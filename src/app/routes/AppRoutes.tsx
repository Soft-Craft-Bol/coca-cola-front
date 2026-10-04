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
const MyTicketPage = lazy(() => import('@/features/participants/pages/MyTicketPage'))
const TicketPage = lazy(() => import('@/features/participants/pages/TicketPage'))
const CheckinPage = lazy(() => import('@/features/checkin/pages/CheckinPage'))
const ActivitiesPage = lazy(() => import('@/features/activities/pages/ActivitiesPage'))
const CouponsPage = lazy(() => import('@/features/coupons/pages/CouponsPage'))
const SurveysPage = lazy(() => import('@/features/surveys/pages/SurveysPage'))
const PublicSurveysPage = lazy(() => import('@/features/surveys/pages/PublicSurveysPage'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const PowerBiPage = lazy(() => import('@/features/powerbi/pages/PowerBiPage'))
const InsightsPage = lazy(() => import('@/features/insights/pages/InsightsPage'))
const CommunicationsPage = lazy(() => import('@/features/communications/pages/CommunicationsPage'))
const PublicSurveyPage = lazy(() => import('@/features/communications/pages/PublicSurveyPage'))
const CatalogPage = lazy(() => import('@/features/catalog/pages/CatalogPage'))
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}><Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro/:eventId" element={<PublicRegisterPage />} />
      <Route path="/mi-entrada" element={<MyTicketPage />} />
      <Route path="/entrada/:code" element={<TicketPage />} />
      <Route path="/encuesta/:code" element={<PublicSurveyPage />} />
      <Route path="/encuestas" element={<PublicSurveysPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/panel" element={<DashboardPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/:id" element={<EventDetailPage />} />
          <Route path="/participantes" element={<ParticipantsPage />} />
          <Route path="/cupones" element={<CouponsPage />} />

          <Route element={<ProtectedRoute roles={['admin', 'organizer']} />}>
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/actividades" element={<ActivitiesPage />} />
            <Route path="/gestion-encuestas" element={<SurveysPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin', 'marketing']} />}>
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/power-bi" element={<PowerBiPage />} />
            <Route path="/inteligencia" element={<InsightsPage />} />
            <Route path="/comunicaciones" element={<CommunicationsPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/catalogos" element={<CatalogPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense>
  )
}
