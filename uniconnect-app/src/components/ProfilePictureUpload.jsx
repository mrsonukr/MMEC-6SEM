import React, { useState, useRef } from 'react';
import { Camera, X, Check, AlertCircle } from 'lucide-react';
import { usernameAPI, compressImage } from '../utils/api';
import Spinner from './Spinner';

// Default profile image
const DEFAULT_PROFILE_IMAGE = 'https://backend.uniconnectmmu.workers.dev/download/users/7/profile/7_1777890781131_YOR4ATDF.jpg';

const ProfilePictureUpload = ({ currentImage, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Allowed file types and size
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPG, PNG, WebP & HEIC allowed.');
      return;
    }

    if (file.size > maxFileSize) {
      setUploadError('File too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(false);

    // Auto-upload the selected file
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadError('');

    try {
      // Compress image to under 10KB before uploading
      const compressedFile = await compressImage(file, 10);
      console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB, Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      
      const response = await usernameAPI.uploadProfilePicture(compressedFile);

      if (response.success) {
        setUploadSuccess(true);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.url);
        }

        // Stop loading after 2 seconds to show completion
        setTimeout(() => {
          setIsUploading(false);
        }, 2000);
      } else {
        setUploadError(response.message || 'Upload failed');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setUploadError('');
    setUploadSuccess(false);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Profile Picture Display */}
      <div 
        className="relative group cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={currentImage || DEFAULT_PROFILE_IMAGE}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover ring-4 ring-white"
          onError={(e) => {
            console.log('Image failed to load:', currentImage);
            e.target.src = DEFAULT_PROFILE_IMAGE;
          }}
        />

        {/* Loading Spinner - Always visible during upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {/* Hover Overlay - Only when not uploading */}
        {!isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Status indicator - removed during upload */}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="absolute top-24 left-0 right-0 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
