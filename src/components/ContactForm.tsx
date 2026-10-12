"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import PhoneInput from "@/components/ui/PhoneInput";

type Service = {
  id: number;
  name: string;
};

const startTimeOptions = [
  { label: "Immediately", value: "Immediately" },
  { label: "Within 1 Month", value: "Within 1 Month" },
  { label: "Within 3 Months", value: "Within 3 Months" },
  { label: "Just Exploring", value: "Just Exploring" },
];

type Step = "form" | "emailOtp";

type Status =
  | "idle"
  | "sendingOtp"
  | "verifyingEmail"
  | "submitting"
  | "sent"
  | "error";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  serviceId: string;
  preferredStartTime: string;
  message: string;
};

export function ContactForm({ services }: { services: Service[] }) {
  const [step, setStep] = useState<Step>("form");
  const [status, setStatus] = useState<Status>("idle");
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [verificationId, setVerificationId] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  const isBusy =
    status === "sendingOtp" ||
    status === "verifyingEmail" ||
    status === "submitting";

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setResendSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  function getFullPhoneNumber(
    phoneNumber: string = phone,
    dialCode: string = countryCode,
  ) {
    const cleanedPhone = phoneNumber.replace(/\D/g, "");
    return `${dialCode}${cleanedPhone}`;
  }

  async function readResponse(response: Response) {
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error(
        result?.message ||
          result?.error ||
          "Something went wrong. Please try again.",
      );
    }

    return result;
  }

  async function sendOtp(values: FormValues) {
    setStatus("sendingOtp");
    setErrorMessage("");

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: getFullPhoneNumber(values.phone),
          city: values.city,
          serviceId: values.serviceId ? Number(values.serviceId) : null,
          preferredStartTime: values.preferredStartTime,
          message: values.message,
        }),
      });

      const result = await readResponse(response);

      if (!result.verificationId) {
        throw new Error("Verification session could not be created.");
      }

      setFormValues(values);
      setVerificationId(result.verificationId);
      setEmailOtp("");
      setResendSeconds(60);
      setStep("emailOtp");
      setStatus("idle");
    } catch (error) {
      console.error("OTP send error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send OTP. Please try again.",
      );
      setStatus("error");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBusy) return;

    const form = event.currentTarget;

    const values: FormValues = {
      name: (
        form.elements.namedItem("name") as HTMLInputElement
      ).value.trim(),
      email: (
        form.elements.namedItem("email") as HTMLInputElement
      ).value.trim(),
      phone: phone.trim(),
      city: (
        form.elements.namedItem("city") as HTMLInputElement
      ).value.trim(),
      serviceId: (
        form.elements.namedItem("serviceId") as HTMLSelectElement
      ).value,
      preferredStartTime: (
        form.elements.namedItem("preferredStartTime") as HTMLSelectElement
      ).value,
      message: (
        form.elements.namedItem("message") as HTMLTextAreaElement
      ).value.trim(),
    };

    if (!values.phone || values.phone.replace(/\D/g, "").length < 6) {
      setErrorMessage("Please enter a valid phone number.");
      setStatus("error");
      return;
    }

    await sendOtp(values);
  }

  async function verifyEmailOtp() {
    if (!verificationId || !formValues) {
      setErrorMessage(
        "Your verification session has expired. Please request a new OTP.",
      );
      setStatus("error");
      return;
    }

    if (!/^\d{6}$/.test(emailOtp)) {
      setErrorMessage("Please enter the 6-digit email OTP.");
      setStatus("error");
      return;
    }

    setStatus("verifyingEmail");
    setErrorMessage("");

    try {
      const response = await fetch("/api/otp/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          email: formValues.email,
          emailOtp,
        }),
      });

      await readResponse(response);
      await submitContact();
    } catch (error) {
      console.error("Email OTP verification error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Email verification failed. Please try again.",
      );
      setStatus("error");
    }
  }

  async function submitContact() {
    if (!verificationId || !formValues) {
      throw new Error("Verification session is missing.");
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          name: formValues.name,
          email: formValues.email,
          phone: getFullPhoneNumber(formValues.phone),
          city: formValues.city,
          serviceId: formValues.serviceId
            ? Number(formValues.serviceId)
            : null,
          preferredStartTime: formValues.preferredStartTime,
          message: formValues.message,
        }),
      });

      await readResponse(response);

      setStatus("sent");
      setStep("form");
      setVerificationId("");
      setFormValues(null);
      setEmailOtp("");
      setResendSeconds(0);
      setPhone("");
      setCountryCode("+91");
    } catch (error) {
      console.error("Contact submission error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your enquiry. Please try again.",
      );
      setStatus("error");
    }
  }

  async function resendOtp() {
    if (!formValues || resendSeconds > 0 || isBusy) return;
    await sendOtp(formValues);
  }

  function returnToForm() {
    setStep("form");
    setStatus("idle");
    setErrorMessage("");
    setEmailOtp("");
    setResendSeconds(0);
    setVerificationId("");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex min-h-[380px] flex-col items-center justify-center px-2 py-12 text-center sm:min-h-[460px]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-400 sm:h-20 sm:w-20">
          <Check size={32} strokeWidth={2.5} />
        </div>

        <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          Message sent
        </p>

        <h3 className="mt-4 text-3xl font-black tracking-[-0.055em] sm:text-4xl">
          We&apos;ll be in touch.
        </h3>

        <p className="mt-4 max-w-md text-sm leading-7 text-black/55">
          Thanks for reaching out. Your enquiry has been received by our team.
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrorMessage("");
            setStep("form");
          }}
          className="mt-8 rounded-full border border-black/15 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  if (step === "emailOtp") {
    return (
      <section
        aria-labelledby="verify-email-heading"
        className="min-h-[380px] sm:min-h-[460px]"
      >
        <div className="border-b border-black/10 py-6 sm:py-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">
            Verification · 02
          </p>

          <h3
            id="verify-email-heading"
            className="mt-3 text-2xl font-black tracking-[-0.045em] sm:text-3xl"
          >
            Verify your email
          </h3>

          <p className="mt-4 break-words text-sm leading-7 text-black/55">
            We&apos;ve sent a 6-digit verification code to{" "}
            <span className="font-semibold text-black">{formValues?.email}</span>.
          </p>
        </div>

        <div className="border-b border-black/10 py-7">
          <label
            htmlFor="emailOtp"
            className="block text-xs font-black uppercase tracking-[0.14em]"
          >
            Email OTP
          </label>

          <input
            id="emailOtp"
            name="emailOtp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={emailOtp}
            onChange={(event) => {
              setEmailOtp(
                event.target.value.replace(/\D/g, "").slice(0, 6),
              );
              if (status === "error") {
                setStatus("idle");
                setErrorMessage("");
              }
            }}
            placeholder="Enter 6-digit OTP"
            aria-describedby={errorMessage ? "otp-error" : undefined}
            className="mt-4 w-full min-w-0 rounded-xl border border-black/10 bg-white/60 px-4 py-4 text-xl font-bold tracking-[0.25em] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-black/30 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 sm:text-2xl"
          />
        </div>

        {status === "error" && (
          <ErrorMessage id="otp-error" message={errorMessage} />
        )}

        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-3">
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendSeconds > 0 || isBusy}
              className="text-xs font-black uppercase tracking-[0.1em] transition hover:text-black/60 disabled:cursor-not-allowed disabled:text-black/30"
            >
              {status === "sendingOtp"
                ? "Sending OTP..."
                : resendSeconds > 0
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={returnToForm}
              disabled={isBusy}
              className="text-sm text-black/50 transition hover:text-black disabled:opacity-50"
            >
              ← Edit details
            </button>
          </div>

          <button
            type="button"
            onClick={verifyEmailOtp}
            disabled={isBusy || emailOtp.length !== 6}
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
          >
            {isBusy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {status === "verifyingEmail" ? "Verifying..." : "Submitting..."}
              </>
            ) : (
              <>
                Verify email
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-black/10">
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:rotate-45"
                  />
                </span>
              </>
            )}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0">
      <FormField
        number="01"
        label="Your name"
        name="name"
        placeholder="What should we call you?"
        autoComplete="name"
        required
      />

      <FormField
        number="02"
        label="Email address"
        name="email"
        type="email"
        placeholder="Where can we reach you?"
        autoComplete="email"
        required
      />

      {/* PHONE */}
      <div className="border-b border-black/10 py-6 sm:py-7">
        <div className="flex gap-3 sm:gap-5">
          <span
            aria-hidden="true"
            className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/35"
          >
            03
          </span>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="phone"
              className="block text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em]"
            >
              Phone number
            </label>

            <div className="mt-4 min-w-0">
              <PhoneInput
                value={phone}
                countryCode={countryCode}
                onPhoneChange={setPhone}
                onCountryChange={(dialCode) => {
                  setCountryCode(dialCode);
                  setPhone("");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <FormField
        number="04"
        label="City"
        name="city"
        placeholder="Where are you based?"
        autoComplete="address-level2"
      />

      {/* SERVICE */}
      <div className="border-b border-black/10 py-6 sm:py-7">
        <div className="flex gap-3 sm:gap-5">
          <span
            aria-hidden="true"
            className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/35"
          >
            05
          </span>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="serviceId"
              className="block text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em]"
            >
              What do you need?
            </label>

            <div className="relative mt-4">
              <select
                id="serviceId"
                name="serviceId"
                defaultValue=""
                className="w-full min-w-0 appearance-none rounded-lg border border-transparent bg-transparent py-2 pr-9 text-base font-medium outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>

              <ArrowUpRight
                aria-hidden="true"
                size={15}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rotate-45 text-black/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* START TIME */}
      <div className="border-b border-black/10 py-6 sm:py-7">
        <div className="flex gap-3 sm:gap-5">
          <span
            aria-hidden="true"
            className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/35"
          >
            06
          </span>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="preferredStartTime"
              className="block text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em]"
            >
              Preferred start time
            </label>

            <div className="relative mt-4">
              <select
                id="preferredStartTime"
                name="preferredStartTime"
                required
                defaultValue=""
                className="w-full min-w-0 appearance-none rounded-lg border border-transparent bg-transparent py-2 pr-9 text-base font-medium outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30"
              >
                <option value="" disabled>
                  Select preferred start time
                </option>
                {startTimeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ArrowUpRight
                aria-hidden="true"
                size={15}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rotate-45 text-black/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="border-b border-black/10 py-6 sm:py-7">
        <div className="flex gap-3 sm:gap-5">
          <span
            aria-hidden="true"
            className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/35"
          >
            07
          </span>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="message"
              className="block text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em]"
            >
              Tell us about your project
            </label>

            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={4}
              placeholder="A few words about your idea, requirements or challenge..."
              className="mt-4 w-full resize-y rounded-xl border border-transparent bg-transparent py-2 text-base leading-7 outline-none transition placeholder:text-black/30 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30"
            />

            <p className="mt-1 text-xs leading-5 text-black/40">
              Include your goals, requirements or any questions you have.
            </p>
          </div>
        </div>
      </div>

      {status === "error" && (
        <ErrorMessage id="form-error" message={errorMessage} />
      )}

      <div className="flex flex-col gap-5 pt-7 sm:gap-6 sm:pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xs text-xs leading-6 text-black/45">
          We&apos;ll only use your details to respond to this enquiry.
        </p>

        <button
          type="submit"
          disabled={isBusy}
          className="group flex w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[190px]"
        >
          {status === "sendingOtp" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Send enquiry
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-black/10">
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function ErrorMessage({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  return (
    <div
      id={id}
      role="alert"
      className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700 sm:px-5"
    >
      {message || "Something went wrong. Please try again."}
    </div>
  );
}

function FormField({
  number,
  label,
  name,
  placeholder,
  type = "text",
  autoComplete,
  required = false,
}: {
  number: string;
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="border-b border-black/10 py-6 sm:py-7">
      <div className="flex gap-3 sm:gap-5">
        <span
          aria-hidden="true"
          className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/35"
        >
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={name}
            className="block text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em]"
          >
            {label}
          </label>

          <input
            id={name}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required={required}
            placeholder={placeholder}
            className="mt-4 w-full min-w-0 rounded-xl border border-transparent bg-transparent py-2 text-base outline-none transition placeholder:text-black/30 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30"
          />
        </div>
      </div>
    </div>
  );
}
