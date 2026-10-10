import { Link } from 'react-router-dom'
import type { Course } from '../types'
import { useProgress } from '../lib/progress'
import { completedLessonCount, isCourseCompleted } from '../lib/stats'
import ProgressBar from './ProgressBar'
import Badge from './Badge'

export default function CourseCard({ course }: { course: Course }) {
  const { state } = useProgress()
  const done = completedLessonCount(course, state)
  const total = course.lessons.length
  const completed = isCourseCompleted(course, state)
  const quiz = state.quizzes[course.id]
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.gradient} text-2xl`}
        >
          {course.icon}
        </span>
        {completed ? (
          <Badge tone="green">已完成</Badge>
        ) : quiz ? (
          <Badge tone="violet">测验 {quiz.best} 分</Badge>
        ) : null}
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
        {course.title}
      </h2>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
        {course.description}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {done} / {total} 节
          </span>
          <span>{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-1.5" />
      </div>

      {quiz && (
        <p className="mt-2 text-xs text-slate-400">
          最近测验 {quiz.last} 分 · 共 {quiz.attempts} 次
        </p>
      )}
    </Link>
  )
}
