"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Loader2,
} from "lucide-react";
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

type Step = "form" | "otp";

type Status =
  | "idle"
  | "sendingOtp"
  | "verifying"
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

export function ContactForm({
  services,
}: {
  services: Service[];
}) {
  const [step, setStep] = useState<Step>("form");

  const [status, setStatus] =
    useState<Status>("idle");

  const [formValues, setFormValues] =
    useState<FormValues | null>(null);

  const [verificationId, setVerificationId] =
    useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [resendSeconds, setResendSeconds] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =====================================================
     PHONE COUNTRY CODE
  ===================================================== */

  const [countryCode, setCountryCode] =
    useState("+91");

  const [phone, setPhone] = useState("");

  /* ================= RESEND TIMER ================= */

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setInterval(() => {
      setResendSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  /* =====================================================
     FULL INTERNATIONAL PHONE
  ===================================================== */

  function getFullPhoneNumber(
    phoneNumber: string = phone,
    dialCode: string = countryCode
  ) {
    const cleanedPhone = phoneNumber.replace(/\D/g, "");

    return `${dialCode}${cleanedPhone}`;
  }

  /* ================= SEND OTP ================= */

  async function sendOtp(values: FormValues) {
    setStatus("sendingOtp");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(
        values.phone,
        countryCode
      );

      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: fullPhone,
          city: values.city,
          serviceId: values.serviceId
            ? Number(values.serviceId)
            : null,
          preferredStartTime:
            values.preferredStartTime,
          message: values.message,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to send OTP."
        );
      }

      setVerificationId(
        result.verificationId
      );

      setFormValues(values);

      setEmailOtp("");
      setPhoneOtp("");

      setResendSeconds(60);

      setStep("otp");
      setStatus("idle");
    } catch (error) {
      console.error(
        "OTP send error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send OTP. Please try again."
      );

      setStatus("error");
    }
  }

  /* ================= FORM SUBMIT ================= */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (status === "sendingOtp") return;

    const form = e.currentTarget;

    const values: FormValues = {
      name: (
        form.elements.namedItem(
          "name"
        ) as HTMLInputElement
      ).value.trim(),

      email: (
        form.elements.namedItem(
          "email"
        ) as HTMLInputElement
      ).value.trim(),

      phone: phone.trim(),

      city: (
        form.elements.namedItem(
          "city"
        ) as HTMLInputElement
      ).value.trim(),

      serviceId: (
        form.elements.namedItem(
          "serviceId"
        ) as HTMLSelectElement
      ).value,

      preferredStartTime: (
        form.elements.namedItem(
          "preferredStartTime"
        ) as HTMLSelectElement
      ).value,

      message: (
        form.elements.namedItem(
          "message"
        ) as HTMLTextAreaElement
      ).value.trim(),
    };

    if (!phone || phone.replace(/\D/g, "").length < 6) {
      setErrorMessage(
        "Please enter a valid phone number."
      );
      setStatus("error");
      return;
    }

    await sendOtp(values);
  }

  /* ================= VERIFY OTP ================= */

  async function verifyOtp() {
    if (!verificationId || !formValues) {
      setErrorMessage(
        "Verification session expired. Please request a new OTP."
      );

      setStatus("error");
      return;
    }

    if (
      emailOtp.length !== 6 ||
      phoneOtp.length !== 6
    ) {
      setErrorMessage(
        "Please enter both 6-digit OTPs."
      );

      setStatus("error");
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(
        formValues.phone,
        countryCode
      );

      const res = await fetch(
        "/api/otp/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationId,
            email: formValues.email,
            phone: fullPhone,
            emailOtp,
            phoneOtp,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error ||
            "Invalid OTP."
        );
      }

      /*
       * OTP verification succeeded.
       * Now submit the actual enquiry.
       */

      await submitContact();
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "OTP verification failed. Please try again."
      );

      setStatus("error");
    }
  }

  /* ================= FINAL CONTACT SUBMIT ================= */

  async function submitContact() {
    if (!verificationId || !formValues) {
      throw new Error(
        "Verification session is missing."
      );
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(
        formValues.phone,
        countryCode
      );

      const res = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationId,

            name: formValues.name,
            email: formValues.email,
            phone: fullPhone,
            city: formValues.city,

            serviceId: formValues.serviceId
              ? Number(formValues.serviceId)
              : null,

            preferredStartTime:
              formValues.preferredStartTime,

            message: formValues.message,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to submit enquiry."
        );
      }

      setStatus("sent");
      setStep("form");

      setVerificationId("");
      setFormValues(null);

      setEmailOtp("");
      setPhoneOtp("");

      setResendSeconds(0);

      setPhone("");
      setCountryCode("+91");
    } catch (error) {
      console.error(
        "Contact submission error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit enquiry."
      );

      setStatus("error");
    }
  }

  /* ================= RESEND OTP ================= */

  async function resendOtp() {
    if (
      !formValues ||
      resendSeconds > 0
    ) {
      return;
    }

    await sendOtp(formValues);
  }

  /* ================= SUCCESS ================= */

  if (status === "sent") {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400">
          <Check
            size={34}
            strokeWidth={2.5}
          />
        </div>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
          Message sent
        </p>

        <h3 className="mt-4 text-4xl font-black tracking-[-0.055em]">
          We&apos;ll be in touch.
        </h3>

        <p className="mt-5 max-w-md text-sm leading-7 text-black/45">
          Thanks for reaching out. Your enquiry
          has been received by our team.
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStep("form");
          }}
          className="mt-9 rounded-full border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  /* ================= OTP SCREEN ================= */

  if (step === "otp") {
    return (
      <div className="min-h-[520px]">
        <div className="border-b border-black/10 py-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/30">
            Verification
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-[-0.045em]">
            Verify your details
          </h3>

          <p className="mt-4 max-w-lg text-sm leading-7 text-black/45">
            We&apos;ve sent one OTP to your email
            and one OTP to your phone number.
            Enter both codes to submit your
            enquiry.
          </p>
        </div>

        {/* EMAIL OTP */}

        <div className="border-b border-black/10 py-7">
          <label
            htmlFor="emailOtp"
            className="block text-xs font-black uppercase tracking-[0.14em]"
          >
            Email OTP
          </label>

          <input
            id="emailOtp"
            value={emailOtp}
            onChange={(e) =>
              setEmailOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="Enter 6-digit OTP"
            className="mt-4 w-full bg-transparent text-2xl font-bold tracking-[0.3em] outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-black/20"
          />
        </div>

        {/* PHONE OTP */}

        <div className="border-b border-black/10 py-7">
          <label
            htmlFor="phoneOtp"
            className="block text-xs font-black uppercase tracking-[0.14em]"
          >
            Phone OTP
          </label>

          <input
            id="phoneOtp"
            value={phoneOtp}
            onChange={(e) =>
              setPhoneOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="mt-4 w-full bg-transparent text-2xl font-bold tracking-[0.3em] outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-black/20"
          />
        </div>

        {/* ERROR */}

        {status === "error" && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {errorMessage ||
              "Something went wrong. Please try again."}
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={resendOtp}
              disabled={
                resendSeconds > 0 ||
                status === "sendingOtp" ||
                status === "verifying" ||
                status === "submitting"
              }
              className="text-left text-xs font-black uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:text-black/20"
            >
              {status === "sendingOtp"
                ? "Sending OTP..."
                : resendSeconds > 0
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setStatus("idle");
                setErrorMessage("");
              }}
              className="text-left text-xs font-medium text-black/40 hover:text-black"
            >
              ← Edit details
            </button>
          </div>

          <button
            type="button"
            onClick={verifyOtp}
            disabled={
              status === "verifying" ||
              status === "submitting"
            }
            className="group flex items-center justify-center gap-4 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "verifying" ||
            status === "submitting" ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                {status === "verifying"
                  ? "Verifying"
                  : "Sending"}
              </>
            ) : (
              <>
                Verify & Send

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
      </div>
    );
  }

  /* ================= CONTACT FORM ================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-0"
    >
      {/* NAME */}

      <FormField
        number="01"
        label="Your name"
        name="name"
        placeholder="What should we call you?"
        required
      />

      {/* EMAIL */}

      <FormField
        number="02"
        label="Email address"
        name="email"
        type="email"
        placeholder="Where can we reach you?"
        required
      />

      {/* PHONE */}

      <div className="group border-b border-black/10 py-7">
        <div className="flex gap-5">
          <span className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/20">
            03
          </span>

          <div className="flex-1">
            <label
              htmlFor="phone"
              className="block text-xs font-black uppercase tracking-[0.14em]"
            >
              Phone number
            </label>

            <div className="mt-4">
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

      {/* CITY */}

      <FormField
        number="04"
        label="City"
        name="city"
        placeholder="Where are you based?"
      />

      {/* SERVICE */}

      <div className="group border-b border-black/10 py-7">
        <div className="flex gap-5">
          <span className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/20">
            05
          </span>

          <div className="flex-1">
            <label
              htmlFor="serviceId"
              className="block text-xs font-black uppercase tracking-[0.14em]"
            >
              What do you need?
            </label>

            <div className="relative mt-4">
              <select
                id="serviceId"
                name="serviceId"
                defaultValue=""
                className="w-full appearance-none bg-transparent pr-10 text-base font-medium text-black/50 outline-none transition focus:text-black"
              >
                <option value="">
                  Select a service
                </option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                ))}
              </select>

              <ArrowUpRight
                size={15}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rotate-45 text-black/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PREFERRED START TIME */}

      <div className="group border-b border-black/10 py-7">
        <div className="flex gap-5">
          <span className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/20">
            06
          </span>

          <div className="flex-1">
            <label
              htmlFor="preferredStartTime"
              className="block text-xs font-black uppercase tracking-[0.14em]"
            >
              Preferred Start Time
            </label>

            <div className="relative mt-4">
              <select
                id="preferredStartTime"
                name="preferredStartTime"
                required
                defaultValue=""
                className="w-full appearance-none bg-transparent pr-10 text-base font-medium text-black/50 outline-none transition focus:text-black"
              >
                <option
                  value=""
                  disabled
                >
                  Select preferred start time
                </option>

                {startTimeOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <ArrowUpRight
                size={15}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rotate-45 text-black/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE */}

      <div className="group border-b border-black/10 py-7">
        <div className="flex gap-5">
          <span className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/20">
            07
          </span>

          <div className="flex-1">
            <label
              htmlFor="message"
              className="block text-xs font-black uppercase tracking-[0.14em]"
            >
              Tell us about your project
            </label>

            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="A few words about your idea, requirements or challenge..."
              className="mt-4 w-full resize-none bg-transparent text-base leading-7 outline-none placeholder:text-black/20"
            />
          </div>
        </div>
      </div>

      {/* ERROR */}

      {status === "error" && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
          {errorMessage ||
            "Something went wrong. Please try again."}
        </div>
      )}

      {/* SUBMIT */}

      <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[10px] leading-5 text-black/30">
          We&apos;ll only use your details to
          respond to this enquiry.
        </p>

        <button
          type="submit"
          disabled={
            status === "sendingOtp"
          }
          className="group flex items-center justify-center gap-4 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sendingOtp" ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />

              Sending OTP
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

/* =====================================================
   FORM FIELD
===================================================== */

function FormField({
  number,
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  number: string;
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="group border-b border-black/10 py-7">
      <div className="flex gap-5">
        <span className="pt-1 text-[9px] font-black tracking-[0.15em] text-black/20">
          {number}
        </span>

        <div className="flex-1">
          <label
            htmlFor={name}
            className="block text-xs font-black uppercase tracking-[0.14em]"
          >
            {label}
          </label>

          <input
            id={name}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            className="mt-4 w-full bg-transparent text-base outline-none placeholder:text-black/20"
          />
        </div>
      </div>
    </div>
  );
}