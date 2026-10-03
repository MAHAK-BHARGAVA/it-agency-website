import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function BlogIndexPage() {
  const posts = await prisma.blog.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="overflow-hidden bg-[#F6F6F2] text-[#181A1B]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="px-6 pb-24 pt-32 sm:px-10 lg:px-16 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-[#DDDDD7] pb-10">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#DCDCD6] bg-white px-4 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B7F000] text-black">
                <BookOpen size={14} />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#555750]">
                Insights & ideas
              </span>
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem]">
              Ideas that
              <br />
              <span className="text-[#777971]">move forward.</span>
            </h1>
          </div>

          <div className="grid gap-8 pt-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <p className="max-w-3xl text-lg leading-8 text-[#666861] sm:text-xl sm:leading-9">
              Practical insights, ideas and perspectives around technology,
              digital products, AI, design and building better digital
              experiences.
            </p>

            <div className="lg:border-l lg:border-[#DDDDD7] lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A8C85]">
                Latest articles
              </p>

              <p className="mt-3 text-base leading-7 text-[#444640]">
                Explore our latest thinking and learn something useful along
                the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOG POSTS
      ========================================================= */}
      <section className="px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between border-b border-[#DDDDD7] pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A8C85]">
                Journal
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Latest from us
              </h2>
            </div>

            {posts.length > 0 && (
              <span className="hidden text-sm font-medium text-[#777971] sm:block">
                {posts.length.toString().padStart(2, "0")} articles
              </span>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="rounded-[32px] border border-[#E2E2DC] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F0EB]">
                <BookOpen size={22} className="text-[#777971]" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                No blog posts published yet
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-[#6B6D68]">
                New articles will appear here once they are published from the
                admin panel.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#DDDDD7]">
              {posts.map((post, index) => {
                const formattedDate = post.publishedAt
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(post.publishedAt))
                  : null;

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group grid gap-6 py-10 transition-all duration-300 first:pt-4 lg:grid-cols-[90px_170px_1fr_auto] lg:items-center"
                  >
                    {/* Number */}
                    <span className="text-sm font-semibold text-[#A0A19B]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Category / date */}
                    <div>
                      {post.category && (
                        <span className="inline-block rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#555750]">
                          {post.category}
                        </span>
                      )}

                      {formattedDate && (
                        <p className="mt-3 text-xs text-[#8A8C85]">
                          {formattedDate}
                        </p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl">
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#555750] sm:text-3xl">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="mt-4 line-clamp-2 max-w-2xl text-base leading-7 text-[#777971]">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DCDCD6] bg-white transition-all duration-300 group-hover:rotate-45 group-hover:border-black group-hover:bg-[#B7F000]">
                      <ArrowUpRight size={19} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-[#181A1B] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B7F000]">
              Let&apos;s create
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Have an idea worth{" "}
              <span className="text-[#B7F000]">building?</span>
            </h2>
          </div>

          <div>
            <p className="mb-7 leading-8 text-white/60">
              From strategy and design to development and digital growth,
              let&apos;s turn your next idea into something real.
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#B7F000] px-6 py-4 text-sm font-bold text-black transition-all duration-300 hover:gap-5 hover:bg-white"
            >
              Start a project

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}