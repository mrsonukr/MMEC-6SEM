// API utility functions for backend communication

const API_BASE_URL = 'https://backend.uniconnectmmu.workers.dev';

// Image compression utility - compress image to under 25KB
export const compressImage = async (file, maxSizeKB = 25) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate dimensions to fit within 800x800 while maintaining aspect ratio
        const maxDimension = 800;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        let quality = 0.9;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Reduce quality until file is under maxSizeKB
        while (compressedDataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        // Convert data URL to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Store username in localStorage
export const setUsername = (username) => {
  localStorage.setItem('username', username);
};

// Get username from localStorage
export const getUsername = () => {
  return localStorage.getItem('username');
};

// Store profile picture URL in localStorage
export const setProfilePictureUrl = (url) => {
  localStorage.setItem('profilePictureUrl', url);
};

// Get profile picture URL from localStorage
export const getProfilePictureUrl = () => {
  return localStorage.getItem('profilePictureUrl');
};

// Store user profile data (username and profile pic) in localStorage
export const storeUserProfileData = (user) => {
  if (user) {
    // Extract username from various possible fields
    const username = user.username || user.user?.username || '';
    setUsername(username);
    
    // Extract profile picture URL from various possible fields
    const profilePicUrl = 
      user.profile_picture_url ||
      user.profile_picture ||
      user.avatar_url ||
      user.avatar ||
      user.url ||
      user.user?.profile_picture_url ||
      user.user?.profile_picture ||
      user.user?.avatar_url ||
      user.user?.avatar ||
      user.user?.url ||
      '';
    setProfilePictureUrl(profilePicUrl);
    
    console.log('Stored user profile data:', { username, profilePicUrl });
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  // For FormData, don't set Content-Type header
  const isFormData = options.body instanceof FormData;
  
  const config = {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Username related API calls
export const usernameAPI = {
  // Set username for authenticated user
  setUsername: async (username) => {
    return apiRequest('/auth/set-username', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  // Get username suggestions based on user's profile
  getUsernameSuggestions: async () => {
    return apiRequest('/auth/username-suggestions', {
      method: 'GET',
    });
  },

  // Check if username is available
  checkUsernameAvailability: async (username) => {
    return apiRequest(`/auth/check-username?username=${encodeURIComponent(username)}`, {
      method: 'GET',
    });
  },

  // Check if user has username set
  checkUsernameStatus: async () => {
    return apiRequest('/auth/username-status', {
      method: 'GET',
    });
  },

  // Get current logged-in user profile
  getMyProfile: async () => {
    return apiRequest('/auth/profile', {
      method: 'GET',
    });
  },

  // Upload user profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/users/me/profile', {
      method: 'POST',
      body: formData,
    });
  },

  // Get user profile picture
  getProfilePicture: async (userId) => {
    return apiRequest(`/users/${userId}/profile`, {
      method: 'GET',
    });
  },
  getUserProfile: async () => {
    return apiRequest('/users/profile/', {
      method: 'GET',
    });
  },

  getUserProfileByUsername: async (username) => {
    return apiRequest(`/users/profile/${encodeURIComponent(username)}`, {
      method: 'GET',
    });
  },

  updateUserProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Posts related API calls
export const postsAPI = {
  // Get feed (Instagram-like feed from mutual connections or all users)
  getFeed: async ({ page = 1, limit = 20, feedType = 'connections' } = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    params.set('feed_type', feedType);
    
    return apiRequest(`/feed?${params.toString()}`, {
      method: 'GET',
    });
  },

  // Create a new post
  createPost: async (postData) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Get all posts (feed)
  getPosts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Get single post by ID
  getPost: async (postId) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'GET',
    });
  },

  // Update a post
  updatePost: async (postId, postData) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  // Delete a post
  deletePost: async (postId) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  // Get posts for a specific user
  getUserPosts: async (userId, params = {}) => {
    const queryString = new URLSearchParams({ ...params, user_id: userId }).toString();
    const endpoint = queryString ? `/posts?${queryString}` : `/posts?user_id=${userId}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Upload media files for posts
  uploadMedia: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiRequest('/posts/media/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

// Likes related API calls
export const likesAPI = {
  // Like a post
  likePost: async (postId) => {
    return apiRequest(`/likes/${postId}`, {
      method: 'POST',
    });
  },

  // Unlike a post
  unlikePost: async (postId) => {
    return apiRequest(`/likes/${postId}`, {
      method: 'DELETE',
    });
  },

  // Get like status and count for a post
  getLikeStatus: async (postId) => {
    return apiRequest(`/likes/${postId}`, {
      method: 'GET',
    });
  },
};

// Comments related API calls
export const commentsAPI = {
  // Add comment to a post
  addComment: async (postId, commentText) => {
    return apiRequest(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ comment_text: commentText }),
    });
  },

  // Get comments for a post
  getComments: async (postId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/comments/${postId}?${queryString}` : `/comments/${postId}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Users related API calls
export const usersAPI = {
  searchUsers: async (query, limit = 20) => {
    const q = (query || '').trim();
    const endpoint = `/users/search?q=${encodeURIComponent(q)}&limit=${limit}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  getSuggestions: async () => {
    return apiRequest('/users/suggestions', {
      method: 'GET',
    });
  },
};

export const connectionsAPI = {
  getConnections: async ({ limit = 20, offset = 0, q = '', username = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    if (q && q.trim()) params.set('q', q.trim());
    if (username && username.trim()) params.set('username', username.trim());

    return apiRequest(`/connections?${params.toString()}`, {
      method: 'GET',
    });
  },

  connectUser: async (username) => {
    return apiRequest(`/connections/${encodeURIComponent(username)}`, {
      method: 'POST',
    });
  },

  disconnectUser: async (username) => {
    return apiRequest(`/connections/${encodeURIComponent(username)}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;
