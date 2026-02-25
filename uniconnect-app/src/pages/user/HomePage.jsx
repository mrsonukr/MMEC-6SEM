import React from "react";
import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";
import SuggestionCard from "../../components/SuggestionCard";

const posts = [
  {
    name: "Ann Levin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "2 hours ago",
    text: "Hello everybody! We are preparing a new Prada campaign. Here's a sneak peek ;)",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    name: "James Dorwart",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "5 hours ago",
    text: "Just wrapped up an amazing collab shoot in the mountains. Nature never disappoints 🏔️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  },
  {
    name: "Jocelyn Westervelt",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    time: "Yesterday",
    text: "New reel dropping tonight. Stay tuned! 🎬",
    image: "",
  },
  {
    name: "Phillip Aminoff",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    time: "2 days ago",
    text: "Behind the scenes from our latest brand shoot. Loved working with this team 🙌",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    name: "Ann Levin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "2 hours ago",
    text: "Hello everybody! We are preparing a new Prada campaign. Here's a sneak peek ;)",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    name: "James Dorwart",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "5 hours ago",
    text: "Just wrapped up an amazing collab shoot in the mountains. Nature never disappoints ",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  },
];

export default function HomePage() {
  return (
    <div className="h-screen flex bg-[#f5f6f8] overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 min-w-0 overflow-hidden items-start h-screen">

        {/* Feed */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto no-scrollbar py-6 px-4 md:px-8 pb-24 md:pb-6">
          <div className="max-w-xl mx-auto space-y-5">
            {posts.map((post, i) => (
              <PostCard key={i} {...post} />
            ))}
          </div>
        </div>

        {/* Right Panel — sticky */}
        <div className="hidden xl:block w-[380px] 2xl:w-[440px] flex-shrink-0 h-full py-6 pr-6 overflow-y-auto no-scrollbar">
          <SuggestionCard />
        </div>

      </div>
    </div>
  );
}