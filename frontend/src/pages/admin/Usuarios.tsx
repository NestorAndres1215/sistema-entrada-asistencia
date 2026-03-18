import { useEffect, useState } from 'react'
import { getUsuarios } from '../../services/usuario.service'
import SidebarAdmin from '../../components/SidebarAdmin'
import { useNavigate } from 'react-router-dom'
import '../../styles/usuarios.css'
const rolColor: Record<string, { bg: string; color: string; icon: string }> = {
  ADMIN:   { bg: 'rgba(232,201,106,0.15)', color: '#e8c96a', icon: 'fa-user-tie'  },
  PORTERO: { bg: 'rgba(79,142,247,0.15)',  color: '#4f8ef7', icon: 'fa-door-open' },
  DEFAULT: { bg: 'rgba(255,255,255,0.08)', color: '#aaa',    icon: 'fa-user'      },
}

function getRol(rol: string) {
  return rolColor[rol] ?? rolColor.DEFAULT
}

const FILTERS: { label: string; value: 'TODOS' | 'ADMIN' | 'PORTERO'; icon: string }[] = [
  { label: 'Todos',   value: 'TODOS',   icon: 'fa-users'     },
  { label: 'Admin',   value: 'ADMIN',   icon: 'fa-user-tie'  },
  { label: 'Portero', value: 'PORTERO', icon: 'fa-door-open' },
]

const PAGE_SIZE = 8

export default function Usuarios() {
  const [usuarios, setUsuarios]   = useState<any[]>([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [rolFilter, setRolFilter] = useState<'TODOS' | 'ADMIN' | 'PORTERO'>('TODOS')
  const [page, setPage]           = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    getUsuarios()
      .then(res => setUsuarios(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = usuarios.filter(u => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.rol?.toLowerCase().includes(search.toLowerCase())
    const matchRol = rolFilter === 'TODOS' || u.rol === rolFilter
    return matchSearch && matchRol
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (f: 'TODOS' | 'ADMIN' | 'PORTERO') => {
    setRolFilter(f)
    setPage(1)
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <>

      <div className="usr-root">
        <SidebarAdmin />

        <div className="usr-main">
          {/* Topbar */}
          <div className="usr-topbar">
            <div className="usr-topbar-left">
              <h1><i className="fa-solid fa-users-gear"></i> Usuarios</h1>
              <p>Gestión de cuentas del sistema</p>
            </div>
            <div className="usr-topbar-right">
              <div className="search-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  className="search-input"
                  placeholder="Buscar usuario..."
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              <button className="btn-crear" onClick={() => navigate('/admin/usuarios/crear')}>
                <i className="fa-solid fa-user-plus"></i>
                Crear Usuario
              </button>
            </div>
          </div>

          <div className="usr-content">
            {/* Summary chips */}
            <div className="summary-row">
              <div className="summary-chip" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                <i className="fa-solid fa-users" style={{ color: '#4f8ef7' }}></i>
                Total: {usuarios.length} usuarios
              </div>
              {(['ADMIN','PORTERO'] as const).map(rol => {
                const count = usuarios.filter(u => u.rol === rol).length
                const r = getRol(rol)
                return (
                  <div key={rol} className="summary-chip" style={{ background: r.bg, borderColor: r.color + '44', color: r.color }}>
                    <i className={`fa-solid ${r.icon}`}></i>
                    {rol}: {count}
                  </div>
                )
              })}
            </div>

            {/* Filter tabs */}
            <div className="filter-bar">
              {FILTERS.map(f => {
                const count = f.value === 'TODOS'
                  ? usuarios.length
                  : usuarios.filter(u => u.rol === f.value).length
                const isActive = rolFilter === f.value
                const activeClass = isActive
                  ? f.value === 'TODOS' ? 'active-todos' : `active-${f.value}`
                  : ''
                return (
                  <button
                    key={f.value}
                    className={`filter-tab ${activeClass}`}
                    onClick={() => handleFilterChange(f.value)}
                  >
                    <i className={`fa-solid ${f.icon}`}></i>
                    {f.label}
                    <span className="filter-count">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Table */}
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="skeleton-row">
                        <td><div className="skeleton-bar" style={{ width: '60%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width: '40%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width: '30%' }} /></td>
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <div className="empty-state">
                          <i className="fa-solid fa-users-slash"></i>
                          <p>{search || rolFilter !== 'TODOS' ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados aún.'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((u, i) => {
                      const r = getRol(u.rol)
                      const initials = u.username?.slice(0,2).toUpperCase() ?? '??'
                      return (
                        <tr key={u.id} style={{ animationDelay: `${i * 0.04}s` }}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-circle" style={{ background: r.bg, color: r.color, border: `1px solid ${r.color}44` }}>
                                {initials}
                              </div>
                              <div>
                                <div className="user-username">{u.username}</div>
                                <div className="user-id">#ID {u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="rol-pill" style={{ background: r.bg, color: r.color }}>
                              <i className={`fa-solid ${r.icon}`}></i>
                              {u.rol}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn" title="Editar" onClick={() => navigate(`/admin/usuarios/${u.id}/editar`)}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="action-btn danger" title="Eliminar">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {!loading && filtered.length > PAGE_SIZE && (
                <div className="pagination-row">
                  <div className="pagination-info">
                    Mostrando <span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> de <span>{filtered.length}</span> usuarios
                  </div>
                  <div className="pagination-controls">
                    {/* Prev */}
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      if (totalPages <= 7 || p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                        return (
                          <button
                            key={p}
                            className={`page-btn ${p === page ? 'active' : ''}`}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </button>
                        )
                      }
                      if (p === page - 2 || p === page + 2) {
                        return <span key={p} className="page-dots">···</span>
                      }
                      return null
                    })}

                    {/* Next */}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}