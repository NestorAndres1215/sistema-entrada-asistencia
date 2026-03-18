import { useEffect, useState } from 'react'
import { getAlumnos } from '../../services/alumno.service'
import SidebarAdmin from '../../components/SidebarAdmin'
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 10

function getInitials(nombre: string, apellido: string) {
  return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase()
}

const COLORS = ['#4f8ef7','#e8c96a','#4fcf8e','#f7a24f','#c47ef7','#f76f6f']
function avatarColor(id: number) { return COLORS[id % COLORS.length] }

// ── Genera y descarga el PDF con el QR que viene del backend ──────
async function descargarQRPdf(alumno: {
  nombre: string
  apellido: string
  codigo: string
  qr_code: string  // base64 longtext desde el backend
}) {
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm' as any)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 110] })

  // Fondo
  doc.setFillColor(11, 22, 40)
  doc.rect(0, 0, 80, 110, 'F')

  // Header
  doc.setFillColor(15, 31, 61)
  doc.roundedRect(4, 4, 72, 22, 3, 3, 'F')

  doc.setTextColor(232, 201, 106)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SISTEMA ESCOLAR', 40, 12, { align: 'center' })

  doc.setTextColor(160, 175, 200)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text('CARNET DE ESTUDIANTE', 40, 18, { align: 'center' })

  // Nombre
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`${alumno.nombre} ${alumno.apellido}`, 40, 33, { align: 'center', maxWidth: 68 })

  // Badge código
  doc.setFillColor(25, 45, 80)
  doc.roundedRect(16, 37, 48, 8, 2, 2, 'F')
  doc.setTextColor(232, 201, 106)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(alumno.codigo, 40, 42.5, { align: 'center' })

  // QR — acepta base64 puro o con prefijo data:image
  const qrSrc = alumno.qr_code.startsWith('data:')
    ? alumno.qr_code
    : `data:image/png;base64,${alumno.qr_code}`

  doc.addImage(qrSrc, 'PNG', 15, 49, 50, 50)

  // Footer
  doc.setTextColor(70, 90, 120)
  doc.setFontSize(5.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Presenta este QR al ingresar al colegio', 40, 105, { align: 'center' })

  // Esquinas decorativas
  doc.setDrawColor(79, 142, 247)
  doc.setLineWidth(0.6)
  doc.line(2, 2, 9, 2);  doc.line(2, 2, 2, 9)    // ↖
  doc.line(71, 2, 78, 2); doc.line(78, 2, 78, 9)   // ↗
  doc.line(2, 101, 2, 108); doc.line(2, 108, 9, 108) // ↙
  doc.line(78, 101, 78, 108); doc.line(71, 108, 78, 108) // ↘

  doc.save(`QR_${alumno.nombre}_${alumno.apellido}.pdf`)
}

