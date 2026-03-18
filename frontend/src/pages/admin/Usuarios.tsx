import { useEffect, useState } from 'react'
import { getUsuarios, createUsuario } from '../../services/usuario.service'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    getUsuarios().then(res => setUsuarios(res.data))
  }, [])

  return (
    <div>
      <SidebarAdmin />
      <h2>Usuarios</h2>

      <button onClick={() => createUsuario({
        username: 'nuevo',
        password: '123456',
        rol: 'PORTERO'
      })}>
        Crear Usuario
      </button>

      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.username} - {u.rol}</li>
        ))}
      </ul>
    </div>
  )
}