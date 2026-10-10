import Button from './Button'

export default function NotFound({ message = '页面不存在' }: { message?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-5xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{message}</h1>
      <p className="mt-2 text-slate-600">你访问的内容不存在或已被移除。</p>
      <div className="mt-6">
        <Button to="/courses">返回课程列表</Button>
      </div>
    </div>
  )
}
