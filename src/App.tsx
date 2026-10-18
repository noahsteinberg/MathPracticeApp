import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PracticeSetupPage } from './pages/PracticeSetupPage'
import { PracticeUnavailablePage } from './pages/PracticeUnavailablePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="setup" element={<PracticeSetupPage />} />
          <Route path="practice" element={<PracticeUnavailablePage />} />
          <Route
            path="statistics"
            element={
              <PlaceholderPage
                title="Statistics"
                message="Your practice statistics will be available in a later phase."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                message="Settings will be available in a later phase."
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
