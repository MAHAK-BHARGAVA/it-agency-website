import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import DOMPurify from "isomorphic-dompurify";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

function getValidId(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

function isValidUrl(value: unknown) {
  if (!value) return true;

  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function getPrismaErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code: string }).code;
  }

  return null;
}

function sanitizeBlogContent(content: string) {
  return DOMPurify.sanitize(content, {
    USE_PROFILES: {
      html: true,
    },

    ALLOWED_TAGS: [
      "p",
      "br",

      "h1",
      "h2",
      "h3",
      "h4",

      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",

      "ul",
      "ol",
      "li",

      "blockquote",

      "code",
      "pre",

      "hr",

      "a",
      "img",

      "mark",
      "span",
    ],

    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "title",

      "src",
      "alt",
      "width",
      "height",

      "style",
      "class",
      "data-align",
    ],
  });
}

function getPlainTextFromHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const { id } = await params;

  const blogId = getValidId(id);

  if (!blogId) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Failed to fetch blog:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const { id } = await params;

  const blogId = getValidId(id);

  if (!blogId) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      category,
      publishedAt,
      featuredImage,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
    } = body;

    // Required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return NextResponse.json(
        {
          error: "Title, slug and content are required",
        },
        { status: 400 },
      );
    }

    // Sanitize rich text HTML
    const sanitizedContent = sanitizeBlogContent(content);

    // Make sure editor is not effectively empty
    const plainTextContent = getPlainTextFromHtml(sanitizedContent);

    if (!plainTextContent) {
      return NextResponse.json(
        {
          error: "Blog content is required",
        },
        { status: 400 },
      );
    }

    // Validate canonical URL
    if (!isValidUrl(canonicalUrl)) {
      return NextResponse.json(
        {
          error: "Canonical URL must be a valid http or https URL",
        },
        { status: 400 },
      );
    }

    // Validate published date
    let parsedPublishedAt: Date | null = null;

    if (publishedAt) {
      const date = new Date(publishedAt);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid published date" },
          { status: 400 },
        );
      }

      parsedPublishedAt = date;
    }

    const blog = await prisma.blog.update({
      where: {
        id: blogId,
      },

      data: {
        title: title.trim(),

        slug: slug.trim(),

        // Save sanitized HTML
        content: sanitizedContent,

        excerpt:
          typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : null,

        category:
          typeof category === "string" && category.trim()
            ? category.trim()
            : null,

        featuredImage: featuredImage || null,

        publishedAt: parsedPublishedAt,

        metaTitle:
          typeof metaTitle === "string" && metaTitle.trim()
            ? metaTitle.trim()
            : null,

        metaDescription:
          typeof metaDescription === "string" && metaDescription.trim()
            ? metaDescription.trim()
            : null,

        canonicalUrl:
          typeof canonicalUrl === "string" && canonicalUrl.trim()
            ? canonicalUrl.trim()
            : null,

        ogImage: ogImage || null,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Failed to update blog:", error);

    const errorCode = getPrismaErrorCode(error);

    if (errorCode === "P2002") {
      return NextResponse.json(
        {
          error: "A blog with this slug already exists",
        },
        { status: 409 },
      );
    }

    if (errorCode === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const { id } = await params;

  const blogId = getValidId(id);

  if (!blogId) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to delete blog:", error);

    const errorCode = getPrismaErrorCode(error);

    if (errorCode === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
