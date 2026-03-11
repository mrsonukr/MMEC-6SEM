import React, { useState } from "react";
import {
  Home,
  Users,
  Handshake,
  Inbox,
  User,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Briefcase,
} from "lucide-react";

import NavItem from "./ui/NavItem";

const menuItems = [
  { name: "Feed", icon: Home, path: "/feed" },
  { name: "Groups", icon: Users, path: "/groups" },
  { name: "Collabs", icon: Handshake, path: "/collabs" },
  { name: "Events", icon: CalendarDays, path: "/events" },
  { name: "Jobs / Referrals", icon: Briefcase, path: "/jobs" },
  { name: "Inbox", icon: Inbox, path: "/inbox", badge: 3 },
  { name: "Notifications", icon: Bell, path: "/notifications", badge: 5 },
  { name: "Search", icon: Search, path: "/search" },
  { name: "Profile", icon: User, path: "/profile" },
];

const bottomItems = [
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Log Out", icon: LogOut, path: "/logout" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`hidden md:flex ${
        collapsed ? "w-[80px]" : "w-[250px]"
      } h-screen flex-col justify-between px-3 py-6
      transition-all duration-300 ease-in-out bg-white border-r border-gray-100`}
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">

          {/* Logo */}
          <h1
            className={`text-lg font-bold tracking-tight text-blue-600 whitespace-nowrap
            transition-all duration-300
            ${
              collapsed
                ? "opacity-0 -translate-x-4 w-0 overflow-hidden"
                : "opacity-100 translate-x-0"
            }`}
          >
            UniConnect
          </h1>

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-100 transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

        </div>

        {/* Main Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={collapsed} />
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div>
        <div className="border-t pt-4 space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={collapsed} />
          ))}
        </div>
      </div>
    </div>
  );
}