import type { ProgressState } from '../types'

const STORAGE_KEY = 'ml-learning:progress'
const CURRENT_VERSION = 1

export function createEmptyProgress(): ProgressState {
  return {
    version: CURRENT_VERSION,
    completedLessons: {},
    quizzes: {},
  }
}

/** 从 localStorage 读取进度;数据损坏或版本不符时安全回退到空状态。 */
export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyProgress()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    if (parsed.version !== CURRENT_VERSION) return createEmptyProgress()
    return {
      version: CURRENT_VERSION,
      completedLessons: parsed.completedLessons ?? {},
      quizzes: parsed.quizzes ?? {},
    }
  } catch {
    return createEmptyProgress()
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 存储不可用(隐私模式等)时静默失败,不影响页面使用。
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function lessonKey(courseId: string, lessonId: string): string {
  return `${courseId}:${lessonId}`
}
