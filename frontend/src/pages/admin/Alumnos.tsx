import { useEffect, useState } from 'react'
import { getAlumnos } from '../../services/alumno.service'
import SidebarAdmin from '../../components/SidebarAdmin'
import { useNavigate } from 'react-router-dom'
import '../../styles/alumnos.css'
const PAGE_SIZE = 10

function getInitials(nombre: string, apellido: string) {
  return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase()
}

const COLORS = ['#4f8ef7','#e8c96a','#4fcf8e','#f7a24f','#c47ef7','#f76f6f']
function avatarColor(id: number) { return COLORS[id % COLORS.length] }

export default function Alumnos() {
  const [alumnos, setAlumnos]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    getAlumnos()
      .then(res => setAlumnos(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = alumnos.filter(a => {
    const q = search.toLowerCase()
    return (
      a.nombre?.toLowerCase().includes(q)   ||
      a.apellido?.toLowerCase().includes(q) ||
      a.codigo?.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => { setSearch(val); setPage(1) }

  return (
    <>


      <div className="al-root">
        <SidebarAdmin />

        <div className="al-main">
          {/* Topbar */}
          <div className="al-topbar">
            <div className="al-topbar-left">
              <h1><i className="fa-solid fa-user-graduate"></i> Alumnos</h1>
              <p>Gestión del padrón de estudiantes</p>
            </div>
            <div className="al-topbar-right">
              <div className="search-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  className="search-input"
                  placeholder="Buscar por nombre o código..."
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  style={{ paddingRight: search ? 32 : 14 }}
                />
                {search && (
                  <button className="search-clear" onClick={() => handleSearch('')}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
              <button className="btn-crear" onClick={() => navigate('/admin/alumnos/crear')}>
                <i className="fa-solid fa-user-plus"></i>
                Nuevo Alumno
              </button>
            </div>
          </div>

          <div className="al-content">
            {/* Summary */}
            <div className="summary-row">
              <div className="summary-chip" style={{ background: 'rgba(79,142,247,0.1)', borderColor: 'rgba(79,142,247,0.3)', color: '#4f8ef7' }}>
                <i className="fa-solid fa-users"></i>
                Total: {alumnos.length} alumnos
              </div>
              {search && (
                <div className="summary-chip" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  <i className="fa-solid fa-filter"></i>
                  {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
                </div>
              )}
            </div>

            {/* Table */}
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <tr key={i} className="skeleton-row">
                        <td><div className="skeleton-bar" style={{ width: '55%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width: '35%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width: '25%' }} /></td>
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={3}>
                      <div className="empty-state">
                        <i className="fa-solid fa-user-slash"></i>
                        <p>{search ? `No se encontraron alumnos con "${search}".` : 'No hay alumnos registrados aún.'}</p>
                      </div>
                    </td></tr>
                  ) : (
                    paginated.map((a, i) => {
                      const color = avatarColor(a.id ?? i)
                      return (
                        <tr key={a.id} style={{ animationDelay: `${i * 0.03}s` }}>
                          <td>
                            <div className="alumno-cell">
                              <div className="alumno-avatar" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
                                {getInitials(a.nombre, a.apellido)}
                              </div>
                              <div>
                                <div className="alumno-nombre">{a.nombre} {a.apellido}</div>
                                <div className="alumno-sub">#ID {a.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="codigo-badge">
                              <i className="fa-solid fa-id-card" style={{ fontSize: 11, opacity: 0.5 }}></i>
                              {a.codigo}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn" title="Ver detalle" onClick={() => navigate(`/admin/alumnos/${a.id}`)}>
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <button className="action-btn" title="Editar" onClick={() => navigate(`/admin/alumnos/${a.id}/editar`)}>
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
                    Mostrando <span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> de <span>{filtered.length}</span> alumnos
                  </div>
                  <div className="pagination-controls">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      if (totalPages <= 7 || p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                        return <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                      if (p === page - 2 || p === page + 2)
                        return <span key={p} className="page-dots">···</span>
                      return null
                    })}
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