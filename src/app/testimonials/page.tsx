import { prisma } from "@/lib/prisma";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Client Testimonials</h1>

      {testimonials.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <ul>
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              style={{
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <h2>{testimonial.clientName}</h2>

              {testimonial.company && (
                <p>
                  <strong>Company:</strong> {testimonial.company}
                </p>
              )}

              <p>{testimonial.quote}</p>

              {testimonial.rating !== null && (
                <p>
                  <strong>Rating:</strong> {testimonial.rating}/5
                </p>
              )}

              {testimonial.photo && (
                <img
                  src={testimonial.photo}
                  alt={testimonial.clientName}
                  width={120}
                  height={120}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}