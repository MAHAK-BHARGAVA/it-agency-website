"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

type ServiceOption = {
  id: number;
  name: string;
};

type Props = {
  services: ServiceOption[];
};

const startTimeOptions = [
  { label: "Immediately", value: "Immediately" },
  { label: "Within 1 Month", value: "Within 1 Month" },
  { label: "Within 3 Months", value: "Within 3 Months" },
  { label: "Just Exploring", value: "Just Exploring" },
];

export default function QuickEnquiryForm({ services }: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const serviceId = Number(formData.get("serviceId"));
    const preferredStartTime = String(
      formData.get("preferredStartTime") ?? "",
    ).trim();

    const cleanedPhone = phone.replace(/\D/g, "");
    const website = String(formData.get("website") ?? "").trim();

    if (name.length < 2 || name.length > 100) {
      setStatus("error");
      setError("Please enter your full name.");
      return;
    }

    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      setStatus("error");
      setError("Please enter a valid contact number.");
      return;
    }

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      setStatus("error");
      setError("Please select a service.");
      return;
    }

    if (!preferredStartTime) {
      setStatus("error");
      setError("Please select your preferred start time.");
      return;
    }

    try {
      console.log("Submitting enquiry...");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          serviceId,
          preferredStartTime,
          website,
        }),
      });

      const data = await response.json();

      console.log("Lead API response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit your enquiry.");
      }

      form.reset();
      setStatus("idle");

      // Temporarily disable redirect while testing
      router.push("/thank-you");
    } catch (submitError) {
      setStatus("error");

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    }
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-lime-600">
            Free Consultation
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
            Let&apos;s Start Your Project
          </h2>

          <p className="mt-3 text-sm leading-6 text-black/55">
            Share a few details and our team will contact you shortly.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="website">Website</label>

              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
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

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-bold text-black"
              >
                Phone / WhatsApp Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={20}
                autoComplete="tel"
                inputMode="tel"
                placeholder="Enter your contact number"
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#f6f6f2] px-5 text-black outline-none transition placeholder:text-black/35 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
              />
            </div>

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
                <option value="" disabled>
                  Select a service
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="" disabled>
                  Select preferred start time
                </option>

                {startTimeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-lime-400 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_16px_40px_rgba(163,230,53,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "submitting"
                ? "Submitting..."
                : "Request a Free Consultation"}

              {status !== "submitting" && (
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              )}
            </button>

            <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-black/45">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
              Your information is secure and will only be used to discuss your
              requirements.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
