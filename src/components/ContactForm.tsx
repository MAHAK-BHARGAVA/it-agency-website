"use client";

import { useEffect, useState } from "react";
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

type Step = "form" | "emailOtp" | "phoneOtp";

type Status =
  | "idle"
  | "sendingOtp"
  | "sendingPhoneOtp"
  | "verifyingEmail"
  | "verifyingPhone"
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
  const [phoneOtp, setPhoneOtp] = useState("");

  const [resendSeconds, setResendSeconds] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  /* =====================================================
     PHONE COUNTRY CODE
  ===================================================== */

  const [countryCode, setCountryCode] = useState("+91");

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
    dialCode: string = countryCode,
  ) {
    const cleanedPhone = phoneNumber.replace(/\D/g, "");

    return `${dialCode}${cleanedPhone}`;
  }

  /* ================= SEND OTP ================= */

  async function sendOtp(values: FormValues) {
    setStatus("sendingOtp");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(values.phone, countryCode);

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
          serviceId: values.serviceId ? Number(values.serviceId) : null,
          preferredStartTime: values.preferredStartTime,
          message: values.message,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Unable to send OTP.",
        );
      }

      setVerificationId(result.verificationId);

      setFormValues(values);

      setEmailOtp("");
      setPhoneOtp("");

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

  /* ================= FORM SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

   if (
  status === "sendingOtp" ||
  status === "sendingPhoneOtp"
) {
  return;
}

    const form = e.currentTarget;

    const values: FormValues = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),

      email: (
        form.elements.namedItem("email") as HTMLInputElement
      ).value.trim(),

      phone: phone.trim(),

      city: (form.elements.namedItem("city") as HTMLInputElement).value.trim(),

      serviceId: (form.elements.namedItem("serviceId") as HTMLSelectElement)
        .value,

      preferredStartTime: (
        form.elements.namedItem("preferredStartTime") as HTMLSelectElement
      ).value,

      message: (
        form.elements.namedItem("message") as HTMLTextAreaElement
      ).value.trim(),
    };

    if (!phone || phone.replace(/\D/g, "").length < 6) {
      setErrorMessage("Please enter a valid phone number.");
      setStatus("error");
      return;
    }

    await sendOtp(values);
  }

  /* ================= VERIFY OTP ================= */

  /* ================= VERIFY EMAIL OTP ================= */

  async function verifyEmailOtp() {
    if (!verificationId || !formValues) {
      setErrorMessage(
        "Verification session expired. Please request a new OTP.",
      );

      setStatus("error");
      return;
    }

    if (emailOtp.length !== 6) {
      setErrorMessage("Please enter the 6-digit email OTP.");

      setStatus("error");
      return;
    }

    setStatus("verifyingEmail");
    setErrorMessage("");

    try {
      const res = await fetch("/api/otp/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          email: formValues.email,
          emailOtp,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || result.error || "Invalid email OTP.");
      }

      /*
       * Email verified successfully.
       * Now generate the phone OTP.
       */

      await sendPhoneOtp();
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

  /* ================= SEND PHONE OTP ================= */

  async function sendPhoneOtp() {
    if (!verificationId || !formValues) {
      setErrorMessage("Verification session expired. Please start again.");

      setStatus("error");
      return;
    }

    setStatus("sendingPhoneOtp");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(formValues.phone, countryCode);

      const res = await fetch("/api/otp/send-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          email: formValues.email,
          phone: fullPhone,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Unable to send phone OTP.",
        );
      }

      setPhoneOtp("");

      setResendSeconds(60);

      setStep("phoneOtp");

      setStatus("idle");
    } catch (error) {
      console.error("Phone OTP send error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send phone OTP. Please try again.",
      );

      setStatus("error");
    }
  }

  /* ================= VERIFY PHONE OTP ================= */

  async function verifyPhoneOtp() {
    if (!verificationId || !formValues) {
      setErrorMessage(
        "Verification session expired. Please request a new OTP.",
      );

      setStatus("error");
      return;
    }

    if (phoneOtp.length !== 6) {
      setErrorMessage("Please enter the 6-digit phone OTP.");

      setStatus("error");
      return;
    }

    setStatus("verifyingPhone");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(formValues.phone, countryCode);

      const res = await fetch("/api/otp/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          email: formValues.email,
          phone: fullPhone,
          phoneOtp,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || result.error || "Invalid phone OTP.");
      }

      /*
       * Both email and phone are now verified.
       * Create the actual lead.
       */

      await submitContact();
    } catch (error) {
      console.error("Phone OTP verification error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Phone verification failed. Please try again.",
      );

      setStatus("error");
    }
  }

  /* ================= FINAL CONTACT SUBMIT ================= */

  async function submitContact() {
    if (!verificationId || !formValues) {
      throw new Error("Verification session is missing.");
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const fullPhone = getFullPhoneNumber(formValues.phone, countryCode);

      const res = await fetch("/api/contact", {
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

          serviceId: formValues.serviceId ? Number(formValues.serviceId) : null,

          preferredStartTime: formValues.preferredStartTime,

          message: formValues.message,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Unable to submit enquiry.");
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
      console.error("Contact submission error:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Unable to submit enquiry.",
      );

      setStatus("error");
    }
  }

  /* ================= RESEND OTP ================= */

  async function resendOtp() {
    if (!formValues || resendSeconds > 0) {
      return;
    }

    if (step === "emailOtp") {
      await sendOtp(formValues);
      return;
    }

    if (step === "phoneOtp") {
      await sendPhoneOtp();
    }
  }

  /* ================= SUCCESS ================= */

  if (status === "sent") {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400">
          <Check size={34} strokeWidth={2.5} />
        </div>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
          Message sent
        </p>

        <h3 className="mt-4 text-4xl font-black tracking-[-0.055em]">
          We&apos;ll be in touch.
        </h3>

        <p className="mt-5 max-w-md text-sm leading-7 text-black/45">
          Thanks for reaching out. Your enquiry has been received by our team.
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

  if (step === "emailOtp" || step === "phoneOtp") {
    const isEmailStep = step === "emailOtp";

    return (
      <div className="min-h-[520px]">
        <div className="border-b border-black/10 py-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/30">
            Verification
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-[-0.045em]">
            {isEmailStep ? "Verify your email" : "Verify your phone"}
          </h3>

          <p className="mt-4 max-w-lg text-sm leading-7 text-black/45">
            {isEmailStep
              ? `We&apos;ve sent a 6-digit verification code to ${formValues?.email}.`
              : `We&apos;ve generated a 6-digit verification code for ${getFullPhoneNumber(
                  formValues?.phone ?? "",
                  countryCode,
                )}.`}
          </p>
        </div>

        {/* OTP INPUT */}

        <div className="border-b border-black/10 py-7">
          <label
            htmlFor={isEmailStep ? "emailOtp" : "phoneOtp"}
            className="block text-xs font-black uppercase tracking-[0.14em]"
          >
            {isEmailStep ? "Email OTP" : "Phone OTP"}
          </label>

          <input
            id={isEmailStep ? "emailOtp" : "phoneOtp"}
            value={isEmailStep ? emailOtp : phoneOtp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);

              if (isEmailStep) {
                setEmailOtp(value);
              } else {
                setPhoneOtp(value);
              }
            }}
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="Enter 6-digit OTP"
            className="mt-4 w-full bg-transparent text-2xl font-bold tracking-[0.3em] outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-black/20"
          />
        </div>

        {/* DEV PHONE OTP NOTE */}

        {!isEmailStep && (
          <div className="mt-5 rounded-2xl bg-black/[0.03] px-5 py-4 text-xs leading-6 text-black/45">
            <span className="font-bold text-black">Development mode:</span>{" "}
            Phone OTP is printed in your terminal console.
          </div>
        )}

        {/* ERROR */}

        {status === "error" && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {errorMessage || "Something went wrong. Please try again."}
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
                status === "sendingPhoneOtp" ||
                status === "verifyingEmail" ||
                status === "verifyingPhone" ||
                status === "submitting"
              }
              className="text-left text-xs font-black uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:text-black/20"
            >
              {status === "sendingOtp" || status === "sendingPhoneOtp"
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
                setEmailOtp("");
                setPhoneOtp("");
                setResendSeconds(0);
              }}
              className="text-left text-xs font-medium text-black/40 hover:text-black"
            >
              ← Edit details
            </button>
          </div>

          <button
            type="button"
            onClick={isEmailStep ? verifyEmailOtp : verifyPhoneOtp}
            disabled={
              status === "verifyingEmail" ||
              status === "verifyingPhone" ||
              status === "sendingPhoneOtp" ||
              status === "submitting"
            }
            className="group flex items-center justify-center gap-4 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "verifyingEmail" ||
            status === "verifyingPhone" ||
            status === "submitting" ||
            status === "sendingPhoneOtp" ? (
              <>
                <Loader2 size={16} className="animate-spin" />

                {status === "verifyingEmail"
                  ? "Verifying Email"
                  : status === "sendingPhoneOtp"
                    ? "Sending Phone OTP"
                    : status === "verifyingPhone"
                      ? "Verifying Phone"
                      : "Sending"}
              </>
            ) : (
              <>
                {isEmailStep ? "Verify Email" : "Verify Phone"}

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
    <form onSubmit={handleSubmit} className="space-y-0">
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
                <option value="">Select a service</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
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
          {errorMessage || "Something went wrong. Please try again."}
        </div>
      )}

      {/* SUBMIT */}

      <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[10px] leading-5 text-black/30">
          We&apos;ll only use your details to respond to this enquiry.
        </p>

        <button
          type="submit"
          disabled={status === "sendingOtp"}
          className="group flex items-center justify-center gap-4 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sendingOtp" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
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
