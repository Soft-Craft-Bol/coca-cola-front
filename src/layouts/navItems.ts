import { BarChart3, CalendarDays, FileText, GlassWater, KeyRound, Package, LayoutDashboard, QrCode, Send, Sparkles, Star, Users } from 'lucide-react'

export const NAV = [
  { to: '/panel', label: 'Panel', icon: BarChart3, roles: ['admin', 'organizer', 'marketing'], end: true },
  { to: '/eventos', label: 'Eventos', icon: CalendarDays, roles: ['admin', 'organizer', 'marketing'] },
  { to: '/participantes', label: 'Participantes', icon: Users, roles: ['admin', 'organizer', 'marketing'] },
  { to: '/checkin', label: 'Ingreso QR', icon: QrCode, roles: ['admin', 'organizer'] },
  { to: '/actividades', label: 'Actividades', icon: GlassWater, roles: ['admin', 'organizer'] },
  { to: '/encuestas', label: 'Encuestas', icon: Star, roles: ['admin', 'organizer'] },
  { to: '/inteligencia', label: 'Inteligencia', icon: Sparkles, roles: ['admin', 'marketing'] },
  { to: '/comunicaciones', label: 'Comunicaciones', icon: Send, roles: ['admin', 'marketing'] },
  { to: '/reportes', label: 'Reportes', icon: FileText, roles: ['admin', 'marketing'] },
  { to: '/power-bi', label: 'Power BI', icon: LayoutDashboard, roles: ['admin', 'marketing'] },
  { to: '/catalogos', label: 'Catálogos', icon: Package, roles: ['admin'] },
  { to: '/usuarios', label: 'Usuarios', icon: KeyRound, roles: ['admin'] },
]
