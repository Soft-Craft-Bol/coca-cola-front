import { useMemo, useState } from 'react'
import { Copy, Download } from 'lucide-react'
import { Card, ErrorBox, Loading, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { useAsync } from '@/shared/hooks/useAsync'
import { API_URL } from '@/shared/services/api'
import PowerBiPanel from '@/features/dashboard/components/PowerBiPanel'
import CodeBlock from '../components/CodeBlock'
import { DAX_MEASURES } from '../lib/dax'
import { REPORT_PAGES, RELATIONSHIPS } from '../lib/guide'
import { buildPowerQuery } from '../lib/powerQuery'
import { biService } from '../services/biService'
import postgresViews from '../assets/vistas_postgres.sql?raw'

const TABS = [
  ['conexion', 'Conexión'],
  ['consultas', 'Consultas (M)'],
  ['modelo', 'Modelo y medidas'],
  ['paginas', 'Páginas del informe'],
  ['informe', 'Informe publicado'],
] as const

type Tab = (typeof TABS)[number][0]

export default function PowerBiPage() {
  const [tab, setTab] = useState<Tab>('conexion')
  const { data: tables, loading, error } = useAsync(() => biService.catalog(), [])
  const toast = useToast()
  const baseUrl = `${API_URL}/bi`

  const mQuery = useMemo(() => (tables ? buildPowerQuery(API_URL, tables) : ''), [tables])

  const copyUrl = async (name: string) => {
    await navigator.clipboard.writeText(`${baseUrl}/${name}?format=csv`)
    toast.success('Dirección copiada')
  }

  const download = async (name: string) => {
    try {
      await biService.downloadCsv(name)
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  return (
    <>
      <PageHeader
        title="Power BI"
        subtitle="Conecta Power BI con los datos de la plataforma: aplicación, base de datos, conexión y dashboard ejecutivo"
      />
      <div className="tabs">
        {TABS.map(([k, l]) => <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <ErrorBox error={error} />

      {tab === 'conexion' && (
        <div className="stack">
          <Card title="Opción A · Desde la API (recomendada)">
            <ol className="steps-list">
              <li>En <strong>Power BI Desktop</strong>: <em>Obtener datos</em> → <em>Consulta en blanco</em> → <em>Editor avanzado</em>.</li>
              <li>Pega las consultas de la pestaña <strong>Consultas (M)</strong> (una por bloque) y reemplaza <code>PEGA_AQUI_TU_CLAVE</code> por el valor de <code>bi.api-key</code> de <code>application.properties</code>.</li>
              <li>Si Power BI pide credenciales para el origen web, elige <strong>Anónimo</strong>: la clave viaja en la cabecera <code>X-API-Key</code>.</li>
              <li>Crea las relaciones y medidas de la pestaña <strong>Modelo y medidas</strong>.</li>
            </ol>
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              Dirección base: <code>{baseUrl}</code>. Si la API corre en <code>localhost</code>, el servicio de Power BI en la nube no puede
              leerla: usa Power BI Desktop o instala una puerta de enlace de datos.
            </p>
          </Card>

          <Card title="Tablas disponibles">
            {loading ? <Loading /> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Tabla</th><th>Descripción</th><th>Columnas</th><th /></tr></thead>
                  <tbody>
                    {tables?.map((t) => (
                      <tr key={t.name}>
                        <td><code>{t.name}</code></td>
                        <td>{t.description}</td>
                        <td>{t.columns.length}</td>
                        <td className="row" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn small icon-inline" onClick={() => copyUrl(t.name)}><Copy size={13} /> Dirección</button>
                          <button className="btn small icon-inline" onClick={() => download(t.name)}><Download size={13} /> CSV</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              Los datos no incluyen nombre, correo ni celular: cada persona se identifica con <code>persona_id</code> (hash del correo),
              suficiente para medir recurrencia y fidelización.
            </p>
          </Card>

          <Card title="Opción B · Directo a la base de datos (PostgreSQL / Neon)">
            <ol className="steps-list">
              <li>Ejecuta el script de abajo en la consola SQL de Neon: crea las vistas <code>bi_*</code> con los mismos nombres de columnas.</li>
              <li>En Power BI Desktop: <em>Obtener datos</em> → <em>Base de datos PostgreSQL</em>. Servidor: el host de Neon; Base de datos: <code>neondb</code>.</li>
              <li>Usa preferiblemente un rol de <strong>solo lectura</strong> y carga las vistas <code>bi_*</code>.</li>
              <li>Las medidas DAX son las mismas (renombra las vistas como las tablas: <code>participantes</code>, <code>interacciones</code>…).</li>
            </ol>
            <CodeBlock code={postgresViews} filename="vistas_postgres.sql" maxHeight={300} />
          </Card>
        </div>
      )}

      {tab === 'consultas' && (
        <Card title="Consultas de Power Query (M)">
          <p className="muted" style={{ marginTop: 0 }}>
            Se generan con la estructura real de la API (columnas y tipos), así que siempre coinciden con los datos.
          </p>
          {loading ? <Loading /> : <CodeBlock code={mQuery} filename="consultas-powerbi.pq" maxHeight={520} />}
        </Card>
      )}

      {tab === 'modelo' && (
        <div className="stack">
          <Card title="Relaciones del modelo">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Desde</th><th>Hacia</th><th>Cardinalidad</th></tr></thead>
                <tbody>
                  {RELATIONSHIPS.map(([a, b, c]) => <tr key={a + b}><td><code>{a}</code></td><td><code>{b}</code></td><td>{c}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              Dirección del filtro: de la tabla “uno” hacia la tabla “varios”. No relaciones <code>eventos</code> directamente con
              <code> interacciones</code> o <code>encuestas</code>: el filtro les llega a través de <code>participantes</code> y así se evitan rutas ambiguas.
            </p>
          </Card>
          <Card title="Medidas DAX (indicadores del reto)">
            <CodeBlock code={DAX_MEASURES} filename="medidas.dax" maxHeight={460} />
          </Card>
        </div>
      )}

      {tab === 'paginas' && (
        <div className="grid cols-2">
          {REPORT_PAGES.map((p) => (
            <Card key={p.title} title={p.title}>
              <ul className="bullets">
                {p.visuals.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'informe' && <PowerBiPanel />}
    </>
  )
}
