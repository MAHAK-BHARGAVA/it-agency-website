"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type RelatedItem = {
  id: number;
  name: string;
};

type InitialData = {
  id?: number;
  question?: string;
  answer?: string;
  services?: RelatedItem[];
  cities?: RelatedItem[];
  states?: RelatedItem[];
  industries?: RelatedItem[];
};

type Props = {
  initialData?: InitialData;
};

export default function FaqForm({ initialData }: Props) {
  const router = useRouter();
  const editing = Boolean(initialData?.id);

  const [services, setServices] = useState<RelatedItem[]>([]);
  const [cities, setCities] = useState<RelatedItem[]>([]);
  const [states, setStates] = useState<RelatedItem[]>([]);
  const [industries, setIndustries] = useState<RelatedItem[]>([]);

  const [question, setQuestion] = useState(
    initialData?.question ?? "",
  );

  const [answer, setAnswer] = useState(
    initialData?.answer ?? "",
  );

  const [serviceIds, setServiceIds] = useState<number[]>(
    initialData?.services?.map((item) => item.id) ?? [],
  );

  const [cityIds, setCityIds] = useState<number[]>(
    initialData?.cities?.map((item) => item.id) ?? [],
  );

  const [stateIds, setStateIds] = useState<number[]>(
    initialData?.states?.map((item) => item.id) ?? [],
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
        setLoading(true);
        setError("");

        const [
          servicesResponse,
          citiesResponse,
          statesResponse,
          industriesResponse,
        ] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/cities"),
          fetch("/api/admin/states"),
          fetch("/api/admin/industries"),
        ]);

        if (
          !servicesResponse.ok ||
          !citiesResponse.ok ||
          !statesResponse.ok ||
          !industriesResponse.ok
        ) {
          throw new Error("Unable to load form options.");
        }

        const [
          servicesData,
          citiesData,
          statesData,
          industriesData,
        ] = await Promise.all([
          servicesResponse.json(),
          citiesResponse.json(),
          statesResponse.json(),
          industriesResponse.json(),
        ]);

        setServices(servicesData);
        setCities(citiesData);
        setStates(statesData);
        setIndustries(industriesData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load form options.",
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
    setter((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Question is required.");
      return;
    }

    if (!answer.trim()) {
      setError("Answer is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/admin/faqs/${initialData?.id}`
          : "/api/admin/faqs",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: question.trim(),
            answer: answer.trim(),
            serviceIds,
            cityIds,
            stateIds,
            industryIds,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to save FAQ.",
        );
      }

      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save FAQ.",
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
      {/* LEFT */}
      <div>
        <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-black">
            FAQ Content
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Write the question and its answer.
          </p>

          <div className="mt-6 space-y-6">
            <Field label="Question" required>
              <input
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                maxLength={300}
                placeholder="What services do you provide?"
                className={inputClass}
              />

              <p className="mt-2 text-right text-xs text-black/35">
                {question.length}/300
              </p>
            </Field>

            <Field label="Answer" required>
              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                maxLength={5000}
                placeholder="Write a clear and helpful answer..."
                className={textareaClass}
              />

              <p className="mt-2 text-right text-xs text-black/35">
                {answer.length}/5000
              </p>
            </Field>
          </div>
        </section>
      </div>

      {/* RIGHT */}
      <div className="space-y-7">
        <Section
          title="Services"
          description="Show this FAQ on selected service pages."
        >
          <CheckList
            items={services}
            selected={serviceIds}
            onToggle={(id) =>
              toggle(id, serviceIds, setServiceIds)
            }
          />
        </Section>

        <Section
          title="Industries"
          description="Connect this FAQ with relevant industries."
        >
          <CheckList
            items={industries}
            selected={industryIds}
            onToggle={(id) =>
              toggle(id, industryIds, setIndustryIds)
            }
          />
        </Section>

        <Section
          title="States"
          description="Show this FAQ on selected state pages."
        >
          <CheckList
            items={states}
            selected={stateIds}
            onToggle={(id) =>
              toggle(id, stateIds, setStateIds)
            }
          />
        </Section>

        <Section
          title="Cities"
          description="Show this FAQ on selected city pages."
        >
          <CheckList
            items={cities}
            selected={cityIds}
            onToggle={(id) =>
              toggle(id, cityIds, setCityIds)
            }
          />
        </Section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
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
              {editing ? "Save Changes" : "Create FAQ"}
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

      <div className="mt-6">{children}</div>
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
  selected,
  onToggle,
}: {
  items: RelatedItem[];
  selected: number[];
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
    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
      {items.map((item) => {
        const checked = selected.includes(item.id);

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
  "min-h-[260px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";