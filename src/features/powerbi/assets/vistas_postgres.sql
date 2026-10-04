-- =====================================================================
-- Coca-Cola Event Intelligence · Vistas para Power BI (PostgreSQL / Neon)
-- Ejecuta este script en la consola SQL de Neon. Es seguro repetirlo.
-- Las vistas usan los mismos nombres de tabla y de columna que la API /api/bi.
-- No exponen nombre, correo ni celular: persona_id es un hash del correo.
-- =====================================================================

CREATE OR REPLACE VIEW bi_productos AS
SELECT p.id AS producto_id,
       p.name AS producto_base,
       concat_ws(' · ', p.name, nullif(p.flavor, ''), nullif(p.presentation, '')) AS producto,
       p.category AS categoria,
       COALESCE(p.flavor, '') AS sabor,
       COALESCE(p.presentation, '') AS presentacion,
       CASE WHEN p.archived THEN 'Archivado' ELSE 'Activo' END AS estado
FROM products p;

CREATE OR REPLACE VIEW bi_experiencias AS
SELECT x.id AS experiencia_id,
       x.name AS experiencia,
       x.category AS categoria,
       COALESCE(x.description, '') AS descripcion,
       CASE WHEN x.archived THEN 'Archivada' ELSE 'Activa' END AS estado
FROM experiences x;

CREATE OR REPLACE VIEW bi_eventos AS
SELECT e.id AS evento_id,
       e.name AS nombre,
       e.type AS tipo,
       (e.event_date AT TIME ZONE 'America/La_Paz')::date AS fecha,
       e.location AS lugar,
       e.organizer AS organizador,
       e.manager AS responsable,
       e.campaign AS campana,
       e.budget AS presupuesto,
       e.expected AS esperados,
       e.channel AS canal,
       CASE e.status WHEN 'PLANNED' THEN 'Planificado' WHEN 'ACTIVE' THEN 'En curso' WHEN 'FINISHED' THEN 'Finalizado' END AS estado,
       COALESCE((SELECT string_agg(concat_ws(' · ', p.name, nullif(p.flavor, ''), nullif(p.presentation, '')), ', ' ORDER BY p.name)
                 FROM event_products ep JOIN products p ON p.id = ep.product_id
                 WHERE ep.event_id = e.id), '') AS productos_destacados,
       COALESCE((SELECT string_agg(x.name, ', ' ORDER BY x.name)
                 FROM event_experiences ee JOIN experiences x ON x.id = ee.experience_id
                 WHERE ee.event_id = e.id), '') AS experiencias_destacadas
FROM events e;

CREATE OR REPLACE VIEW bi_actividades AS
SELECT a.id AS actividad_id,
       a.event_id AS evento_id,
       a.name AS actividad,
       a.experience_id AS experiencia_id,
       COALESCE(xa.name, '') AS experiencia,
       CASE a.type
            WHEN 'TASTING' THEN 'Degustación o muestra'
            WHEN 'EXPERIENCE' THEN 'Experiencia de producto'
            WHEN 'CONTEST' THEN 'Concurso o dinámica'
            WHEN 'PROMO' THEN 'Activación promocional'
            WHEN 'PHOTOCALL' THEN 'Fotografía / experiencia digital'
            WHEN 'SURVEY' THEN 'Encuesta'
            WHEN 'REDEEM' THEN 'Canje de beneficio o cupón'
            WHEN 'CONTENT' THEN 'Interacción con contenido de marca'
       END AS tipo_actividad
FROM activities a
LEFT JOIN experiences xa ON xa.id = a.experience_id;

