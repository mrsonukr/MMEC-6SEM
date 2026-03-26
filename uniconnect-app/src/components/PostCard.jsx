import { useState } from "react";
import { Heart, MessageCircle, Send, ArrowUp } from "lucide-react";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setCommentText("");
  };

  return (
    <div>
      <div className="flex items-start gap-3 mb-3">
        <img
          className="w-10 h-10 rounded-full"
          src={post.profileImage}
          alt="profile"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{post.author}</h3>
            <span className="text-gray-500 text-sm">{post.time}</span>
          </div>

          <p className="text-gray-800 mt-1">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-3">
              <img
                className="max-h-[400px] object-contain rounded-lg"
                src={post.image}
                alt="post"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1 mt-4 text-gray-500 ml-14 select-none">
        <div 
          className="flex items-center gap-2 hover:text-gray-700 hover:bg-[#F5F5F5] cursor-pointer transition-colors -ml-4 px-3 py-1.5 rounded-full"
          onClick={handleLike}
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
          />
          <span className="text-sm">{likes}</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-700 hover:bg-[#F5F5F5] cursor-pointer transition-colors px-3 py-1.5 rounded-full" onClick={handleCommentClick}>
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{post.comments}</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-700 hover:bg-[#F5F5F5] cursor-pointer transition-colors px-3 py-1.5 rounded-full">
          <Send className="w-5 h-5" />
          <span className="text-sm">{post.shares}</span>
        </div>
      </div>
      
      <div className="border-b border-gray-300 mt-4 -mx-4"></div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-4xl mx-4 h-[600px] flex overflow-hidden">
            {/* Left Side - Media */}
            <div className="w-1/2 border-r border-gray-200 flex items-center justify-center bg-gray-50 rounded-tl-3xl">
              {post.image ? (
                <img 
                  src={post.image} 
                  alt="Post media" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <p>No media available</p>
                </div>
              )}
            </div>

            {/* Right Side - Comments */}
            <div className="w-1/2 flex flex-col rounded-tr-3xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={post.profileImage}
                    alt="profile"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{post.author}</h3>
                    <span className="text-gray-500 text-xs">{post.time}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseCommentModal}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              </div>

              {/* Comment Input */}
              <div className="border-t p-4">
                {/* Like and Share Buttons */}
                <div className="flex items-center gap-1 mb-3">
                  <div 
                    className="flex items-center gap-2 hover:text-gray-700 hover:bg-[#F5F5F5] cursor-pointer transition-colors -ml-4 px-3 py-1.5 rounded-full"
                    onClick={handleLike}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                    <span className="text-sm">{likes}</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-gray-700 hover:bg-[#F5F5F5] cursor-pointer transition-colors px-3 py-1.5 rounded-full">
                    <Send className="w-5 h-5" />
                    <span className="text-sm">{post.shares}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="Your profile"
                  />
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:bg-gray-200 transition-colors"
                  />
                  <button
                    className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!commentText.trim()}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
