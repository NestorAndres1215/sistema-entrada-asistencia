import { useState } from 'react'
import { createUsuario } from '../../services/usuario.service'
import { useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'
import '../../styles/crear_usuario.css'
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

  return (
    <>
  

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