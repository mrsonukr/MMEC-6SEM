import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sparkles, CheckCircle, XCircle } from 'lucide-react'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const err = searchParams.get('error')
    if (success === 'true') {
      const userData = {
        id: searchParams.get('id'),
        user_id: searchParams.get('user_id'),
        full_name: searchParams.get('full_name'),
        role: searchParams.get('role'),
        email: searchParams.get('email'),
      }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    if (err) setError(err)
  }, [])

  useEffect(() => {
    if (user) {
      const t = setTimeout(() => navigate('/home'), 1500)
      return () => clearTimeout(t)
    }
  }, [user, navigate])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="card p-10 w-full max-w-sm text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-violet-950/40 border border-[color:var(--accent-light)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-violet-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#F9FAFB] mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">{user.full_name}</p>
          <div className="text-left bg-violet-950/40 rounded-xl p-4 space-y-2 mb-6 border border-[#111]/[0.07]">
            <p className="text-xs text-[#6B7280]"><span className="font-medium text-[#F9FAFB]">Email</span> · {user.email}</p>
            <p className="text-xs text-[#6B7280]"><span className="font-medium text-[#F9FAFB]">Role</span> · {user.role}</p>
          </div>
          <p className="text-xs text-[#6B7280]">Redirecting to your feed…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="card p-10 w-full max-w-sm text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#F9FAFB] mb-2">Login Failed</h2>
          <p className="text-sm text-[#6B7280] mb-8">
            {error === 'user_not_found' ? 'No account found. Please register first.' : error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-outline text-sm px-6 py-2.5 rounded-full w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="card p-10 w-full max-w-sm text-center animate-fade-up">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} className="text-violet-400" />
          <span className="font-display text-2xl font-semibold text-[#F9FAFB]">UniConnect</span>
        </div>
        <h2 className="font-display text-xl font-light text-[#F9FAFB] mb-6">
          Sign in with Google
        </h2>
        <button
          onClick={() => window.location.href = 'https://backend.uniconnectmmu.workers.dev/auth/google'}
          className="w-full flex items-center justify-center gap-3 btn-outline py-3 rounded-full"
        >
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.4 13.67 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.67 7.1l7.18 5.58C43.36 37.28 46.52 31.36 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.74 28.26A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.7-4.26l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.77l8.18-6.51z"/>
            <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.2-4.1 1.98-6.18 1.98-6.27 0-11.6-4.17-13.26-9.74l-8.18 6.51C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          <span className="text-sm font-medium text-[#F9FAFB]">Continue with Google</span>
        </button>
      </div>
    </div>
  )
}
