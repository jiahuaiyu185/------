interface ProgressBarProps {
  /** 0 ~ 100 */
  value: number
  className?: string
  tone?: 'blue-violet' | 'green'
}

export default function ProgressBar({
  value,
  className = '',
  tone = 'blue-violet',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const barTone =
    tone === 'green'
      ? 'bg-emerald-500'
      : 'bg-gradient-to-r from-blue-600 to-violet-600'

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barTone}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
