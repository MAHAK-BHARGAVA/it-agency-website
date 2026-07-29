interface Props {
  subtitle: string;
  title: string;
}

export default function SectionHeading({
  subtitle,
  title,
}: Props) {
  return (
    <div className="mb-16">
      <span className="text-sm uppercase tracking-[0.3em] text-orange-400">
        {subtitle}
      </span>

      <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
        {title}
      </h2>
    </div>
  );
} 