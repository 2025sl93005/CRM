export function StatusBadge({ status }) {
  const cls = `badge-${status?.toLowerCase()}`
  return <span className={cls}>{status?.replace('_', ' ')}</span>
}

export function PriorityBadge({ priority }) {
  const cls = `priority-${priority?.toLowerCase()}`
  return <span className={cls}>{priority}</span>
}
