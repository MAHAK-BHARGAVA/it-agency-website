"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Star } from "lucide-react";
import ImageUpload from "@/components/admin/uploads/ImageUpload";

type RelatedItem = {
  id: number;
  name: string;
};

type InitialData = {
  id?: number;
  clientName?: string;
  company?: string | null;
  quote?: string;
  rating?: number | null;
  photo?: string | null;
  services?: RelatedItem[];
  cities?: RelatedItem[];
  industries?: RelatedItem[];
};

type Props = {
  initialData?: InitialData;
};

export default function TestimonialForm({ initialData }: Props) {
  const router = useRouter();
  const editing = Boolean(initialData?.id);

  const [services, setServices] = useState<RelatedItem[]>([]);
  const [cities, setCities] = useState<RelatedItem[]>([]);
  const [industries, setIndustries] = useState<RelatedItem[]>([]);

  const [clientName, setClientName] = useState(initialData?.clientName ?? "");
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [quote, setQuote] = useState(initialData?.quote ?? "");
  const [photo, setPhoto] = useState(initialData?.photo ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 5);

  const [serviceIds, setServiceIds] = useState<number[]>(
    initialData?.services?.map((item) => item.id) ?? [],
  );
  const [cityIds, setCityIds] = useState<number[]>(
    initialData?.cities?.map((item) => item.id) ?? [],
  );
  const [industryIds, setIndustryIds] = useState<number[]>(
    initialData?.industries?.map((item) => item.id) ?? [],
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [serviceRes, cityRes, industryRes] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/cities"),
          fetch("/api/admin/industries"),
        ]);

        if (!serviceRes.ok || !cityRes.ok || !industryRes.ok) {
          throw new Error("Unable to load form options.");
        }

        const [serviceData, cityData, industryData] = await Promise.all([
          serviceRes.json(),
          cityRes.json(),
          industryRes.json(),
        ]);

        setServices(serviceData);
        setCities(cityData);
        setIndustries(industryData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load form options.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  function toggle(
    id: number,
    values: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) {
    setter(
      values.includes(id)
        ? values.filter((item) => item !== id)
        : [...values, id],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientName.trim() || !quote.trim()) {
      setError("Client name and testimonial are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/admin/testimonials/${initialData?.id}`
          : "/api/admin/testimonials",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName: clientName.trim(),
            company: company.trim() || null,
            quote: quote.trim(),
            rating,
            photo: photo.trim() || null,
            serviceIds,
            cityIds,
            industryIds,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to save testimonial.",
        );
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save testimonial.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-black/30" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-7 xl:grid-cols-[1.25fr_0.75fr]"
    >
      <div className="space-y-7">
        <Section title="Client Information">
          <Field label="Client name" required>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={inputClass}
              placeholder="Client name"
            />
          </Field>

          <Field label="Company">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
              placeholder="Company name"
            />
          </Field>

          <ImageUpload label="Client Photo" value={photo} onChange={setPhoto} />
        </Section>

        <Section title="Testimonial">
          <Field label="Client feedback" required>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              maxLength={2000}
              className={textareaClass}
              placeholder="What did the client say about the project?"
            />

            <p className="mt-2 text-right text-xs text-black/35">
              {quote.length}/2000
            </p>
          </Field>

          <Field label="Rating">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setRating((current) =>
                      current === value ? value - 1 : value,
                    );
                  }}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={27}
                    className={
                      value <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-black/15"
                    }
                  />
                </button>
              ))}
            </div>
          </Field>
        </Section>
      </div>

      <div className="space-y-7">
        <Section title="Services">
          <CheckList
            items={services}
            selected={serviceIds}
            onToggle={(id) => toggle(id, serviceIds, setServiceIds)}
          />
        </Section>

        <Section title="Industries">
          <CheckList
            items={industries}
            selected={industryIds}
            onToggle={(id) => toggle(id, industryIds, setIndustryIds)}
          />
        </Section>

        <Section title="Cities">
          <CheckList
            items={cities}
            selected={cityIds}
            onToggle={(id) => toggle(id, cityIds, setCityIds)}
          />
        </Section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-black text-white transition hover:bg-lime-400 hover:text-black disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              {editing ? "Save Changes" : "Create Testimonial"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
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
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function CheckList({
  items,
  selected,
  onToggle,
}: {
  items: RelatedItem[];
  selected: number[];
  onToggle: (id: number) => void;
}) {
  if (!items.length) {
    return <p className="text-sm text-black/40">No options available.</p>;
  }

  return (
    <div className="max-h-56 space-y-2 overflow-y-auto">
      {items.map((item) => {
        const checked = selected.includes(item.id);

        return (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
              checked
                ? "border-lime-300 bg-lime-50"
                : "border-black/5 bg-[#fafaf7]"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 accent-lime-500"
            />

            <span className="text-sm font-bold text-black/65">{item.name}</span>
          </label>
        );
      })}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";

const textareaClass =
  "min-h-[180px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";
