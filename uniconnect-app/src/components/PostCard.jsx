import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Send, ArrowUp, MoreHorizontal, Edit, Trash2, Share2, Eye, EyeOff, MessageSquareOff, Flag, UserMinus } from "lucide-react";
import { postsAPI } from '../utils/api';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Spinner from './Spinner';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DEFAULT_PROFILE_IMAGE = '/images/default_profile.png';

const getAuthorInfo = (post) => {
  const author = typeof post.author === 'object' ? post.author : null;
  const username = author?.username || post.username || post.author_username || '';

  return {
    username,
    displayUsername: username || 'unknown'
  };
};

// Image Skeleton Component with aspect ratio
const ImageSkeleton = ({ width, height, className = "" }) => {
  return (
    <div 
      className={`bg-gray-200 animate-pulse rounded-lg ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : '16/9' }}
    />
  );
};

export default function PostCard({ post, currentUser, onDeletePost }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const dropdownRef = useRef(null);
  const authorInfo = getAuthorInfo(post);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPostDropdown(false);
      }
    };

    if (showPostDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPostDropdown]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    setSelectedMediaIndex(0);
    setShowCommentModal(true);
  };

  const handleMediaClick = (mediaIndex = 0) => {
    setSelectedMediaIndex(mediaIndex);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setCommentText("");
  };

  const handleImageLoad = (imageIndex) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageIndex]: true
    }));
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const response = await postsAPI.deletePost(post.id);
      if (response.success) {
        console.log('Post deleted successfully:', post.id);
        setShowDeleteConfirm(false);
        setShowPostDropdown(false);
        // Call parent function to update posts list
        if (onDeletePost) {
          onDeletePost(post.id);
        }
      } else {
        console.error('Failed to delete post:', response.message);
        alert('Failed to delete post: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const postMenuItems = currentUser && post.author_id === currentUser.id ? [
    // Owner menu items
    {
      label: post.is_private ? 'Make Public' : 'Make Private',
      icon: post.is_private ? <Eye size={16} /> : <EyeOff size={16} />,
      onClick: () => console.log(`${post.is_private ? 'Make Public' : 'Make Private'} post:`, post.id)
    },
    {
      label: 'Turn off commenting',
      icon: <MessageSquareOff size={16} />,
      onClick: () => console.log('Turn off commenting for post:', post.id)
    },
    {
      label: 'Delete post',
      icon: <Trash2 size={16} />,
      onClick: () => {
        setShowDeleteConfirm(true);
        setShowPostDropdown(false);
      },
      danger: true
    }
  ] : [
    // Other users' menu items
    {
      label: 'Report post',
      icon: <Flag size={16} />,
      onClick: () => console.log('Report post:', post.id),
      danger: true
    },
    {
      label: 'Disconnect',
      icon: <UserMinus size={16} />,
      onClick: () => {}
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            className="w-10 h-10 rounded-full flex-shrink-0"
            src={post.profileImage}
            alt="profile"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-base leading-none">
                {authorInfo.displayUsername}
              </h3>
              {post.level ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 leading-none">
                  {post.level}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-500 text-sm leading-none">{post.time}</span>

          {/* Three dots menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowPostDropdown(!showPostDropdown)}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {showPostDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {postMenuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                      item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      item.onClick();
                      setShowPostDropdown(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="pl-[52px]">
        <p className="text-gray-800 mt-1">
          {post.content}
        </p>

          {/* Handle media display based on media_urls and media_type */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-3">
              {post.media_type === 'video' || post.media_type === 'videos' ? (
                <video
                  className="max-h-[400px] w-full object-contain rounded-lg"
                  controls
                  src={post.media_urls[0]}
                  onClick={() => handleMediaClick(0)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                (() => {
                  const hasMoreThanThree = post.media_urls.length > 3;
                  const displayMedia = hasMoreThanThree ? post.media_urls.slice(0, 3) : post.media_urls;
                  const extraCount = post.media_urls.length - 3;

                  return (
                <div className={`grid gap-2 ${
                  displayMedia.length === 1 ? 'grid-cols-1' : 
                  displayMedia.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-3'
                }`}>
                  {displayMedia.map((url, index) => {
                    const dimensions = post.media_dimensions?.[index];
                    const isLoaded = loadedImages[index];
                    
                    return (
                      <div key={index} className="relative">
                        {!isLoaded && (
                          <ImageSkeleton 
                            width={dimensions?.width}
                            height={dimensions?.height}
                            className="w-full h-48"
                          />
                        )}
                        <img
                          className={`object-cover rounded-lg ${
                            displayMedia.length === 1 ? 'max-h-[400px] w-full' : 'h-48 w-full'
                          } ${!isLoaded ? 'absolute inset-0 opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                          src={url}
                          alt={`post media ${index + 1}`}
                          onLoad={() => handleImageLoad(index)}
                          onClick={() => handleMediaClick(index)}
                        />
                        {hasMoreThanThree && index === 2 && (
                          <div className="absolute inset-0 bg-black/55 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                            +{extraCount} More
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                  );
                })()
              )}
            </div>
          )}

          {/* Fallback for backward compatibility with single image */}
          {post.image && !post.media_urls && (
            <div className="mt-3">
              <img
                className="max-h-[400px] object-contain rounded-lg"
                src={post.image}
                alt="post"
                onClick={() => handleMediaClick(0)}
              />
            </div>
          )}
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
            <div className="w-1/2 border-r border-gray-200 flex items-center justify-center bg-black rounded-tl-3xl">
              {post.media_urls && post.media_urls.length > 0 ? (
                post.media_type === 'video' || post.media_type === 'videos' ? (
                  <video 
                    className="max-w-full max-h-full object-contain"
                    controls
                    src={post.media_urls[0]}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : post.media_urls.length > 1 ? (
                  <Swiper
                    key={`comment-swiper-${post.id}-${selectedMediaIndex}`}
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    initialSlide={Math.min(selectedMediaIndex, post.media_urls.length - 1)}
                    className="w-full h-full comment-media-swiper"
                  >
                    {post.media_urls.map((mediaUrl, index) => (
                      <SwiperSlide key={`${mediaUrl}-${index}`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={mediaUrl}
                            alt={`Post media ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img 
                    src={post.media_urls[0]} 
                    alt="Post media" 
                    className="max-w-full max-h-full object-contain"
                  />
                )
              ) : post.image ? (
                <img 
                  src={post.image} 
                  alt="Post media" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                      {post.content || 'No caption available'}
                    </p>
                  </div>
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
                    onError={(e) => {
                      e.target.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-gray-900">{authorInfo.displayUsername}</h3>
                      {post.level ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {post.level}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-gray-500 text-xs">{post.created_at}</span>
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
                    <span className="text-sm">{post.shares || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={currentUser?.profile_picture_url || DEFAULT_PROFILE_IMAGE}
                    alt="Your profile"
                    onError={(e) => {
                      e.target.src = DEFAULT_PROFILE_IMAGE;
                    }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="w-20 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="w-20 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Spinner />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
