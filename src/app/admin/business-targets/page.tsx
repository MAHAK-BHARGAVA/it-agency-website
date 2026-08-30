"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import ImageUpload from "@/components/admin/uploads/ImageUpload";

type Industry = {
  id: number;
  name: string;
  slug: string;
  description: string;

  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;

  _count: {
    serviceIndustries: number;
    portfolios?: number;
    testimonials?: number;
    faqs?: number;
  };
};

type FormState = {
  name: string;
  slug: string;
  description: string;

  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",

  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImage: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BusinessTargetsPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD INDUSTRIES ================= */

  async function loadIndustries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/industries");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load industries.",
        );
      }

      setIndustries(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load industries.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIndustries();
  }, []);

  /* ================= ADD ================= */

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setOpenMenu(null);
    setShowModal(true);
  }

  /* ================= EDIT ================= */

  async function openIndustryEdit(industry: Industry) {
    setEditingId(industry.id);
    setOpenMenu(null);
    setError("");

    try {
      const response = await fetch(`/api/admin/industries/${industry.id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load industry.",
        );
      }

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        description: data.description ?? "",

        metaTitle: data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        canonicalUrl: data.canonicalUrl ?? "",
        ogImage: data.ogImage ?? "",
      });

      setShowModal(true);
    } catch (editError) {
      setError(
        editError instanceof Error
          ? editError.message
          : "Unable to load industry.",
      );
    }
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  /* ================= NAME + SLUG ================= */

  function handleNameChange(value: string) {
    setForm((current) => {
      if (editingId) {
        return {
          ...current,
          name: value,
        };
      }

      return {
        ...current,
        name: value,
        slug: createSlug(value),
      };
    });
  }

  /* ================= CREATE / UPDATE ================= */

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Industry name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const endpoint = editingId
        ? `/api/admin/industries/${editingId}`
        : "/api/admin/industries";

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),

          metaTitle: form.metaTitle.trim() || null,

          metaDescription: form.metaDescription.trim() || null,

          canonicalUrl: form.canonicalUrl.trim() || null,

          ogImage: form.ogImage.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Unable to ${editingId ? "update" : "create"} industry.`,
        );
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadIndustries();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ================= DELETE ================= */

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Delete this industry? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setError("");
      setOpenMenu(null);

      const response = await fetch(`/api/admin/industries/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to delete industry.",
        );
      }

      await loadIndustries();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete industry.",
      );
    }
  }

  /* ================= SEARCH ================= */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredIndustries = industries.filter((industry) => {
    return (
      industry.name.toLowerCase().includes(normalizedSearch) ||
      industry.slug.toLowerCase().includes(normalizedSearch) ||
      industry.description.toLowerCase().includes(normalizedSearch)
    );
  });

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#fcf8ff] px-5 py-7 text-[#1b1b23] sm:px-8">
      {/* Header */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6466e8]">
            SEO Engine
          </p>

          <h1 className="mt-2 text-[32px] font-bold text-[#1b1b23]">
            Business Targets
          </h1>

          <p className="mt-1 max-w-2xl text-[15px] text-[#6B7280]">
            Manage the industries your agency serves and configure their SEO
            information.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          {/* Search */}

          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search industries..."
              className="h-11 w-full rounded-xl border border-[#c7c4d7] bg-white pl-9 pr-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-[#9ca3af] focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
            />
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4648d4] px-5 text-sm font-semibold text-white transition hover:bg-[#383bcf]"
          >
            <Plus size={16} />
            Add Industry
          </button>
        </div>
      </div>

      {/* Error */}

      {error && !showModal && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Industries" value={industries.length} />

        <StatCard
          label="Active Targets"
          value={
            industries.filter(
              (industry) => industry._count.serviceIndustries > 0,
            ).length
          }
        />

        <StatCard
          label="No Service Pages"
          value={
            industries.filter(
              (industry) => industry._count.serviceIndustries === 0,
            ).length
          }
        />
      </div>

      {/* Table */}

      <div className="mt-7 overflow-x-auto rounded-2xl border border-[#E4E2F0] bg-white">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#6B7280]">
            Loading industries...
          </div>
        ) : filteredIndustries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-[#464554]">No industries found</p>

            <p className="mt-2 text-sm text-[#9ca3af]">
              Try another search or add a new industry.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#F8F7FF] text-[#464554]">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Industry</th>

                <th className="px-6 py-4 font-semibold">Description</th>

                <th className="px-6 py-4 font-semibold">Service Pages</th>

                <th className="px-6 py-4 font-semibold">SEO</th>

                <th className="px-6 py-4 font-semibold">Status</th>

                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredIndustries.map((industry) => {
                const seoComplete = Boolean(
                  industry.metaTitle && industry.metaDescription,
                );

                const isLive = industry._count.serviceIndustries > 0;

                return (
                  <tr
                    key={industry.id}
                    className="border-t border-[#F1F0F7] transition hover:bg-[#FCFBFF]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1b1b23]">
                        {industry.name}
                      </p>

                      <p className="mt-1 text-xs text-[#9ca3af]">
                        /industries/
                        {industry.slug}
                      </p>
                    </td>

                    <td className="max-w-sm px-6 py-4 text-[#6B7280]">
                      <p className="line-clamp-2 leading-6">
                        {industry.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#1b1b23]">
                      {industry._count.serviceIndustries}
                    </td>

                    <td className="px-6 py-4">
                      {seoComplete ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Complete
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Needs work
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isLive ? (
                        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                          <CheckCircle2 size={15} />
                          Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 font-medium text-slate-400">
                          <Circle size={15} />
                          No Pages Yet
                        </span>
                      )}
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === industry.id ? null : industry.id,
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-[#F4F2FA] hover:text-[#4648d4]"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenu === industry.id && (
                        <div className="absolute right-6 top-12 z-30 w-36 overflow-hidden rounded-xl border border-[#E4E2F0] bg-white py-1 text-left shadow-xl">
                          <button
                            type="button"
                            onClick={() => openIndustryEdit(industry)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#464554] hover:bg-[#F8F7FF]"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(industry.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white text-[#1b1b23] shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E4E2F0] bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1b23]">
                  {editingId ? "Edit Industry" : "Add Industry"}
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Manage industry content and SEO information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#777584] transition hover:bg-[#F4F2FA]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Name */}

              <Field label="Industry name *">
                <input
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Healthcare"
                  className={inputClass}
                />
              </Field>

              {/* Slug */}

              <Field label="Slug *">
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      slug: createSlug(event.target.value),
                    })
                  }
                  placeholder="healthcare"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-[#9ca3af]">
                  Public URL: /industries/
                  {form.slug || "..."}
                </p>
              </Field>

              {/* Description */}

              <Field label="Description *">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  maxLength={5000}
                  placeholder="Describe the industry and the solutions your agency provides..."
                  className="min-h-[150px] w-full resize-y rounded-xl border border-[#c7c4d7] bg-white px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-[#9ca3af] focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
                />
              </Field>

              {/* SEO */}

              <div className="space-y-5 border-t border-[#E4E2F0] pt-6">
                <div>
                  <h3 className="font-bold text-[#1b1b23]">SEO Settings</h3>

                  <p className="mt-1 text-sm text-[#6B7280]">
                    Optional metadata for the industry landing page.
                  </p>
                </div>

                <Field label="Meta title">
                  <input
                    value={form.metaTitle}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        metaTitle: event.target.value,
                      })
                    }
                    maxLength={70}
                    placeholder="Healthcare Digital Solutions"
                    className={inputClass}
                  />

                  <CharacterCount current={form.metaTitle.length} max={70} />
                </Field>

                <Field label="Meta description">
                  <textarea
                    value={form.metaDescription}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        metaDescription: event.target.value,
                      })
                    }
                    maxLength={180}
                    placeholder="Professional digital solutions for healthcare businesses..."
                    className="min-h-[110px] w-full resize-y rounded-xl border border-[#c7c4d7] bg-white px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-[#9ca3af] focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
                  />

                  <CharacterCount
                    current={form.metaDescription.length}
                    max={180}
                  />
                </Field>

                <Field label="Canonical URL">
                  <input
                    type="url"
                    value={form.canonicalUrl}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        canonicalUrl: event.target.value,
                      })
                    }
                    placeholder="https://example.com/industries/healthcare"
                    className={inputClass}
                  />
                </Field>

                <ImageUpload
                  label="OG Image"
                  value={form.ogImage}
                  onChange={(url) =>
                    setForm((current) => ({
                      ...current,
                      ogImage: url,
                    }))
                  }
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Modal Footer */}

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#E4E2F0] bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-[#d8d5e4] bg-white px-5 py-2.5 text-sm font-semibold text-[#555462] transition hover:bg-[#F8F7FF]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-[#4648d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#383bcf] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Industry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E4E2F0] bg-white p-5">
      <p className="text-sm font-semibold text-[#6B7280]">{label}</p>

      <p className="mt-2 text-3xl font-bold text-[#1b1b23]">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#262631]">
        {label}
      </label>

      {children}
    </div>
  );
}

function CharacterCount({ current, max }: { current: number; max: number }) {
  return (
    <p className="mt-2 text-right text-xs text-[#9ca3af]">
      {current}/{max}
    </p>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#c7c4d7] bg-white px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-[#9ca3af] focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10";
