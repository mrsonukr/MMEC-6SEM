import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MoveLeft, MoveRight, Eye, EyeOff } from 'lucide-react'
import FloatingInput from '../components/ui/FloatingInput'
import Button from '../components/ui/Button'

const BASE = 'https://backend.uniconnectmmu.workers.dev'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmError, setConfirmError] = useState(false)
  const passwordRef = useRef(null)
  const confirmRef = useRef(null)

  if (!token) {
    return (
      <div className="min-h-screen flex">
        <div className="w-1/2 bg-white hidden md:block">
          <img src="/loginpage.jpg" alt="reset" className="w-full p-5 h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 flex items-start md:items-center justify-center bg-white px-8 pt-16 md:pt-0">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.svg"
                alt="logo"
                className="h-16 object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-gray-400 mb-8">This link is missing a token. Please request a new one.</p>
            <Button fullWidth icon={<MoveRight size={18} />} onClick={() => navigate('/forgot-password')}>
              Request new link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!password.trim()) { setPasswordError(true); passwordRef.current?.focus(); return }
    if (!confirmPassword.trim()) { setConfirmError(true); confirmRef.current?.focus(); return }
    if (password !== confirmPassword) {
      setMsg('Passwords do not match.')
      setIsError(true)
      setConfirmError(true)
      confirmRef.current?.focus()
      return
    }
    setPasswordError(false)
    setConfirmError(false)
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg(data.message || 'Password updated successfully!')
        setIsError(false)
        setDone(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setMsg(data.message || 'Invalid or expired token.')
        setIsError(true)
      }
    } catch {
      setMsg('Network error. Please try again.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="w-1/2 bg-white hidden md:block">
        <img src="/loginpage.jpg" alt="reset" className="w-full p-5 h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-start md:items-center justify-center bg-white px-8 pt-16 md:pt-0">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-16 object-contain"
            />
          </div>

          {/* BACK + HEADING */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-500 hover:text-black transition"
            >
              <MoveLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Reset password</h2>
          </div>

          {/* Message */}
          {msg && (
            <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              isError
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {msg}
              {!isError && <span className="ml-1 text-xs opacity-70">(Redirecting to login...)</span>}
            </div>
          )}

          {/* New Password */}
          <div className="mb-6 relative">
            <FloatingInput
              ref={passwordRef}
              label="New password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); setMsg('') }}
              autoFocus
              showError={passwordError}
              disabled={done}
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-0 top-3 text-gray-400 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <FloatingInput
              ref={confirmRef}
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(false); setMsg('') }}
              showError={confirmError}
              disabled={done}
            />
            {confirmPassword && (
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                className="absolute right-0 top-3 text-gray-400 hover:text-gray-700 transition"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          <Button
            fullWidth
            icon={<MoveRight size={18} />}
            onClick={handleSubmit}
            disabled={loading || done}
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </Button>

        </div>
      </div>
    </div>
  )
}
