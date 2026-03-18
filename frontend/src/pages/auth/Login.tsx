import { useState } from 'react'
import { loginRequest } from '../../services/auth.service'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
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
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  )
}