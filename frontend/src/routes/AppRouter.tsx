import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Usuarios from '../pages/admin/Usuarios'
import Alumnos from '../pages/admin/Alumnos'
import Reportes from '../pages/admin/Reportes'
import PrivateRoute from '../guards/PrivateRoute'
import Dashboard from '../pages/admin/Dashboard'
import Login from '../pages/auth/Login'
import Asistencia from '../pages/portero/Asistencia'
import PublicRoute from '../guards/PublicRoute'
import CrearUsuario from '../pages/admin/CrearUsuario'
import CrearAlumno from '../pages/admin/CrearAlumno'


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<PublicRoute> <Login /></PublicRoute>} />

                {/* ADMIN */}
                <Route path="/admin" element={<PrivateRoute role="ADMIN"><Dashboard /></PrivateRoute>} />
                <Route path="/admin/usuarios" element={<PrivateRoute role="ADMIN"><Usuarios /></PrivateRoute>} />
                <Route path="/admin/alumnos" element={<PrivateRoute role="ADMIN"><Alumnos /></PrivateRoute>} />
                <Route path="/admin/reportes" element={<PrivateRoute role="ADMIN"><Reportes /></PrivateRoute>} />
                <Route path="/admin/usuarios/crear" element={<PrivateRoute role="ADMIN"><CrearUsuario /></PrivateRoute>} />
                <Route path="/admin/alumnos/crear" element={<PrivateRoute role="ADMIN"><CrearAlumno /></PrivateRoute>} />

                {/* PORTERO */}
                <Route path="/portero" element={<PrivateRoute role="PORTERO"><Asistencia /></PrivateRoute>} />

                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </BrowserRouter>
    )
}