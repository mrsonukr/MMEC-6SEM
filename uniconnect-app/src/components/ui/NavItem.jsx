import { NavLink } from "react-router-dom";

export default function NavItem({ item, isCollapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600 font-medium"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }`
      }
    >
      {/* Icon */}
      <Icon size={20} className="flex-shrink-0" />

      {/* Text */}
      <span
        className={`transition-all duration-300 whitespace-nowrap
        ${
          isCollapsed
            ? "opacity-0 w-0 overflow-hidden"
            : "opacity-100 ml-1"
        }`}
      >
        {item.name}
      </span>

      {/* Badge */}
      {item.badge && !isCollapsed && (
        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}