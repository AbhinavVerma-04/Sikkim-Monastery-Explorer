export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-stone-900/60 border border-amber-900/30">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="aspect-[3/1] skeleton rounded-2xl" />
      <div className="h-8 w-2/3 skeleton rounded" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  )
}
