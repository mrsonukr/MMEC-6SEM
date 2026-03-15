import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react'
import FloatingInput from '../components/ui/FloatingInput'
import Button from '../components/ui/Button'

const BASE = 'https://backend.uniconnectmmu.workers.dev'
const features = [
  { emoji: '🚀', label: 'Find hackathon teammates' },
  { emoji: '🔄', label: 'Exchange skills with peers' },
  { emoji: '💼', label: 'Discover internships & jobs' },
  { emoji: '🎓', label: 'Grow your university network' },
]

export default function LoginPage() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [pwErr, setPwErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const emailRef = useRef(null)
  const pwRef = useRef(null)
  const navigate = useNavigate()
  const [sp] = useSearchParams()

  useEffect(() => {
    if (sp.get('success')==='true') {
      localStorage.setItem('user', JSON.stringify({id:sp.get('id'),user_id:sp.get('user_id'),full_name:sp.get('full_name'),role:sp.get('role'),email:sp.get('email')}))
      navigate('/home')
    }
    if (sp.get('error')) setErrMsg(sp.get('error')==='user_not_found' ? 'No account found.' : 'Login failed.')
  }, [])

  const next = () => { if (!email.trim()) { setEmailErr(true); emailRef.current?.focus(); return } setEmailErr(false); setStep('password') }
  const submit = async () => {
    if (!password.trim()) { setPwErr(true); pwRef.current?.focus(); return }
    setPwErr(false); setErrMsg(''); setLoading(true)
    try {
      const res = await fetch(`${BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) })
      const data = await res.json()
      if (res.ok) { localStorage.setItem('user', JSON.stringify(data.user)); navigate('/home') }
      else setErrMsg(data.message || 'Invalid credentials.')
    } catch { setErrMsg('Network error.') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Left */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col items-center justify-center px-14 bg-[#0D0D0D] border-r border-[#111]/[0.06]">
        {/* Glow orbs */}
        <div className="absolute top-24 left-20 w-64 h-64 rounded-full bg-violet-700/15 blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-16 w-80 h-80 rounded-full bg-cyan-700/10 blur-3xl pointer-events-none" style={{animation:'float 4.5s ease-in-out infinite reverse'}} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.06),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-xs w-full">
          <div className="flex items-center gap-3 mb-12 animate-slide-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center shadow-lg shadow-violet-900/60">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-display text-xl text-[#F9FAFB] font-bold">UniConnect</span>
          </div>

          <h1 className="font-display text-5xl font-bold text-[#F9FAFB] leading-[1.1] mb-4 animate-fade-up">
            Your campus,<br />
            <span className="text-gradient">connected.</span>
          </h1>
          <p className="text-[#6B7280] text-sm mb-10 leading-relaxed animate-fade-up stagger-1">
            The network built for students who build, create and collaborate.
          </p>

          <div className="space-y-3.5">
            {features.map((f,i) => (
              <div key={f.label} className="flex items-center gap-3 animate-slide-left" style={{animationDelay:`${(i+2)*80}ms`}}>
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-[#111]/[0.08] flex items-center justify-center text-base flex-shrink-0">
                  {f.emoji}
                </div>
                <span className="text-[#9CA3AF] text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-8 py-16">
        <div className="w-full max-w-sm">

          {step === 'email' ? (
            <div className="animate-fade-up">
              <h2 className="font-display text-3xl font-bold text-[#F9FAFB] mb-1">Welcome back</h2>
              <p className="text-sm text-[#6B7280] mb-10">Sign in to your account</p>

              <div className="mb-8"><FloatingInput ref={emailRef} lowercase label="Email address" type="email" value={email} onChange={e=>{setEmail(e.target.value);setEmailErr(false)}} autoFocus showError={emailErr} /></div>

              <Button fullWidth icon={<ArrowRight size={16}/>} onClick={next} className="rounded-full mb-6">Continue</Button>

              <div className="flex items-center mb-6">
                <div className="flex-1 divider" />
                <span className="px-4 text-xs text-[#4B5563] tracking-widest uppercase">or</span>
                <div className="flex-1 divider" />
              </div>

              <Button fullWidth variant="outline" onClick={() => window.location.href=`${BASE}/auth/google`} className="gap-3 mb-8">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.4 13.67 17.73 9.5 24 9.5z"/><path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.67 7.1l7.18 5.58C43.36 37.28 46.52 31.36 46.52 24.5z"/><path fill="#FBBC05" d="M10.74 28.26A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.7-4.26l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.77l8.18-6.51z"/><path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.2-4.1 1.98-6.18 1.98-6.27 0-11.6-4.17-13.26-9.74l-8.18 6.51C7.07 41.52 14.82 47 24 47z"/></svg>
                Continue with Google
              </Button>
              <p className="text-center text-xs text-[#4B5563]">New here? <span className="text-violet-400 cursor-pointer hover:underline font-medium">Create account</span></p>
            </div>
          ) : (
            <div className="animate-fade-up">
              <button onClick={() => setStep('email')} className="flex items-center gap-2 text-[#6B7280] hover:text-[#D1D5DB] mb-7 text-sm transition-colors group">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 duration-200" /> Back
              </button>
              <h2 className="font-display text-3xl font-bold text-[#F9FAFB] mb-1">Enter password</h2>
              <p className="text-sm text-violet-400 font-medium mb-8 truncate">{email}</p>
              <div className="mb-6 relative">
                <FloatingInput ref={pwRef} label="Password" type={showPw?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setPwErr(false)}} autoFocus showError={pwErr} />
                {password && <button type="button" onClick={() => setShowPw(p=>!p)} className="absolute right-0 top-3 text-[#4B5563] hover:text-violet-400 transition-colors">{showPw ? <EyeOff size={16}/> : <Eye size={16}/>}</button>}
              </div>
              {errMsg && <div className="text-red-400 text-xs mb-4 bg-red-950/40 px-4 py-2.5 rounded-xl border border-red-900/50 animate-pop-in">{errMsg}</div>}
              <Button fullWidth icon={loading?null:<ArrowRight size={16}/>} onClick={submit} disabled={loading} className="rounded-full mb-5">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#111]/30 border-t-white rounded-full animate-spin-slow"/>Signing in…</span> : 'Sign in'}
              </Button>
              <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/forgot-password')} className="text-xs text-[#6B7280] hover:text-violet-400">Forgot password?</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
