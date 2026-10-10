import { HashRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from './lib/progress'
import Layout from './components/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Lesson from './pages/Lesson'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'
import NotFound from './components/NotFound'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={<Lesson />}
            />
            <Route path="/course/:courseId/quiz" element={<Quiz />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
