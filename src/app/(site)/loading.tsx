export default function SiteLoading() {
  return (
    <div className="container-page py-14 sm:py-20" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="h-3 w-24 animate-pulse rounded-full bg-linen" />
      <div className="mt-5 h-12 w-full max-w-xl animate-pulse rounded-xl bg-linen/80" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded-full bg-linen/70" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-sand/60 bg-porcelain/60"
          />
        ))}
      </div>
    </div>
  );
}
