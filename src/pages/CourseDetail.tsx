import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../data/courses'
import { useProgress } from '../lib/progress'
import { completedLessonCount, isCourseCompleted } from '../lib/stats'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import ProgressBar from '../components/ProgressBar'
import NotFound from '../components/NotFound'

export default function CourseDetail() {
  const { courseId } = useParams()
  const course = courseId ? getCourse(courseId) : undefined
  const { state } = useProgress()

  if (!course) {
    return <NotFound message="未找到该课程" />
  }

  const done = completedLessonCount(course, state)
  const completed = isCourseCompleted(course, state)
  const quiz = state.quizzes[course.id]
  const pct = course.lessons.length
    ? Math.round((done / course.lessons.length) * 100)
    : 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-slate-500" aria-label="面包屑">
        <Link to="/courses" className="hover:text-blue-700">
          课程
        </Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700">{course.title}</span>
      </nav>

      <header className="mt-5 flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${course.gradient} text-3xl`}
        >
          {course.icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="mt-1 text-slate-600">{course.tagline}</p>
        </div>
      </header>

      <p className="mt-5 leading-relaxed text-slate-700">{course.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge tone={completed ? 'green' : 'slate'}>
          {completed ? '已完成' : '进行中'}
        </Badge>
        {quiz && <Badge tone="violet">测验最佳 {quiz.best} 分</Badge>}
        <span className="text-sm text-slate-500">
          {done} / {course.lessons.length} 节完成
        </span>
      </div>
      <ProgressBar value={pct} className="mt-3" />

      <h2 className="mt-10 text-xl font-bold text-slate-900">课程小节</h2>
      <div className="mt-4 space-y-2">
        {course.lessons.map((l, i) => {
          const lessonDone = state.completedLessons[`${course.id}:${l.id}`]
          return (
            <Link
              key={l.id}
              to={`/course/${course.id}/lesson/${l.id}`}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-slate-50"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  lessonDone
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                    : 'border-slate-300 bg-slate-50 text-slate-500'
                }`}
              >
                {lessonDone ? '✓' : i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-slate-800">{l.title}</p>
                <p className="truncate text-sm text-slate-500">{l.intro}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button to={`/course/${course.id}/quiz`}>开始本章测验</Button>
        {course.lessons.length > 0 && (
          <Button
            variant="secondary"
            to={`/course/${course.id}/lesson/${course.lessons[0].id}`}
          >
            从第一节开始学习
          </Button>
        )}
      </div>

      {course.demo && (
        <Card className="mt-8 p-5">
          <p className="font-medium text-slate-800">✨ 本章含交互演示</p>
          <p className="mt-1 text-sm text-slate-600">
            {course.demo === 'linear-regression'
              ? '在「梯度下降」一节的末尾,你可以拖动滑块直观体验线性回归的拟合过程。'
              : '在「选择 K 值与局限」一节的末尾,你可以逐步运行 K-means 算法观察聚类过程。'}
          </p>
        </Card>
      )}
    </div>
  )
}