export default function Alumnos() {
  const [alumnos, setAlumnos]         = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [page, setPage]               = useState(1)
  const [downloading, setDownloading] = useState<number | null>(null)
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

  const handleDownload = async (a: any) => {
    if (!a.qr_code) return alert('Este alumno no tiene QR generado aún.')
    setDownloading(a.id)
    try {
      await descargarQRPdf(a)
    } catch (e) {
      console.error(e)
      alert('Error al generar el PDF. Verifica el formato del QR.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root { display:flex; height:100vh; overflow:hidden; background:#0b1628; font-family:'Lato',sans-serif; color:#fff; }
        .al-main  { flex:1; display:flex; flex-direction:column; overflow-y:auto; height:100vh; min-width:0; }

        .al-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 32px; border-bottom:1px solid rgba(255,255,255,0.06);
          background:rgba(15,31,61,0.6); backdrop-filter:blur(10px);
          position:sticky; top:0; z-index:10; gap:16px;
        }
        .al-topbar-left h1 { font-family:'Playfair Display',serif; font-size:22px; color:#fff; font-weight:600; display:flex; align-items:center; gap:10px; }
        .al-topbar-left h1 i { color:#e8c96a; font-size:18px; }
        .al-topbar-left p { font-size:12px; color:rgba(255,255,255,0.35); margin-top:3px; }
        .al-topbar-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }

        .search-wrap { position:relative; }
        .search-wrap i { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); font-size:13px; pointer-events:none; }
        .search-input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:9px 14px 9px 36px; color:#fff; font-family:'Lato',sans-serif; font-size:13px; width:240px; outline:none; transition:border-color 0.2s,background 0.2s; }
        .search-input::placeholder { color:rgba(255,255,255,0.25); }
        .search-input:focus { border-color:rgba(192,160,80,0.5); background:rgba(255,255,255,0.08); }
        .search-clear { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; font-size:12px; padding:2px 4px; transition:color 0.2s; }
        .search-clear:hover { color:rgba(255,255,255,0.7); }

        .btn-crear { display:flex; align-items:center; gap:8px; padding:9px 18px; background:linear-gradient(135deg,#c0a050,#e8c96a); border:none; border-radius:10px; color:#0f1f3d; font-family:'Lato',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:transform 0.18s,box-shadow 0.18s; box-shadow:0 4px 14px rgba(192,160,80,0.3); white-space:nowrap; }
        .btn-crear:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(192,160,80,0.45); }
        .btn-crear:active { transform:translateY(0); }

        .al-content { padding:32px; display:flex; flex-direction:column; gap:20px; animation:fadeUp 0.4s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .summary-row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .summary-chip { display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:600; border:1px solid; }

        .table-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
        .table-card table { width:100%; border-collapse:collapse; }
        .table-card thead th { text-align:left; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.25); padding:14px 24px; border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); }
        .table-card tbody tr { transition:background 0.15s; animation:fadeUp 0.4s ease both; }
        .table-card tbody tr:hover { background:rgba(255,255,255,0.04); }
        .table-card tbody td { padding:13px 24px; font-size:13px; color:rgba(255,255,255,0.65); border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
        .table-card tbody tr:last-child td { border-bottom:none; }

        .alumno-cell { display:flex; align-items:center; gap:12px; }
        .alumno-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; text-transform:uppercase; }
        .alumno-nombre { font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); }
        .alumno-sub    { font-size:11px; color:rgba(255,255,255,0.25); margin-top:1px; }

        .codigo-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.09); font-size:12px; font-weight:700; color:rgba(255,255,255,0.6); font-family:monospace; letter-spacing:0.5px; }

        /* Download button */
        .btn-download {
          display:inline-flex; align-items:center; gap:8px; padding:8px 16px;
          border-radius:9px; cursor:pointer; font-size:12px; font-weight:700;
          font-family:'Lato',sans-serif; white-space:nowrap;
          background:rgba(79,207,142,0.1); color:#4fcf8e;
          border:1px solid rgba(79,207,142,0.25);
          transition:background 0.2s,transform 0.15s,box-shadow 0.2s;
        }
        .btn-download:hover:not(:disabled) { background:rgba(79,207,142,0.2); transform:translateY(-1px); box-shadow:0 4px 14px rgba(79,207,142,0.2); }
        .btn-download:active:not(:disabled) { transform:translateY(0); }
        .btn-download:disabled { opacity:0.4; cursor:not-allowed; }

        .btn-download.no-qr { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.25); border-color:rgba(255,255,255,0.08); }

        .spin { animation:spin 0.8s linear infinite; display:inline-block; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .empty-state { padding:56px 24px; text-align:center; color:rgba(255,255,255,0.25); }
        .empty-state i { font-size:36px; margin-bottom:12px; display:block; }
        .empty-state p { font-size:14px; }
        .skeleton-row td { padding:13px 24px; border-bottom:1px solid rgba(255,255,255,0.04); }
        .skeleton-bar { height:14px; border-radius:6px; background:linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        .pagination-row { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-top:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.01); }
        .pagination-info { font-size:12px; color:rgba(255,255,255,0.3); }
        .pagination-info span { color:rgba(255,255,255,0.65); font-weight:600; }
        .pagination-controls { display:flex; align-items:center; gap:4px; }
        .page-btn { width:32px; height:32px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background:transparent; color:rgba(255,255,255,0.4); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; font-family:'Lato',sans-serif; font-weight:600; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .page-btn:hover:not(:disabled):not(.active) { background:rgba(255,255,255,0.07); color:#fff; }
        .page-btn.active { background:rgba(192,160,80,0.2); border-color:rgba(192,160,80,0.5); color:#e8c96a; }
        .page-btn:disabled { opacity:0.25; cursor:not-allowed; }
        .page-dots { color:rgba(255,255,255,0.2); font-size:12px; padding:0 4px; }
      `}</style>

      <div className="al-root">
        <SidebarAdmin />

        <div className="al-main">
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
            <div className="summary-row">
              <div className="summary-chip" style={{ background:'rgba(79,142,247,0.1)', borderColor:'rgba(79,142,247,0.3)', color:'#4f8ef7' }}>
                <i className="fa-solid fa-users"></i>
                Total: {alumnos.length} alumnos
              </div>
              {search && (
                <div className="summary-chip" style={{ background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>
                  <i className="fa-solid fa-filter"></i>
                  {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
                </div>
              )}
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Carnet QR</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <tr key={i} className="skeleton-row">
                        <td><div className="skeleton-bar" style={{ width:'55%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width:'35%' }} /></td>
                        <td><div className="skeleton-bar" style={{ width:'30%' }} /></td>
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
                      const isDownloading = downloading === a.id
                      const hasQr = !!a.qr_code
                      return (
                        <tr key={a.id} style={{ animationDelay:`${i * 0.03}s` }}>
                          <td>
                            <div className="alumno-cell">
                              <div className="alumno-avatar" style={{ background:`${color}22`, color, border:`1px solid ${color}44` }}>
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
                              <i className="fa-solid fa-id-card" style={{ fontSize:11, opacity:0.5 }}></i>
                              {a.codigo}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn-download${!hasQr ? ' no-qr' : ''}`}
                              disabled={isDownloading || !hasQr}
                              onClick={() => handleDownload(a)}
                              title={!hasQr ? 'Sin QR disponible' : `Descargar carnet PDF de ${a.nombre}`}
                            >
                              {isDownloading
                                ? <><i className="fa-solid fa-circle-notch spin"></i>Generando...</>
                                : !hasQr
                                ? <><i className="fa-solid fa-ban"></i>Sin QR</>
                                : <><i className="fa-solid fa-file-arrow-down"></i>Descargar PDF</>
                              }
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>

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