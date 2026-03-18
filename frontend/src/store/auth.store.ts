import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any
  token: string | null
  login: (data: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (data) =>
        set({
          user: data.user,
          token: data.access_token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: 'auth-storage', // clave en localStorage
    }
  )
)