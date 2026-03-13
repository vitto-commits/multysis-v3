export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-2/3"></div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-100 rounded mb-3"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-50 rounded mb-2 border border-gray-100"></div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1,2,3].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
