"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
};

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/blogs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to load blogs.",
        );
      }

      setBlogs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load blogs.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(blog: Blog) {
    const confirmed = window.confirm(
      `Delete "${blog.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(blog.id);
      setError("");

      const response = await fetch(
        `/api/admin/blogs/${blog.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to delete blog.",
        );
      }

      setBlogs((current) =>
        current.filter((item) => item.id !== blog.id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete blog.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredBlogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query);

      const published = Boolean(blog.publishedAt);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && published) ||
        (statusFilter === "DRAFT" && !published);

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const publishedCount = blogs.filter(
    (blog) => blog.publishedAt,
  ).length;

  const draftCount = blogs.length - publishedCount;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            Content Management
          </p>

          <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
            Blogs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Create, edit and publish SEO-friendly articles for
            your website.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />
          Add Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Blogs"
          value={blogs.length}
        />

        <StatCard
          label="Published"
          value={publishedCount}
        />

        <StatCard
          label="Drafts"
          value={draftCount}
        />
      </div>

      {/* Main card */}
      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-black text-black">
              Blog Library
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {filteredBlogs.length} article
              {filteredBlogs.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter,
                )
              }
              className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm font-bold text-[#1b1b23] outline-none focus:border-[#6466e8]"
            >
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search blogs..."
                className="h-11 w-full rounded-xl border border-black/10 bg-[#fafaf7] pl-11 pr-4 text-sm text-[#1b1b23] outline-none placeholder:text-black/35 focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
              />
            </div>
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
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="mx-auto h-10 w-10 text-black/15" />

            <p className="mt-4 text-sm font-bold text-black/40">
              No blogs found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                deleting={deletingId === blog.id}
                onDelete={() => handleDelete(blog)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCard({
  blog,
  deleting,
  onDelete,
}: {
  blog: Blog;
  deleting: boolean;
  onDelete: () => void;
}) {
  const published = Boolean(blog.publishedAt);

  return (
    <article className="overflow-hidden rounded-[22px] border border-black/5 bg-[#fafaf7] transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden bg-black/5">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-10 w-10 text-black/15" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              published
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {published ? "Published" : "Draft"}
          </span>

          {blog.category && (
            <span className="text-xs font-bold text-black/35">
              {blog.category}
            </span>
          )}
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-black leading-6 text-black">
          {blog.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/55">
          {blog.excerpt ||
            "No excerpt has been added for this article."}
        </p>

        {published && blog.publishedAt && (
          <p className="mt-4 text-xs font-semibold text-black/35">
            Published{" "}
            {new Date(blog.publishedAt).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            )}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <code className="max-w-[55%] truncate rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/40">
            {blog.slug}
          </code>

          <div className="flex gap-2">
            <Link
              href={`/admin/blogs/${blog.id}/edit`}
              title="Edit blog"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black/5 hover:text-black"
            >
              <Pencil size={15} />
            </Link>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              title="Delete blog"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? (
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
      </div>
    </article>
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