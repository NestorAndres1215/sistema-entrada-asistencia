import { useState } from 'react'
import { createUsuario } from '../../services/usuario.service'
import { useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'

const ROLES = [
  { value: 'PORTERO', label: 'Portero', icon: 'fa-door-open', desc: 'Acceso al control de entrada',  color: '#4f8ef7' },
  { value: 'ADMIN',   label: 'Admin',   icon: 'fa-user-tie',  desc: 'Acceso completo al sistema',    color: '#e8c96a' },
]

export default function CrearUsuario() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '', rol: 'PORTERO' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.username.trim())        errs.username = 'El usuario es requerido'
    else if (form.username.length < 3) errs.username = 'Mínimo 3 caracteres'
    if (!form.password)               errs.password = 'La contraseña es requerida'
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await createUsuario(form)
      navigate('/admin/usuarios')
    } catch {
      setErrors({ general: 'Error al crear el usuario. Inténtalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const selectedRol = ROLES.find(r => r.value === form.rol)!

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cu-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #0b1628;
          font-family: 'Lato', sans-serif;
          color: #fff;
        }

        .cu-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
          min-width: 0;
        }

        /* Topbar */
        .cu-topbar {
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

        .cu-topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .back-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .back-btn:hover {
          background: rgba(192,160,80,0.12);
          color: #e8c96a;
          border-color: rgba(192,160,80,0.3);
        }

        .cu-topbar h1 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cu-topbar h1 i { color: #e8c96a; font-size: 18px; }

        .cu-topbar p {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 3px;
        }

        /* Content */
        .cu-content {
          padding: 40px 32px;
          display: flex;
          justify-content: center;
          animation: fadeUp 0.45s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cu-card {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Section block */
        .form-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .section-header {
          padding: 16px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.02);
        }

        .section-header i { color: #e8c96a; font-size: 13px; }

        .section-header span {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .section-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Input group */
        .input-group { display: flex; flex-direction: column; gap: 7px; }

        .input-label {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-label i { font-size: 11px; color: rgba(192,160,80,0.7); }

        .input-wrap { position: relative; }

        .cu-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .cu-input::placeholder { color: rgba(255,255,255,0.2); }

        .cu-input:focus {
          border-color: rgba(192,160,80,0.5);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(192,160,80,0.08);
        }

        .cu-input.error {
          border-color: rgba(247,111,111,0.5);
          box-shadow: 0 0 0 3px rgba(247,111,111,0.07);
        }

        .pass-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 14px;
          padding: 2px 4px;
          transition: color 0.2s;
        }

        .pass-toggle:hover { color: rgba(255,255,255,0.7); }

        .error-msg {
          font-size: 11px;
          color: #f76f6f;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Role selector */
        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .role-option {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .role-option:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }

        .role-option.selected-PORTERO {
          border-color: rgba(79,142,247,0.6);
          background: rgba(79,142,247,0.1);
        }

        .role-option.selected-ADMIN {
          border-color: rgba(232,201,106,0.6);
          background: rgba(232,201,106,0.1);
        }

        .role-option-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .role-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .role-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          transition: background 0.2s, border-color 0.2s;
        }

        .role-check.checked-PORTERO {
          background: #4f8ef7;
          border-color: #4f8ef7;
          color: #fff;
        }

        .role-check.checked-ADMIN {
          background: #e8c96a;
          border-color: #e8c96a;
          color: #0f1f3d;
        }

        .role-label {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
        }

        .role-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }

        /* General error */
        .general-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(247,111,111,0.1);
          border: 1px solid rgba(247,111,111,0.3);
          border-radius: 10px;
          font-size: 13px;
          color: #f76f6f;
        }

        /* Actions */
        .form-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
        }

        .btn-submit {
          flex: 2;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #c0a050, #e8c96a);
          color: #0f1f3d;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          box-shadow: 0 4px 16px rgba(192,160,80,0.3);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(192,160,80,0.45);
        }

        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="cu-root">
        <SidebarAdmin />

        <div className="cu-main">
          {/* Topbar */}
          <div className="cu-topbar">
            <div className="cu-topbar-left">
              <button className="back-btn" onClick={() => navigate('/admin/usuarios')} title="Volver">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h1><i className="fa-solid fa-user-plus"></i> Crear Usuario</h1>
                <p>Registra una nueva cuenta en el sistema</p>
              </div>
            </div>
          </div>

          <div className="cu-content">
            <form className="cu-card" onSubmit={handleSubmit}>

              {/* Credentials */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fa-solid fa-key"></i>
                  <span>Credenciales de acceso</span>
                </div>
                <div className="section-body">

                  <div className="input-group">
                    <label className="input-label">
                      <i className="fa-solid fa-user"></i> Nombre de usuario
                    </label>
                    <input
                      className={`cu-input${errors.username ? ' error' : ''}`}
                      name="username"
                      placeholder="ej. jperez"
                      autoComplete="off"
                      value={form.username}
                      onChange={handleChange}
                    />
                    {errors.username && (
                      <span className="error-msg">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {errors.username}
                      </span>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <i className="fa-solid fa-lock"></i> Contraseña
                    </label>
                    <div className="input-wrap">
                      <input
                        className={`cu-input${errors.password ? ' error' : ''}`}
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        className="pass-toggle"
                        onClick={() => setShowPass(s => !s)}
                        tabIndex={-1}
                      >
                        <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {errors.password && (
                      <span className="error-msg">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {errors.password}
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* Role */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Rol del usuario</span>
                </div>
                <div className="section-body">
                  <div className="role-grid">
                    {ROLES.map(r => {
                      const isSelected = form.rol === r.value
                      return (
                        <div
                          key={r.value}
                          className={`role-option${isSelected ? ` selected-${r.value}` : ''}`}
                          onClick={() => setForm({ ...form, rol: r.value })}
                        >
                          <div className="role-option-top">
                            <div className="role-icon" style={{ background: `${r.color}20`, color: r.color }}>
                              <i className={`fa-solid ${r.icon}`}></i>
                            </div>
                            <div className={`role-check${isSelected ? ` checked-${r.value}` : ''}`}>
                              {isSelected && <i className="fa-solid fa-check"></i>}
                            </div>
                          </div>
                          <div className="role-label">{r.label}</div>
                          <div className="role-desc">{r.desc}</div>
                        </div>
                      )
                    })}
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
                <button type="button" className="btn-cancel" onClick={() => navigate('/admin/usuarios')}>
                  <i className="fa-solid fa-xmark" style={{ marginRight: 7 }}></i>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? <><i className="fa-solid fa-circle-notch spin"></i> Guardando...</>
                    : <><i className="fa-solid fa-floppy-disk"></i> Guardar Usuario</>
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