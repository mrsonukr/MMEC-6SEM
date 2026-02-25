import React, { useState } from "react";
import { MoreVertical, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

export default function PostCard({
  name = "Ann Levin",
  avatar = "https://randomuser.me/api/portraits/women/44.jpg",
  time = "2 hours ago",
  text = "Hello everybody! We are preparing a new Prada campaign. Here's a sneak peek ;)",
  image = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
}) {
  const [vote, setVote] = useState(null);
  const [upvotes, setUpvotes] = useState(24);
  const [downvotes, setDownvotes] = useState(3);

  const handleVote = (type) => {
    if (vote === type) {
      setVote(null);
      type === "up" ? setUpvotes(v => v - 1) : setDownvotes(v => v - 1);
    } else {
      if (vote === "up") setUpvotes(v => v - 1);
      if (vote === "down") setDownvotes(v => v - 1);
      setVote(type);
      type === "up" ? setUpvotes(v => v + 1) : setDownvotes(v => v + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 ">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{time}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Text */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{text}</p>

      {/* Image */}
      {image && (
        <div className="rounded-xl overflow-hidden bg-black mb-4 max-h-[480px] flex items-center justify-center">
          <img src={image} className="w-full max-h-[480px] object-contain" />
        </div>
      )}

      {/* Divider */}
      <div className="border-t pt-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote("up")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              vote === "up" ? "bg-green-100 text-green-700" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ThumbsUp size={15} /> {upvotes}
          </button>

          <button
            onClick={() => handleVote("down")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              vote === "down" ? "bg-red-100 text-red-600" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ThumbsDown size={15} /> {downvotes}
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition ml-auto">
            <MessageCircle size={15} /> Comment
          </button>
        </div>
      </div>
    </div>
  );
}