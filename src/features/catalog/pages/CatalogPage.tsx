import { useMemo, useState } from 'react'
import { Archive, ArchiveRestore, Pencil, Plus, Search } from 'lucide-react'
import { Badge, Card, ErrorBox, Loading, Modal, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import Pagination from '@/shared/components/Pagination'
import { useAsync } from '@/shared/hooks/useAsync'
import { usePagination } from '@/shared/hooks/usePagination'
import { distinct } from '@/shared/utils/catalog'
import type { Experience, Product } from '@/shared/types'
import ExperienceForm from '../components/ExperienceForm'
import ProductForm from '../components/ProductForm'
import { catalogService, type ExperienceInput, type ProductInput } from '../services/catalogService'

type Tab = 'productos' | 'experiencias'

// Administración de los catálogos de productos (con sabor y presentación) y de experiencias destacadas
export default function CatalogPage() {
  const [tab, setTab] = useState<Tab>('productos')
  return (
    <>
      <PageHeader title="Catálogos" subtitle="Productos (marca, sabor y presentación) y experiencias que se destacan en los eventos" />
      <div className="tabs">
        <button className={`tab ${tab === 'productos' ? 'on' : ''}`} onClick={() => setTab('productos')}>Productos</button>
        <button className={`tab ${tab === 'experiencias' ? 'on' : ''}`} onClick={() => setTab('experiencias')}>Experiencias</button>
      </div>
      {tab === 'productos' ? <ProductsTab /> : <ExperiencesTab />}
    </>
  )
}

function Toolbar({ search, onSearch, showArchived, onShowArchived, onNew, label }: {
  search: string; onSearch: (v: string) => void; showArchived: boolean; onShowArchived: (v: boolean) => void; onNew: () => void; label: string
}) {
  return (
    <div className="row spread" style={{ marginBottom: 12 }}>
      <div className="row">
        <div className="search-box"><Search size={15} /><input placeholder="Buscar…" value={search} onChange={(e) => onSearch(e.target.value)} /></div>
        <label className="check"><input type="checkbox" checked={showArchived} onChange={(e) => onShowArchived(e.target.checked)} /> Mostrar archivados</label>
      </div>
      <button className="btn primary icon-inline" onClick={onNew}><Plus size={16} /> {label}</button>
    </div>
  )
}

function ProductsTab() {
  const { data, loading, error, reload } = useAsync(() => catalogService.products(), [])
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<Product | 'new' | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data ?? []).filter((p) => (showArchived || !p.archived)
      && (!q || [p.name, p.category, p.flavor, p.presentation].join(' ').toLowerCase().includes(q)))
  }, [data, search, showArchived])
  const pg = usePagination(filtered, 10)

  const save = async (input: ProductInput) => {
    if (editing && editing !== 'new') await catalogService.updateProduct(editing.id, input)
    else await catalogService.createProduct(input)
    toast.success('Producto guardado')
    setEditing(null)
    reload()
  }

  const toggleArchive = async (p: Product) => {
    try {
      await catalogService.updateProduct(p.id, { name: p.name, category: p.category, flavor: p.flavor ?? '', presentation: p.presentation ?? '', archived: !p.archived })
      toast.success(p.archived ? 'Producto restaurado' : 'Producto archivado')
      reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <Card>
      <ErrorBox error={error} />
      <Toolbar search={search} onSearch={(v) => { setSearch(v); pg.reset() }} showArchived={showArchived} onShowArchived={(v) => { setShowArchived(v); pg.reset() }}
        onNew={() => setEditing('new')} label="Nuevo producto" />
      {loading ? <Loading /> : (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Producto</th><th>Sabor</th><th>Presentación</th><th>Categoría</th><th>Estado</th><th /></tr></thead>
              <tbody>
                {pg.pageItems.map((p) => (
                  <tr key={p.id} style={p.archived ? { opacity: 0.6 } : undefined}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.flavor || '—'}</td>
                    <td>{p.presentation || '—'}</td>
                    <td>{p.category}</td>
                    <td>{p.archived ? <Badge>Archivado</Badge> : <Badge tone="green">Activo</Badge>}</td>
                    <td className="row" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn small icon-inline" onClick={() => setEditing(p)}><Pencil size={13} /> Editar</button>
                      <button className="btn small icon-inline" onClick={() => toggleArchive(p)}>
                        {p.archived ? <><ArchiveRestore size={13} /> Restaurar</> : <><Archive size={13} /> Archivar</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!pg.pageItems.length && <div className="empty">No hay productos que coincidan</div>}
          </div>
          <Pagination p={pg} />
        </>
      )}
      {editing && (
        <Modal title={editing === 'new' ? 'Nuevo producto' : 'Editar producto'} onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing === 'new' ? undefined : editing}
            categories={distinct((data ?? []).map((p) => p.category))}
            presentations={distinct((data ?? []).map((p) => p.presentation))}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </Card>
  )
}

function ExperiencesTab() {
  const { data, loading, error, reload } = useAsync(() => catalogService.experiences(), [])
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<Experience | 'new' | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data ?? []).filter((e) => (showArchived || !e.archived) && (!q || [e.name, e.category, e.description].join(' ').toLowerCase().includes(q)))
  }, [data, search, showArchived])
  const pg = usePagination(filtered, 10)

  const save = async (input: ExperienceInput) => {
    if (editing && editing !== 'new') await catalogService.updateExperience(editing.id, input)
    else await catalogService.createExperience(input)
    toast.success('Experiencia guardada')
    setEditing(null)
    reload()
  }

  const toggleArchive = async (e: Experience) => {
    try {
      await catalogService.updateExperience(e.id, { name: e.name, category: e.category, description: e.description ?? '', archived: !e.archived })
      toast.success(e.archived ? 'Experiencia restaurada' : 'Experiencia archivada')
      reload()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  return (
    <Card>
      <ErrorBox error={error} />
      <Toolbar search={search} onSearch={(v) => { setSearch(v); pg.reset() }} showArchived={showArchived} onShowArchived={(v) => { setShowArchived(v); pg.reset() }}
        onNew={() => setEditing('new')} label="Nueva experiencia" />
      {loading ? <Loading /> : (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Experiencia</th><th>Tipo</th><th>Descripción</th><th>Estado</th><th /></tr></thead>
              <tbody>
                {pg.pageItems.map((e) => (
                  <tr key={e.id} style={e.archived ? { opacity: 0.6 } : undefined}>
                    <td><strong>{e.name}</strong></td>
                    <td>{e.category}</td>
                    <td className="muted" style={{ maxWidth: 360 }}>{e.description || '—'}</td>
                    <td>{e.archived ? <Badge>Archivada</Badge> : <Badge tone="green">Activa</Badge>}</td>
                    <td className="row" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn small icon-inline" onClick={() => setEditing(e)}><Pencil size={13} /> Editar</button>
                      <button className="btn small icon-inline" onClick={() => toggleArchive(e)}>
                        {e.archived ? <><ArchiveRestore size={13} /> Restaurar</> : <><Archive size={13} /> Archivar</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!pg.pageItems.length && <div className="empty">No hay experiencias que coincidan</div>}
          </div>
          <Pagination p={pg} />
        </>
      )}
      {editing && (
        <Modal title={editing === 'new' ? 'Nueva experiencia' : 'Editar experiencia'} onClose={() => setEditing(null)}>
          <ExperienceForm
            initial={editing === 'new' ? undefined : editing}
            categories={distinct((data ?? []).map((e) => e.category))}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </Card>
  )
}
