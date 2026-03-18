import api from './api'

export const loginRequest = (data: any) => {
  return api.post('/auth/login', data)
}