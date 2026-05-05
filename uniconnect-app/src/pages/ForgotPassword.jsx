import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveLeft, MoveRight } from 'lucide-react'
import FloatingInput from '../components/ui/FloatingInput'
import Spinner from '../components/Spinner'
import Button from '../components/ui/Button'

const BASE = 'https://backend.uniconnectmmu.workers.dev'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [emailError, setEmailError] = useState(false)
  const [maxLimit, setMaxLimit] = useState(false)
  const [emailNotFound, setEmailNotFound] = useState(false)
  const emailRef = useRef(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  const handleGoogle = () => {
    window.location.href = `${BASE}/auth/google`
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const startCooldown = (seconds) => {
    setCooldown(seconds)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const sendLink = async (endpoint) => {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.status === 429) {
        const is24h = data.message?.toLowerCase().includes('24 hour') || data.message?.toLowerCase().includes('maximum')
        if (is24h) {
          setMaxLimit(true)
        } else {
          const match = data.message?.match(/(\d+)/)
          startCooldown(match ? parseInt(match[1]) : 60)
        }
      } else if (res.status === 404) {
        setEmailNotFound(true)
      } else if (res.ok) {
        setMsg('')
        setIsError(false)
        setSent(true)
        startCooldown(60)
      } else {
        setMsg(data.message || 'Something went wrong.')
        setIsError(true)
      }
    } catch {
      setMsg('Network error. Please try again.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!email.trim()) { setEmailError(true); emailRef.current?.focus(); return }
    setEmailError(false)
    sendLink('/auth/forgot-password')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleResend = () => {
    sendLink('/auth/resend-reset')
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="w-1/2 bg-white hidden md:block">
        <img
          src="/loginpage.jpg"
          alt="forgot"
          className="w-full p-5 h-full object-cover"
        />
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
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-black transition"
            >
              <MoveLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Forgot password?</h2>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <FloatingInput
              ref={emailRef}
              lowercase
              label="Enter your email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(false)
                setEmailNotFound(false)
                setMsg('')
                setSent(false)
                setMaxLimit(false)
                setCooldown(0)
                clearInterval(timerRef.current)
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              showError={emailError || emailNotFound}
            />
            {emailNotFound && (
              <p className="text-red-500 text-xs mt-2">No account found with this email.</p>
            )}
          </div>

          {/* Send Reset Link / Status Button */}
          <Button
            fullWidth
            icon={maxLimit ? null : <MoveRight size={18} />}
            onClick={maxLimit ? null : handleSubmit}
            disabled={loading || cooldown > 0 || maxLimit}
          >
            {loading
              ? <Spinner />
              : maxLimit
                ? 'Limit reached — try after 24h'
                : sent && cooldown > 0
                  ? `Sent! Resend in ${cooldown}s`
                  : sent && cooldown === 0
                    ? 'Resend Link'
                    : 'Send Reset Link'
            }
          </Button>

          {/* Divider + Google */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <Button fullWidth variant="outline" onClick={handleGoogle}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Login with Google
          </Button>


        </div>
      </div>
    </div>
  )
}
