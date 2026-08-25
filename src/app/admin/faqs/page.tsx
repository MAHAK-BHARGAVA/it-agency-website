"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CircleHelp,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type RelatedItem = {
  id: number;
  name: string;
};

type Faq = {
  id: number;
  question: string;
  answer: string;
  services: RelatedItem[];
  cities: RelatedItem[];
  states: RelatedItem[];
  industries: RelatedItem[];
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/faqs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load FAQs.",
        );
      }

      setFaqs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load FAQs.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(faq: Faq) {
    const confirmed = window.confirm(
      `Delete this FAQ?\n\n${faq.question}`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(faq.id);
      setError("");

      const response = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete FAQ.");
      }

      setFaqs((current) =>
        current.filter((item) => item.id !== faq.id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete FAQ.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredFaqs = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.services.some((item) =>
          item.name.toLowerCase().includes(query),
        ) ||
        faq.industries.some((item) =>
          item.name.toLowerCase().includes(query),
        ),
    );
  }, [faqs, search]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            Optimization
          </p>

          <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
            FAQs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Manage frequently asked questions and connect them with relevant
            services, locations and industries.
          </p>
        </div>

        <Link
          href="/admin/faqs/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />
          Add FAQ
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total FAQs"
          value={faqs.length}
        />

        <StatCard
          label="Connected FAQs"
          value={
            faqs.filter(
              (faq) =>
                faq.services.length ||
                faq.cities.length ||
                faq.states.length ||
                faq.industries.length,
            ).length
          }
        />
      </div>

      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-black">
              FAQ Library
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {filteredFaqs.length} FAQ
              {filteredFaqs.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search FAQs..."
              className="h-11 w-full rounded-xl border border-black/10 bg-[#fafaf7] pl-11 pr-4 text-sm text-[#1b1b23] outline-none placeholder:text-black/35 focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black/35" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-20 text-center">
            <CircleHelp className="mx-auto h-10 w-10 text-black/15" />

            <p className="mt-4 text-sm font-bold text-black/40">
              No FAQs found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {filteredFaqs.map((faq) => (
              <article
                key={faq.id}
                className="p-6 transition hover:bg-[#fafaf7]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-black">
                      {faq.question}
                    </h3>

                    <p className="mt-3 line-clamp-3 max-w-4xl text-sm leading-6 text-black/55">
                      {faq.answer}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {faq.services.slice(0, 2).map((item) => (
                        <Tag
                          key={`service-${item.id}`}
                          text={item.name}
                        />
                      ))}

                      {faq.industries.slice(0, 2).map((item) => (
                        <Tag
                          key={`industry-${item.id}`}
                          text={item.name}
                        />
                      ))}

                      {faq.cities.slice(0, 1).map((item) => (
                        <Tag
                          key={`city-${item.id}`}
                          text={item.name}
                        />
                      ))}

                      {faq.states.slice(0, 1).map((item) => (
                        <Tag
                          key={`state-${item.id}`}
                          text={item.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/faqs/${faq.id}/edit`}
                      title="Edit FAQ"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black/5 hover:text-black"
                    >
                      <Pencil size={15} />
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === faq.id}
                      onClick={() => handleDelete(faq)}
                      title="Delete FAQ"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === faq.id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-black/40">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-black">
        {value}
      </p>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-lime-100 px-3 py-1 text-[11px] font-bold text-lime-800">
      {text}
    </span>
  );
}