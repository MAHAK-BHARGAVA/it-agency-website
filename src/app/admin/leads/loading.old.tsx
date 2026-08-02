export default function LeadsLoading() {
  return (
    <main className="px-5 py-7 sm:px-8">
      <div className="animate-pulse">
        <div className="h-8 w-40 rounded bg-black/10" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-black/10" />

        <div className="mt-7 overflow-hidden rounded-2xl border border-[#e4e2f0] bg-white">
          <div className="flex gap-3 border-b border-[#f0eef7] p-5">
            <div className="h-11 flex-1 rounded-xl bg-black/10" />
            <div className="h-11 w-44 rounded-xl bg-black/10" />
            <div className="h-11 w-32 rounded-xl bg-black/10" />
          </div>

          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center gap-4"
              >
                <div className="col-span-2 h-10 rounded bg-black/10" />
                <div className="h-8 rounded bg-black/10" />
                <div className="h-8 rounded bg-black/10" />
                <div className="h-8 rounded bg-black/10" />
                <div className="h-8 rounded bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}