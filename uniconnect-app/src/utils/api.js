// API utility functions for backend communication

const API_BASE_URL = 'https://backend.uniconnectmmu.workers.dev';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
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
    return apiRequest('/auth/profile', {
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

// Users related API calls
export const usersAPI = {
  searchUsers: async (query, limit = 20) => {
    const q = (query || '').trim();
    const endpoint = `/users/search?q=${encodeURIComponent(q)}&limit=${limit}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },
};

export const connectionsAPI = {
  getConnections: async ({ limit = 20, offset = 0, q = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    if (q && q.trim()) params.set('q', q.trim());

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
