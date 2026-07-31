import { prisma } from "@/lib/prisma";

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Frequently Asked Questions</h1>

      {faqs.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        <div>
          {faqs.map((faq) => (
            <section
              key={faq.id}
              style={{
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <h2>{faq.question}</h2>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}