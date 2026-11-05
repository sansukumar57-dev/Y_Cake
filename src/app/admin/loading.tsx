export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[1240px]" aria-busy="true">
      <span className="sr-only">Loading atelier desk</span>
      <div className="h-3 w-28 animate-pulse rounded-full bg-linen" />
      <div className="mt-4 h-11 w-full max-w-md animate-pulse rounded-xl bg-linen/80" />
      <div className="mt-3 h-4 w-full max-w-sm animate-pulse rounded-full bg-linen/70" />
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-sand/60 bg-cream"
          />
        ))}
      </div>
      <div className="mt-6 h-80 animate-pulse rounded-xl border border-sand/60 bg-cream" />
    </div>
  );
}
