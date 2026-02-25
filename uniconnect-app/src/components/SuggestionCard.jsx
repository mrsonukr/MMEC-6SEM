import React from "react";
import SuggestionItem from "./ui/SuggestionItem";

export default function SuggestionCard() {
  const users = [
    "Desiree Baptista",
    "James Dorwart",
    "Jocelyn Westervelt",
    "Phillip Aminoff",
    "Ann Levin",
  ];

  return (
    <div className="bg-white rounded-3xl p-6 w-full">
      
      <h3 className="text-[16px] font-semibold mb-3">
        Based on Your Profile
      </h3>

      <div>
        {users.map((name, i) => (
          <SuggestionItem
            key={i}
            name={name}
            image={`https://randomuser.me/api/portraits/${
              i % 2 ? "men" : "women"
            }/${i + 20}.jpg`}
          />
        ))}
      </div>

      <div className="text-center mt-2">
        <button className="text-sm text-gray-600 hover:text-black transition">
          VIEW MORE →
        </button>
      </div>
    </div>
  );
}