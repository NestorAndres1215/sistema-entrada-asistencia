import api from './api'

export const registrarAsistencia = (data: any) =>
  api.post('/asistencias', data)

export const getAsistencias = () => api.get('/asistencias')