import type { ActivityType, EventStatus, InteractionType, Role } from '@/shared/types'

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  MARKETING: 'marketing',
} as const satisfies Record<string, Role>

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  organizer: 'Organizador',
  marketing: 'Marketing / Trade marketing',
}

export const EVENT_TYPES = [
  'Lanzamiento de producto',
  'Activación de marca / muestras',
  'Festival o concierto',
  'Evento deportivo',
  'Feria o exhibición',
  'Campaña promocional / punto de venta',
  'Evento con distribuidores y aliados',
  'Actividad para comunidades',
]

export const EVENT_STATUS: Record<EventStatus, string> = {
  planned: 'Planificado',
  active: 'En curso',
  finished: 'Finalizado',
}

export const ACTIVITY_TYPES: Record<ActivityType, string> = {
  tasting: 'Degustación o muestra',
  experience: 'Experiencia de producto',
  contest: 'Concurso o dinámica',
  promo: 'Activación promocional',
  photocall: 'Fotografía / experiencia digital',
  survey: 'Encuesta',
  redeem: 'Canje de beneficio o cupón',
  content: 'Interacción con contenido de marca',
}

export const INTERACTION_TYPES: Record<InteractionType, string> = {
  activity: 'Participación',
  tasting: 'Degustación',
  redeem: 'Canje',
  conversion: 'Conversión',
}

export const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+']

export const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga']

export const SOURCES = ['Código QR', 'Formulario web', 'Tablet en sitio', 'Aplicación móvil', 'Preinscripción web']

export const CAMPAIGNS = ['Destapa la felicidad', 'Verano Zero', 'Sabores del barrio', 'Comparte una Coca-Cola']

export const INTERACTION_LEVELS = [
  { level: 1, label: 'Visitante' },
  { level: 2, label: 'Registrado' },
  { level: 3, label: 'Participó en una actividad' },
  { level: 4, label: 'Probó un producto o canjeó un beneficio' },
  { level: 5, label: 'Aceptó recibir información' },
  { level: 6, label: 'Conversión relevante' },
]

export type SurveyCriterionKey = 'organization' | 'service' | 'experiences' | 'products' | 'overall'

export const SURVEY_CRITERIA: { key: SurveyCriterionKey; label: string }[] = [
  { key: 'organization', label: 'Organización' },
  { key: 'service', label: 'Atención' },
  { key: 'experiences', label: 'Experiencias y dinámicas' },
  { key: 'products', label: 'Productos probados' },
  { key: 'overall', label: 'Experiencia general' },
]

export const CHART_COLORS = ['#e61a27', '#1f1f1f', '#f59e0b', '#2563eb', '#16a34a', '#9333ea', '#6b7280']
