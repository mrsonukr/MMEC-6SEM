import { useState, useEffect } from "react";
import { MoreHorizontal, FileImage, BarChart3, Sparkles, ChevronDown } from "lucide-react";
import { postsAPI } from '../utils/api';

// Default profile image
const DEFAULT_PROFILE_IMAGE = '/default-avatar.png';

const scrollbarHideStyle = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
};

export default function PostInput({ externalOpen, onModalClose, userProfile, onPostCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementInProgress, setEnhancementInProgress] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (externalOpen) {
      setIsModalOpen(true);
    }
  }, [externalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostContent("");
    setSelectedFiles([]);
    setUploadedMedia(null);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Reset uploaded media when new files are selected
    setUploadedMedia(null);
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Reset uploaded media when files are removed
    setUploadedMedia(null);
  };

  const handlePost = async () => {
    if (postContent.trim() || selectedFiles.length > 0) {
      setIsPosting(true);
      try {
        let mediaData = null;
        
        // Upload media if there are files
        if (selectedFiles.length > 0) {
          // Use already uploaded media if available
          if (uploadedMedia) {
            mediaData = uploadedMedia;
          } else {
            // Upload files first
            setIsUploading(true);
            const uploadResponse = await postsAPI.uploadMedia(selectedFiles);
            
            if (uploadResponse.success) {
              mediaData = uploadResponse.data;
              setUploadedMedia(mediaData);
            } else {
              console.error("Failed to upload media:", uploadResponse.message);
              alert("Failed to upload media: " + uploadResponse.message);
              return;
            }
          }
        }
        
        // Create post with uploaded media URLs
        const postData = {
          caption: postContent.trim(),
          media_type: mediaData?.media_type || null,
          media_urls: mediaData?.media_urls || [],
          is_private: false
        };

        const response = await postsAPI.createPost(postData);
        
        if (response.success) {
          console.log("Post created successfully:", response.data);
          handleCloseModal();
          // Call parent function to refresh posts
          if (onPostCreated) {
            onPostCreated();
          }
        } else {
          console.error("Failed to create post:", response.message);
          alert("Failed to create post: " + response.message);
        }
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Error creating post. Please try again.");
      } finally {
        setIsPosting(false);
        setIsUploading(false);
      }
    }
  };

  const handleAIEnhance = async (type) => {
    if (!postContent.trim() || enhancementInProgress) return;
    
    setEnhancementInProgress(true);
    setIsEnhancing(true);
    setShowAIOptions(false);
    
    try {
      const response = await fetch('https://ai.uniconnectmmu.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: postContent
        })
      });
      
      if (!response.ok) {
        throw new Error('AI enhancement failed');
      }
      
      const enhancedText = await response.text();
      
      // Use the enhanced text from API response
      if (enhancedText && enhancedText.trim()) {
        const finalText = enhancedText.trim();
        // Enforce 5000 character limit
        if (finalText.length > 5000) {
          setPostContent(finalText.substring(0, 5000));
        } else {
          setPostContent(finalText);
        }
      } else {
        throw new Error('Empty response from AI');
      }
      
    } catch (error) {
      console.error('AI enhancement failed:', error);
      // Show error message or fallback
      setPostContent(postContent + ' [AI enhancement failed, please try again]');
    } finally {
      setIsEnhancing(false);
      setEnhancementInProgress(false);
    }
  };

  return (
    <>
      <div className="border-b border-gray-300 -mx-4 px-4 pb-4 mb-4">
        <div className="flex items-center gap-1">
          {/* Profile Picture with Skeleton */}
          {userProfile?.profile_picture_url ? (
            <img
              className="w-10 h-10 rounded-full"
              src={userProfile.profile_picture_url}
              alt="profile"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          )}
          
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 text-gray-500 bg-transparent outline-none placeholder-gray-500 p-2 cursor-pointer"
            onClick={handleOpenModal}
            readOnly
          />
          <button className="px-4 py-1.5 font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            Post
          </button>
        </div>
      </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl mx-auto border border-gray-200 max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <h2 className="text-lg font-semibold">New Post</h2>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                </div>
                
                {/* Scrollable Content Area - Only this grows */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {/* Profile Picture with Skeleton */}
                      {userProfile?.profile_picture_url ? (
                        <img
                          className="w-10 h-10 rounded-full"
                          src={userProfile.profile_picture_url}
                          alt="profile"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">mrsonukr</div>
                      </div>
                      
                      {/* AI Enhancement Button */}
                      {postContent.trim() && (
                        <button
                          onClick={() => handleAIEnhance('enhance')}
                          disabled={isEnhancing}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {isEnhancing ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                        </button>
                      )}
                    </div>
                    
                    {/* Dynamic Textarea - This grows */}
                    <textarea
                      value={postContent}
                      onChange={(e) => {
                        const text = e.target.value;
                        // Enforce 5000 character limit
                        if (text.length <= 5000) {
                          setPostContent(text);
                        }
                      }}
                      placeholder="What's new?"
                      className="w-full p-0 outline-none resize-none text-base placeholder-gray-400 bg-transparent disabled:bg-transparent"
                      rows={1}
                      style={{ 
                        border: 'none', 
                        minHeight: '100px',
                        height: 'auto',
                        overflow: 'hidden'
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      disabled={isEnhancing}
                      maxLength={5000}
                    />
                    
                    {/* Image Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <div className="flex gap-2 overflow-x-auto px-4 -mx-4" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitScrollbar: 'none'
}}>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative flex-shrink-0">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Selected ${index + 1}`} 
                                className="h-[100px] w-auto object-contain rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Fixed Footer */}
                <div className="flex items-center gap-4 p-4 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" 
                      title="Image"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <FileImage className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Poll">
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1"></div>
                  
                  {/* Character Counter */}
                  <div className="text-xs text-gray-400">
                    {postContent.length}/5000
                  </div>
                  
                  <button
                    onClick={handlePost}
                    disabled={(!postContent.trim() && selectedFiles.length === 0) || isPosting || isUploading}
                    className={`w-16 h-8 font-medium border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                      (postContent.trim() || selectedFiles.length > 0) && !isPosting && !isUploading
                        ? 'bg-black text-white hover:bg-gray-800 border-black' 
                        : isPosting || isUploading
                        ? 'bg-black text-white border-black'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {isPosting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
    </>
  );
}
