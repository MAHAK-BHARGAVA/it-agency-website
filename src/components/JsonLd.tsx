// JSON-LD stands for JavaScript Object Notation for Linked Data.
// It is a special JSON object that you put inside a <script> tag.
// Google reads it, but users never see it.

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}