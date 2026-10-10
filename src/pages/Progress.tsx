import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../data/courses'
import { useProgress } from '../lib/progress'
import {
  completedCourseCount,
  completedLessonCount,
  isCourseCompleted,
  overallPercent,
  totalCompletedLessons,
  totalLessons,
} from '../lib/stats'
import Card from '../components/Card'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import Badge from '../components/Badge'
import Button from '../components/Button'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  )
}

export default function Progress() {
  const { state, resetProgress } = useProgress()
  const [confirming, setConfirming] = useState(false)

  const doneCourses = completedCourseCount(courses, state)
  const doneLessons = totalCompletedLessons(courses, state)
  const overall = overallPercent(courses, state)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">学习进度</h1>
      <p className="mt-2 text-slate-600">
        你的学习记录保存在当前浏览器中,可随时回来继续。
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr]">
        <Card className="flex flex-col items-center justify-center p-8">
          <ProgressRing value={overall} size={140} strokeWidth={12} />
          <p className="mt-3 text-sm text-slate-500">总进度 {overall}%</p>
        </Card>
        <Card className="flex items-center p-6 sm:p-8">
          <div className="grid w-full grid-cols-3 gap-4 text-center">
            <Stat value={doneCourses} label="已完成课程" />
            <Stat value={`${doneLessons}/${totalLessons(courses)}`} label="已完成小节" />
            <Stat value={`${overall}%`} label="总进度" />
          </div>
        </Card>
      </div>

      <h2 className="mt-12 text-xl font-bold text-slate-900">各课程明细</h2>
      <div className="mt-4 space-y-4">
        {courses.map((c) => {
          const done = completedLessonCount(c, state)
          const completed = isCourseCompleted(c, state)
          const quiz = state.quizzes[c.id]
          const pct = c.lessons.length
            ? Math.round((done / c.lessons.length) * 100)
            : 0
          return (
            <Card key={c.id} className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-xl`}
                  >
                    {c.icon}
                  </span>
                  <div>
                    <Link
                      to={`/course/${c.id}`}
                      className="font-semibold text-slate-800 hover:text-blue-700"
                    >
                      {c.title}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {done} / {c.lessons.length} 节 ·{' '}
                      {completed ? '已完成' : '进行中'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {quiz ? (
                    <div className="text-right text-sm">
                      <p className="font-medium text-slate-700">
                        测验最佳 {quiz.best} 分
                      </p>
                      <p className="text-xs text-slate-400">
                        最近 {quiz.last} 分 · {quiz.attempts} 次
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">尚未测验</span>
                  )}
                  <Badge tone={completed ? 'green' : 'slate'}>
                    {completed ? '已完成' : '进行中'}
                  </Badge>
                </div>
              </div>
              <ProgressBar value={pct} className="mt-4" />
            </Card>
          )
        })}
      </div>

      <Card className="mt-12 border-rose-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">重置学习进度</h2>
        <p className="mt-1 text-sm text-slate-600">
          这会清除所有已完成的课程标记与测验成绩,且无法恢复。
        </p>
        <div className="mt-4">
          {confirming ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  resetProgress()
                  setConfirming(false)
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                确认重置
              </button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                取消
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              重置学习进度
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}
