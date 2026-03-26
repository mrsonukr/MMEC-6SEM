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
  { name: 'Account',       icon: User,         path: '/profile' },
]

const bottomItems = [
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Log Out',  icon: LogOut,   path: '/logout' },
  { name: 'Hide sidebar', icon: ChevronLeft, path: '#collapse', special: 'collapse' },
]

function NavItem({ item, isCollapsed, index, onCollapse }) {
  const Icon = item.icon
  const location = useLocation()
  const isActive = location.pathname === item.path

  if (item.special === 'collapse') {
    return (
      <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 group overflow-hidden cursor-pointer"
           onClick={() => onCollapse()}>
        {/* Hover effect */}
        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-gray-100 rounded-xl pointer-events-none" />
        
        {/* Icon */}
        {isCollapsed ? (
          <ChevronRight size={18} className="flex-shrink-0 relative z-10" />
        ) : (
          <ChevronLeft size={18} className="flex-shrink-0 relative z-10" />
        )}
        
        {/* Text */}
        <span className={`relative z-10 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          {item.name}
        </span>
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive: a }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
         group overflow-hidden
         ${a
           ? 'bg-violet-100 text-violet-700 font-semibold'
           : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
         }`
      }
    >
      {/* Hover effect */}
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-gray-100 rounded-xl pointer-events-none" />

      {/* Icon or DP */}
      {item.name === 'Account' ? (
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          className={`w-5 h-5 rounded-full object-cover flex-shrink-0 relative z-10
            ${isActive ? 'ring-2 ring-violet-600' : ''}`}
          alt="user"
        />
      ) : (
        <Icon
          size={18}
          className={`flex-shrink-0 relative z-10
            ${isActive ? 'text-violet-600' : ''}`}
        />
      )}

      {/* Text */}
      <span className={`relative z-10 whitespace-nowrap
        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
        {item.name}
      </span>

      {/* Badge */}
      {item.badge && !isCollapsed && (
        <span className="ml-auto relative z-10 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium min-w-[20px] text-center">
          {item.badge}
        </span>
      )}

      {item.badge && isCollapsed && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
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
      bg-white border-r border-gray-200
      transition-all duration-300 ease-in-out flex-shrink-0
    `}>
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between mb-7 px-2">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="text-[15px] font-bold text-gray-900 whitespace-nowrap">
                UniConnect
              </span>
            </div>
          )}

          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto">
              <Zap size={14} className="text-white" fill="white" />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-0.5">
          {menuItems.map((item, i) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={collapsed}
              index={i}
              onCollapse={() => setCollapsed(!collapsed)}
            />
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div>
        <div className="border-t border-gray-200 mb-3" />
        <div className="space-y-0.5">
          {bottomItems.map((item, i) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={collapsed}
              index={i}
              onCollapse={() => setCollapsed(!collapsed)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}