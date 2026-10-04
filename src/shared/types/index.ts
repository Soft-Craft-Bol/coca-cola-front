// Tipos compartidos. Reflejan los DTOs del backend (Spring Boot).

export type Role = 'admin' | 'organizer' | 'marketing'
export type EventStatus = 'planned' | 'active' | 'finished'
export type ActivityType = 'tasting' | 'experience' | 'contest' | 'promo' | 'photocall' | 'survey' | 'redeem' | 'content'
export type InteractionType = 'activity' | 'tasting' | 'redeem' | 'conversion'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
}

export interface UserInput {
  name: string
  email: string
  role: Role
  active: boolean
  password?: string
}

export interface Product {
  id: string
  name: string
  category: string
  flavor: string | null
  presentation: string | null
  archived: boolean
}

export interface Experience {
  id: string
  name: string
  category: string
  description: string
  archived: boolean
}

export interface CcEvent {
  id: string
  name: string
  type: string
  date: string
  location: string
  organizer: string
  manager: string
  description: string
  objective: string
  campaign: string
  budget: number
  expected: number
  channel: string
  productIds: string[]
  experienceIds: string[]
  status: EventStatus
  imageUrl?: string | null
}

export type EventInput = Omit<CcEvent, 'id' | 'imageUrl'>

export interface Activity {
  id: string
  eventId: string
  name: string
  type: ActivityType
  experienceId?: string | null
}

export interface ActivityInput {
  eventId: string
  name: string
  type: ActivityType
  experienceId?: string | null
}

export interface Participant {
  id: string
  eventId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  city: string
  ageRange: string
  isReturning: boolean
  preferences: string[]
  consent: boolean
  source: string
  campaign: string
  qrCode: string
  registeredAt: string
  checkedInAt: string | null
  checkedOutAt: string | null
}

export interface ParticipantInput {
  eventId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  city: string
  ageRange: string
  preferences: string[]
  consent: boolean
  source: string
}

export interface Interaction {
  id: string
  eventId: string
  participantId: string
  activityId: string | null
  type: InteractionType
  productId?: string | null
  rating?: number | null
  wouldBuy?: boolean | null
  wantsPromos?: boolean | null
  at: string
}

export type InteractionInput = Omit<Interaction, 'id' | 'at'>

export interface Survey {
  id: string
  eventId: string
  participantId: string
  organization: number
  service: number
  experiences: number
  products: number
  overall: number
  nps: number
  createdAt: string
}

export type SurveyInput = Omit<Survey, 'id' | 'createdAt'>

// ---- Público (sin sesión) ----
export interface PublicEvent {
  id: string
  name: string
  type: string
  date: string
  location: string
  description: string | null
  campaign: string | null
  imageUrl: string | null
  status: 'planned' | 'active'
}

export interface PublicTicket {
  participantName: string
  eventId: string
  eventName: string
  eventDate: string
  location: string
  eventStatus: string
  qrCode: string
  attended: boolean
  registrationType: 'Pre-inscripción' | 'Inscripción'
}

// ---- Inteligencia ----
export interface SegmentMember {
  participantId: string
  name: string
  city: string
  consent: boolean
  affinity: number
}

export interface Segment {
  key: string
  name: string
  description: string
  action: string
  count: number
  pct: number
  members: SegmentMember[]
}

export interface AffinityScore {
  participantId: string
  name: string
  city: string
  consent: boolean
  score: number
  level: 'Alta' | 'Media' | 'Baja'
  factors: string[]
}

export interface AffinityReport {
  distribution: { name: string; value: number }[]
  averageScore: number
  top: AffinityScore[]
}

export interface SourceForecast {
  source: string
  registered: number
  rate: number
  expected: number
}

export interface AttendanceForecast {
  eventId: string
  eventName: string
  status: string
  registered: number
  attendedSoFar: number
  expectedAttendees: number | null
  low: number | null
  high: number | null
  historicalRate: number | null
  projectedConversions: number | null
  targetExpected: number | null
  bySource: SourceForecast[]
  note: string
}

