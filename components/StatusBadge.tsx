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
  const cls = map[status?.toLowerCase()] || 'badge-pending'
  return <span className={cls}>{labels[status?.toLowerCase()] || status}</span>
}
