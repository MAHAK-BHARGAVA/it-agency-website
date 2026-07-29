import Image from "next/image";

const brands = [
  "brand-1.png",
  "brand-2.png",
  "brand-3.png",
  "brand-4.png",
  "brand-5.png",
];

export default function BrandStrip() {
  return (
    <section className="border-y bg-[#111] py-14">

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-10 px-6">

        {brands.map((brand) => (
          <Image
            key={brand}
            src={`/assets/images/brand/${brand}`}
            alt=""
            width={140}
            height={40}
            className="opacity-60 transition hover:opacity-100"
          />
        ))}

      </div>

    </section>
  );
}