import api from './api'

export const getIncidencias = () => api.get('/incidencias')
export const createIncidencia = (data: any) =>
  api.post('/incidencias', data)