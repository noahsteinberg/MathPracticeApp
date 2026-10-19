import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ActiveSessionProvider } from './contexts/ActiveSessionContext'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticeSetupPage } from './pages/PracticeSetupPage'
import { PracticePage } from './pages/PracticePage'
import { SessionSummaryPage } from './pages/SessionSummaryPage'

const StatisticsPage = lazy(() =>
  import('./pages/StatisticsPage').then(({ StatisticsPage }) => ({
    default: StatisticsPage,
  })),
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then(({ SettingsPage }) => ({
    default: SettingsPage,
  })),
)

function App() {
  return (
    <BrowserRouter>
      <ActiveSessionProvider>
        <Suspense fallback={<p role="status">Loading page…</p>}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="setup" element={<PracticeSetupPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="summary" element={<SessionSummaryPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ActiveSessionProvider>
    </BrowserRouter>
  )
}

export default App
