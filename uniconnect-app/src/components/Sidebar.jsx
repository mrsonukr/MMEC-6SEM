import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, Search, Bell, User, Settings
} from 'lucide-react'

const menuItems = [
  { name: 'Home',          icon: Home,         path: '/' },
  { name: 'Search',        icon: Search,       path: '/search' },
  { name: 'Notifications', icon: Bell,         path: '/notifications', badge: 5 },
  { name: 'Account',       icon: User,         path: '/profile' },
]

const bottomItems = [
  { name: 'Settings', icon: Settings, path: '/settings' },
]

function NavItem({ item, isCollapsed, index, onCollapse }) {
  const Icon = item.icon
  const location = useLocation()
  const isActive = location.pathname === item.path

  return (
    <NavLink
      to={item.path}
      className={({ isActive: a }) =>
        `flex items-center pl-6 pr-3 py-3 rounded-lg transition-all duration-200 relative ${
          a
            ? 'text-black'
            : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      {/* Icon */}
      <Icon
        size={28}
        className={`flex-shrink-0 ${
          isActive ? 'text-black' : 'text-current'
        }`}
      />

      {/* Badge next to icon */}
      {item.badge && (
        <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`
      hidden md:flex flex-col
      w-28
      h-screen
      transition-all duration-300 ease-in-out
    `}>
      {/* Logo - Top */}
        <div className="pt-4 pl-6">
          <img 
            src="/logo.svg" 
            alt="UniConnect" 
            className=" w-20 object-contain transition-all duration-300"
          />
      </div>

      {/* Navigation - Vertical Line */}
      <div className="flex-1 py-6 bg-gray-50 flex items-center">
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={collapsed}
              index={0}
              onCollapse={() => setCollapsed(!collapsed)}
            />
          ))}
        </nav>
      </div>

      {/* Settings - Bottom */}
      <div className="pb-8">
        <nav className="space-y-4">
          {bottomItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={collapsed}
              index={0}
              onCollapse={() => setCollapsed(!collapsed)}
            />
          ))}
        </nav>
      </div>
    </div>
  )
}