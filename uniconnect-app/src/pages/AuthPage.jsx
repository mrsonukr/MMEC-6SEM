import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

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

    if (err) {
      setError(err)
    }
  }, [])

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate('/home')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Login Successful!</h2>
          <div className="text-sm text-gray-600 space-y-1 text-left bg-gray-50 rounded-lg p-4">
            <p><span className="font-medium text-gray-700">Name:</span> {user.full_name}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
            <p><span className="font-medium text-gray-700">Role:</span> {user.role}</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Login Failed</h2>
          <p className="text-sm text-gray-500">
            {error === 'user_not_found'
              ? 'Account nahi hai. Pehle register karo.'
              : error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Login with Google</h2>
        <button
          onClick={() => window.location.href = 'https://backend.uniconnectmmu.workers.dev/auth/google'}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.4 13.67 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.67 7.1l7.18 5.58C43.36 37.28 46.52 31.36 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.74 28.26A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.7-4.26l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.77l8.18-6.51z"/>
            <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.2-4.1 1.98-6.18 1.98-6.27 0-11.6-4.17-13.26-9.74l-8.18 6.51C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  )
}
