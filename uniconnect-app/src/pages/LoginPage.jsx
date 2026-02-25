import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoveRight, MoveLeft, Eye, EyeOff } from "lucide-react";
import FloatingInput from "../components/ui/FloatingInput";
import Button from "../components/ui/Button";

const BASE = 'https://backend.uniconnectmmu.workers.dev'

export default function LoginPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'true') {
      const user = {
        id: searchParams.get('id'),
        user_id: searchParams.get('user_id'),
        full_name: searchParams.get('full_name'),
        role: searchParams.get('role'),
        email: searchParams.get('email'),
      }
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    }

    if (error === 'user_not_found') {
      setErrorMsg('Account nahi hai. Pehle register karo.')
    } else if (error) {
      setErrorMsg('Login failed: ' + error)
    }
  }, [])

  const handleNext = () => {
    if (!email.trim()) { setEmailError(true); emailRef.current?.focus(); return; }
    setEmailError(false);
    setStep("password");
  };

  const handleContinue = async () => {
    if (!password.trim()) { setPasswordError(true); passwordRef.current?.focus(); return; }
    setPasswordError(false);
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        setErrorMsg(data.message || 'Invalid email or password.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  };

  const handleGoogle = () => {
    window.location.href = `${BASE}/auth/google`
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="w-1/2 bg-white hidden md:block">
        <img
          src="/loginpage.jpg"
          alt="login"
          className="w-full p-5 h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-start md:items-center justify-center bg-white px-8 pt-16 md:pt-0">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="https://download.logo.wine/logo/LinkedIn/LinkedIn-Logo.wine.png"
              alt="logo"
              className="h-16 object-contain"
            />
          </div>

          {/* HEADING */}
          {step === "email" ? (
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Welcome back
            </h2>
          ) : (
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setStep("email")}
                className="text-gray-500 hover:text-black transition"
              >
                <MoveLeft size={20} />
              </button>
              <span className="text-xl font-semibold text-gray-800">{email}</span>
            </div>
          )}

          {/* STEP: EMAIL */}
          {step === "email" && (
            <>
              <div className="mb-6">
                <FloatingInput
                  ref={emailRef}
                  lowercase
                  label="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                  autoFocus
                  showError={emailError}
                />
              </div>

              <Button
                fullWidth
                icon={<MoveRight size={18} />}
                onClick={handleNext}
              >
                Next
              </Button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google Login */}
              <Button fullWidth variant="outline" onClick={handleGoogle}>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-5 h-5"
                />
                Login with Google
              </Button>
            </>
          )}

          {/* STEP: PASSWORD */}
          {step === "password" && (
            <>
              <div className="mb-6 relative">
                <FloatingInput
                  ref={passwordRef}
                  label="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                  autoFocus
                  showError={passwordError}
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-0 top-3 text-gray-400 hover:text-gray-700 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>

              {errorMsg && (
                <p className="text-red-500 text-xs mb-3">{errorMsg}</p>
              )}

              <Button
                fullWidth
                icon={<MoveRight size={18} />}
                onClick={handleContinue}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Continue'}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-6 mb-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Forgot Password */}
              <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}