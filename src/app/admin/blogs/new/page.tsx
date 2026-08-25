import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import BlogForm from "@/components/admin/blogs/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft size={16} />
        Back to Blogs
      </Link>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          Content Management
        </p>

        <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
          Add Blog
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
          Write a new article, configure its SEO information and
          save it as a draft or publish it.
        </p>
      </div>

      <div className="mt-8">
        <BlogForm />
      </div>
    </div>
  );
}