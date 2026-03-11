import React from "react";
import { Users, Search, Plus } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Web Developers",
    members: 124,
    description: "Discuss React, Node.js and full-stack projects.",
    color: "from-blue-300 to-indigo-300",
  },
  {
    id: 2,
    name: "AI Enthusiasts",
    members: 89,
    description: "Talk about machine learning and AI tools.",
    color: "from-purple-300 to-pink-300",
  },
  {
    id: 3,
    name: "Startup Builders",
    members: 56,
    description: "Find collaborators and build startups.",
    color: "from-green-300 to-emerald-300",
  },
  {
    id: 4,
    name: "UI/UX Designers",
    members: 71,
    description: "Share design inspiration and Figma tips.",
    color: "from-orange-300 to-yellow-300",
  },
];

export default function Groups() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">

        <div className="flex items-center gap-3">
          <Users size={28} className="text-blue-600"/>
          <h1 className="text-2xl font-bold text-gray-800">
            Groups
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
          <Plus size={18}/>
          Create Group
        </button>

      </div>

      {/* Search Bar */}
      <div className="relative mb-10 max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
        <input
          type="text"
          placeholder="Search groups..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300"
          >

            {/* Soft Gradient Banner */}
            <div
              className={`h-20 rounded-t-2xl bg-gradient-to-r ${group.color}`}
            />

            {/* Content */}
            <div className="p-5">

              <h2 className="text-lg font-semibold text-gray-800">
                {group.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {group.members} members
              </p>

              <p className="text-sm text-gray-600 mt-3">
                {group.description}
              </p>

              {/* Member avatars */}
              <div className="flex items-center mt-4">
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://i.pravatar.cc/100?img=5"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white -ml-3"
                  src="https://i.pravatar.cc/100?img=8"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white -ml-3"
                  src="https://i.pravatar.cc/100?img=10"
                />

                <span className="text-xs text-gray-500 ml-2">
                  +{group.members}
                </span>
              </div>

              {/* Join button */}
              <button className="mt-5 w-full py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">
                Join Group
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}