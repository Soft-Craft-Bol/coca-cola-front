// Medidas DAX equivalentes a los indicadores del reto (nombres de tablas y columnas de la API /bi)

export const DAX_MEASURES = `// ===== Participación y asistencia =====
Registrados = COUNTROWS ( participantes )

Asistentes = CALCULATE ( COUNTROWS ( participantes ), participantes[asistio] = "Sí" )

Asistencia efectiva % = DIVIDE ( [Asistentes], [Registrados] )

Nuevos = CALCULATE ( [Asistentes], participantes[tipo_participante] = "Nuevo" )

Recurrentes = CALCULATE ( [Asistentes], participantes[tipo_participante] = "Recurrente" )

Índice de recurrencia % = DIVIDE ( [Recurrentes], [Asistentes] )

Consentimientos = CALCULATE ( COUNTROWS ( participantes ), participantes[consentimiento] = "Sí" )

Permanencia promedio (min) = AVERAGE ( participantes[permanencia_min] )

// ===== Interacción y conversión =====
Muestras entregadas = CALCULATE ( COUNTROWS ( interacciones ), interacciones[tipo] = "Degustación" )

Interacciones con producto =
CALCULATE ( DISTINCTCOUNT ( interacciones[participante_id] ), interacciones[tipo] IN { "Degustación", "Canje" } )

Participaron =
CALCULATE ( DISTINCTCOUNT ( interacciones[participante_id] ), interacciones[tipo] IN { "Participación", "Degustación", "Canje" } )

Tasa de participación % = DIVIDE ( [Participaron], [Asistentes] )

Conversiones =
CALCULATE ( DISTINCTCOUNT ( interacciones[participante_id] ), interacciones[tipo] IN { "Conversión", "Canje" } )

Tasa de conversión % = DIVIDE ( [Conversiones], [Asistentes] )

Canjes = CALCULATE ( COUNTROWS ( interacciones ), interacciones[tipo] = "Canje" )

// ===== Satisfacción y NPS =====
Satisfacción = AVERAGE ( encuestas[satisfaccion_promedio] )

Promotores = CALCULATE ( COUNTROWS ( encuestas ), encuestas[categoria_nps] = "Promotor" )

Detractores = CALCULATE ( COUNTROWS ( encuestas ), encuestas[categoria_nps] = "Detractor" )

NPS = DIVIDE ( [Promotores] - [Detractores], COUNTROWS ( encuestas ) ) * 100

// ===== Resumen general y fidelización =====
Eventos = DISTINCTCOUNT ( eventos[evento_id] )

Personas únicas = DISTINCTCOUNT ( participantes[persona_id] )

Eventos por persona = DIVIDE ( COUNTROWS ( participantes ), [Personas únicas] )

Personas recurrentes =
COUNTROWS (
    FILTER (
        VALUES ( participantes[persona_id] ),
        CALCULATE ( DISTINCTCOUNT ( participantes[evento_id] ) ) > 1
    )
)
`
