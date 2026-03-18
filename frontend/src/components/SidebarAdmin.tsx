import { Link } from 'react-router-dom'

export default function SidebarAdmin() {
  return (
    <div>
      <h3>ADMIN</h3>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/usuarios">Usuarios</Link></li>
        <li><Link to="/admin/alumnos">Alumnos</Link></li>
        <li><Link to="/admin/reportes">Reportes</Link></li>
      </ul>
    </div>
  )
}