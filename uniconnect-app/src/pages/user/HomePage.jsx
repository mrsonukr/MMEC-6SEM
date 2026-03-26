import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import PostInput from "../../components/PostInput";
import PostCard from "../../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openPostModal, setOpenPostModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

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

      // Using JSONPlaceholder public API for testing
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=10`);
      const postsData = await response.json();
      
      // Fetch user data for profile images
      const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
      const usersData = await usersResponse.json();
      
      // Combine posts with user data and add additional fields
      const formattedPosts = postsData.map((post, index) => {
        const user = usersData[(index + (pageNum - 1) * 10) % usersData.length];
        return {
          id: post.id,
          author: user.name,
          time: `${Math.floor(Math.random() * 24) + 1} hours ago`,
          content: post.body,
          image: index % 2 === 0 ? `https://picsum.photos/seed/${post.id}/800/600.jpg` : null,
          profileImage: `https://picsum.photos/seed/${user.name}/100/100.jpg`,
          likes: Math.floor(Math.random() * 500) + 10,
          comments: Math.floor(Math.random() * 50) + 1,
          shares: Math.floor(Math.random() * 200) + 5
        };
      });
      
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
      }

      // Check if there are more posts to load
      if (postsData.length < 10) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (!isLoadMore) {
        // Fallback to mock data if API fails
        setPosts([
          {
            id: 1,
            author: "Ann Levin",
            time: "2 hours ago",
            content: "Hello everybody! We are preparing a new Prada campaign. Here's a sneak peek ;)",
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
            likes: 149,
            comments: 16,
            shares: 539
          }
        ]);
      }
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
          <PostInput externalOpen={openPostModal} onModalClose={() => setOpenPostModal(false)} />

          {/* Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                {loadingMore && (
                  <div className="text-center py-4 text-gray-500">
                    Loading more posts...
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
