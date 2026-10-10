import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../data/courses'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { useProgress } from '../lib/progress'
import NotFound from '../components/NotFound'

export default function Quiz() {
  const { courseId } = useParams()
  const course = courseId ? getCourse(courseId) : undefined
  const { state, recordQuiz } = useProgress()

  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)

  // 切换课程时重置作答状态
  useEffect(() => {
    setAnswers(course ? course.quiz.map(() => null) : [])
    setSubmitted(false)
  }, [courseId, course])

  if (!course) {
    return <NotFound message="未找到该课程的测验" />
  }

  const total = course.quiz.length
  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === total
  const score = answers.filter(
    (a, i) => a === course.quiz[i].answerIndex,
  ).length
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const record = state.quizzes[course.id]
  const best = record?.best ?? 0
  const attempts = record?.attempts ?? 0

  const select = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)))
  }

  const submit = () => {
    if (!allAnswered || submitted) return
    recordQuiz(course.id, score, total)
    setSubmitted(true)
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const retry = () => {
    setAnswers(course.quiz.map(() => null))
    setSubmitted(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-slate-500" aria-label="面包屑">
        <Link to="/courses" className="hover:text-blue-700">
          课程
        </Link>
        <span className="mx-1">/</span>
        <Link to={`/course/${course.id}`} className="hover:text-blue-700">
          {course.title}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700">章节测验</span>
      </nav>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        {course.title} · 章节测验
      </h1>
      <p className="mt-2 text-slate-600">
        共 {total} 道选择题,提交后立即查看答案与解析,成绩会自动保存。
      </p>

      {submitted && (
        <Card className="mt-6 p-6 text-center">
          <p className="text-4xl font-bold text-slate-900">
            {score}
            <span className="text-xl text-slate-400"> / {total}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">得分 {pct} 分</p>
          <div className="mt-3 flex justify-center gap-2">
            <Badge tone="violet">历史最佳 {best} 分</Badge>
            <Badge tone="slate">已作答 {attempts} 次</Badge>
          </div>
        </Card>
      )}

      <div className="mt-6 space-y-5">
        {course.quiz.map((q, qIdx) => {
          const chosen = answers[qIdx]
          const isCorrect = submitted && chosen === q.answerIndex
          return (
            <Card key={q.id} className="p-6">
              <div role="group" aria-label={`第 ${qIdx + 1} 题`}>
                <p className="text-base font-semibold text-slate-900">
                  <span className="mr-1.5 text-slate-400">{qIdx + 1}.</span>
                  {q.question}
                </p>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isAnswer = oIdx === q.answerIndex
                    const isChosen = oIdx === chosen
                    let cls =
                      'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    if (submitted) {
                      if (isAnswer) cls = 'border-emerald-400 bg-emerald-50'
                      else if (isChosen) cls = 'border-rose-400 bg-rose-50'
                      else cls = 'border-slate-200 bg-white opacity-60'
                    }
                    return (
                      <label
                        key={oIdx}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${cls}`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isChosen}
                          onChange={() => select(qIdx, oIdx)}
                          disabled={submitted}
                          className="mt-0.5 h-4 w-4 accent-blue-600"
                        />
                        <span className="text-sm text-slate-700">{opt}</span>
                        {submitted && isAnswer && (
                          <span className="ml-auto shrink-0 text-sm font-medium text-emerald-600">
                            ✓ 正确
                          </span>
                        )}
                        {submitted && isChosen && !isAnswer && (
                          <span className="ml-auto shrink-0 text-sm font-medium text-rose-600">
                            ✗
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
                {submitted && (
                  <p
                    className={`mt-3 rounded-lg p-3 text-sm leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    <span className="font-semibold">
                      {isCorrect ? '回答正确。' : '回答错误。'}
                    </span>
                    {q.explanation}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {!submitted ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button onClick={submit} disabled={!allAnswered}>
            提交答案
          </Button>
          {!allAnswered && (
            <p className="text-sm text-slate-500">
              请完成全部 {total} 道题(已答 {answeredCount} 道)
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={retry}>重新作答</Button>
          <Button variant="secondary" to={`/course/${course.id}`}>
            返回课程
          </Button>
        </div>
      )}
    </div>
  )
}
