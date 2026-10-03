import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";

type Props = {
  params: Promise<{ post: string }>;
};

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany({
    where: {
      publishedAt: {
        not: null,
      },
    },
  });

  return posts.map((p) => ({
    post: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { post } = await params;

  const data = await prisma.blog.findUnique({
    where: {
      slug: post,
    },
  });

  if (!data) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: data.metaTitle || data.title,
    description:
      data.metaDescription ||
      data.excerpt ||
      undefined,
  };
}

export default async function BlogDetailPage({
  params,
}: Props) {
  const { post } = await params;

  const blogPost = await prisma.blog.findUnique({
    where: {
      slug: post,
    },
  });

  if (!blogPost) {
    notFound();
  }

  /*
   * Sanitize rich-text HTML before rendering.
   *
   * This allows the Tiptap-generated HTML to be displayed
   * while preventing unsafe HTML from being rendered directly.
   */
  const sanitizedContent = DOMPurify.sanitize(
    blogPost.content,
    {
      ADD_ATTR: ["data-align"],
    },
  );

  const formattedDate = blogPost.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(blogPost.publishedAt))
    : null;

  return (
    <main className="overflow-hidden bg-[#F6F6F2] text-[#181A1B]">
      {/* =========================================================
          ARTICLE HERO
      ========================================================= */}
      <section className="px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:pb-28 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="group mb-12 inline-flex items-center gap-3 text-sm font-semibold text-[#666861] transition-colors hover:text-black"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCDCD6] bg-white transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeft size={16} />
            </span>

            Back to insights
          </Link>

          {/* Category + date */}
          <div className="flex flex-wrap items-center gap-4">
            {blogPost.category && (
              <span className="rounded-full bg-[#B7F000] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-black">
                {blogPost.category}
              </span>
            )}

            {formattedDate && (
              <span className="inline-flex items-center gap-2 text-sm text-[#777971]">
                <CalendarDays size={16} />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-8 max-w-6xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
            {blogPost.title}
          </h1>

          {/* Excerpt */}
          {blogPost.excerpt && (
            <p className="mt-10 max-w-3xl text-lg leading-8 text-[#666861] sm:text-xl sm:leading-9">
              {blogPost.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="mt-14 border-t border-[#DCDCD6]" />
        </div>
      </section>

      {/* =========================================================
          ARTICLE CONTENT
      ========================================================= */}
      <section className="px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[180px_minmax(0,1fr)]">
          {/* Sticky article label */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A8C85]">
                Article
              </p>

              <div className="mt-5 h-px w-12 bg-[#B7F000]" />

              {formattedDate && (
                <p className="mt-5 text-sm leading-6 text-[#777971]">
                  Published
                  <br />
                  {formattedDate}
                </p>
              )}
            </div>
          </aside>

          {/* =====================================================
              RICH TEXT CONTENT
          ===================================================== */}
          <article className="min-w-0">
            <div
  className="
    blog-content
    max-w-4xl
    text-[17px]
    leading-8
    text-[#444640]
  "
  dangerouslySetInnerHTML={{
    __html: sanitizedContent,
  }}
/>
          </article>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-6 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] bg-[#181A1B] px-8 py-14 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Lime accent */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#B7F000]/20 blur-3xl" />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B7F000]">
                  Have a project in mind?
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Let&apos;s build something that matters.
                </h2>
              </div>

              <Link
                href="/contact"
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#B7F000] px-6 py-4 text-sm font-bold text-black transition-all duration-300 hover:gap-5 hover:bg-white"
              >
                Start a project

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-10" />
    </main>
  );
}