"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wrench,
} from "lucide-react";

type Service = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;

  _count?: {
    serviceCities: number;
    serviceStates: number;
    serviceIndustries: number;
  };
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/services");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to load services.",
        );
      }

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load services.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(service: Service) {
    const confirmed = window.confirm(
      `Delete "${service.name}"?\n\nThis may also remove related SEO targeting records.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(service.id);
      setError("");

      const response = await fetch(
        `/api/admin/services/${service.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to delete service.",
        );
      }

      setServices((current) =>
        current.filter((item) => item.id !== service.id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete service.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredServices = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return services;

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(query) ||
        service.slug.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    });
  }, [services, search]);

  const seoCompleteCount = services.filter(
    (service) =>
      service.metaTitle &&
      service.metaDescription &&
      service.image,
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            Website Content
          </p>

          <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
            Services
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Manage service pages, descriptions, images and SEO
            metadata.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />
          Add Service
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Services"
          value={services.length}
        />

        <StatCard
          label="SEO Complete"
          value={seoCompleteCount}
        />

        <StatCard
          label="Needs SEO"
          value={services.length - seoCompleteCount}
        />
      </div>

      {/* Table */}
      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-black">
              All Services
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {filteredServices.length} service
              {filteredServices.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search services..."
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
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center">
            <Wrench className="mx-auto h-10 w-10 text-black/15" />

            <p className="mt-4 text-sm font-bold text-black/40">
              No services found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-[#fafaf7] text-left">
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>SEO</TableHead>
                  <TableHead>Target Pages</TableHead>
                  <TableHead align="right">
                    Actions
                  </TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => {
                  const targetPages =
                    (service._count?.serviceCities ?? 0) +
                    (service._count?.serviceStates ?? 0) +
                    (service._count?.serviceIndustries ?? 0);

                  const seoComplete = Boolean(
                    service.metaTitle &&
                      service.metaDescription &&
                      service.image,
                  );

                  return (
                    <tr
                      key={service.id}
                      className="border-t border-black/5 transition hover:bg-[#fafaf7]"
                    >
                      {/* Service */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/5">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-black/20" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-black text-black">
                              {service.name}
                            </p>

                            <code className="mt-1 block text-xs text-black/35">
                              {service.slug}
                            </code>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-sm px-6 py-5">
                        <p className="line-clamp-2 text-sm leading-6 text-black/55">
                          {service.description}
                        </p>
                      </td>

                      {/* SEO */}
                      <td className="px-6 py-5">
                        {seoComplete ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            Complete
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                            Needs work
                          </span>
                        )}
                      </td>

                      {/* Targets */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-black/55">
                          {targetPages}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            title="Preview service"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black/5 hover:text-black"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            title="Edit service"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black/5 hover:text-black"
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId === service.id
                            }
                            onClick={() =>
                              handleDelete(service)
                            }
                            title="Delete service"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === service.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-black uppercase tracking-wider text-black/35 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}