import type { BiTable, BiType } from '../services/biService'

const M_TYPE: Record<BiType, string> = {
  text: 'type text',
  integer: 'Int64.Type',
  number: 'type number',
  date: 'type date',
  datetime: 'type datetime',
}

/** Consultas de Power Query (M) para cargar todas las tablas de la API /bi. */
export function buildPowerQuery(baseUrl: string, tables: BiTable[]): string {
  const header = `// =====================================================================
// Coca-Cola Event Intelligence · Consultas de Power Query (M)
// Power BI Desktop > Obtener datos > Consulta en blanco > Editor avanzado
// Crea UNA consulta por cada bloque (el nombre va en el título del bloque).
// =====================================================================

// ---- Consulta: UrlBase -------------------------------------------------
"${baseUrl}/bi" meta [IsParameterQuery = true, Type = "Text", IsParameterQueryRequired = true]

// ---- Consulta: ClaveApi (valor de bi.api-key del backend) -------------
"PEGA_AQUI_TU_CLAVE" meta [IsParameterQuery = true, Type = "Text", IsParameterQueryRequired = true]

// ---- Consulta: ObtenerTabla (función) ----------------------------------
(tabla as text) as table =>
let
    Origen = Csv.Document(
        Web.Contents(UrlBase, [
            RelativePath = tabla,
            Query = [format = "csv"],
            Headers = [#"X-API-Key" = ClaveApi]
        ]),
        [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]
    ),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true])
in
    Encabezados
`

  const blocks = tables.map((t) => {
    const nonText = t.columns.filter((c) => c.type !== 'text').map((c) => `"${c.name}"`)
    const types = t.columns.map((c) => `{"${c.name}", ${M_TYPE[c.type]}}`).join(', ')
    const lines = [
      `// ---- Consulta: ${t.name} (${t.description}) ----`,
      'let',
      `    Origen = ObtenerTabla("${t.name}"),`,
    ]
    if (nonText.length) {
      lines.push(`    SinVacios = Table.ReplaceValue(Origen, "", null, Replacer.ReplaceValue, {${nonText.join(', ')}}),`)
      lines.push(`    Tipos = Table.TransformColumnTypes(SinVacios, {${types}}, "en-US")`)
    } else {
      lines.push(`    Tipos = Table.TransformColumnTypes(Origen, {${types}}, "en-US")`)
    }
    lines.push('in', '    Tipos')
    return lines.join('\n')
  })

  return `${header}\n${blocks.join('\n\n')}\n`
}
