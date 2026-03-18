import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/admin',          icon: 'fa-gauge-high',    label: 'Dashboard' },
  { to: '/admin/usuarios', icon: 'fa-users-gear',    label: 'Usuarios'  },
  { to: '/admin/alumnos',  icon: 'fa-user-graduate', label: 'Alumnos'   },
  { to: '/admin/reportes', icon: 'fa-chart-bar',     label: 'Reportes'  },
]

export default function SidebarAdmin() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        .sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          align-self: flex-start;
          width: ${collapsed ? '72px' : '240px'};
          background: #0f1f3d;
          border-right: 1px solid rgba(192,160,80,0.18);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          font-family: 'Lato', sans-serif;
          position: relative;
          flex-shrink: 0;
          box-shadow: 4px 0 24px rgba(0,0,0,0.35);
        }

        /* Top brand area */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 18px 20px;
          border-bottom: 1px solid rgba(192,160,80,0.15);
          min-height: 76px;
          overflow: hidden;
        }

        .sidebar-brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c0a050, #e8c96a);
          box-shadow: 0 4px 12px rgba(192,160,80,0.35);
        }

        .sidebar-brand-icon i {
          font-size: 16px;
          color: #0f1f3d;
        }

        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s ease;
        }

        .sidebar-brand-title {
          font-size: 13px;
          font-weight: 700;
          color: #e8c96a;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .sidebar-brand-sub {
          font-size: 10px;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          padding: 16px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0 8px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          height: ${collapsed ? '0' : 'auto'};
          transition: opacity 0.2s ease;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.55);
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }

        .nav-link.active {
          background: rgba(192,160,80,0.15);
          color: #e8c96a;
          box-shadow: inset 3px 0 0 #e8c96a;
        }

        .nav-link i {
          font-size: 16px;
          min-width: 20px;
          text-align: center;
          transition: transform 0.2s;
        }

        .nav-link:hover i {
          transform: scale(1.1);
        }

        .nav-link-label {
          font-size: 13px;
          font-weight: 400;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease;
          letter-spacing: 0.3px;
        }

        /* Tooltip when collapsed */
        .nav-link .tooltip {
          display: none;
          position: absolute;
          left: 62px;
          background: #1a305c;
          color: #e8c96a;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(192,160,80,0.3);
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 100;
        }

        ${collapsed ? `.nav-link:hover .tooltip { display: block; }` : ''}

        /* Toggle button */
        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px 16px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          gap: 10px;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-toggle:hover {
          background: rgba(192,160,80,0.1);
          color: #e8c96a;
          border-color: rgba(192,160,80,0.3);
        }

        .sidebar-toggle i {
          font-size: 14px;
          min-width: 16px;
          transition: transform 0.3s ease;
          transform: ${collapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
        }

        .sidebar-toggle span {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease;
        }

        /* Bottom user area */
        .sidebar-footer {
          padding: 14px 10px;
          border-top: 1px solid rgba(192,160,80,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: rgba(192,160,80,0.2);
          border: 1px solid rgba(192,160,80,0.4);
          color: #e8c96a;
          font-size: 14px;
        }

        .user-info {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease;
          white-space: nowrap;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
        }

        .user-role {
          font-size: 10px;
          font-weight: 300;
          color: rgba(192,160,80,0.7);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <i className="fa-solid fa-school"></i>
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">Sistema Escolar</span>
            <span className="sidebar-brand-sub">Panel Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-label">Menú</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${isActive ? ' active' : ''}`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span className="nav-link-label">{item.label}</span>
                <span className="tooltip">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Toggle */}
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <i className="fa-solid fa-chevrons-left"></i>
          <span>Colapsar</span>
        </button>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-avatar">
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div className="user-info">
            <div className="user-name">Administrador</div>
            <div className="user-role">Admin</div>
          </div>
        </div>

      </div>
    </>
  )
}