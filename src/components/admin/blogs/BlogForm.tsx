"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ImageIcon,
  Loader2,
  Save,
  Search,
} from "lucide-react";

type BlogData = {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  category?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

type Props = {
  initialData?: BlogData;
};

export default function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const editing = Boolean(initialData?.id);

  const [title, setTitle] = useState(
    initialData?.title ?? "",
  );

  const [slug, setSlug] = useState(
    initialData?.slug ?? "",
  );

  const [excerpt, setExcerpt] = useState(
    initialData?.excerpt ?? "",
  );

  const [content, setContent] = useState(
    initialData?.content ?? "",
  );

  const [category, setCategory] = useState(
    initialData?.category ?? "",
  );

  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage ?? "",
  );

  const [metaTitle, setMetaTitle] = useState(
    initialData?.metaTitle ?? "",
  );

  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? "",
  );

  /*
   * publishedAt === null => Draft
   * publishedAt has value => Published
   */
  const [published, setPublished] = useState(
    Boolean(initialData?.publishedAt),
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

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!editing) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Blog slug is required.");
      return;
    }

    if (!content.trim()) {
      setError("Blog content is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/admin/blogs/${initialData?.id}`
          : "/api/admin/blogs",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),

            excerpt: excerpt.trim() || null,
            content: content.trim(),

            category: category.trim() || null,

            featuredImage:
              featuredImage.trim() || null,

            /*
             * If Publish is selected, save current date/time.
             * If Draft, save null.
             */
            publishedAt: published
              ? initialData?.publishedAt ||
                new Date().toISOString()
              : null,

            metaTitle: metaTitle.trim() || null,

            metaDescription:
              metaDescription.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to save blog.",
        );
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save blog.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]"
    >
      {/* LEFT COLUMN */}

      <div className="space-y-7">
        {/* MAIN CONTENT */}

        <Section
          title="Blog Content"
          description="Write the main content of your article."
        >
          <Field label="Blog title" required>
            <input
              value={title}
              onChange={(event) =>
                handleTitleChange(event.target.value)
              }
              maxLength={200}
              placeholder="10 Ways AI Can Help Your Business"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" required>
            <div className="flex overflow-hidden rounded-xl border border-black/10 bg-[#fafaf7] focus-within:border-[#6466e8] focus-within:ring-4 focus-within:ring-[#6466e8]/10">
              <span className="flex items-center border-r border-black/5 px-4 text-sm text-black/35">
                /blog/
              </span>

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    generateSlug(event.target.value),
                  )
                }
                placeholder="ai-for-business"
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[#1b1b23] outline-none"
              />
            </div>
          </Field>

          <Field label="Excerpt">
            <textarea
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              maxLength={500}
              placeholder="Write a short summary that will appear on the blog listing page..."
              className="min-h-[120px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <CharacterCount
              current={excerpt.length}
              maximum={500}
            />
          </Field>

          <Field label="Article content" required>
            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder={`Write your article here...

Introduction

Explain the topic...

Key Benefits

Add your detailed content here...`}
              className="min-h-[500px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-4 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <p className="mt-2 text-xs text-black/35">
              {content.length.toLocaleString()} characters
            </p>
          </Field>
        </Section>

        {/* FEATURED IMAGE */}

        <Section
          title="Featured Image"
          description="Main image displayed on the blog card and article."
        >
          <Field label="Image URL">
            <input
              value={featuredImage}
              onChange={(event) =>
                setFeaturedImage(event.target.value)
              }
              placeholder="https://res.cloudinary.com/..."
              className={inputClass}
            />
          </Field>

          {featuredImage ? (
            <div className="overflow-hidden rounded-2xl border border-black/5">
              <img
                src={featuredImage}
                alt="Featured image preview"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/9] flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#fafaf7]">
              <ImageIcon className="h-9 w-9 text-black/15" />

              <p className="mt-3 text-sm font-semibold text-black/30">
                No featured image
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* RIGHT COLUMN */}

      <div className="space-y-7">
        {/* PUBLISHING */}

        <Section
          title="Publishing"
          description="Control whether this article is publicly available."
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPublished(false)}
              className={`rounded-xl border p-4 text-left transition ${
                !published
                  ? "border-amber-300 bg-amber-50 ring-2 ring-amber-100"
                  : "border-black/10 bg-white hover:bg-black/[0.02]"
              }`}
            >
              <FileText
                size={20}
                className={
                  !published
                    ? "text-amber-600"
                    : "text-black/30"
                }
              />

              <p className="mt-3 text-sm font-black text-black">
                Draft
              </p>

              <p className="mt-1 text-xs leading-5 text-black/40">
                Keep it private.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPublished(true)}
              className={`rounded-xl border p-4 text-left transition ${
                published
                  ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-black/10 bg-white hover:bg-black/[0.02]"
              }`}
            >
              <FileText
                size={20}
                className={
                  published
                    ? "text-emerald-600"
                    : "text-black/30"
                }
              />

              <p className="mt-3 text-sm font-black text-black">
                Publish
              </p>

              <p className="mt-1 text-xs leading-5 text-black/40">
                Make it public.
              </p>
            </button>
          </div>

          {published && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold leading-5 text-emerald-700">
                {initialData?.publishedAt
                  ? "This article is currently published."
                  : "This article will be published when you save it."}
              </p>
            </div>
          )}
        </Section>

        {/* CATEGORY */}

        <Section
          title="Organization"
          description="Help organize articles in the blog library."
        >
          <Field label="Category">
            <input
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder="AI & Automation"
              className={inputClass}
            />
          </Field>
        </Section>

        {/* SEO */}

        <Section
          title="Search Engine Optimization"
          description="Control how this article appears in search results."
        >
          <Field label="Meta title">
            <input
              value={metaTitle}
              onChange={(event) =>
                setMetaTitle(event.target.value)
              }
              maxLength={70}
              placeholder="AI for Business: Complete Guide"
              className={inputClass}
            />

            <div className="mt-2 flex justify-between text-xs text-black/35">
              <span>50–60 recommended</span>
              <span>{metaTitle.length}/70</span>
            </div>
          </Field>

          <Field label="Meta description">
            <textarea
              value={metaDescription}
              onChange={(event) =>
                setMetaDescription(
                  event.target.value,
                )
              }
              maxLength={180}
              placeholder="Discover how businesses can use AI to automate processes and improve productivity..."
              className="min-h-[130px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <div className="mt-2 flex justify-between text-xs text-black/35">
              <span>150–160 recommended</span>
              <span>
                {metaDescription.length}/180
              </span>
            </div>
          </Field>
        </Section>

        {/* GOOGLE PREVIEW */}

        <Section
          title="Search Preview"
          description="Approximate appearance in Google results."
        >
          <div className="rounded-2xl border border-black/5 bg-[#fafaf7] p-5">
            <div className="flex items-center gap-2 text-xs text-black/45">
              <Search size={14} />

              <span className="truncate">
                yourwebsite.com/blog/
                {slug || "..."}
              </span>
            </div>

            <p className="mt-3 text-lg font-medium leading-6 text-[#1a0dab]">
              {metaTitle ||
                title ||
                "Blog Article Title"}
            </p>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/55">
              {metaDescription ||
                excerpt ||
                "Your blog meta description will appear here."}
            </p>
          </div>
        </Section>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* SAVE */}

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
                : published
                  ? "Publish Blog"
                  : "Save Draft"}
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
  maximum,
}: {
  current: number;
  maximum: number;
}) {
  return (
    <p className="mt-2 text-right text-xs text-black/35">
      {current}/{maximum}
    </p>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";