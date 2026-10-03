import { useState } from 'react'
import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import { Badge, Card, ErrorBox, Loading, Modal, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { ROLE_LABELS } from '@/shared/constants'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import type { User } from '@/shared/types'
import UserForm, { type UserFormValues } from '../components/UserForm'
import { useUsers } from '../hooks/useUsers'
import { userService } from '../services/userService'

export default function UsersPage() {
  const { data: users, loading, error, reload } = useUsers()
  const me = useCurrentUser()
  const toast = useToast()
  const pg = usePagination(users ?? [])
  const [editing, setEditing] = useState<Partial<User> | null>(null)

  const save = async (form: UserFormValues) => {
    const { id, password, ...rest } = form
    const payload = password ? { ...rest, password } : rest
    if (id) await userService.update(id, payload)
    else await userService.create(payload)
    toast.success('Usuario guardado')
    setEditing(null)
    reload()
  }

  const remove = async (u: User) => {
    if (!confirm(`¿Eliminar a ${u.name}?`)) return
    await userService.remove(u.id)
    toast.success('Usuario eliminado')
    reload()
  }

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Administradores, organizadores y equipo de marketing"
        actions={<button className="btn primary" onClick={() => setEditing({})}>+ Nuevo usuario</button>}
      />
      <Card>
        <ErrorBox error={error} />
        {loading ? <Loading /> : (
          <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th /></tr></thead>
              <tbody>
                {pg.pageItems.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{ROLE_LABELS[u.role]}</td>
                    <td><Badge tone={u.active ? 'green' : ''}>{u.active ? 'Activo' : 'Inactivo'}</Badge></td>
                    <td className="row" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn small" onClick={() => setEditing(u)}>Editar</button>
                      {u.id !== me.id && <button className="btn small danger" onClick={() => remove(u)}>Eliminar</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination p={pg} />
          </>
        )}
      </Card>
      {editing && (
        <Modal title={editing.id ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setEditing(null)}>
          <UserForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  )
}
