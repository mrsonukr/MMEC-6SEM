import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, Users, Handshake, Inbox, User, Bell,
  Settings, LogOut, ChevronLeft, ChevronRight,
  CalendarDays, Briefcase, Zap,
} from 'lucide-react'

const menuItems = [
  { name: 'Feed',          icon: Home,         path: '/feed' },
  { name: 'Groups',        icon: Users,        path: '/groups' },
  { name: 'Collabs',       icon: Handshake,    path: '/collabs' },
  { name: 'Events',        icon: CalendarDays, path: '/events' },
  { name: 'Jobs',          icon: Briefcase,    path: '/jobs' },
  { name: 'Inbox',         icon: Inbox,        path: '/inbox',         badge: 3 },
  { name: 'Notifications', icon: Bell,         path: '/notifications', badge: 5 },
  { name: 'Profile',       icon: User,         path: '/profile' },
]
const bottomItems = [
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Log Out',  icon: LogOut,   path: '/logout' },
]

function NavItem({ item, isCollapsed, index }) {
  const Icon = item.icon
  const location = useLocation()
  const isActive = location.pathname === item.path

  return (
    <NavLink
      to={item.path}
      style={{ animationDelay: `${index * 45}ms` }}
      className={({ isActive: a }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
         transition-all duration-200 group overflow-hidden animate-slide-left
         ${a
           ? 'nav-active bg-violet-950/50 text-violet-300 font-semibold'
           : 'text-[#6B7280] hover:bg-white/[0.05] hover:text-[#D1D5DB]'
         }`
      }
    >
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-white/[0.04] transition-transform duration-300 ease-out rounded-xl pointer-events-none" />
      <Icon
        size={18}
        className={`flex-shrink-0 relative z-10 transition-all duration-200
          ${isActive ? 'text-violet-400' : 'group-hover:scale-110 group-hover:text-violet-400'}`}
      />
      <span className={`relative z-10 transition-all duration-300 whitespace-nowrap
        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
        {item.name}
      </span>
      {item.badge && !isCollapsed && (
        <span className="ml-auto relative z-10 text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded-full font-bold badge-pulse">
          {item.badge}
        </span>
      )}
      {item.badge && isCollapsed && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 badge-pulse" />
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`
      hidden md:flex flex-col justify-between
      ${collapsed ? 'w-[68px]' : 'w-[232px]'}
      h-screen px-3 py-6
      bg-[#0D0D0D] border-r border-[#111]/[0.06]
      transition-all duration-300 ease-in-out flex-shrink-0
    `}>
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between mb-7 px-2">
          {!collapsed && (
            <div className="flex items-center gap-2.5 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/50 animate-float flex-shrink-0">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="font-display text-[15px] font-bold text-[#F9FAFB] tracking-tight whitespace-nowrap">
                UniConnect
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center mx-auto animate-float">
              <Zap size={14} className="text-white" fill="white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-[#4B5563] hover:bg-white/[0.05] hover:text-[#9CA3AF] transition-all duration-200"
            >
              <ChevronLeft size={15} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-1.5 rounded-lg text-[#4B5563] hover:bg-white/[0.05] hover:text-[#9CA3AF] transition-all duration-200 mb-4"
          >
            <ChevronRight size={15} />
          </button>
        )}

        {/* User pill */}
        {!collapsed && (
          <div className="mx-1 mb-5 p-3 rounded-2xl bg-white/[0.04] border border-[#111]/[0.07] animate-pop-in">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <img src="https://randomuser.me/api/portraits/men/75.jpg"
                  className="w-9 h-9 rounded-full ring-2 ring-violet-800/60 ring-offset-1 ring-offset-[#0D0D0D] object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#F9FAFB] truncate leading-tight">Rahul Sharma</p>
                <p className="text-xs text-[#6B7280]">Student · CS</p>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-0.5">
          {menuItems.map((item, i) => (
            <NavItem key={item.name} item={item} isCollapsed={collapsed} index={i} />
          ))}
        </nav>
      </div>

      <div>
        <div className="divider-glow mb-3" />
        <div className="space-y-0.5">
          {bottomItems.map((item, i) => (
            <NavItem key={item.name} item={item} isCollapsed={collapsed} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
