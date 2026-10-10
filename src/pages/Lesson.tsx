import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../data/courses'
import type { SectionBlock } from '../types'
import Formula from '../components/Formula'
import LessonNav from '../components/LessonNav'
import Button from '../components/Button'
import LinearRegressionDemo from '../demos/LinearRegressionDemo'
import KMeansDemo from '../demos/KMeansDemo'
import { useProgress } from '../lib/progress'
import NotFound from '../components/NotFound'

function Section({ block }: { block: SectionBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="leading-relaxed text-slate-700">{block.text}</p>
    case 'formula':
      return <Formula text={block.text} note={block.note} />
    case 'example':
      return (
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            示例:{block.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/80">
            {block.text}
          </p>
        </div>
      )
    case 'list':
      if (block.ordered) {
        return (
          <ol className="list-decimal space-y-1.5 pl-5 text-slate-700">
            {block.items.map((it, i) => (
              <li key={i} className="leading-relaxed">
                {it}
              </li>
            ))}
          </ol>
        )
      }
      return (
        <ul className="list-disc space-y-1.5 pl-5 text-slate-700">
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed">
              {it}
            </li>
          ))}
        </ul>
      )
    case 'keypoints':
      return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-800">要点</p>
          <ul className="mt-1.5 space-y-1.5 text-sm text-blue-900/80">
            {block.items.map((it, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true">✓</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'note':
      return (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-relaxed text-violet-900/80">
          <span aria-hidden="true">💡 </span>
          {block.text}
        </div>
      )
    case 'summary':
      return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">知识总结</p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">
            {block.text}
          </p>
        </div>
      )
    default:
      return null
  }
}

export default function Lesson() {
  const { courseId, lessonId } = useParams()
  const course = courseId ? getCourse(courseId) : undefined
  const lesson = course?.lessons.find((l) => l.id === lessonId)
  const { isLessonCompleted, toggleLesson } = useProgress()

  if (!course || !lesson) {
    return <NotFound message="未找到该课程小节" />
  }

  const idx = course.lessons.findIndex((l) => l.id === lesson.id)
  const completed = isLessonCompleted(course.id, lesson.id)
  const isLastLesson = idx === course.lessons.length - 1

  const lessonList = (
    <ul className="space-y-1">
      {course.lessons.map((l) => {
        const done = isLessonCompleted(course.id, l.id)
        const active = l.id === lesson.id
        return (
          <li key={l.id}>
            <Link
              to={`/course/${course.id}/lesson/${l.id}`}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? 'bg-blue-50 font-medium text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                  done
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                    : 'border-slate-300'
                }`}
              >
                {done ? '✓' : ''}
              </span>
              <span className="truncate">{l.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-slate-500" aria-label="面包屑">
        <Link to="/courses" className="hover:text-blue-700">
          课程
        </Link>
        <span className="mx-1">/</span>
        <Link to={`/course/${course.id}`} className="hover:text-blue-700">
          {course.title}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700">{lesson.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              课程目录
            </p>
            {lessonList}
          </div>
        </aside>

        <details className="rounded-2xl border border-slate-200 bg-white lg:hidden">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-700">
            课程目录
          </summary>
          <div className="border-t border-slate-100 p-3">{lessonList}</div>
        </details>

        <article className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            {lesson.intro}
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {lesson.sections.map((block, i) => (
              <Section key={i} block={block} />
            ))}
          </div>

          {isLastLesson && course.demo === 'linear-regression' && (
            <div className="mt-10">
              <LinearRegressionDemo />
            </div>
          )}
          {isLastLesson && course.demo === 'kmeans' && (
            <div className="mt-10">
              <KMeansDemo />
            </div>
          )}

          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Button
              variant={completed ? 'secondary' : 'primary'}
              onClick={() => toggleLesson(course.id, lesson.id)}
            >
              {completed ? '✓ 已完成' : '标记本节为已完成'}
            </Button>
            <p className="text-sm text-slate-500">
              {completed
                ? '点击可取消完成标记'
                : '完成后会计入你的学习进度'}
            </p>
          </div>

          <LessonNav course={course} lessonId={lesson.id} />
        </article>
      </div>
    </div>
  )
}
