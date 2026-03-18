import api from './api'

export const getAlumnos = () => api.get('/alumnos')
export const createAlumno = (data: any) => api.post('/alumnos', data)