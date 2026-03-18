import { useState } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'

// ── Mock data ────────────────────────────────────────────────────
const ASISTENCIA_SEMANAL = [
  { dia: 'Lun', presentes: 88, ausentes: 12, tarde: 5  },
  { dia: 'Mar', presentes: 92, ausentes: 8,  tarde: 3  },
  { dia: 'Mié', presentes: 85, ausentes: 15, tarde: 7  },
  { dia: 'Jue', presentes: 94, ausentes: 6,  tarde: 2  },
  { dia: 'Vie', presentes: 78, ausentes: 22, tarde: 9  },
]

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const ASISTENCIA_MENSUAL = [82, 85, 88, 79, 91, 94, 88, 86, 90, 87, 93, 89]

const RECIENTES = [
  { nombre: 'María García',   codigo: 'ALU-001', estado: 'Presente', hora: '07:45' },
  { nombre: 'Luis Pérez',     codigo: 'ALU-002', estado: 'Tarde',    hora: '08:22' },
  { nombre: 'Ana Torres',     codigo: 'ALU-003', estado: 'Presente', hora: '07:38' },
  { nombre: 'Carlos Mendoza', codigo: 'ALU-004', estado: 'Ausente',  hora: '—'    },
  { nombre: 'Sofía Ramírez',  codigo: 'ALU-005', estado: 'Presente', hora: '07:51' },
  { nombre: 'Diego López',    codigo: 'ALU-006', estado: 'Tarde',    hora: '08:15' },
]

const STATS = [
  { label: 'Asistencia hoy',   value: '94%',  sub: '+2% vs ayer',       icon: 'fa-circle-check',    color: '#4fcf8e' },
  { label: 'Alumnos presentes',value: '318',  sub: 'de 338 en total',    icon: 'fa-user-check',      color: '#4f8ef7' },
  { label: 'Tardanzas',        value: '11',   sub: 'registradas hoy',    icon: 'fa-clock',           color: '#e8c96a' },
  { label: 'Ausencias',        value: '20',   sub: '5.9% del total',     icon: 'fa-user-xmark',      color: '#f76f6f' },
]

const estadoStyle: Record<string, { color: string; bg: string }> = {
  Presente: { color: '#4fcf8e', bg: 'rgba(79,207,142,0.12)' },
  Tarde:    { color: '#e8c96a', bg: 'rgba(232,201,106,0.12)' },
  Ausente:  { color: '#f76f6f', bg: 'rgba(247,111,111,0.12)' },
}

