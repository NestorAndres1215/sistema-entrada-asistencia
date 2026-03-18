import { useState, useCallback } from 'react'
import QRScanner from '../../components/QRScanner'
import SidebarPortero from '../../components/SidebarPortero'
import { registrarAsistencia } from '../../services/asistencia.service'

type ScanStatus = 'idle' | 'success' | 'error' | 'loading'

interface ScanRecord {
  codigo: string
  hora: string
  estado: 'success' | 'error'
  mensaje?: string
}

export default function Asistencia() {
  const [status, setStatus]       = useState<ScanStatus>('idle')
  const [lastCode, setLastCode]   = useState<string>('')
  const [lastRecord, setLastRecord] = useState<ScanRecord | null>(null)
  const [historial, setHistorial] = useState<ScanRecord[]>([])
  const [totalHoy, setTotalHoy]   = useState(0)

  const handleScan = useCallback(async (data: string) => {
    if (!data || status === 'loading') return

    setLastCode(data)
    setStatus('loading')

    try {
      await registrarAsistencia({ codigo: data, tipo_registro: 'QR' })

      const record: ScanRecord = {
        codigo:  data,
        hora:    new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        estado:  'success',
        mensaje: 'Asistencia registrada',
      }

      setLastRecord(record)
      setHistorial(h => [record, ...h].slice(0, 10))
      setTotalHoy(t => t + 1)
      setStatus('success')
    } catch {
      const record: ScanRecord = {
        codigo:  data,
        hora:    new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        estado:  'error',
        mensaje: 'Error al registrar',
      }
      setLastRecord(record)
      setHistorial(h => [record, ...h].slice(0, 10))
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [status])

  const statusConfig = {
    idle:    { color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)',  border: 'rgba(79,142,247,0.25)',  icon: 'fa-qrcode',         text: 'Listo para escanear' },
    loading: { color: '#e8c96a', bg: 'rgba(232,201,106,0.1)', border: 'rgba(232,201,106,0.25)', icon: 'fa-circle-notch',   text: 'Registrando...'      },
    success: { color: '#4fcf8e', bg: 'rgba(79,207,142,0.1)',  border: 'rgba(79,207,142,0.25)',  icon: 'fa-circle-check',   text: '¡Asistencia registrada!' },
    error:   { color: '#f76f6f', bg: 'rgba(247,111,111,0.1)', border: 'rgba(247,111,111,0.25)', icon: 'fa-circle-xmark',   text: 'Error al registrar'  },
  }

  const cfg = statusConfig[status]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .as-root { display:flex; height:100vh; overflow:hidden; background:#0b1628; font-family:'Lato',sans-serif; color:#fff; }
        .as-main  { flex:1; display:flex; flex-direction:column; overflow-y:auto; height:100vh; min-width:0; }

        /* Topbar */
        .as-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 32px; border-bottom:1px solid rgba(255,255,255,0.06);
          background:rgba(15,31,61,0.6); backdrop-filter:blur(10px);
          position:sticky; top:0; z-index:10; gap:16px;
        }
        .as-topbar h1 { font-family:'Playfair Display',serif; font-size:22px; color:#fff; font-weight:600; display:flex; align-items:center; gap:10px; }
        .as-topbar h1 i { color:#4f8ef7; font-size:18px; }
        .as-topbar p { font-size:12px; color:rgba(255,255,255,0.35); margin-top:3px; }

        .topbar-chip {
          display:flex; align-items:center; gap:8px; padding:8px 16px;
          border-radius:10px; font-size:13px; font-weight:600; border:1px solid;
          background:rgba(79,207,142,0.08); border-color:rgba(79,207,142,0.25); color:#4fcf8e;
          flex-shrink:0;
        }
        .topbar-chip-dot { width:7px; height:7px; border-radius:50%; background:#4fcf8e; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        /* Content */
        .as-content { padding:28px 32px; display:flex; gap:24px; animation:fadeUp 0.4s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        /* Left col */
        .as-left { display:flex; flex-direction:column; gap:16px; flex:1; min-width:0; }

        /* Status banner */
        .status-banner {
          display:flex; align-items:center; gap:16px; padding:16px 20px;
          border-radius:14px; border:1px solid; transition:all 0.4s ease;
        }
        .status-icon-wrap {
          width:44px; height:44px; border-radius:12px; display:flex; align-items:center;
          justify-content:center; font-size:20px; flex-shrink:0;
        }
        .status-text-title { font-size:15px; font-weight:700; }
        .status-text-sub   { font-size:12px; opacity:0.6; margin-top:2px; }
        .spin { animation:spin 0.8s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* Scanner card */
        .scanner-card {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; overflow:hidden;
        }
        .scanner-card-header {
          padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.02);
        }
        .scanner-card-header i   { color:#4f8ef7; font-size:13px; }
        .scanner-card-header span { font-size:12px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,0.5); }
        .scanner-card-body { padding:20px; display:flex; justify-content:center; }

        /* Scanner wrapper — decorative frame */
        .scanner-frame {
          position:relative; border-radius:16px; overflow:hidden;
          border:2px solid rgba(79,142,247,0.3);
          box-shadow:0 0 30px rgba(79,142,247,0.12), inset 0 0 20px rgba(79,142,247,0.04);
          width:100%; max-width:360px;
        }
        .scanner-frame::before, .scanner-frame::after {
          content:''; position:absolute; width:24px; height:24px; z-index:2;
          border-color:#4f8ef7; border-style:solid;
        }
        .scanner-frame::before { top:8px; left:8px; border-width:3px 0 0 3px; border-radius:4px 0 0 0; }
        .scanner-frame::after  { bottom:8px; right:8px; border-width:0 3px 3px 0; border-radius:0 0 4px 0; }

        /* Corner extras via wrapper */
        .scanner-corners::before, .scanner-corners::after {
          content:''; position:absolute; width:24px; height:24px; z-index:2;
          border-color:#4f8ef7; border-style:solid;
        }
        .scanner-corners::before { top:8px; right:8px; border-width:3px 3px 0 0; border-radius:0 4px 0 0; }
        .scanner-corners::after  { bottom:8px; left:8px; border-width:0 0 3px 3px; border-radius:0 0 0 4px; }

        /* Scan line animation */
        .scan-line {
          position:absolute; left:10px; right:10px; height:2px; z-index:3;
          background:linear-gradient(90deg, transparent, #4f8ef7, transparent);
          animation:scanMove 2s ease-in-out infinite;
          box-shadow:0 0 8px rgba(79,142,247,0.8);
        }
        @keyframes scanMove {
          0%   { top:12px;   opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { top:calc(100% - 12px); opacity:0; }
        }

        /* Stats row */
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .mini-stat {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; gap:6px;
        }
        .mini-stat-val   { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; }
        .mini-stat-label { font-size:11px; color:rgba(255,255,255,0.4); }

        /* Right col — historial */
        .as-right { width:280px; flex-shrink:0; display:flex; flex-direction:column; gap:16px; }

        .historial-card {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; overflow:hidden; flex:1;
        }
        .historial-header {
          padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.06);
          background:rgba(255,255,255,0.02); display:flex; align-items:center; justify-content:space-between;
        }
        .historial-title { font-size:13px; font-weight:700; color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:8px; }
        .historial-title i { color:#4f8ef7; font-size:12px; }
        .historial-count { font-size:11px; padding:2px 8px; border-radius:20px; background:rgba(79,142,247,0.15); color:#4f8ef7; font-weight:700; border:1px solid rgba(79,142,247,0.25); }

        .historial-empty { padding:32px 18px; text-align:center; color:rgba(255,255,255,0.2); }
        .historial-empty i { font-size:28px; display:block; margin-bottom:10px; }
        .historial-empty p { font-size:13px; }

        .historial-list { display:flex; flex-direction:column; }
        .historial-item {
          display:flex; align-items:center; gap:12px; padding:12px 18px;
          border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s;
          animation:fadeUp 0.3s ease both;
        }
        .historial-item:last-child { border-bottom:none; }
        .historial-item:hover { background:rgba(255,255,255,0.03); }

        .hi-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
        .hi-code { font-size:12px; font-weight:700; color:rgba(255,255,255,0.75); font-family:monospace; }
        .hi-hora { font-size:10px; color:rgba(255,255,255,0.3); margin-top:1px; }
        .hi-right { margin-left:auto; font-size:10px; font-weight:700; padding:2px 8px; border-radius:6px; }
      `}</style>

      <div className="as-root">
        <SidebarPortero />

        <div className="as-main">
          {/* Topbar */}
          <div className="as-topbar">
            <div>
              <h1><i className="fa-solid fa-qrcode"></i> Escaneo QR</h1>
              <p>Registro de asistencia por código QR</p>
            </div>
            <div className="topbar-chip">
              <div className="topbar-chip-dot"></div>
              {totalHoy} registros hoy
            </div>
          </div>

          <div className="as-content">
            {/* LEFT */}
            <div className="as-left">

              {/* Status banner */}
              <div className="status-banner" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                <div className="status-icon-wrap" style={{ background: `${cfg.color}18` }}>
                  <i className={`fa-solid ${cfg.icon}${status === 'loading' ? ' spin' : ''}`}></i>
                </div>
                <div>
                  <div className="status-text-title" style={{ color: cfg.color }}>{cfg.text}</div>
                  <div className="status-text-sub" style={{ color: cfg.color }}>
                    {lastCode
                      ? <>Último código: <strong style={{ fontFamily: 'monospace' }}>{lastCode}</strong></>
                      : 'Acerca el QR del alumno a la cámara'}
                  </div>
                </div>
              </div>

              {/* Scanner */}
              <div className="scanner-card">
                <div className="scanner-card-header">
                  <i className="fa-solid fa-camera"></i>
                  <span>Cámara activa</span>
                </div>
                <div className="scanner-card-body">
                  <div className="scanner-frame">
                    <div className="scanner-corners"></div>
                    <div className="scan-line"></div>
                    <QRScanner onScan={handleScan} />
                  </div>
                </div>
              </div>

              {/* Mini stats */}
              <div className="stats-row">
                <div className="mini-stat">
                  <div className="mini-stat-val" style={{ color: '#4fcf8e' }}>{totalHoy}</div>
                  <div className="mini-stat-label"><i className="fa-solid fa-circle-check" style={{ marginRight: 5 }}></i>Registrados hoy</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-val" style={{ color: '#f76f6f' }}>{historial.filter(h => h.estado === 'error').length}</div>
                  <div className="mini-stat-label"><i className="fa-solid fa-circle-xmark" style={{ marginRight: 5 }}></i>Errores</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-val" style={{ color: '#4f8ef7' }}>
                    {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="mini-stat-label"><i className="fa-solid fa-clock" style={{ marginRight: 5 }}></i>Hora actual</div>
                </div>
              </div>

            </div>

            {/* RIGHT — historial */}
            <div className="as-right">
              <div className="historial-card">
                <div className="historial-header">
                  <div className="historial-title">
                    <i className="fa-solid fa-list-check"></i> Últimos escaneos
                  </div>
                  <span className="historial-count">{historial.length}</span>
                </div>

                {historial.length === 0 ? (
                  <div className="historial-empty">
                    <i className="fa-solid fa-qrcode"></i>
                    <p>Aún no hay registros en esta sesión</p>
                  </div>
                ) : (
                  <div className="historial-list">
                    {historial.map((h, i) => (
                      <div key={i} className="historial-item" style={{ animationDelay: `${i * 0.03}s` }}>
                        <div className="hi-icon" style={{
                          background: h.estado === 'success' ? 'rgba(79,207,142,0.12)' : 'rgba(247,111,111,0.12)',
                          color: h.estado === 'success' ? '#4fcf8e' : '#f76f6f',
                        }}>
                          <i className={`fa-solid ${h.estado === 'success' ? 'fa-check' : 'fa-xmark'}`}></i>
                        </div>
                        <div>
                          <div className="hi-code">{h.codigo}</div>
                          <div className="hi-hora">{h.hora}</div>
                        </div>
                        <div className="hi-right" style={{
                          background: h.estado === 'success' ? 'rgba(79,207,142,0.1)' : 'rgba(247,111,111,0.1)',
                          color: h.estado === 'success' ? '#4fcf8e' : '#f76f6f',
                        }}>
                          {h.estado === 'success' ? 'OK' : 'ERR'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}