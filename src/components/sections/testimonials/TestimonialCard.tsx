// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Quote, Star } from "lucide-react";

// import type { TestimonialItem } from "./testimonial.types";

// type Props = {
//   testimonial: TestimonialItem;
// };

// export default function TestimonialCard({ testimonial }: Props) {
//   const [imageFailed, setImageFailed] = useState(false);

//   const photo = testimonial.photo?.trim() ?? "";
//   const hasPhoto = photo.length > 0 && !imageFailed;

//   const rating = Math.min(
//     5,
//     Math.max(0, testimonial.rating ?? 5),
//   );

//   const initials = testimonial.clientName
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => word[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <article className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-7 sm:p-9 lg:p-12">
//       <Quote className="pointer-events-none absolute right-8 top-7 h-24 w-24 text-black/[0.04] sm:h-32 sm:w-32" />

//       <div className="relative z-10">
//         <div
//           className="flex items-center gap-1"
//           aria-label={`${rating} out of 5 stars`}
//         >
//           {Array.from({ length: 5 }).map((_, index) => (
//             <Star
//               key={index}
//               className={`h-5 w-5 ${
//                 index < rating
//                   ? "fill-lime-400 text-lime-400"
//                   : "text-black/15"
//               }`}
//             />
//           ))}
//         </div>

//         <blockquote className="mt-8 max-w-4xl text-2xl font-semibold leading-[1.45] text-black sm:text-3xl lg:text-4xl">
//           “{testimonial.quote}”
//         </blockquote>

//         <div className="mt-10 flex items-center gap-4 border-t border-black/10 pt-7">
//           <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime-400 text-sm font-black text-black">
//             {hasPhoto ? (
//               <Image
//                 src={photo}
//                 alt={testimonial.clientName}
//                 fill
//                 sizes="56px"
//                 onError={() => setImageFailed(true)}
//                 className="object-cover"
//               />
//             ) : (
//               <span>{initials || "CL"}</span>
//             )}
//           </div>

//           <div>
//             <p className="font-bold text-black">
//               {testimonial.clientName}
//             </p>

//             {testimonial.company && (
//               <p className="mt-1 text-sm text-gray-600">
//                 {testimonial.company}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

import type { TestimonialItem } from "./testimonial.types";

type Props = {
  testimonial: TestimonialItem;
};

export default function TestimonialCard({ testimonial }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const photo = testimonial.photo?.trim() ?? "";
  const hasPhoto = photo.length > 0 && !imageFailed;

  const rating = Math.min(
    5,
    Math.max(0, testimonial.rating ?? 5),
  );

  const initials = testimonial.clientName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="relative overflow-hidden rounded-[36px] border border-black/[0.08] bg-white px-7 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12 lg:px-16 lg:py-16">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 h-24 w-24 text-black/[0.035] sm:h-32 sm:w-32"
      />

      <div className="relative z-10">
        <div
          className="flex justify-center gap-1"
          aria-label={`${rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < rating
                  ? "fill-lime-400 text-lime-400"
                  : "text-black/15"
              }`}
            />
          ))}
        </div>

        <blockquote className="mx-auto mt-8 max-w-4xl text-2xl font-semibold leading-[1.4] text-black sm:text-3xl lg:text-[42px]">
          “{testimonial.quote}”
        </blockquote>

        <div className="mx-auto mt-10 h-px max-w-3xl bg-black/10" />

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-lime-400 text-lg font-black text-black ring-8 ring-lime-400/[0.12]">
            {hasPhoto ? (
              <Image
                src={photo}
                alt={testimonial.clientName}
                fill
                sizes="80px"
                onError={() => setImageFailed(true)}
                className="object-cover"
              />
            ) : (
              <span>{initials || "CL"}</span>
            )}
          </div>

          <div>
            <p className="text-xl font-black text-black">
              {testimonial.clientName}
            </p>

            {testimonial.company && (
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-black/45">
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}