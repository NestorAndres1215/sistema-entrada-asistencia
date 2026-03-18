import api from './api'

export const registrarAsistencia = (data: any) =>
  api.post('/asistencia', data)

export const getAsistencias = () => api.get('/asistencia')