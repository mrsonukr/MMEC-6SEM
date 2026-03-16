import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Mail } from 'lucide-react'
import FloatingInput from '../components/ui/FloatingInput'
import Button from '../components/ui/Button'

const BASE = 'https://backend.uniconnectmmu.workers.dev'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [emailError, setEmailError] = useState(false)
  const [maxLimit, setMaxLimit] = useState(false)
  const [emailNotFound, setEmailNotFound] = useState(false)
  const [msg, setMsg] = useState('')
  const emailRef = useRef(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => () => clearInterval(timerRef.current), [])

  const startCooldown = (seconds) => {
    setCooldown(seconds)
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const sendLink = async (endpoint) => {
    setLoading(true); setMsg('')
    try {
      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.status === 429) {
        const is24h = data.message?.toLowerCase().includes('24 hour')
        if (is24h) setMaxLimit(true)
        else {
          const match = data.message?.match(/(\d+)/)
          startCooldown(match ? parseInt(match[1]) : 60)
        }
      } else if (res.status === 404) {
        setEmailNotFound(true)
      } else if (res.ok) {
        setSent(true); startCooldown(60)
      } else {
        setMsg(data.message || 'Something went wrong.')
      }
    } catch {
      setMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!email.trim()) { setEmailError(true); emailRef.current?.focus(); return }
    setEmailError(false)
    sendLink('/auth/forgot-password')
  }

  const handleGoogle = () => { window.location.href = `${BASE}/auth/google` }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      {/* LEFT — dark panel */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1E1B4B 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(99,102,241,0.3) 40px, rgba(99,102,241,0.3) 41px)` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
          <div className="w-16 h-16 rounded-full border border-[color:var(--accent)] flex items-center justify-center mb-8 opacity-80">
            <Mail size={28} className="text-[color:var(--accent-light)]" />
          </div>
          <h1 className="font-display text-4xl font-light text-white mb-4">
            Reset your<br />
            <span className="italic text-[color:var(--accent-light)]">password</span>
          </h1>
          <p className="text-sm text-[#6B7280] max-w-xs leading-relaxed">
            We'll send a secure link to your email address to reset your password.
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-8 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2 mb-10">
            <Sparkles size={18} className="text-violet-400" />
            <span className="font-display text-2xl font-semibold text-[#F9FAFB]">UniConnect</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#F9FAFB] mb-6 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <h2 className="font-display text-3xl font-light text-[#F9FAFB] mb-1">
            Forgot password?
          </h2>
          <p className="text-sm text-[#6B7280] mb-10">
            Enter your email and we'll send a reset link
          </p>

          {sent && (
            <div className="mb-6 p-4 rounded-xl border border-[color:var(--accent-light)] bg-violet-950/40 text-sm text-[#F9FAFB]">
              <p className="font-medium text-violet-400 mb-1">Link sent!</p>
              <p className="text-[#D1D5DB] text-xs">Check your inbox and follow the instructions.</p>
            </div>
          )}

          {maxLimit && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600">
              Daily limit reached. Please try again after 24 hours.
            </div>
          )}

          {msg && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-500">{msg}</div>
          )}

          <div className="mb-8">
            <FloatingInput
              ref={emailRef}
              lowercase
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(false); setEmailNotFound(false)
                setSent(false); setMaxLimit(false); setCooldown(0)
                clearInterval(timerRef.current)
              }}
              autoFocus
              showError={emailError || emailNotFound}
            />
            {emailNotFound && (
              <p className="text-red-500 text-xs mt-2">No account found with this email.</p>
            )}
          </div>

          <Button
            fullWidth
            icon={maxLimit ? null : <ArrowRight size={16} />}
            onClick={maxLimit ? null : handleSubmit}
            disabled={loading || cooldown > 0 || maxLimit}
            className="rounded-full mb-4"
          >
            {loading ? 'Sending…'
              : maxLimit ? 'Limit reached — try after 24h'
              : sent && cooldown > 0 ? `Sent! Resend in ${cooldown}s`
              : sent ? 'Resend Link'
              : 'Send Reset Link'}
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-1 divider-glow" />
            <span className="px-4 text-xs text-[#6B7280] tracking-widest uppercase">or</span>
            <div className="flex-1 divider-glow" />
          </div>

          <Button fullWidth variant="outline" onClick={handleGoogle} className="gap-3">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.4 13.67 17.73 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.67 7.1l7.18 5.58C43.36 37.28 46.52 31.36 46.52 24.5z"/>
              <path fill="#FBBC05" d="M10.74 28.26A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.7-4.26l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.77l8.18-6.51z"/>
              <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.2-4.1 1.98-6.18 1.98-6.27 0-11.6-4.17-13.26-9.74l-8.18 6.51C7.07 41.52 14.82 47 24 47z"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
