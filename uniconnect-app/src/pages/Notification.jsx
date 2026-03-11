import React from "react";

const notifications = [
  {
    id: 1,
    user: "Rahul Sharma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    action: "liked your post",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    user: "Priya Verma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    action: "commented on your project",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 3,
    user: "Startup Community",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    action: "invited you to join Hackathon 2026",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    user: "Ankit Kumar",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    action: "started following you",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    user: "Design Group",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    action: "posted a new update",
    time: "Yesterday",
    unread: false,
  },
];

export default function Notifications() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h1>

          <button className="text-sm text-blue-600 hover:text-blue-700">
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-2">

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition cursor-pointer
              ${
                n.unread
                  ? "bg-blue-50 border-blue-100"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >

              {/* Avatar */}
              <img
                src={n.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Notification text */}
              <div className="flex-1">

                <p className="text-sm text-gray-700">
                  <span className="font-medium">{n.user}</span>{" "}
                  {n.action}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {n.time}
                </p>

              </div>

              {/* Unread indicator */}
              {n.unread && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}