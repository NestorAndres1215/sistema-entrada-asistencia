import { useState } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'
import '../../styles/dashboard.css'
const stats = [
  { icon: 'fa-user-graduate', label: 'Alumnos',       value: '342',  change: '+12 este mes',  color: '#4f8ef7' },
  { icon: 'fa-users',         label: 'Usuarios',      value: '28',   change: '+2 este mes',   color: '#e8c96a' },
  { icon: 'fa-chart-line',    label: 'Asistencia',    value: '94%',  change: '+1% esta semana', color: '#4fcf8e' },
  { icon: 'fa-bell',          label: 'Notificaciones',value: '7',    change: '3 sin leer',    color: '#f76f6f' },
]

const recent = [
  { name: 'María García',    grade: '3° Primaria', status: 'Presente', avatar: 'MG' },
  { name: 'Luis Pérez',      grade: '5° Primaria', status: 'Tarde',    avatar: 'LP' },
  { name: 'Ana Torres',      grade: '1° Secundaria', status: 'Presente', avatar: 'AT' },
  { name: 'Carlos Mendoza',  grade: '2° Secundaria', status: 'Ausente',  avatar: 'CM' },
  { name: 'Sofía Ramírez',   grade: '4° Primaria', status: 'Presente', avatar: 'SR' },
]

const statusColor: Record<string, string> = {
  Presente: '#4fcf8e',
  Tarde:    '#e8c96a',
  Ausente:  '#f76f6f',
}

export default function Dashboard() {
  const [greeting] = useState(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  })

  return (
    <>
      <div className="dash-root">
        <SidebarAdmin />

        <div className="dash-main">
          {/* Topbar */}
          <div className="dash-topbar">
            <div className="dash-topbar-left">
              <h1>Panel Administrativo</h1>
              <p>{new Date().toLocaleDateString('es-PE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
            </div>
            <div className="dash-topbar-right">
              <div className="topbar-icon-btn">
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 14 }}></i>
              </div>
              <div className="topbar-icon-btn">
                <i className="fa-solid fa-bell" style={{ fontSize: 14 }}></i>
                <span className="notif-dot"></span>
              </div>
              <div className="topbar-avatar">
                <i className="fa-solid fa-user-tie"></i>
              </div>
            </div>
          </div>

          <div className="dash-content">
            {/* Greeting */}
            <div className="dash-greeting">
              <div className="greeting-text">
                <h2>{greeting}, Administrador 👋</h2>
                <p>Aquí tienes el resumen del día de hoy</p>
              </div>
              <div className="greeting-icon">
                <i className="fa-solid fa-school"></i>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="stat-card-top">
                    <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                  </div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                  <div className="stat-change">
                    <i className="fa-solid fa-arrow-trend-up" style={{ color: '#4fcf8e', fontSize: 10 }}></i>
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Panels */}
            <div className="panels-row">
              {/* Recent students */}
              <div className="panel">
                <div className="panel-header">
                  <h3><i className="fa-solid fa-clock-rotate-left"></i> Actividad Reciente</h3>
                  <span className="panel-badge">Hoy</span>
                </div>
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>Alumno</th>
                      <th>Grado</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.name}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">{r.avatar}</div>
                            {r.name}
                          </div>
                        </td>
                        <td>{r.grade}</td>
                        <td>
                          <span
                            className="status-pill"
                            style={{
                              background: `${statusColor[r.status]}18`,
                              color: statusColor[r.status],
                              border: `1px solid ${statusColor[r.status]}44`,
                            }}
                          >
                            <span className="status-dot" style={{ background: statusColor[r.status] }}></span>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick actions */}
              <div className="panel">
                <div className="panel-header">
                  <h3><i className="fa-solid fa-bolt"></i> Acciones Rápidas</h3>
                </div>
                <div className="quick-actions">
                  {[
                    { icon: 'fa-user-plus',    color: '#4f8ef7', title: 'Nuevo Alumno',    sub: 'Registrar alumno',     to: '/admin/alumnos'  },
                    { icon: 'fa-user-gear',    color: '#e8c96a', title: 'Nuevo Usuario',   sub: 'Crear cuenta',         to: '/admin/usuarios' },
                    { icon: 'fa-file-lines',   color: '#4fcf8e', title: 'Ver Reportes',    sub: 'Asistencia y más',     to: '/admin/reportes' },
                    { icon: 'fa-gear',         color: '#f7a24f', title: 'Configuración',   sub: 'Ajustes del sistema',  to: '/admin/config'   },
                  ].map((a) => (
                    <a href={a.to} className="quick-action-item" key={a.title}>
                      <div className="qa-icon" style={{ background: `${a.color}18`, color: a.color }}>
                        <i className={`fa-solid ${a.icon}`}></i>
                      </div>
                      <div className="qa-text">
                        <div className="qa-title">{a.title}</div>
                        <div className="qa-sub">{a.sub}</div>
                      </div>
                      <i className="fa-solid fa-chevron-right qa-arrow"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}