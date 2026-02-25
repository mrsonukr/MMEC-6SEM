import React from "react";

export default function SuggestionItem({ name, image }) {
  return (
    <div className="flex items-center justify-between py-4">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <img
          src={image}
          className="w-11 h-11 rounded-full object-cover"
        />

        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">
            Instagram Influencer, TikToker
          </p>
        </div>
      </div>

      {/* Button */}
      <button className="text-xs font-medium px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition">
        CONNECT
      </button>
    </div>
  );
}