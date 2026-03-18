import { useEffect, useState } from 'react'
import { getAlumnos, createAlumno } from '../../services/alumno.service'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState<any[]>([])

  useEffect(() => {
    getAlumnos().then(res => setAlumnos(res.data))
  }, [])

  return (
    <div>
      <SidebarAdmin />
      <h2>Alumnos</h2>

      <button onClick={() => createAlumno({
        nombre: 'Juan',
        apellido: 'Perez',
        codigo: 'A001'
      })}>
        Crear Alumno
      </button>

      <ul>
        {alumnos.map(a => (
          <li key={a.id}>{a.nombre} {a.apellido}</li>
        ))}
      </ul>
    </div>
  )
}