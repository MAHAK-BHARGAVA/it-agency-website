"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  Save,
} from "lucide-react";

type Service = {
  id: number;
  name: string;
};

type Industry = {
  id: number;
  name: string;
};

type Testimonial = {
  id: number;
  clientName: string;
  company: string | null;
};

type PortfolioInitialData = {
  id?: number;
  projectName?: string;
  slug?: string;
  thumbnail?: string | null;
  resultSummary?: string;
  clientName?: string | null;
  projectUrl?: string | null;
  challenge?: string | null;
  solution?: string | null;
  process?: string | null;
  testimonialId?: number | null;
  services?: Service[];
  industries?: Industry[];
};

type Props = {
  initialData?: PortfolioInitialData;
};

export default function PortfolioForm({
  initialData,
}: Props) {
  const router = useRouter();

  const editing = Boolean(initialData?.id);

  const [services, setServices] = useState<Service[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projectName, setProjectName] = useState(
    initialData?.projectName ?? "",
  );

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [clientName, setClientName] = useState(
    initialData?.clientName ?? "",
  );

  const [projectUrl, setProjectUrl] = useState(
    initialData?.projectUrl ?? "",
  );

  const [thumbnail, setThumbnail] = useState(
    initialData?.thumbnail ?? "",
  );

  const [resultSummary, setResultSummary] = useState(
    initialData?.resultSummary ?? "",
  );

  const [challenge, setChallenge] = useState(
    initialData?.challenge ?? "",
  );

  const [solution, setSolution] = useState(
    initialData?.solution ?? "",
  );

  const [process, setProcess] = useState(
    initialData?.process ?? "",
  );

  const [testimonialId, setTestimonialId] = useState(
    initialData?.testimonialId
      ? String(initialData.testimonialId)
      : "",
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(
    initialData?.services?.map((service) => service.id) ?? [],
  );

  const [selectedIndustryIds, setSelectedIndustryIds] =
    useState<number[]>(
      initialData?.industries?.map((industry) => industry.id) ?? [],
    );

  const [error, setError] = useState("");

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      setLoadingOptions(true);

      const [
        servicesResponse,
        industriesResponse,
        testimonialsResponse,
      ] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/industries"),
        fetch("/api/admin/testimonials"),
      ]);

      if (
        !servicesResponse.ok ||
        !industriesResponse.ok ||
        !testimonialsResponse.ok
      ) {
        throw new Error("Unable to load form options.");
      }

      const [
        servicesData,
        industriesData,
        testimonialsData,
      ] = await Promise.all([
        servicesResponse.json(),
        industriesResponse.json(),
        testimonialsResponse.json(),
      ]);

      setServices(servicesData);
      setIndustries(industriesData);
      setTestimonials(testimonialsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load form options.",
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleProjectNameChange(value: string) {
    setProjectName(value);

    if (!editing) {
      setSlug(generateSlug(value));
    }
  }

  function toggleService(id: number) {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleIndustry(id: number) {
    setSelectedIndustryIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  const previewUrl = useMemo(() => {
    if (!slug) return "";

    return `/portfolio/${slug}`;
  }, [slug]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!resultSummary.trim()) {
      setError("Result summary is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const endpoint = editing
        ? `/api/admin/portfolio/${initialData?.id}`
        : "/api/admin/portfolio";

      const response = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          projectName: projectName.trim(),
          slug: slug.trim(),

          resultSummary: resultSummary.trim(),

          clientName: clientName.trim() || null,

          projectUrl: projectUrl.trim() || null,

          thumbnail: thumbnail.trim() || null,

          challenge: challenge.trim() || null,

          solution: solution.trim() || null,

          process: process.trim() || null,

          testimonialId: testimonialId
            ? Number(testimonialId)
            : null,

          serviceIds: selectedServiceIds,

          industryIds: selectedIndustryIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to save portfolio project.",
        );
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save project.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadingOptions) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-black/35" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
    >
      <div className="space-y-7">
        {/* Basic Information */}
        <Section
          title="Basic Information"
          description="Main project details shown across portfolio pages."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Project name" required>
              <input
                value={projectName}
                onChange={(event) =>
                  handleProjectNameChange(event.target.value)
                }
                required
                className={inputClass}
                placeholder="Coitonic"
              />
            </FormField>

            <FormField label="Slug" required>
              <input
                value={slug}
                onChange={(event) =>
                  setSlug(generateSlug(event.target.value))
                }
                required
                className={inputClass}
                placeholder="coitonic"
              />
            </FormField>

            <FormField label="Client name">
              <input
                value={clientName}
                onChange={(event) =>
                  setClientName(event.target.value)
                }
                className={inputClass}
                placeholder="Coitonic"
              />
            </FormField>

            <FormField label="Live project URL">
              <input
                value={projectUrl}
                onChange={(event) =>
                  setProjectUrl(event.target.value)
                }
                type="url"
                className={inputClass}
                placeholder="https://example.com"
              />
            </FormField>
          </div>

          <FormField label="Thumbnail URL">
            <div className="relative">
              <ImageIcon
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                value={thumbnail}
                onChange={(event) =>
                  setThumbnail(event.target.value)
                }
                className={`${inputClass} pl-11`}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
          </FormField>

          <FormField label="Result summary" required>
            <textarea
              value={resultSummary}
              onChange={(event) =>
                setResultSummary(event.target.value)
              }
              required
              className={textareaClass}
              placeholder="Describe the project's outcome and impact..."
            />
          </FormField>
        </Section>

        {/* Case Study */}
        <Section
          title="Case Study"
          description="Optional detailed information for the portfolio detail page."
        >
          <FormField label="Challenge">
            <textarea
              value={challenge}
              onChange={(event) =>
                setChallenge(event.target.value)
              }
              className={textareaClass}
              placeholder="What problem was the client facing?"
            />
          </FormField>

          <FormField label="Solution">
            <textarea
              value={solution}
              onChange={(event) =>
                setSolution(event.target.value)
              }
              className={textareaClass}
              placeholder="How did your team solve the problem?"
            />
          </FormField>

          <FormField label="Process">
            <textarea
              value={process}
              onChange={(event) =>
                setProcess(event.target.value)
              }
              className={textareaClass}
              placeholder="Explain the development/design process..."
            />
          </FormField>
        </Section>
      </div>

      {/* Right column */}
      <div className="space-y-7">
        {/* Preview */}
        <Section
          title="Preview"
          description="Quick project preview."
        >
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#fafaf7]">
            <div className="aspect-[16/10] bg-black/5">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-9 w-9 text-black/15" />
                </div>
              )}
            </div>

            <div className="p-4">
              <p className="font-black text-black">
                {projectName || "Project name"}
              </p>

              <p className="mt-1 text-xs text-black/40">
                {clientName || "Client name"}
              </p>

              {previewUrl && (
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#6466e8]">
                  <ExternalLink size={13} />
                  {previewUrl}
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* Services */}
        <Section
          title="Services"
          description="Select services delivered for this project."
        >
          <CheckList
            items={services}
            selectedIds={selectedServiceIds}
            onToggle={toggleService}
          />
        </Section>

        {/* Industries */}
        <Section
          title="Industries"
          description="Choose the industries associated with this project."
        >
          <CheckList
            items={industries}
            selectedIds={selectedIndustryIds}
            onToggle={toggleIndustry}
          />
        </Section>

        {/* Testimonial */}
        <Section
          title="Testimonial"
          description="Optionally connect one testimonial."
        >
          <select
            value={testimonialId}
            onChange={(event) =>
              setTestimonialId(event.target.value)
            }
            className={inputClass}
          >
            <option value="">No testimonial</option>

            {testimonials.map((testimonial) => (
              <option
                key={testimonial.id}
                value={testimonial.id}
              >
                {testimonial.clientName}
                {testimonial.company
                  ? ` — ${testimonial.company}`
                  : ""}
              </option>
            ))}
          </select>
        </Section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-black text-white transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              {editing ? "Save Changes" : "Create Project"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">
        {title}
      </h2>

      <p className="mt-1 text-sm text-black/40">
        {description}
      </p>

      <div className="mt-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#1b1b23]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function CheckList({
  items,
  selectedIds,
  onToggle,
}: {
  items: {
    id: number;
    name: string;
  }[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-black/40">
        No options available.
      </p>
    );
  }

  return (
    <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
      {items.map((item) => {
        const checked = selectedIds.includes(item.id);

        return (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              checked
                ? "border-lime-300 bg-lime-50"
                : "border-black/5 bg-[#fafaf7] hover:bg-black/[0.02]"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 accent-lime-500"
            />

            <span className="text-sm font-bold text-black/65">
              {item.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";

const textareaClass =
  "min-h-[140px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";