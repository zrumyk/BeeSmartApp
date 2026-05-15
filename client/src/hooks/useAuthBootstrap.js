import { useEffect } from 'react'
import { meRequest } from '../api/services/authApi'
import useAuthStore from '../store/authStore'

function useAuthBootstrap() {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token || !isAuthenticated) {
        return
      }

      try {
        const user = await meRequest()
        setAuth({ token, user, role: user?.role })
      } catch (error) {
        if (error?.response?.status === 401) {
          clearAuth()
        }
      }
    }

    bootstrap()
  }, [clearAuth, isAuthenticated, setAuth, token])
}

export default useAuthBootstrap
