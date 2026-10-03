import { lazy, Suspense } from 'react'
import { Loading } from '@/shared/components/ui'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const EventsPage = lazy(() => import('@/features/events/pages/EventsPage'))
const EventDetailPage = lazy(() => import('@/features/events/pages/EventDetailPage'))
const ParticipantsPage = lazy(() => import('@/features/participants/pages/ParticipantsPage'))
const PublicRegisterPage = lazy(() => import('@/features/participants/pages/PublicRegisterPage'))
const CheckinPage = lazy(() => import('@/features/checkin/pages/CheckinPage'))
const ActivitiesPage = lazy(() => import('@/features/activities/pages/ActivitiesPage'))
const SurveysPage = lazy(() => import('@/features/surveys/pages/SurveysPage'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const PowerBiPage = lazy(() => import('@/features/powerbi/pages/PowerBiPage'))
const InsightsPage = lazy(() => import('@/features/insights/pages/InsightsPage'))
const CommunicationsPage = lazy(() => import('@/features/communications/pages/CommunicationsPage'))
const PublicSurveyPage = lazy(() => import('@/features/communications/pages/PublicSurveyPage'))
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}><Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro/:eventId" element={<PublicRegisterPage />} />
      <Route path="/encuesta/:code" element={<PublicSurveyPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/panel" element={<DashboardPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/:id" element={<EventDetailPage />} />
          <Route path="/participantes" element={<ParticipantsPage />} />

          <Route element={<ProtectedRoute roles={['admin', 'organizer']} />}>
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/actividades" element={<ActivitiesPage />} />
            <Route path="/encuestas" element={<SurveysPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin', 'marketing']} />}>
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/power-bi" element={<PowerBiPage />} />
            <Route path="/inteligencia" element={<InsightsPage />} />
            <Route path="/comunicaciones" element={<CommunicationsPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/usuarios" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense>
  )
}
