import { useState, useCallback } from 'react'
import QRScanner from '../../components/QRScanner'
import SidebarPortero from '../../components/SidebarPortero'
import { registrarAsistencia } from '../../services/asistencia.service'
import '../../styles/asistencia.css'
type ScanStatus = 'idle' | 'success' | 'error' | 'loading'

interface ScanRecord {
  codigo: string
  hora: string
  estado: 'success' | 'error'
  mensaje?: string
}

export default function Asistencia() {
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [lastCode, setLastCode] = useState<string>('')
const [_lastRecord, setLastRecord] = useState<ScanRecord | null>(null)
  const [historial, setHistorial] = useState<ScanRecord[]>([])
  const [totalHoy, setTotalHoy] = useState(0)

  const handleScan = useCallback(async (data: string) => {
    if (!data || status === 'loading') return

    setLastCode(data)
    setStatus('loading')

    try {
      await registrarAsistencia({ codigo: data, tipo_registro: 'QR' })

      const record: ScanRecord = {
        codigo: data,
        hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        estado: 'success',
        mensaje: 'Asistencia registrada',
      }

      setLastRecord(record)
      setHistorial(h => [record, ...h].slice(0, 10))
      setTotalHoy(t => t + 1)
      setStatus('success')
    } catch {
      const record: ScanRecord = {
        codigo: data,
        hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        estado: 'error',
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
    idle: { color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)', border: 'rgba(79,142,247,0.25)', icon: 'fa-qrcode', text: 'Listo para escanear' },
    loading: { color: '#e8c96a', bg: 'rgba(232,201,106,0.1)', border: 'rgba(232,201,106,0.25)', icon: 'fa-circle-notch', text: 'Registrando...' },
    success: { color: '#4fcf8e', bg: 'rgba(79,207,142,0.1)', border: 'rgba(79,207,142,0.25)', icon: 'fa-circle-check', text: '¡Asistencia registrada!' },
    error: { color: '#f76f6f', bg: 'rgba(247,111,111,0.1)', border: 'rgba(247,111,111,0.25)', icon: 'fa-circle-xmark', text: 'Error al registrar' },
  }

  const cfg = statusConfig[status]

  return (
    <>
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