export interface Recommendation {
  priority: 'alta' | 'media' | 'baja'
  category: string
  title: string
  detail: string
}

export interface InsightSummary {
  eventId: string | null
  title: string
  text: string
  recommendations: Recommendation[]
  ai: string | null
  aiSource: 'local' | 'claude' | 'ia'
}

// ---- Notificaciones y comunicaciones ----
export interface AppNotification {
  id: string
  type: string
  severity: 'info' | 'success' | 'warning'
  title: string
  message: string
  eventId: string | null
  createdAt: string
  read: boolean
}

export type MessageType = 'CONFIRMATION' | 'REMINDER' | 'THANKS' | 'INVITATION'
export type Channel = 'EMAIL' | 'WHATSAPP'

export interface SendCommunication {
  eventId: string
  type: MessageType
  channel: Channel
  audience: 'ALL' | 'ATTENDED' | 'NOT_ATTENDED'
  targetEventId?: string
}

export interface SendResult {
  total: number
  sent: number
  skipped: number
  errors: number
  note: string | null
}

export interface MessageLog {
  id: string
  eventId: string
  participantId: string
  channel: Channel
  type: string
  status: 'SENT' | 'ERROR'
  detail: string | null
  sentAt: string
}

export interface IntegrationStatus {
  email: boolean
  whatsapp: boolean
  crm: boolean
  ai: boolean
}

export interface PublicSurveyInfo {
  participantName: string
  eventName: string
  attended: boolean
  answered: boolean
}

// ---- Métricas ----
export interface NamedValue {
  name: string
  value: number
}

export interface ProductInterest {
  productId: string
  name: string
  value: number
  pct: number
}

export interface ExperienceInterest { experienceId: string; name: string; value: number; pct: number }

export interface CriterionScore {
  key: string
  value: number
}

export interface EventMetrics {
  experienceInterest: ExperienceInterest[]
  interestByCategory: NamedValue[]
  interestByFlavor: NamedValue[]
  interestByPresentation: NamedValue[]
  event: CcEvent
  registered: number
  attended: number
  attendanceRate: number
  newCount: number
  returningCount: number
  recurrenceIndex: number
  productInteractions: number
  samples: number
  participationRate: number
  consents: number
  consentRate: number
  conversions: number
  conversionRate: number
  redemptions: number
  interactionRate: number
  avgStayMinutes: number
  satisfaction: number
  satisfactionByCriterion: CriterionScore[]
  nps: number
  surveyCount: number
  productInterest: ProductInterest[]
  activityPerformance: NamedValue[]
  hourly: NamedValue[]
  funnel: NamedValue[]
  byCity: NamedValue[]
  byAge: NamedValue[]
  bySource: NamedValue[]
  byCampaign: NamedValue[]
}

export interface EventSummary {
  id: string
  name: string
  type: string
  campaign: string
  date: string
  registered: number
  attended: number
  attendanceRate: number
  interactions: number
  conversions: number
  redemptions: number
  satisfaction: number
  nps: number
  participationRate: number
  conversionRate: number
}

export interface EvolutionPoint {
  name: string
  date: string
  Asistentes: number
  Recurrentes: number
}

export interface OverviewMetrics {
  experienceInterest: ExperienceInterest[]
  interestByCategory: NamedValue[]
  interestByFlavor: NamedValue[]
  interestByPresentation: NamedValue[]
  events: number
  registered: number
  attended: number
  attendanceRate: number
  productInteractions: number
  samples: number
  conversions: number
  redemptions: number
  consents: number
  returning: number
  recurrenceIndex: number
  satisfaction: number
  nps: number
  perEvent: EventSummary[]
  byCity: NamedValue[]
  byAge: NamedValue[]
  bySource: NamedValue[]
  byCampaign: NamedValue[]
  consentSplit: NamedValue[]
  newVsReturning: NamedValue[]
  loyalty: NamedValue[]
  productInterest: ProductInterest[]
  evolution: EvolutionPoint[]
}
