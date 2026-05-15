import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACCESS_TOKEN_KEY, AUTH_STORAGE_KEY } from '../config/constants'

const initialUser = null
const initialRole = null
const initialToken = null

const useAuthStore = create(
  persist(
    (set) => ({
      user: initialUser,
      role: initialRole,
      token: initialToken,
      isAuthenticated: false,

      setAuth: ({ user, role, token }) => {
        if (token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, token)
        } else {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
        }

        set({
          user: user ?? initialUser,
          role: role ?? initialRole,
          token: token ?? initialToken,
          isAuthenticated: Boolean(token),
        })
      },

      clearAuth: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        set({
          user: initialUser,
          role: initialRole,
          token: initialToken,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
