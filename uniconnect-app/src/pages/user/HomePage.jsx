import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import PostInput from "../../components/PostInput";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";
import { usernameAPI, postsAPI, storeUserProfileData } from "../../utils/api";

// Default profile image
const DEFAULT_PROFILE_IMAGE = 'https://backend.uniconnectmmu.workers.dev/download/users/7/profile/7_1777890781131_YOR4ATDF.jpg';

const normalizeProfileUser = (payload) => {
  const rawUser = payload?.user || payload?.data?.user || payload?.data || null;
  if (!rawUser) return null;

  return {
    ...rawUser,
    profile_picture_url: rawUser.profile_picture_url || rawUser.profile_picture || rawUser.avatar_url || rawUser.avatar || ''
  };
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    // Check if user data is already cached in localStorage
    const cachedUser = localStorage.getItem('user');
    const cacheTimestamp = localStorage.getItem('userCacheTimestamp');
    const now = Date.now();
    
    // Clear cache if it's older than 5 minutes or on page refresh
    if (cachedUser && cacheTimestamp) {
      const cacheAge = now - parseInt(cacheTimestamp);
      if (cacheAge < 30 * 1000) { // 30 seconds
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
          // Store username and profile pic URL separately from cached data
          storeUserProfileData(parsedUser);
          return; // Use cache if it's fresh
        } catch (error) {
          console.error('Error parsing cached user data:', error);
        }
      }
    }

    // Fetch fresh data using the logged-in user's profile API
    try {
      const response = await usernameAPI.getMyProfile();
      if (response.success) {
        const normalizedUser = normalizeProfileUser(response);
        setUser(normalizedUser);
        // Store username and profile pic URL separately in localStorage
        storeUserProfileData(normalizedUser);
        // Cache the user data with timestamp
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('userCacheTimestamp', now.toString());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const feedContainer = document.querySelector('.feed-container');
      if (feedContainer) {
        const { scrollTop, scrollHeight, clientHeight } = feedContainer;
        if (scrollTop + clientHeight >= scrollHeight - 100 && !loadingMore && hasMore) {
          loadMorePosts();
        }
      }
    };

    const feedContainer = document.querySelector('.feed-container');
    if (feedContainer) {
      feedContainer.addEventListener('scroll', handleScroll);
      return () => feedContainer.removeEventListener('scroll', handleScroll);
    }
  }, [loadingMore, hasMore, page]);

  const fetchPosts = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Use the new Instagram-like feed API
      const response = await postsAPI.getFeed({ page: pageNum, limit: 10 });
      
      if (response.success && response.data) {
        const newPosts = response.data.posts || [];
        if (pageNum === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        setHasMore(response.data.pagination?.has_next || false);
      } else {
        console.error('Failed to fetch feed:', response.message);
        if (pageNum === 1) setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      if (pageNum === 1) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Tabs */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#">For You</a>
          <a href="#">Connections</a>
          <a href="#">Favorites</a>
        </div>

        {/* Plus Button */}
        <button
          onClick={() => setOpenPostModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50 pointer-events-auto"
        >
          <Plus size={24} />
        </button>

        {/* Feed Container */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar feed-container">
          
          {/* Post Input */}
          <PostInput userProfile={user} externalOpen={openPostModal} onModalClose={() => setOpenPostModal(false)} />

          {/* Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <Spinner />
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No more posts to load
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No posts found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
