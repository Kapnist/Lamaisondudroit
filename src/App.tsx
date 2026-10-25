import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { ProfessionalsPage } from './pages/ProfessionalsPage'
import { ProfessionalSignupPage } from './pages/ProfessionalSignupPage'
import { ProfessionalDashboardPage } from './pages/ProfessionalDashboardPage'
import { ProfessionalProfilePage } from './pages/ProfessionalProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

const DraftProfessionalPage = import.meta.env.DEV
  ? lazy(() =>
      import('./pages/DraftProfessionalPage').then(({ DraftProfessionalPage: page }) => ({
        default: page,
      })),
    )
  : null

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="professionnels" element={<ProfessionalsPage />} />
        <Route path="professionnels/inscription" element={<ProfessionalSignupPage />} />
        <Route path="professionnel/tableau-de-bord" element={<ProfessionalDashboardPage />} />
        <Route path="professionnels/:id" element={<ProfessionalProfilePage />} />
        {DraftProfessionalPage && (
          <Route
            path="__dev/professionnels/maitre-noupa-rudi"
            element={
              <Suspense fallback={null}>
                <DraftProfessionalPage />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
