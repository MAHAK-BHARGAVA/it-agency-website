"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

type RelatedItem = {
  id: number;
  name: string;
};

type Testimonial = {
  id: number;
  clientName: string;
  company: string | null;
  quote: string;
  rating: number | null;
  photo: string | null;
  services: RelatedItem[];
  cities: RelatedItem[];
  industries: RelatedItem[];
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/testimonials");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load testimonials.",
        );
      }

      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load testimonials.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (
      !window.confirm(
        `Delete testimonial from "${testimonial.clientName}"?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(testimonial.id);

      const response = await fetch(
        `/api/admin/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to delete testimonial.");
      }

      setItems((current) =>
        current.filter((item) => item.id !== testimonial.id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete testimonial.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return items;

    return items.filter((item) => {
      return (
        item.clientName.toLowerCase().includes(query) ||
        item.company?.toLowerCase().includes(query) ||
        item.quote.toLowerCase().includes(query)
      );
    });
  }, [items, search]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            Social Proof
          </p>

          <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
            Testimonials
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Manage client feedback and connect testimonials with services,
            industries and cities.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />
          Add Testimonial
        </Link>
      </div>

      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-black">
              Client Testimonials
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {filteredItems.length} testimonial
              {filteredItems.length === 1 ? "" : "s"}
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
              placeholder="Search testimonials..."
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
            <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-black/40">
              No testimonials found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="rounded-[22px] border border-black/5 bg-[#fafaf7] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.clientName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 text-sm font-black text-lime-800">
                      {item.clientName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-black text-black">
                      {item.clientName}
                    </h3>

                    <p className="text-sm text-black/40">
                      {item.company ?? "No company"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={
                        index < (item.rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-black/15"
                      }
                    />
                  ))}
                </div>

                <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/55">
                  “{item.quote}”
                </p>

                {item.services.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.services.slice(0, 2).map((service) => (
                      <span
                        key={service.id}
                        className="rounded-full bg-lime-100 px-3 py-1 text-[11px] font-bold text-lime-800"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex justify-end gap-2 border-t border-black/5 pt-4">
                  <Link
                    href={`/admin/testimonials/${item.id}/edit`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 hover:bg-black/5"
                  >
                    <Pencil size={15} />
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}