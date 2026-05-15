import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginRequest } from '../../api/services/authApi'
import useAuthStore from '../../store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from?.pathname
  const setAuth = useAuthStore((state) => state.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const data = await loginRequest({ email, password })
      const token = data?.token
      const user = data?.user ?? null
      const role = data?.user?.role ?? data?.role

      if (!token || !role) {
        throw new Error('Missing token or role in login response')
      }

      setAuth({ token, user, role })

      if (fromPath) {
        navigate(fromPath, { replace: true })
      } else {
        navigate(role === 'admin' ? '/admin' : '/beekeeper', { replace: true })
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        'Login failed. Please check credentials and try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-yellow-400 px-4">
      <div className="w-full max-w-md rounded-2xl bg-black p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold">BeeSmart</h1>
        <p className="mt-2 text-sm text-zinc-300">Sign in to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Email</span>
            <input
              className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-base outline-none transition focus:border-yellow-300"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@beesmart.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Password</span>
            <input
              className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-base outline-none transition focus:border-yellow-300"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          <button
            className="h-12 w-full rounded-xl bg-yellow-300 text-base font-bold text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
