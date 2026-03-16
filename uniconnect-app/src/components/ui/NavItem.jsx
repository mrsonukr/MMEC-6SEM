import { NavLink } from 'react-router-dom'

export default function NavItem({ item, isCollapsed }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
        transition-all duration-200 group overflow-hidden
        ${isActive
          ? 'nav-active bg-violet-950/40 text-violet-400 font-medium'
          : 'text-[#6B7280] hover:bg-violet-950/40 hover:text-[#F9FAFB]'
        }`
      }
    >
      <Icon size={19} className="flex-shrink-0" />

      <span className={`transition-all duration-300 whitespace-nowrap font-medium
        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
        {item.name}
      </span>

      {item.badge && !isCollapsed && (
        <span className="ml-auto text-xs btn-gold px-2 py-0.5 rounded-full text-white text-[10px] font-semibold">
          {item.badge}
        </span>
      )}

      {item.badge && isCollapsed && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[color:var(--accent)]" />
      )}
    </NavLink>
  )
}
