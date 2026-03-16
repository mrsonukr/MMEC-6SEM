import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Zap, X, Menu } from 'lucide-react'

const links = [
  { to: '/',                label: 'Dashboard' },
  { to: '/login',           label: 'Login' },
  { to: '/forgot-password', label: 'Forgot' },
  { to: '/reset-password',  label: 'Reset' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#111]/[0.07] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-md shadow-violet-900/50 group-hover:scale-110 transition-transform duration-200">
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="font-display text-[15px] font-bold text-[#F9FAFB] tracking-tight">UniConnect</span>
        </div>
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-violet-950/60 text-violet-300 border border-violet-700/40' : 'text-[#6B7280] hover:text-[#D1D5DB] hover:bg-white/[0.05]'}`
              }
            >{link.label}</NavLink>
          ))}
        </nav>
        <button className="sm:hidden p-2 rounded-lg text-[#6B7280] hover:bg-white/[0.05] hover:text-[#D1D5DB] transition-all" onClick={() => setOpen(o => !o)}>
          <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </div>
      {open && (
        <div className="sm:hidden border-t border-[#111]/[0.06] bg-[#0D0D0D] px-4 py-3 flex flex-col gap-1 animate-fade-up">
          {links.map((link, i) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 50}ms` }}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 animate-slide-left
                ${isActive ? 'bg-violet-950/60 text-violet-300' : 'text-[#6B7280] hover:bg-white/[0.05] hover:text-[#D1D5DB]'}`
              }
            >{link.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
