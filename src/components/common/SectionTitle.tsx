type Props = {
  subTitle: string;
  title: string;
  center?: boolean;
};

export default function SectionTitle({
  subTitle,
  title,
  center = false,
}: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="inline-block text-sm font-bold uppercase tracking-[4px] text-lime-500">
        {subTitle}
      </span>

      <h2 className="mt-5 text-[44px] font-black uppercase leading-[1.05] text-black lg:text-[64px]">
        {title}
      </h2>
    </div>
  );
}