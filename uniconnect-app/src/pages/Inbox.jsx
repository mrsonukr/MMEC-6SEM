import React from "react";
import { Inbox as InboxIcon } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "Rahul Sharma",
    message: "Hey! Are you joining the hackathon?",
    time: "2 min ago",
  },
  {
    id: 2,
    sender: "Priya Verma",
    message: "Can you review my React project?",
    time: "10 min ago",
  },
  {
    id: 3,
    sender: "Startup Team",
    message: "We have a meeting at 7 PM.",
    time: "1 hour ago",
  },
];

export default function Inbox() {
  return (
    <div className="p-6">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <InboxIcon size={28} />
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border divide-y">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{msg.sender}</h3>
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {msg.message}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}