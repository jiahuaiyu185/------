// 课程内容块的联合类型:内容与展示方式解耦,便于渲染层复用。
export type SectionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'formula'; text: string; note?: string }
  | { type: 'example'; title: string; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'keypoints'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'summary'; text: string }
  | { type: 'objectives'; items: string[] }
  | { type: 'code'; caption?: string; text: string }
  | { type: 'output'; text: string }
  | { type: 'commonMistakes'; items: string[] }

export interface Lesson {
  id: string
  title: string
  intro: string
  sections: SectionBlock[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export type DemoKind = 'linear-regression' | 'kmeans'

export interface Course {
  id: string
  title: string
  icon: string
  tagline: string
  description: string
  /** Tailwind 渐变类,用于课程卡片与图标底色 */
  gradient: string
  demo?: DemoKind
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

export interface QuizRecord {
  best: number
  last: number
  attempts: number
}

export interface ProgressState {
  version: number
  /** key 为 `${courseId}:${lessonId}` */
  completedLessons: Record<string, boolean>
  /** key 为 courseId */
  quizzes: Record<string, QuizRecord>
}
