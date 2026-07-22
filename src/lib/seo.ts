// buildMetadata() is a reusable helper function that creates consistent SEO metadata for every page. Instead of repeating the same metadata structure across multiple pages, you call this function with the page-specific values (title, description, path, and optionally image), and it returns the correctly formatted Metadata object that Next.js uses to generate the appropriate <head> tags automatically.

// Metadata = tells search engines how to display your page.

import { Metadata } from 'next'

const SITE_NAME = 'ABC Technologies'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description?: string
  path: string
  image?: string
}): Metadata {
  const url = `${SITE_URL}${path}`
  const desc = description || `${SITE_NAME} - digital services.`

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: image ? [image] : undefined,
    },
  }
}