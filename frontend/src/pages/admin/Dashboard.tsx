import { useState } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #0b1628;
          font-family: 'Lato', sans-serif;
          color: #fff;
        }

        /* ── Main area ── */
        .dash-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          min-width: 0;
          height: 100vh;
        }

        /* ── Topbar ── */
        .dash-topbar {
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
        }

        .dash-topbar-left h1 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #fff;
          font-weight: 600;
        }

        .dash-topbar-left p {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
          letter-spacing: 0.3px;
        }

        .dash-topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .topbar-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          position: relative;
        }

        .topbar-icon-btn:hover {
          background: rgba(192,160,80,0.12);
          color: #e8c96a;
          border-color: rgba(192,160,80,0.3);
        }

        .notif-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f76f6f;
          border: 1px solid #0b1628;
        }

        .topbar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(192,160,80,0.2);
          border: 1.5px solid rgba(192,160,80,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8c96a;
          font-size: 15px;
          cursor: pointer;
        }

        /* ── Content ── */
        .dash-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── Greeting banner ── */
        .dash-greeting {
          background: linear-gradient(135deg, rgba(192,160,80,0.15) 0%, rgba(79,142,247,0.08) 100%);
          border: 1px solid rgba(192,160,80,0.2);
          border-radius: 16px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeUp 0.5s ease both;
        }

        .greeting-text h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #e8c96a;
          margin-bottom: 4px;
        }

        .greeting-text p {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
        }

        .greeting-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #c0a050, #e8c96a);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(192,160,80,0.3);
        }

        .greeting-icon i {
          font-size: 24px;
          color: #0f1f3d;
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          animation: fadeUp 0.5s ease both;
          cursor: default;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.12);
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.4px;
        }

        .stat-change {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* ── Panels row ── */
        .panels-row {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          animation: fadeUp 0.5s ease 0.15s both;
        }

        @media (max-width: 900px) {
          .panels-row { grid-template-columns: 1fr; }
        }

        .panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .panel-header {
          padding: 18px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-header h3 {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-header h3 i {
          color: #e8c96a;
          font-size: 13px;
        }

        .panel-badge {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(192,160,80,0.15);
          color: #e8c96a;
          border: 1px solid rgba(192,160,80,0.3);
          font-weight: 700;
        }

        /* Table */
        .recent-table {
          width: 100%;
          border-collapse: collapse;
        }

        .recent-table th {
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 12px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .recent-table td {
          padding: 13px 22px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .recent-table tr:last-child td { border-bottom: none; }

        .recent-table tr:hover td {
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.9);
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .student-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(79,142,247,0.2);
          border: 1px solid rgba(79,142,247,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #4f8ef7;
          flex-shrink: 0;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Quick actions panel */
        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .quick-action-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 22px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          text-decoration: none;
        }

        .quick-action-item:last-child { border-bottom: none; }

        .quick-action-item:hover {
          background: rgba(255,255,255,0.04);
        }

        .qa-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .qa-text {
          flex: 1;
        }

        .qa-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }

        .qa-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 1px;
        }

        .qa-arrow {
          color: rgba(255,255,255,0.2);
          font-size: 12px;
        }

        .quick-action-item:hover .qa-arrow {
          color: #e8c96a;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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