export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg shimmer" />
        <div className="w-20 h-5 rounded-full shimmer" />
      </div>
      <div className="h-4 shimmer rounded-lg w-3/4 mb-2.5" />
      <div className="h-3 shimmer rounded-lg w-full mb-2" />
      <div className="h-3 shimmer rounded-lg w-5/6 mb-5" />
      <div className="h-8 shimmer rounded-xl w-full" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <div className="h-10 shimmer rounded-lg mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50">
          <div className="h-4 shimmer rounded w-24 flex-shrink-0" />
          <div className="h-4 shimmer rounded w-32 flex-shrink-0" />
          <div className="h-4 shimmer rounded flex-1" />
          <div className="h-5 shimmer rounded-full w-16 flex-shrink-0" />
          <div className="h-4 shimmer rounded w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="h-7 shimmer rounded-lg w-48 mb-2" />
        <div className="h-4 shimmer rounded-lg w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl shimmer" />
              <div className="w-12 h-5 rounded-full shimmer" />
            </div>
            <div className="h-8 shimmer rounded-lg w-20 mb-1" />
            <div className="h-3 shimmer rounded w-28" />
          </div>
        ))}
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-5 shimmer rounded w-40" />
        </div>
        <div className="p-4">
          <TableSkeleton rows={5} />
        </div>
      </div>
    </div>
  )
}
