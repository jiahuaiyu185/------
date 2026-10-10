import type { Course, ProgressState } from '../types'

export function completedLessonCount(
  course: Course,
  state: ProgressState,
): number {
  return course.lessons.filter(
    (l) => state.completedLessons[`${course.id}:${l.id}`],
  ).length
}

export function isCourseCompleted(
  course: Course,
  state: ProgressState,
): boolean {
  return (
    course.lessons.length > 0 &&
    course.lessons.every((l) => state.completedLessons[`${course.id}:${l.id}`])
  )
}

export function totalLessons(courses: Course[]): number {
  return courses.reduce((n, c) => n + c.lessons.length, 0)
}

export function totalCompletedLessons(
  courses: Course[],
  state: ProgressState,
): number {
  return courses.reduce((n, c) => n + completedLessonCount(c, state), 0)
}

export function completedCourseCount(
  courses: Course[],
  state: ProgressState,
): number {
  return courses.filter((c) => isCourseCompleted(c, state)).length
}

export function overallPercent(
  courses: Course[],
  state: ProgressState,
): number {
  const total = totalLessons(courses)
  if (total === 0) return 0
  return Math.round((totalCompletedLessons(courses, state) / total) * 100)
}
