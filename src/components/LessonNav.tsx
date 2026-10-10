import { Link } from 'react-router-dom'
import type { Course } from '../types'

const linkBase =
  'inline-flex max-w-[48%] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50'

export default function LessonNav({
  course,
  lessonId,
}: {
  course: Course
  lessonId: string
}) {
  const idx = course.lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0) return null

  const prev = course.lessons[idx - 1]
  const next = course.lessons[idx + 1]

  return (
    <nav
      className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-6"
      aria-label="课程小节导航"
    >
      {prev ? (
        <Link to={`/course/${course.id}/lesson/${prev.id}`} className={linkBase}>
          <span aria-hidden="true">←</span>
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link to={`/course/${course.id}/lesson/${next.id}`} className={linkBase}>
          <span className="truncate">{next.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <Link to={`/course/${course.id}/quiz`} className={linkBase}>
          <span className="truncate">去做本章测验</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </nav>
  )
}
