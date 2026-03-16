import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react'
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

  const LeftPanel = () => (
    <div className="hidden md:flex w-1/2 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1E1B4B 100%)' }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(99,102,241,0.3) 40px, rgba(99,102,241,0.3) 41px)` }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
        <div className="w-16 h-16 rounded-full border border-[color:var(--accent)] flex items-center justify-center mb-8 opacity-80">
          <KeyRound size={28} className="text-[color:var(--accent-light)]" />
        </div>
        <h1 className="font-display text-4xl font-light text-white mb-4">
          Create a new<br />
          <span className="italic text-[color:var(--accent-light)]">password</span>
        </h1>
        <p className="text-sm text-[#6B7280] max-w-xs leading-relaxed">
          Choose a strong, secure password for your UniConnect account.
        </p>
      </div>
    </div>
  )

  if (!token) {
    return (
      <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
        <LeftPanel />
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-8 py-16">
          <div className="w-full max-w-sm animate-fade-up text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <h2 className="font-display text-2xl font-light text-[#F9FAFB] mb-2">Invalid Link</h2>
            <p className="text-sm text-[#6B7280] mb-8">This reset link is missing or expired. Please request a new one.</p>
            <Button fullWidth icon={<ArrowRight size={16} />} onClick={() => navigate('/forgot-password')} className="rounded-full">
              Request New Link
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
      setMsg('Passwords do not match.'); setIsError(true); setConfirmError(true)
      confirmRef.current?.focus(); return
    }
    setPasswordError(false); setConfirmError(false); setLoading(true); setMsg('')
    try {
      const res = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg(data.message || 'Password updated successfully!')
        setIsError(false); setDone(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setMsg(data.message || 'Invalid or expired token.'); setIsError(true)
      }
    } catch {
      setMsg('Network error. Please try again.'); setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <LeftPanel />
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-8 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2 mb-10">
            <Sparkles size={18} className="text-violet-400" />
            <span className="font-display text-2xl font-semibold text-[#F9FAFB]">UniConnect</span>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#F9FAFB] mb-6 text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Back to login
          </button>

          <h2 className="font-display text-3xl font-light text-[#F9FAFB] mb-1">New password</h2>
          <p className="text-sm text-[#6B7280] mb-10">Enter and confirm your new secure password</p>

          {msg && (
            <div className={`mb-6 p-4 rounded-xl border text-sm ${
              isError
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-violet-950/40 border-[color:var(--accent-light)] text-violet-400'
            }`}>
              {msg}
              {!isError && <span className="ml-2 text-xs opacity-60">(Redirecting…)</span>}
            </div>
          )}

          <div className="mb-8 relative">
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
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-0 top-3 text-[#6B7280] hover:text-violet-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>

          <div className="mb-8 relative">
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
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute right-0 top-3 text-[#6B7280] hover:text-violet-400 transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>

          <Button
            fullWidth
            icon={<ArrowRight size={16} />}
            onClick={handleSubmit}
            disabled={loading || done}
            className="rounded-full"
          >
            {loading ? 'Saving…' : done ? 'Password Updated ✓' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}