CREATE OR REPLACE VIEW bi_participantes AS
SELECT p.id AS participante_id,
       p.event_id AS evento_id,
       left(encode(sha256(convert_to(lower(trim(p.email)), 'UTF8')), 'hex'), 12) AS persona_id,
       p.city AS ciudad,
       p.age_range AS rango_edad,
       CASE WHEN p.is_returning THEN 'Recurrente' ELSE 'Nuevo' END AS tipo_participante,
       CASE WHEN p.consent THEN 'Sí' ELSE 'No' END AS consentimiento,
       p.source AS fuente_registro,
       p.campaign AS campana,
       p.registered_at AT TIME ZONE 'America/La_Paz' AS fecha_registro,
       p.checked_in_at AT TIME ZONE 'America/La_Paz' AS fecha_ingreso,
       p.checked_out_at AT TIME ZONE 'America/La_Paz' AS fecha_salida,
       CASE WHEN p.checked_in_at IS NOT NULL THEN 'Sí' ELSE 'No' END AS asistio,
       round((extract(epoch FROM (p.checked_out_at - p.checked_in_at)) / 60.0)::numeric, 1) AS permanencia_min,
       nv.n AS nivel_interaccion,
       CASE nv.n WHEN 6 THEN 'Conversión relevante'
                 WHEN 5 THEN 'Aceptó recibir información'
                 WHEN 4 THEN 'Probó un producto o canjeó un beneficio'
                 WHEN 3 THEN 'Participó en una actividad'
                 ELSE 'Registrado' END AS nivel_nombre,
       COALESCE((SELECT string_agg(pr.name, ', ' ORDER BY pr.name)
                 FROM participant_preferences pp JOIN products pr ON pr.id = pp.product_id
                 WHERE pp.participant_id = p.id), '') AS productos_interes
FROM participants p
LEFT JOIN LATERAL (
    SELECT CASE
             WHEN bool_or(i.type = 'CONVERSION') THEN 6
             WHEN p.consent AND p.checked_in_at IS NOT NULL AND bool_or(i.type IN ('ACTIVITY', 'TASTING', 'REDEEM')) THEN 5
             WHEN bool_or(i.type IN ('TASTING', 'REDEEM')) THEN 4
             WHEN bool_or(i.type = 'ACTIVITY') THEN 3
             ELSE 2
           END AS n
    FROM interactions i WHERE i.participant_id = p.id
) nv ON TRUE;

CREATE OR REPLACE VIEW bi_interacciones AS
SELECT i.id AS interaccion_id,
       i.event_id AS evento_id,
       i.participant_id AS participante_id,
       i.activity_id AS actividad_id,
       COALESCE(a.name, '') AS actividad,
       CASE i.type WHEN 'ACTIVITY' THEN 'Participación' WHEN 'TASTING' THEN 'Degustación'
                   WHEN 'REDEEM' THEN 'Canje' WHEN 'CONVERSION' THEN 'Conversión' END AS tipo,
       i.product_id AS producto_id,
       concat_ws(' · ', pr.name, nullif(pr.flavor, ''), nullif(pr.presentation, '')) AS producto,
       COALESCE(pr.category, '') AS categoria,
       COALESCE(pr.flavor, '') AS sabor,
       COALESCE(pr.presentation, '') AS presentacion,
       i.rating AS calificacion,
       CASE i.would_buy WHEN TRUE THEN 'Sí' WHEN FALSE THEN 'No' ELSE '' END AS compraria,
       CASE i.wants_promos WHEN TRUE THEN 'Sí' WHEN FALSE THEN 'No' ELSE '' END AS quiere_promociones,
       i.occurred_at AT TIME ZONE 'America/La_Paz' AS fecha_hora,
       (i.occurred_at AT TIME ZONE 'America/La_Paz')::date AS fecha,
       extract(hour FROM i.occurred_at AT TIME ZONE 'America/La_Paz')::int AS hora
FROM interactions i
LEFT JOIN activities a ON a.id = i.activity_id
LEFT JOIN products pr ON pr.id = i.product_id;

CREATE OR REPLACE VIEW bi_encuestas AS
SELECT s.id AS encuesta_id,
       s.event_id AS evento_id,
       s.participant_id AS participante_id,
       s.organization AS organizacion,
       s.service AS atencion,
       s.experiences AS experiencias,
       s.products AS productos,
       s.overall AS general,
       round(((s.organization + s.service + s.experiences + s.products + s.overall) / 5.0)::numeric, 2) AS satisfaccion_promedio,
       s.nps AS nps,
       CASE WHEN s.nps >= 9 THEN 'Promotor' WHEN s.nps >= 7 THEN 'Pasivo' ELSE 'Detractor' END AS categoria_nps,
       s.created_at AT TIME ZONE 'America/La_Paz' AS fecha
FROM surveys s;
