"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Loader2,
  Save,
  Search,
} from "lucide-react";

type ServiceData = {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  image?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

type Props = {
  initialData?: ServiceData;
};

export default function ServiceForm({
  initialData,
}: Props) {
  const router = useRouter();
  const editing = Boolean(initialData?.id);

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [image, setImage] = useState(
    initialData?.image ?? "",
  );

  const [metaTitle, setMetaTitle] = useState(
    initialData?.metaTitle ?? "",
  );

  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? "",
  );

  const [canonicalUrl, setCanonicalUrl] = useState(
    initialData?.canonicalUrl ?? "",
  );

  const [ogImage, setOgImage] = useState(
    initialData?.ogImage ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    // Automatically generate slug while creating.
    // Editing an existing service should not unexpectedly
    // change its public URL.
    if (!editing) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Service slug is required.");
      return;
    }

    if (!description.trim()) {
      setError("Service description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/admin/services/${initialData?.id}`
          : "/api/admin/services",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),

            image: image.trim() || null,

            metaTitle: metaTitle.trim() || null,
            metaDescription:
              metaDescription.trim() || null,

            canonicalUrl:
              canonicalUrl.trim() || null,

            ogImage: ogImage.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to save service.",
        );
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save service.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr]"
    >
      {/* LEFT SIDE */}

      <div className="space-y-7">
        <Section
          title="Service Information"
          description="Main content displayed on the service page."
        >
          <Field label="Service name" required>
            <input
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              maxLength={150}
              placeholder="Website Design & Development"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" required>
            <div className="flex overflow-hidden rounded-xl border border-black/10 bg-[#fafaf7] focus-within:border-[#6466e8] focus-within:ring-4 focus-within:ring-[#6466e8]/10">
              <span className="flex items-center border-r border-black/5 px-4 text-sm text-black/35">
                /services/
              </span>

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    generateSlug(event.target.value),
                  )
                }
                placeholder="website-development"
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[#1b1b23] outline-none"
              />
            </div>
          </Field>

          <Field label="Description" required>
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={5000}
              placeholder="Describe the service, its benefits and what your company provides..."
              className="min-h-[260px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <p className="mt-2 text-right text-xs text-black/35">
              {description.length}/5000
            </p>
          </Field>
        </Section>

        {/* SERVICE IMAGE */}

        <Section
          title="Service Image"
          description="Main visual used for this service."
        >
          <Field label="Image URL">
            <input
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              placeholder="https://res.cloudinary.com/..."
              className={inputClass}
            />
          </Field>

          {image ? (
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#fafaf7]">
              <img
                src={image}
                alt="Service preview"
                className="h-60 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#fafaf7]">
              <ImageIcon className="h-8 w-8 text-black/15" />

              <p className="mt-3 text-sm font-semibold text-black/30">
                No service image
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* RIGHT SIDE */}

      <div className="space-y-7">
        <Section
          title="Search Engine Optimization"
          description="Control how this service appears in search results."
        >
          <Field label="Meta title">
            <input
              value={metaTitle}
              onChange={(event) =>
                setMetaTitle(event.target.value)
              }
              maxLength={70}
              placeholder="Website Development Services"
              className={inputClass}
            />

            <CharacterCount
              current={metaTitle.length}
              recommended="50–60 recommended"
            />
          </Field>

          <Field label="Meta description">
            <textarea
              value={metaDescription}
              onChange={(event) =>
                setMetaDescription(event.target.value)
              }
              maxLength={180}
              placeholder="Professional website development services for modern businesses..."
              className="min-h-[130px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <CharacterCount
              current={metaDescription.length}
              recommended="150–160 recommended"
            />
          </Field>

          <Field label="Canonical URL">
            <input
              value={canonicalUrl}
              onChange={(event) =>
                setCanonicalUrl(event.target.value)
              }
              placeholder="https://example.com/services/website-development"
              className={inputClass}
            />
          </Field>

          <Field label="Open Graph image">
            <input
              value={ogImage}
              onChange={(event) =>
                setOgImage(event.target.value)
              }
              placeholder="https://res.cloudinary.com/.../og-image.jpg"
              className={inputClass}
            />
          </Field>
        </Section>

        {/* GOOGLE PREVIEW */}

        <Section
          title="Search Preview"
          description="Approximate Google search appearance."
        >
          <div className="rounded-2xl border border-black/5 bg-[#fafaf7] p-5">
            <div className="flex items-center gap-2 text-xs text-black/45">
              <Search size={14} />

              {canonicalUrl ||
                (slug
                  ? `yourwebsite.com/services/${slug}`
                  : "yourwebsite.com/services/...")}
            </div>

            <p className="mt-3 text-lg font-medium text-[#1a0dab]">
              {metaTitle ||
                name ||
                "Service Page Title"}
            </p>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/55">
              {metaDescription ||
                description ||
                "Your service meta description will appear here."}
            </p>
          </div>
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

              {editing
                ? "Save Changes"
                : "Create Service"}
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
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function CharacterCount({
  current,
  recommended,
}: {
  current: number;
  recommended: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between text-xs text-black/35">
      <span>{recommended}</span>
      <span>{current}</span>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";