import React from "react";
import { CalendarDays } from "lucide-react";

export default function Events() {
  return (
    <div className="p-8">

      <div className="flex items-center gap-3 mb-6">
        <CalendarDays size={28} className="text-blue-600"/>
        <h1 className="text-2xl font-bold">Events</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold">Hackathon 2026</h2>
        <p className="text-sm text-gray-500 mt-1">
          April 12 • Online
        </p>

        <p className="text-gray-600 mt-2">
          Join developers and build amazing projects.
        </p>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Register
        </button>
      </div>

    </div>
  );
}