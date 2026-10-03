export const RELATIONSHIPS = [
  ['eventos[evento_id]', 'participantes[evento_id]', 'Uno a varios'],
  ['eventos[evento_id]', 'indicadores_evento[evento_id]', 'Uno a uno (opcional)'],
  ['participantes[participante_id]', 'interacciones[participante_id]', 'Uno a varios'],
  ['participantes[participante_id]', 'encuestas[participante_id]', 'Uno a varios'],
  ['productos[producto_id]', 'interacciones[producto_id]', 'Uno a varios'],
  ['actividades[actividad_id]', 'interacciones[actividad_id]', 'Uno a varios'],
]

export const REPORT_PAGES = [
  {
    title: 'Página 1 · Resumen general',
    visuals: ['Tarjetas: Eventos, Registrados, Asistentes, Interacciones con producto, Conversiones, Satisfacción', 'Columnas: Asistentes por evento (eventos[nombre])', 'Línea: Asistentes por fecha del evento (eventos[fecha])'],
  },
  {
    title: 'Página 2 · Análisis de participantes',
    visuals: ['Barras: Registrados por rango_edad y por ciudad', 'Anillo: tipo_participante (Nuevo / Recurrente)', 'Anillo: fuente_registro y consentimiento', 'Segmentadores: evento, campaña'],
  },
  {
    title: 'Página 3 · Rendimiento de eventos',
    visuals: ['Matriz con eventos[nombre] y las medidas: Asistencia efectiva %, Tasa de participación %, Interacciones con producto, Conversiones, Satisfacción', 'Columnas agrupadas para comparar dos o más eventos'],
  },
  {
    title: 'Página 4 · Producto y campaña',
    visuals: ['Barras: Interacciones por interacciones[producto] (Muestras entregadas)', 'Barras: Participaron por interacciones[actividad]', 'Tarjetas: Canjes y Conversiones', 'Columnas: Conversiones por participantes[campana]'],
  },
  {
    title: 'Página 5 · Fidelización',
    visuals: ['Tarjetas: Personas recurrentes, Índice de recurrencia %, Eventos por persona', 'Columnas: número de personas por cantidad de eventos', 'Línea: Asistentes y Recurrentes a lo largo del tiempo'],
  },
]
