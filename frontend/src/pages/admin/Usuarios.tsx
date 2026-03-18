import { useEffect, useState } from 'react'
import { getUsuarios } from '../../services/usuario.service'
import SidebarAdmin from '../../components/SidebarAdmin'
import { useNavigate } from 'react-router-dom'

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .usr-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #0b1628;
          font-family: 'Lato', sans-serif;
          color: #fff;
        }

        .usr-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
          min-width: 0;
        }

        /* Topbar */
        .usr-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(15,31,61,0.6);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
          gap: 16px;
        }

        .usr-topbar-left h1 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .usr-topbar-left h1 i { color: #e8c96a; font-size: 18px; }

        .usr-topbar-left p {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 3px;
        }

        .usr-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .search-wrap { position: relative; }

        .search-wrap i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          pointer-events: none;
        }

        .search-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 9px 14px 9px 36px;
          color: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          width: 220px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.25); }

        .search-input:focus {
          border-color: rgba(192,160,80,0.5);
          background: rgba(255,255,255,0.08);
        }

        .btn-crear {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: linear-gradient(135deg, #c0a050, #e8c96a);
          border: none;
          border-radius: 10px;
          color: #0f1f3d;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(192,160,80,0.3);
          white-space: nowrap;
        }

        .btn-crear:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(192,160,80,0.45);
        }

        .btn-crear:active { transform: translateY(0); }

        /* Content */
        .usr-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Summary chips */
        .summary-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .summary-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
        }

        /* ── Filter tabs ── */
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 5px;
          width: fit-content;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'Lato', sans-serif;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .filter-tab:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
        }

        .filter-tab.active-todos {
          background: rgba(255,255,255,0.09);
          color: #fff;
        }

        .filter-tab.active-ADMIN {
          background: rgba(232,201,106,0.15);
          color: #e8c96a;
        }

        .filter-tab.active-PORTERO {
          background: rgba(79,142,247,0.15);
          color: #4f8ef7;
        }

        .filter-count {
          font-size: 11px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
        }

        /* Table card */
        .table-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .table-card table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-card thead th {
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }

        .table-card tbody tr {
          transition: background 0.15s;
          animation: fadeUp 0.4s ease both;
        }

        .table-card tbody tr:hover { background: rgba(255,255,255,0.04); }

        .table-card tbody td {
          padding: 15px 24px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }

        .table-card tbody tr:last-child td { border-bottom: none; }

        .user-cell { display: flex; align-items: center; gap: 12px; }

        .user-avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .user-username { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .user-id       { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 1px; }

        .rol-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          margin-right: 6px;
        }

        .action-btn:hover {
          background: rgba(192,160,80,0.15);
          color: #e8c96a;
          border-color: rgba(192,160,80,0.35);
        }

        .action-btn.danger:hover {
          background: rgba(247,111,111,0.15);
          color: #f76f6f;
          border-color: rgba(247,111,111,0.35);
        }

        .empty-state {
          padding: 56px 24px;
          text-align: center;
          color: rgba(255,255,255,0.25);
        }

        .empty-state i    { font-size: 36px; margin-bottom: 12px; display: block; }
        .empty-state p    { font-size: 14px; }

        .skeleton-row td  { padding: 15px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); }

        .skeleton-bar {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Pagination ── */
        .pagination-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.01);
        }

        .pagination-info {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        .pagination-info span {
          color: rgba(255,255,255,0.65);
          font-weight: 600;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Lato', sans-serif;
          font-weight: 600;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .page-btn:hover:not(:disabled):not(.active) {
          background: rgba(255,255,255,0.07);
          color: #fff;
        }

        .page-btn.active {
          background: rgba(192,160,80,0.2);
          border-color: rgba(192,160,80,0.5);
          color: #e8c96a;
        }

        .page-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .page-dots {
          color: rgba(255,255,255,0.2);
          font-size: 12px;
          padding: 0 4px;
        }
      `}</style>

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