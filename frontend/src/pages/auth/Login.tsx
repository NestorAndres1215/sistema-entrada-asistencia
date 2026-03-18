import { useState } from 'react'
import { loginRequest } from '../../services/auth.service'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import '../../styles/login.css'
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await loginRequest({ username, password })
      login(res.data)
      if (res.data.user.rol === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/portero')
      }
    } catch (error) {
      alert('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <>


      <div className="login-wrapper">
        <div className="login-card">

          <div className="school-icon">
            <i className="fa-solid fa-school"></i>
          </div>

          <div className="school-name">Sistema Escolar</div>
          <div className="school-subtitle">Portal de Acceso</div>

          <div className="divider"><span>Identificación</span></div>

          <div className="input-group" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <i className="fa-solid fa-user input-icon"></i>
            <input
              className="login-input"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>

          <div className="input-group" style={{ '--delay': '0.48s' } as React.CSSProperties}>
            <i className="fa-solid fa-lock input-icon"></i>
            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin-slow"></i>
                Ingresando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                Ingresar
              </>
            )}
          </button>

          <div className="login-footer">
            <i className="fa-solid fa-shield-halved" style={{ marginRight: 6 }}></i>
            Acceso restringido al personal autorizado
          </div>

        </div>
      </div>
    </>
  )
}