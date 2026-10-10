import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  /** 交互式卡片带悬浮上移与阴影效果 */
  interactive?: boolean
}

export default function Card({ children, className = '', interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
        interactive ? 'transition hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
