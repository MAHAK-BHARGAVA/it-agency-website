import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/blogs/BlogForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blogId = Number(id);

  if (!Number.isInteger(blogId) || blogId <= 0) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    notFound();
  }

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
          Edit Blog
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
          Update article content, publishing settings and SEO information.
        </p>
      </div>

      <div className="mt-8">
        <BlogForm
          initialData={{
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt,
            category: blog.category,
            featuredImage: blog.featuredImage,
            publishedAt: blog.publishedAt,
            metaTitle: blog.metaTitle,
            metaDescription: blog.metaDescription,
            canonicalUrl: blog.canonicalUrl,
            ogImage: blog.ogImage,
          }}
        />
      </div>
    </div>
  );
}
