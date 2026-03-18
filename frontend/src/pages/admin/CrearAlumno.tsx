import { useState } from 'react'
import { createAlumno } from '../../services/alumno.service'
import { useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function CrearAlumno() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ nombre: '', apellido: '', codigo: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.nombre.trim())   errs.nombre   = 'El nombre es requerido'
    if (!form.apellido.trim()) errs.apellido = 'El apellido es requerido'
    if (!form.codigo.trim())   errs.codigo   = 'El código es requerido'
    else if (!/^[a-zA-Z0-9\-_]+$/.test(form.codigo)) errs.codigo = 'Solo letras, números y guiones'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await createAlumno(form)
      navigate('/admin/alumnos')
    } catch {
      setErrors({ general: 'Error al crear el alumno. Inténtalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const initials = `${form.nombre?.[0] ?? ''}${form.apellido?.[0] ?? ''}`.toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ca-root {
          display: flex; height: 100vh; overflow: hidden;
          background: #0b1628; font-family: 'Lato', sans-serif; color: #fff;
        }
        .ca-main {
          flex: 1; display: flex; flex-direction: column;
          overflow-y: auto; height: 100vh; min-width: 0;
        }

        /* Topbar */
        .ca-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(15,31,61,0.6); backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 10;
        }
        .ca-topbar-left { display: flex; align-items: center; gap: 14px; }
        .back-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5); display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 13px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .back-btn:hover { background: rgba(192,160,80,0.12); color: #e8c96a; border-color: rgba(192,160,80,0.3); }
        .ca-topbar h1 {
          font-family: 'Playfair Display', serif; font-size: 22px;
          color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px;
        }
        .ca-topbar h1 i { color: #e8c96a; font-size: 18px; }
        .ca-topbar p { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 3px; }

        /* Content */
        .ca-content {
          padding: 40px 32px; display: flex; justify-content: center;
          animation: fadeUp 0.45s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ca-card { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 20px; }

        /* Preview avatar */
        .avatar-preview {
          display: flex; align-items: center; gap: 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px 22px;
        }
        .avatar-circle {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(79,142,247,0.2); border: 2px solid rgba(79,142,247,0.4);
          color: #4f8ef7; display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 700; flex-shrink: 0;
          transition: all 0.2s;
        }
        .avatar-circle.filled {
          background: rgba(79,142,247,0.25); border-color: rgba(79,142,247,0.6);
          color: #6fa8ff;
        }
        .avatar-info { display: flex; flex-direction: column; gap: 3px; }
        .avatar-name {
          font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.85);
          min-height: 22px;
        }
        .avatar-name.placeholder { color: rgba(255,255,255,0.2); font-weight: 400; font-style: italic; }
        .avatar-sub { font-size: 12px; color: rgba(255,255,255,0.3); }

        /* Form section */
        .form-section {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .section-header {
          padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.02);
        }
        .section-header i { color: #e8c96a; font-size: 13px; }
        .section-header span {
          font-size: 12px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
        }
        .section-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .input-group { display: flex; flex-direction: column; gap: 7px; }
        .input-label {
          font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5);
          letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;
        }
        .input-label i { font-size: 11px; color: rgba(192,160,80,0.7); }

        .ca-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; color: #fff; font-family: 'Lato', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .ca-input::placeholder { color: rgba(255,255,255,0.2); }
        .ca-input:focus {
          border-color: rgba(192,160,80,0.5); background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(192,160,80,0.08);
        }
        .ca-input.error { border-color: rgba(247,111,111,0.5); box-shadow: 0 0 0 3px rgba(247,111,111,0.07); }

        .ca-input.codigo {
          font-family: monospace; font-size: 15px; letter-spacing: 1px;
          text-transform: uppercase;
        }

        .error-msg {
          font-size: 11px; color: #f76f6f;
          display: flex; align-items: center; gap: 5px;
        }

        /* General error */
        .general-error {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px;
          background: rgba(247,111,111,0.1); border: 1px solid rgba(247,111,111,0.3);
          border-radius: 10px; font-size: 13px; color: #f76f6f;
        }

        /* Actions */
        .form-actions { display: flex; gap: 12px; }
        .btn-cancel {
          flex: 1; padding: 13px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5); font-family: 'Lato', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
        .btn-submit {
          flex: 2; padding: 13px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #c0a050, #e8c96a);
          color: #0f1f3d; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          box-shadow: 0 4px 16px rgba(192,160,80,0.3);
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(192,160,80,0.45); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="ca-root">
        <SidebarAdmin />

        <div className="ca-main">
          {/* Topbar */}
          <div className="ca-topbar">
            <div className="ca-topbar-left">
              <button className="back-btn" onClick={() => navigate('/admin/alumnos')} title="Volver">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h1><i className="fa-solid fa-user-graduate"></i> Crear Alumno</h1>
                <p>Registra un nuevo estudiante en el sistema</p>
              </div>
            </div>
          </div>

          <div className="ca-content">
            <form className="ca-card" onSubmit={handleSubmit}>

              {/* Live preview */}
              <div className="avatar-preview">
                <div className={`avatar-circle${initials ? ' filled' : ''}`}>
                  {initials || <i className="fa-solid fa-user-graduate" style={{ fontSize: 22 }}></i>}
                </div>
                <div className="avatar-info">
                  <div className={`avatar-name${!form.nombre && !form.apellido ? ' placeholder' : ''}`}>
                    {form.nombre || form.apellido
                      ? `${form.nombre} ${form.apellido}`.trim()
                      : 'Nombre del alumno'}
                  </div>
                  <div className="avatar-sub">
                    {form.codigo
                      ? <><i className="fa-solid fa-id-card" style={{ marginRight: 5, opacity: 0.5 }}></i>{form.codigo.toUpperCase()}</>
                      : 'Código de estudiante'
                    }
                  </div>
                </div>
              </div>

              {/* Datos personales */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fa-solid fa-user"></i>
                  <span>Datos personales</span>
                </div>
                <div className="section-body">
                  <div className="field-row">
                    <div className="input-group">
                      <label className="input-label">
                        <i className="fa-solid fa-font"></i> Nombre
                      </label>
                      <input
                        className={`ca-input${errors.nombre ? ' error' : ''}`}
                        name="nombre"
                        placeholder="ej. María"
                        value={form.nombre}
                        onChange={handleChange}
                      />
                      {errors.nombre && <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.nombre}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <i className="fa-solid fa-font"></i> Apellido
                      </label>
                      <input
                        className={`ca-input${errors.apellido ? ' error' : ''}`}
                        name="apellido"
                        placeholder="ej. García"
                        value={form.apellido}
                        onChange={handleChange}
                      />
                      {errors.apellido && <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.apellido}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Código */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fa-solid fa-id-card"></i>
                  <span>Identificación</span>
                </div>
                <div className="section-body">
                  <div className="input-group">
                    <label className="input-label">
                      <i className="fa-solid fa-hashtag"></i> Código de alumno
                    </label>
                    <input
                      className={`ca-input codigo${errors.codigo ? ' error' : ''}`}
                      name="codigo"
                      placeholder="ej. ALU-2024-001"
                      value={form.codigo}
                      onChange={handleChange}
                    />
                    {errors.codigo
                      ? <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.codigo}</span>
                      : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                          <i className="fa-solid fa-circle-info" style={{ marginRight: 5 }}></i>
                          Solo letras, números y guiones. Se guardará en mayúsculas.
                        </span>
                    }
                  </div>
                </div>
              </div>

              {/* General error */}
              {errors.general && (
                <div className="general-error">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {errors.general}
                </div>
              )}

              {/* Actions */}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/admin/alumnos')}>
                  <i className="fa-solid fa-xmark" style={{ marginRight: 7 }}></i>Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? <><i className="fa-solid fa-circle-notch spin"></i>Guardando...</>
                    : <><i className="fa-solid fa-floppy-disk"></i>Guardar Alumno</>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}