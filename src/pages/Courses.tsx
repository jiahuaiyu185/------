import { courses } from '../data/courses'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">全部课程</h1>
      <p className="mt-2 text-slate-600">
        共 {courses.length} 门课程,建议按顺序学习,由浅入深。
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  )
}
