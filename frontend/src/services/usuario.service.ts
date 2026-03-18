import api from './api'

export const getUsuarios = () => api.get('/usuarios')
export const createUsuario = (data: any) => api.post('/usuarios', data)