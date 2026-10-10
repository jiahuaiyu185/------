import { Link } from 'react-router-dom'
import { courses } from '../data/courses'
import { useProgress } from '../lib/progress'
import {
  completedCourseCount,
  overallPercent,
  totalCompletedLessons,
  totalLessons,
} from '../lib/stats'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressRing from '../components/ProgressRing'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const { state } = useProgress()
  const overall = overallPercent(courses, state)
  const doneCourses = completedCourseCount(courses, state)
  const doneLessons = totalCompletedLessons(courses, state)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium">
            零基础 · 中文 · 交互式
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            机器学习
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-100">
            从基础概念到神经网络,循序渐进地理解机器学习。配有直观的交互演示与练习测验,让抽象的公式变得看得见、摸得着。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              开始学习
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-base font-medium text-white transition hover:bg-white/10"
            >
              查看进度
            </Link>
          </div>
        </div>
      </section>

      {/* 学习路线图 */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">学习路线图</h2>
        <p className="mt-2 text-slate-600">
          共 {courses.length} 门课程,建议按顺序学习,由浅入深。
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* 课程进度概览 */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <ProgressRing value={overall} size={120} />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900">我的学习进度</h2>
                <p className="mt-1 text-sm text-slate-600">
                  已完成 {doneCourses} / {courses.length} 门课程,共完成{' '}
                  {doneLessons} / {totalLessons(courses)} 个小节。
                </p>
              </div>
            </div>
            <Button to="/progress" variant="secondary">
              查看详情
            </Button>
          </div>
        </Card>
      </section>
    </>
  )
}
