export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    processing: 'badge-processing',
    for_pickup: 'badge-ready',
    ready: 'badge-ready',
    completed: 'badge-completed',
    rejected: 'badge-rejected',
    cancelled: 'badge-rejected',
    paid: 'badge-ready',
    unpaid: 'badge-pending',
  }
  const labels: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    for_pickup: 'For Pickup',
    ready: 'Ready',
    completed: 'Completed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
  }
  const dotColors: Record<string, string> = {
    'badge-pending': 'bg-amber-500',
    'badge-processing': 'bg-blue-500',
    'badge-ready': 'bg-emerald-500',
    'badge-completed': 'bg-gray-400',
    'badge-rejected': 'bg-red-500',
  }
  const cls = map[status?.toLowerCase()] || 'badge-pending'
  const dotColor = dotColors[cls] || 'bg-gray-400'
  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} inline-block flex-shrink-0`} aria-hidden="true" />
      {labels[status?.toLowerCase()] || status}
    </span>
  )
}
