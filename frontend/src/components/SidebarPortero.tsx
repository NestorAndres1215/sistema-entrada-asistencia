import { Link } from 'react-router-dom'

export default function SidebarPortero() {
  return (
    <div>
      <h3>PORTERO</h3>
      <ul>
        <li><Link to="/portero">Asistencia</Link></li>
      </ul>
    </div>
  )
}