// ── Bar chart helper ──────────────────────────────────────────────
function BarChart() {
  const max = Math.max(...ASISTENCIA_SEMANAL.map(d => d.presentes))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, padding: '0 4px' }}>
      {ASISTENCIA_SEMANAL.map((d) => (
        <div key={d.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{d.presentes}%</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <div style={{
              width: '100%', borderRadius: '6px 6px 0 0',
              height: `${(d.presentes / max) * 80}px`,
              background: 'linear-gradient(180deg, #4f8ef7 0%, rgba(79,142,247,0.6) 100%)',
              transition: 'height 0.5s ease',
            }} />
            <div style={{
              width: '100%', height: `${(d.tarde / max) * 20}px`,
              background: 'rgba(232,201,106,0.7)',
              minHeight: 3,
            }} />
            <div style={{
              width: '100%', height: `${(d.ausentes / max) * 20}px`,
              background: 'rgba(247,111,111,0.6)',
              borderRadius: '0 0 4px 4px', minHeight: 3,
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{d.dia}</div>
        </div>
      ))}
    </div>
  )
}

// ── Sparkline for monthly ─────────────────────────────────────────
function Sparkline() {
  const w = 100, h = 40
  const min = Math.min(...ASISTENCIA_MENSUAL)
  const max = Math.max(...ASISTENCIA_MENSUAL)
  const pts = ASISTENCIA_MENSUAL.map((v, i) => {
    const x = (i / (ASISTENCIA_MENSUAL.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * (h - 6) - 3
    return `${x},${y}`
  }).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 40 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fcf8e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4fcf8e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke="#4fcf8e" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ── Donut chart ───────────────────────────────────────────────────
function Donut() {
  const total = 338, presentes = 318, tardes = 11, ausentes = 9
  const r = 36, cx = 44, cy = 44, circ = 2 * Math.PI * r
  const pPres = (presentes / total) * circ
  const pTard = (tardes / total) * circ
  const pAus  = (ausentes / total) * circ
  const gap = 2
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#4fcf8e" strokeWidth={10}
        strokeDasharray={`${pPres - gap} ${circ - pPres + gap}`}
        strokeDashoffset={circ / 4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8c96a" strokeWidth={10}
        strokeDasharray={`${pTard - gap} ${circ - pTard + gap}`}
        strokeDashoffset={circ / 4 - pPres} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f76f6f" strokeWidth={10}
        strokeDasharray={`${pAus - gap} ${circ - pAus + gap}`}
        strokeDashoffset={circ / 4 - pPres - pTard} strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700} fontFamily="Lato">94%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="Lato">asistencia</text>
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function Reportes() {
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes'>('semana')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rep-root { display:flex; height:100vh; overflow:hidden; background:#0b1628; font-family:'Lato',sans-serif; color:#fff; }
        .rep-main  { flex:1; display:flex; flex-direction:column; overflow-y:auto; height:100vh; min-width:0; }

        /* Topbar */
        .rep-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 32px; border-bottom:1px solid rgba(255,255,255,0.06);
          background:rgba(15,31,61,0.6); backdrop-filter:blur(10px);
          position:sticky; top:0; z-index:10; gap:16px;
        }
        .rep-topbar h1 { font-family:'Playfair Display',serif; font-size:22px; color:#fff; font-weight:600; display:flex; align-items:center; gap:10px; }
        .rep-topbar h1 i { color:#e8c96a; font-size:18px; }
        .rep-topbar p { font-size:12px; color:rgba(255,255,255,0.35); margin-top:3px; }

        .topbar-actions { display:flex; gap:10px; flex-shrink:0; }

        .btn-export {
          display:flex; align-items:center; gap:8px; padding:9px 16px;
          border-radius:10px; font-family:'Lato',sans-serif; font-size:13px; font-weight:600;
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .btn-export.outline {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.55);
        }
        .btn-export.outline:hover { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.2); }
        .btn-export.gold {
          background:linear-gradient(135deg,#c0a050,#e8c96a); border:none; color:#0f1f3d;
          box-shadow:0 4px 14px rgba(192,160,80,0.3);
        }
        .btn-export.gold:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(192,160,80,0.45); }

        /* Content */
        .rep-content { padding:28px 32px; display:flex; flex-direction:column; gap:22px; animation:fadeUp 0.4s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        /* Stats grid */
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        @media(max-width:900px){ .stats-grid{ grid-template-columns:repeat(2,1fr); } }

        .stat-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
          border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:10px;
          transition:transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor:default;
          animation:fadeUp 0.5s ease both;
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.3); border-color:rgba(255,255,255,0.12); }
        .stat-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:16px; }
        .stat-value { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#fff; line-height:1; }
        .stat-label { font-size:12px; color:rgba(255,255,255,0.45); }
        .stat-sub   { font-size:11px; color:rgba(255,255,255,0.25); display:flex; align-items:center; gap:5px; }

        /* Charts row */
        .charts-row { display:grid; grid-template-columns:1fr 1fr 280px; gap:16px; }
        @media(max-width:1100px){ .charts-row{ grid-template-columns:1fr 1fr; } }

        .chart-card {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; overflow:hidden;
        }
        .chart-header {
          padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:center; justify-content:space-between;
        }
        .chart-header h3 { font-size:13px; font-weight:700; color:rgba(255,255,255,0.8); display:flex; align-items:center; gap:8px; }
        .chart-header h3 i { color:#e8c96a; font-size:12px; }
        .chart-badge {
          font-size:11px; padding:3px 9px; border-radius:20px;
          background:rgba(192,160,80,0.12); color:#e8c96a;
          border:1px solid rgba(192,160,80,0.25); font-weight:700;
        }
        .chart-body { padding:20px; }

        /* Tab switcher */
        .tab-bar {
          display:flex; gap:4px; background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:4px; width:fit-content;
        }
        .tab-btn {
          padding:6px 14px; border-radius:7px; border:none; background:transparent;
          color:rgba(255,255,255,0.4); font-family:'Lato',sans-serif; font-size:12px; font-weight:600;
          cursor:pointer; transition:all 0.2s;
        }
        .tab-btn.active { background:rgba(192,160,80,0.2); color:#e8c96a; }
        .tab-btn:hover:not(.active) { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.7); }

        /* Chart bar legend */
        .chart-legend { display:flex; gap:14px; margin-top:12px; }
        .legend-item  { display:flex; align-items:center; gap:6px; font-size:11px; color:rgba(255,255,255,0.4); }
        .legend-dot   { width:8px; height:8px; border-radius:2px; }

        /* Monthly sparkline */
        .month-grid { display:flex; gap:4px; flex-wrap:wrap; margin-top:4px; }
        .month-item { flex:1; text-align:center; font-size:10px; color:rgba(255,255,255,0.3); min-width:20px; }

        /* Donut card */
        .donut-card { display:flex; flex-direction:column; gap:16px; }
        .donut-row  { display:flex; align-items:center; gap:16px; }
        .donut-legend { display:flex; flex-direction:column; gap:8px; }
        .donut-legend-item { display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .donut-legend-left { display:flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,0.5); }
        .donut-legend-dot  { width:10px; height:10px; border-radius:3px; flex-shrink:0; }
        .donut-legend-val  { font-size:13px; font-weight:700; color:rgba(255,255,255,0.8); }

        /* Table panel */
        .table-panel { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
        .table-panel table { width:100%; border-collapse:collapse; }
        .table-panel thead th {
          text-align:left; font-size:10px; font-weight:700; letter-spacing:1.5px;
          text-transform:uppercase; color:rgba(255,255,255,0.25); padding:13px 20px;
          border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02);
        }
        .table-panel tbody tr { transition:background 0.15s; }
        .table-panel tbody tr:hover { background:rgba(255,255,255,0.03); }
        .table-panel tbody td {
          padding:12px 20px; font-size:12px; color:rgba(255,255,255,0.6);
          border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .table-panel tbody tr:last-child td { border-bottom:none; }

        .status-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
        }
        .status-dot { width:5px; height:5px; border-radius:50%; }

        .hora-badge {
          font-family:monospace; font-size:12px; padding:3px 8px; border-radius:6px;
          background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.4);
        }
      `}</style>

      <div className="rep-root">
        <SidebarAdmin />

        <div className="rep-main">
          {/* Topbar */}
          <div className="rep-topbar">
            <div>
              <h1><i className="fa-solid fa-chart-bar"></i> Reportes</h1>
              <p>Resumen de asistencia y estadísticas del colegio</p>
            </div>
            <div className="topbar-actions">
              <button className="btn-export outline">
                <i className="fa-solid fa-file-csv"></i> Exportar CSV
              </button>
              <button className="btn-export gold">
                <i className="fa-solid fa-file-pdf"></i> Exportar PDF
              </button>
            </div>
          </div>

          <div className="rep-content">

            {/* Stats */}
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                  <div className="stat-sub">
                    <i className="fa-solid fa-arrow-trend-up" style={{ color: '#4fcf8e', fontSize: 10 }}></i>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="charts-row">

              {/* Bar chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3><i className="fa-solid fa-chart-column"></i> Asistencia semanal</h3>
                  <span className="chart-badge">Esta semana</span>
                </div>
                <div className="chart-body">
                  <BarChart />
                  <div className="chart-legend">
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#4f8ef7' }}></div>Presentes</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#e8c96a' }}></div>Tarde</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#f76f6f' }}></div>Ausentes</div>
                  </div>
                </div>
              </div>

              {/* Sparkline mensual */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3><i className="fa-solid fa-chart-line"></i> Tendencia mensual</h3>
                  <span className="chart-badge">2024</span>
                </div>
                <div className="chart-body">
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 26, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#4fcf8e' }}>
                      {Math.round(ASISTENCIA_MENSUAL.reduce((a,b)=>a+b,0)/ASISTENCIA_MENSUAL.length)}%
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>promedio anual</span>
                  </div>
                  <Sparkline />
                  <div className="month-grid" style={{ marginTop: 8 }}>
                    {MESES.map((m) => (
                      <div key={m} className="month-item">{m}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Donut */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3><i className="fa-solid fa-chart-pie"></i> Distribución hoy</h3>
                </div>
                <div className="chart-body">
                  <div className="donut-card">
                    <div className="donut-row">
                      <Donut />
                      <div className="donut-legend">
                        {[
                          { label: 'Presentes', val: '318', color: '#4fcf8e' },
                          { label: 'Tardanzas', val: '11',  color: '#e8c96a' },
                          { label: 'Ausentes',  val: '9',   color: '#f76f6f' },
                        ].map(d => (
                          <div key={d.label} className="donut-legend-item">
                            <div className="donut-legend-left">
                              <div className="donut-legend-dot" style={{ background: d.color }}></div>
                              {d.label}
                            </div>
                            <div className="donut-legend-val">{d.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent table */}
            <div className="table-panel">
              <div className="chart-header" style={{ padding: '16px 20px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fa-solid fa-clock-rotate-left" style={{ color: '#e8c96a', fontSize: 12 }}></i>
                  Últimos registros de hoy
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="tab-bar">
                    {(['hoy','semana','mes'] as const).map(t => (
                      <button key={t} className={`tab-btn${activeTab===t?' active':''}`} onClick={() => setActiveTab(t)}>
                        {t.charAt(0).toUpperCase()+t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Estado</th>
                    <th>Hora entrada</th>
                  </tr>
                </thead>
                <tbody>
                  {RECIENTES.map((r, i) => {
                    const st = estadoStyle[r.estado]
                    return (
                      <tr key={i}>
                        <td style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{r.nombre}</td>
                        <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{r.codigo}</span></td>
                        <td>
                          <span className="status-pill" style={{ background: st.bg, color: st.color }}>
                            <span className="status-dot" style={{ background: st.color }}></span>
                            {r.estado}
                          </span>
                        </td>
                        <td><span className="hora-badge">{r.hora}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}