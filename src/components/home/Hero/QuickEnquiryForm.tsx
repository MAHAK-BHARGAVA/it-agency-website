"use client";

import {
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PhoneInput from "@/components/ui/PhoneInput";

type ServiceOption = {
  id: number;
  name: string;
};

type Props = {
  services: ServiceOption[];
};

const startTimeOptions = [
  {
    label: "Immediately",
    value: "Immediately",
  },
  {
    label: "Within 1 Month",
    value: "Within 1 Month",
  },
  {
    label: "Within 3 Months",
    value: "Within 3 Months",
  },
  {
    label: "Just Exploring",
    value: "Just Exploring",
  },
];

type Step = "form" | "emailOtp";

type Status =
  | "idle"
  | "sendingOtp"
  | "verifyingEmail"
  | "submitting"
  | "error";

export default function QuickEnquiryForm({
  services,
}: Props) {
  const router = useRouter();

  const [step, setStep] =
    useState<Step>("form");

  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] = useState("");

  const [verificationId, setVerificationId] =
    useState("");

  const [emailOtp, setEmailOtp] =
    useState("");

  const [resendCooldown, setResendCooldown] =
    useState(0);

  // PHONE
  const [countryCode, setCountryCode] =
    useState("+91");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [formValues, setFormValues] =
    useState({
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      preferredStartTime: "",
      website: "",
    });

  /* =========================================================
     BUILD COMPLETE INTERNATIONAL PHONE NUMBER
  ========================================================= */

  function getFullPhoneNumber() {
    const digits = phoneNumber.replace(
      /\D/g,
      "",
    );

    return `${countryCode}${digits}`;
  }

  /* =========================================================
     START RESEND TIMER
  ========================================================= */

  function startResendCooldown() {
    setResendCooldown(60);

    const interval = setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  }

  /* =========================================================
     VALIDATE FORM
  ========================================================= */

  function validateForm(
    values = formValues,
  ) {
    const {
      name,
      email,
      serviceId,
      preferredStartTime,
    } = values;

    const cleanedPhone =
      values.phone.replace(/\D/g, "");

    if (
      name.length < 2 ||
      name.length > 100
    ) {
      setError(
        "Please enter your full name.",
      );

      return false;
    }

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      setError(
        "Please enter a valid email address.",
      );

      return false;
    }

    if (
      cleanedPhone.length < 6 ||
      cleanedPhone.length > 15
    ) {
      setError(
        "Please enter a valid contact number.",
      );

      return false;
    }

    const serviceIdNumber =
      Number(serviceId);

    if (
      !Number.isInteger(serviceIdNumber) ||
      serviceIdNumber <= 0
    ) {
      setError(
        "Please select a service.",
      );

      return false;
    }

    if (!preferredStartTime) {
      setError(
        "Please select your preferred start time.",
      );

      return false;
    }

    return true;
  }

  /* =========================================================
     SEND EMAIL OTP
  ========================================================= */

  async function sendOtp(
    values = formValues,
  ) {
    setError("");

    if (!validateForm(values)) {
      setStatus("error");
      return;
    }

    setStatus("sendingOtp");

    try {
      const response = await fetch(
        "/api/otp/send",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: values.name,

            email: values.email
              .trim()
              .toLowerCase(),

            phone: values.phone,

            serviceId: Number(
              values.serviceId,
            ),

            preferredStartTime:
              values.preferredStartTime,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to send verification OTP.",
        );
      }

      setVerificationId(
        data.verificationId,
      );

      setEmailOtp("");

      setStep("emailOtp");

      setStatus("idle");

      startResendCooldown();
    } catch (error) {
      console.error(
        "Email OTP send error:",
        error,
      );

      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending OTP.",
      );
    }
  }

  /* =========================================================
     VERIFY EMAIL OTP
  ========================================================= */

  async function verifyEmailOtp() {
    setError("");

    if (!/^\d{6}$/.test(emailOtp)) {
      setError(
        "Please enter the 6-digit email OTP.",
      );

      setStatus("error");

      return;
    }

    if (!verificationId) {
      setError(
        "Verification session not found. Please request OTP again.",
      );

      setStatus("error");

      return;
    }

    setStatus("verifyingEmail");

    try {
      const response = await fetch(
        "/api/otp/verify-email",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            verificationId,

            email: formValues.email
              .trim()
              .toLowerCase(),

            emailOtp,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email OTP. Please try again.",
        );
      }

      // Email verified successfully.
      // Now submit the lead.
      await submitLead();
    } catch (error) {
      console.error(
        "Email OTP verification error:",
        error,
      );

      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Email verification failed.",
      );
    }
  }

  /* =========================================================
     SUBMIT FINAL LEAD
  ========================================================= */

  async function submitLead() {
    setError("");

    setStatus("submitting");

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            verificationId,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to submit your enquiry.",
        );
      }

      setStatus("idle");

      router.push("/thank-you");
    } catch (error) {
      console.error(
        "Lead submission error:",
        error,
      );

      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  /* =========================================================
     RESEND EMAIL OTP
  ========================================================= */

  async function resendEmailOtp() {
    if (
      resendCooldown > 0 ||
      status === "sendingOtp"
    ) {
      return;
    }

    await sendOtp(formValues);
  }

  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      status === "sendingOtp" ||
      status === "verifyingEmail" ||
      status === "submitting"
    ) {
      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const fullPhone =
      getFullPhoneNumber();

    const values = {
      name: String(
        formData.get("name") ?? "",
      ).trim(),

      email: String(
        formData.get("email") ?? "",
      ).trim(),

      phone: fullPhone,

      serviceId: String(
        formData.get("serviceId") ?? "",
      ),

      preferredStartTime:
        String(
          formData.get(
            "preferredStartTime",
          ) ?? "",
        ),

      website: String(
        formData.get("website") ?? "",
      ).trim(),
    };

    setFormValues(values);

    if (!validateForm(values)) {
      setStatus("error");

      return;
    }

    await sendOtp(values);
  }

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[48px] bg-lime-400/10 blur-[90px]"
      />

      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-lime-400/10 blur-[70px]"
        />

        <div className="relative z-10">

          {/* =====================================================
              FORM
          ===================================================== */}

          {step === "form" && (
            <>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-lime-600">
                Free Consultation
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
                Let&apos;s Start Your Project
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/55">
                Share a few details and our team
                will contact you shortly.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >

                {/* HONEYPOT */}

                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
                >
                  <label htmlFor="website">
                    Website
                  </label>

                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Client Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-black outline-none transition placeholder:text-black/35 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-black outline-none transition placeholder:text-black/35 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Phone / WhatsApp Number
                  </label>

                  <PhoneInput
                    value={phoneNumber}
                    countryCode={countryCode}
                    onCountryChange={
                      setCountryCode
                    }
                    onPhoneChange={
                      setPhoneNumber
                    }
                  />
                </div>

                {/* SERVICE */}

                <div>
                  <label
                    htmlFor="serviceId"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Service Required
                  </label>

                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    defaultValue=""
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-black outline-none transition focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select a service
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* START TIME */}

                <div>
                  <label
                    htmlFor="preferredStartTime"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Preferred Start Time
                  </label>

                  <select
                    id="preferredStartTime"
                    name="preferredStartTime"
                    required
                    defaultValue=""
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-black outline-none transition focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
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
                      ),
                    )}
                  </select>
                </div>

                {/* ERROR */}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}

                {/* SEND OTP */}

                <button
                  type="submit"
                  disabled={
                    status ===
                      "sendingOtp" ||
                    status ===
                      "verifyingEmail" ||
                    status ===
                      "submitting"
                  }
                  className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-lime-400 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_16px_40px_rgba(163,230,53,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status ===
                  "sendingOtp"
                    ? "Sending OTP..."
                    : "Verify & Continue"}

                  {status !==
                    "sendingOtp" && (
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  )}
                </button>

                <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-black/45">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />

                  Your information is secure and
                  will only be used to discuss your
                  requirements.
                </p>
              </form>
            </>
          )}

          {/* =====================================================
              EMAIL OTP
          ===================================================== */}

          {step === "emailOtp" && (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/15">
                <ShieldCheck className="h-7 w-7 text-lime-600" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-lime-600">
                Email Verification
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
                Verify Your Email
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/55">
                We&apos;ve sent a 6-digit
                verification code to{" "}
                <span className="font-bold text-black">
                  {formValues.email}
                </span>
                .
              </p>

              <div className="mt-7 space-y-5">

                {/* EMAIL OTP */}

                <div>
                  <label
                    htmlFor="emailOtp"
                    className="mb-2 block text-sm font-bold text-black"
                  >
                    Email OTP
                  </label>

                  <input
                    id="emailOtp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={emailOtp}
                    onChange={(event) =>
                      setEmailOtp(
                        event.target.value
                          .replace(
                            /\D/g,
                            "",
                          )
                          .slice(0, 6),
                      )
                    }
                    placeholder="Enter 6-digit email OTP"
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-center text-lg font-bold tracking-[0.35em] text-black outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-black/35 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>

                {/* ERROR */}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}

                {/* VERIFY EMAIL */}

                <button
                  type="button"
                  onClick={
                    verifyEmailOtp
                  }
                  disabled={
                    status ===
                      "verifyingEmail" ||
                    status === "submitting"
                  }
                  className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-lime-400 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_16px_40px_rgba(163,230,53,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status ===
                  "verifyingEmail"
                    ? "Verifying Email..."
                    : status ===
                        "submitting"
                      ? "Submitting..."
                      : "Verify Email"}

                  {status !==
                    "verifyingEmail" &&
                    status !==
                      "submitting" && (
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    )}
                </button>

                {/* RESEND */}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={
                      resendEmailOtp
                    }
                    disabled={
                      resendCooldown >
                        0 ||
                      status ===
                        "sendingOtp" ||
                      status ===
                        "verifyingEmail" ||
                      status ===
                        "submitting"
                    }
                    className="text-sm font-bold text-black underline decoration-black/20 underline-offset-4 transition hover:text-lime-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status ===
                    "sendingOtp"
                      ? "Sending..."
                      : resendCooldown >
                          0
                        ? `Resend email OTP in ${resendCooldown}s`
                        : "Resend email OTP"}
                  </button>
                </div>

                {/* BACK */}

                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setEmailOtp("");
                    setStatus("idle");
                  }}
                  className="w-full text-center text-xs font-bold text-black/45 transition hover:text-black"
                >
                  ← Edit your details
                </button>

                <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-black/45">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />

                  Your email is verified securely
                  before we continue.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}