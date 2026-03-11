import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, Image, Video, Calendar, TrendingUp, Sparkles, UserPlus } from "lucide-react";

const posts = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "2h ago",
    text: "Excited to collaborate with developers for Hackathon 2026 🚀 Building something amazing with React and Node.js. Who's joining?",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
  },
  {
    id: 2,
    name: "Priya Verma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "5h ago",
    text: "Just finished designing a new UI for a productivity app. The focus was on minimalism and user experience. What do you think about this approach?",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    likes: 42,
    comments: 15,
    shares: 7,
    isLiked: true,
  },
  {
    id: 3,
    name: "Amit Kumar",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    time: "8h ago",
    text: "Learning AI/ML has been transformative for my career. Started with Python basics and now building recommendation systems. The future is here! 🤖",
    likes: 67,
    comments: 23,
    shares: 12,
    isLiked: false,
  },
];

const trendingTopics = [
  { topic: "#Hackathon2026", posts: "2.1K posts" },
  { topic: "#ReactJS", posts: "1.8K posts" },
  { topic: "#AI_ML", posts: "3.2K posts" },
  { topic: "#WebDev", posts: "4.5K posts" },
];

export default function Feed() {
  const [likedPosts, setLikedPosts] = useState(new Set([2])); // Post ID 2 is liked
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postText, setPostText] = useState("");

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Feed
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">

            {/* Create Post Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    className="w-12 h-12 rounded-full ring-2 ring-blue-100"
                  />
                  <div className="flex-1">
                    <div
                      onClick={() => setShowCreatePost(!showCreatePost)}
                      className="w-full bg-gray-50 hover:bg-gray-100 rounded-2xl px-4 py-3 text-gray-500 cursor-pointer transition-colors duration-200 border border-gray-200 hover:border-blue-300"
                    >
                      Share something amazing with your network...
                    </div>

                    {showCreatePost && (
                      <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <textarea
                          value={postText}
                          onChange={(e) => setPostText(e.target.value)}
                          placeholder="What's on your mind?"
                          className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          rows="4"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Image size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Video size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                              <Calendar size={20} />
                            </button>
                          </div>
                          <button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            onClick={() => {
                              setShowCreatePost(false);
                              setPostText("");
                            }}
                          >
                            <Plus size={18} className="inline mr-2" />
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.avatar}
                      className="w-12 h-12 rounded-full ring-2 ring-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
                        {post.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{post.time}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-500">🌐</span>
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Text */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {post.text}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Heart size={12} className="text-white fill-current" />
                      </div>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex gap-4">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        likedPosts.has(post.id)
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart
                        size={18}
                        className={likedPosts.has(post.id) ? 'fill-current' : ''}
                      />
                      <span className="font-medium">Like</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <MessageCircle size={18} />
                      <span className="font-medium">Comment</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Share2 size={18} />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Trending Topics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600" size={20} />
                <h3 className="font-semibold text-gray-800">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {topic.topic}
                      </p>
                      <p className="text-sm text-gray-500">{topic.posts}</p>
                    </div>
                    <Sparkles size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-colors backdrop-blur-sm">
                  <div className="font-medium">Create Event</div>
                  <div className="text-sm opacity-90">Organize a meetup</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-colors backdrop-blur-sm">
                  <div className="font-medium">Find Jobs</div>
                  <div className="text-sm opacity-90">Explore opportunities</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-colors backdrop-blur-sm">
                  <div className="font-medium">Join Groups</div>
                  <div className="text-sm opacity-90">Connect with peers</div>
                </button>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Sarah</span> liked your post
                    </p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Mike</span> commented on your post
                    </p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserPlus size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Alex</span> started following you
                    </p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}