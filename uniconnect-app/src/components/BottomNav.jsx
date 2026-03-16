import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, Users, Handshake, Inbox, User, Bell,
  CalendarDays, Briefcase,
} from 'lucide-react'

const navItems = [
  { name: 'Feed',    icon: Home,         path: '/feed' },
  { name: 'Groups',  icon: Users,        path: '/groups' },
  { name: 'Collabs', icon: Handshake,    path: '/collabs' },
  { name: 'Events',  icon: CalendarDays, path: '/events' },
  { name: 'Jobs',    icon: Briefcase,    path: '/jobs' },
  { name: 'Inbox',   icon: Inbox,        path: '/inbox',         badge: 3 },
  { name: 'Notifs',  icon: Bell,         path: '/notifications', badge: 5 },
  { name: 'Profile', icon: User,         path: '/profile' },
]

// Show only the 5 most important items on mobile bottom nav
const mobileItems = [
  { name: 'Feed',    icon: Home,      path: '/feed' },
  { name: 'Groups',  icon: Users,     path: '/groups' },
  { name: 'Collabs', icon: Handshake, path: '/collabs' },
  { name: 'Inbox',   icon: Inbox,     path: '/inbox', badge: 3 },
  { name: 'Profile', icon: User,      path: '/profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-white/[0.07] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1"
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-violet-950/60' : ''
              }`}>
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-violet-400' : 'text-[#6B7280]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium truncate transition-colors duration-200 ${
                isActive ? 'text-violet-400' : 'text-[#6B7280]'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-violet-400" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
