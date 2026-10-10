import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { ProgressState } from '../types'
import {
  clearProgress,
  createEmptyProgress,
  lessonKey,
  loadProgress,
  saveProgress,
} from './storage'

interface ProgressContextValue {
  state: ProgressState
  isLessonCompleted: (courseId: string, lessonId: string) => boolean
  markLessonCompleted: (courseId: string, lessonId: string) => void
  toggleLesson: (courseId: string, lessonId: string) => void
  recordQuiz: (courseId: string, score: number, total: number) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress())

  // 状态变化时持久化到 localStorage
  useEffect(() => {
    saveProgress(state)
  }, [state])

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string) =>
      state.completedLessons[lessonKey(courseId, lessonId)] === true,
    [state.completedLessons],
  )

  const markLessonCompleted = useCallback(
    (courseId: string, lessonId: string) => {
      const key = lessonKey(courseId, lessonId)
      setState((prev) => {
        if (prev.completedLessons[key]) return prev
        return {
          ...prev,
          completedLessons: { ...prev.completedLessons, [key]: true },
        }
      })
    },
    [],
  )

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    const key = lessonKey(courseId, lessonId)
    setState((prev) => {
      const completed = { ...prev.completedLessons }
      if (completed[key]) delete completed[key]
      else completed[key] = true
      return { ...prev, completedLessons: completed }
    })
  }, [])

  const recordQuiz = useCallback(
    (courseId: string, score: number, total: number) => {
      const pct = total > 0 ? Math.round((score / total) * 100) : 0
      setState((prev) => {
        const prevRecord = prev.quizzes[courseId]
        return {
          ...prev,
          quizzes: {
            ...prev.quizzes,
            [courseId]: {
              best: Math.max(prevRecord?.best ?? 0, pct),
              last: pct,
              attempts: (prevRecord?.attempts ?? 0) + 1,
            },
          },
        }
      })
    },
    [],
  )

  const resetProgress = useCallback(() => {
    clearProgress()
    setState(createEmptyProgress())
  }, [])

  return (
    <ProgressContext.Provider
      value={{
        state,
        isLessonCompleted,
        markLessonCompleted,
        toggleLesson,
        recordQuiz,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress 必须在 <ProgressProvider> 内部使用')
  }
  return ctx
}
