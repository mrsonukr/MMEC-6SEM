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
  Moon,
  Sun,
} from "lucide-react";

const menuItems = [
  { name: "Feed", icon: Home },
  { name: "Groups", icon: Users },
  { name: "Collabs", icon: Handshake },
  { name: "Inbox", icon: Inbox },
  { name: "Profile", icon: User },
  { name: "Notifications", icon: Bell },
  { name: "Search", icon: Search },
];

const bottomItems = [
  { name: "Settings", icon: Settings },
  { name: "Log Out", icon: LogOut },
];

const mobileTabs = [
  { name: "Home", icon: Home },
  { name: "Notifications", icon: Bell },
  { name: "Search", icon: Search },
  { name: "Message", icon: Inbox },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [active, setActive] = useState("Feed");
  const [theme, setTheme] = useState("light");

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[220px] h-screen bg-white flex-col justify-between px-4 py-6 flex-shrink-0">

        {/* Top */}
        <div>
          <h1 className="text-lg font-bold tracking-tight mb-8 px-3">UniConnect</h1>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 border-t pt-4 space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="bg-gray-100 rounded-xl p-1 flex">
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition ${
              theme === "dark" ? "bg-white shadow text-gray-800" : "text-gray-500"
            }`}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition ${
              theme === "light" ? "bg-green-300 shadow text-gray-800" : "text-gray-500"
            }`}
          >
            <Sun size={14} /> Light
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center px-2 py-2">
        {mobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{item.name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}