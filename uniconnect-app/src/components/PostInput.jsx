import { useState, useEffect } from "react";
import { MoreHorizontal, FileImage, BarChart3 } from "lucide-react";

const scrollbarHideStyle = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
};

export default function PostInput({ externalOpen, onModalClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

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
    setSelectedImages([]);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (postContent.trim()) {
      console.log("Posting:", postContent);
      // TODO: Add actual post functionality
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="border-b border-gray-300 -mx-4 px-4 pb-4 mb-4">
        <div className="flex items-center gap-1">
          <img
            className="w-9 h-9 rounded-full border border-gray-300"
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="profile"
          />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
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
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  className="w-10 h-10 rounded-full border border-gray-300"
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="profile"
                />
                <div className="flex-1">
                  <div className="font-semibold">mrsonukr</div>
                </div>
              </div>
              
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's new?"
                className="w-full p-0 outline-none resize-none text-base placeholder-gray-400"
                rows={4}
                style={{ border: 'none' }}
              />
              
              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <div className="flex gap-2 overflow-x-auto px-4 -mx-4" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitScrollbar: 'none'
}}>
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img 
                          src={image} 
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
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t -mx-6 px-6">
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
                
                <button
                  onClick={handlePost}
                  disabled={!postContent.trim()}
                  className={`px-4 py-1.5 font-medium border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    postContent.trim() 
                      ? 'bg-black text-white hover:bg-gray-800 border-black' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Post
                </button>
              </div>
              
              </div>
          </div>
        </div>
      )}
    </>
  );
}
