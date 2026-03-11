import React from "react";
import { Briefcase } from "lucide-react";

export default function Jobs() {
  return (
    <div className="p-8">

      <div className="flex items-center gap-3 mb-6">
        <Briefcase size={28} className="text-blue-600"/>
        <h1 className="text-2xl font-bold">Jobs / Referrals</h1>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">

        <h2 className="font-semibold">
          Frontend Developer Internship
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Company: TechNova
        </p>

        <p className="text-gray-600 mt-2">
          Looking for React developers. Remote internship opportunity.
        </p>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Apply
        </button>

      </div>

    </div>
  );
}