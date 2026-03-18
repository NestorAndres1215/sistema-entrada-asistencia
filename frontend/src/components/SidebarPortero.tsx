import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/portero',            icon: 'fa-clipboard-check', label: 'Asistencia'   },
  { to: '/portero/historial',  icon: 'fa-clock-rotate-left', label: 'Historial'  },
]

export default function SidebarPortero() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        .sp-sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: ${collapsed ? '72px' : '240px'};
          background: #0f1f3d;
          border-right: 1px solid rgba(79,142,247,0.18);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          font-family: 'Lato', sans-serif;
          position: sticky;
          top: 0;
          align-self: flex-start;
          flex-shrink: 0;
          box-shadow: 4px 0 24px rgba(0,0,0,0.35);
        }

        /* Brand */
        .sp-brand {
          display: flex; align-items: center; gap: 12px;
          padding: 24px 18px 20px;
          border-bottom: 1px solid rgba(79,142,247,0.15);
          min-height: 76px; overflow: hidden;
        }
        .sp-brand-icon {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; min-width: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2a5cbf 0%, #4f8ef7 100%);
          box-shadow: 0 4px 12px rgba(79,142,247,0.35);
        }
        .sp-brand-icon i { font-size: 16px; color: #fff; }
        .sp-brand-text {
          display: flex; flex-direction: column; overflow: hidden;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s ease;
        }
        .sp-brand-title { font-size: 13px; font-weight: 700; color: #4f8ef7; letter-spacing: 0.5px; line-height: 1.2; }
        .sp-brand-sub   { font-size: 10px; font-weight: 300; color: rgba(255,255,255,0.35); letter-spacing: 1.5px; text-transform: uppercase; }

        /* Nav */
        .sp-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }

        .sp-nav-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.2); padding: 0 8px; margin-bottom: 4px; white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          height: ${collapsed ? '0' : 'auto'};
          transition: opacity 0.2s ease;
        }

        .sp-nav-link {
          display: flex; align-items: center; gap: 14px; padding: 11px 12px;
          border-radius: 10px; text-decoration: none; color: rgba(255,255,255,0.55);
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden; white-space: nowrap;
        }
        .sp-nav-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
        .sp-nav-link.active {
          background: rgba(79,142,247,0.15); color: #4f8ef7;
          box-shadow: inset 3px 0 0 #4f8ef7;
        }
        .sp-nav-link i { font-size: 16px; min-width: 20px; text-align: center; transition: transform 0.2s; }
        .sp-nav-link:hover i { transform: scale(1.1); }
        .sp-nav-link-label {
          font-size: 13px; font-weight: 400;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease; letter-spacing: 0.3px;
        }

        /* Tooltip when collapsed */
        .sp-nav-link .sp-tooltip {
          display: none; position: absolute; left: 62px;
          background: #1a305c; color: #4f8ef7; font-size: 12px; font-weight: 600;
          padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(79,142,247,0.3);
          white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          pointer-events: none; z-index: 100;
        }
        ${collapsed ? `.sp-nav-link:hover .sp-tooltip { display: block; }` : ''}

        /* Status badge */
        .sp-status {
          margin: 0 10px 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(79,207,142,0.08);
          border: 1px solid rgba(79,207,142,0.2);
          display: flex; align-items: center; gap: 10px;
          overflow: hidden; white-space: nowrap;
        }
        .sp-status-dot {
          width: 8px; height: 8px; min-width: 8px; border-radius: 50%;
          background: #4fcf8e;
          box-shadow: 0 0 6px rgba(79,207,142,0.8);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
        .sp-status-text {
          display: flex; flex-direction: column;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease;
        }
        .sp-status-title { font-size: 12px; font-weight: 700; color: #4fcf8e; }
        .sp-status-sub   { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }

        /* Toggle */
        .sp-toggle {
          display: flex; align-items: center; justify-content: center;
          margin: 0 10px 16px; padding: 10px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4); cursor: pointer;
          transition: background 0.2s, color 0.2s; gap: 10px; white-space: nowrap; overflow: hidden;
        }
        .sp-toggle:hover { background: rgba(79,142,247,0.12); color: #4f8ef7; border-color: rgba(79,142,247,0.3); }
        .sp-toggle i { font-size: 14px; min-width: 16px; transition: transform 0.3s ease; transform: ${collapsed ? 'rotate(180deg)' : 'rotate(0deg)'}; }
        .sp-toggle span { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s ease; }

        /* Footer */
        .sp-footer {
          padding: 14px 10px; border-top: 1px solid rgba(79,142,247,0.12);
          display: flex; align-items: center; gap: 12px; overflow: hidden;
        }
        .sp-avatar {
          width: 36px; height: 36px; min-width: 36px; border-radius: 50%;
          background: rgba(79,142,247,0.15); border: 1.5px solid rgba(79,142,247,0.4);
          color: #4f8ef7; display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .sp-user-info { overflow: hidden; opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s ease; white-space: nowrap; }
        .sp-user-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.8); }
        .sp-user-role { font-size: 10px; font-weight: 300; color: rgba(79,142,247,0.7); letter-spacing: 1px; text-transform: uppercase; }
      `}</style>

      <div className="sp-sidebar">

        {/* Brand */}
        <div className="sp-brand">
          <div className="sp-brand-icon">
            <i className="fa-solid fa-door-open"></i>
          </div>
          <div className="sp-brand-text">
            <span className="sp-brand-title">Sistema Escolar</span>
            <span className="sp-brand-sub">Portal Portero</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sp-nav">
          <div className="sp-nav-label">Menú</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`sp-nav-link${isActive ? ' active' : ''}`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span className="sp-nav-link-label">{item.label}</span>
                <span className="sp-tooltip">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Status indicator */}
        <div className="sp-status">
          <div className="sp-status-dot"></div>
          <div className="sp-status-text">
            <div className="sp-status-title">Sistema activo</div>
            <div className="sp-status-sub">Registrando asistencia</div>
          </div>
        </div>

        {/* Toggle */}
        <button className="sp-toggle" onClick={() => setCollapsed(!collapsed)}>
          <i className="fa-solid fa-chevrons-left"></i>
          <span>Colapsar</span>
        </button>

        {/* Footer */}
        <div className="sp-footer">
          <div className="sp-avatar">
            <i className="fa-solid fa-door-open"></i>
          </div>
          <div className="sp-user-info">
            <div className="sp-user-name">Portero</div>
            <div className="sp-user-role">Acceso limitado</div>
          </div>
        </div>

      </div>
    </>
  )
}