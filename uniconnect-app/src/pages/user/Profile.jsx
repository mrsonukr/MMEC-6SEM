import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import PostInput from '../../components/PostInput'
import PostCard from '../../components/PostCard'
import DropdownMenu from '../../components/DropdownMenu'
import ProfilePictureUpload from '../../components/ProfilePictureUpload'
import { MapPin, Briefcase, GraduationCap, Plus, Edit3, ExternalLink, Award, Users, MoreHorizontal } from 'lucide-react'
import { usernameAPI, postsAPI } from '../../utils/api'

// Default profile image
const DEFAULT_PROFILE_IMAGE = '/images/default_profile.png'

// Tab state
const TABS = ['Posts', 'Skills', 'Educations']

// Skeleton Loader Components
const ProfileSkeleton = () => (
  <div className="bg-white">
    <div className="h-40 bg-gray-200 mb-4 -mx-4 -mt-4 relative">
      <div className="absolute top-3 right-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    <div className="px-4 pb-5">
      <div className="flex items-end justify-between -mt-10 mb-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full ring-4 ring-white"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-300 rounded-lg w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded-lg w-64 animate-pulse"></div>
      </div>
      <div className="w-full h-10 bg-gray-300 rounded-lg mt-4 animate-pulse"></div>
    </div>
  </div>
)

const ProfilePictureSkeleton = () => (
  <div className="relative">
    <div className="w-20 h-20 bg-gray-300 rounded-full ring-4 ring-white"></div>
  </div>
)

const PostSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded-lg w-24"></div>
        <div className="h-3 bg-gray-300 rounded-lg w-16"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded-lg w-full"></div>
      <div className="h-4 bg-gray-300 rounded-lg w-3/4"></div>
    </div>
    <div className="flex gap-4">
      <div className="h-8 bg-gray-300 rounded-lg w-16"></div>
      <div className="h-8 bg-gray-300 rounded-lg w-16"></div>
      <div className="h-8 bg-gray-300 rounded-lg w-16"></div>
    </div>
  </div>
)


const skills = ['React', 'Node.js', 'MongoDB', 'UI Design', 'Figma', 'TypeScript', 'Next.js']

const normalizeProfileUser = (payload) => {
  const rawUser = payload?.user || payload?.data?.user || payload?.data || null
  if (!rawUser) return null

  return {
    ...rawUser,
    profile_picture_url: rawUser.profile_picture_url || rawUser.profile_picture || rawUser.avatar_url || rawUser.avatar || '',
    bio: rawUser.bio || rawUser.desc || rawUser.description || rawUser.about || '',
    connected_count: rawUser.connected_count ?? rawUser.connectedCount ?? 0,
    connected_dps: Array.isArray(rawUser.connected_dps) ? rawUser.connected_dps : (Array.isArray(rawUser.connectedDps) ? rawUser.connectedDps : [])
  }
}

export default function Profile() {
  const { username: routeUsername } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Posts')
  const [showDropdown, setShowDropdown] = useState(false)
  const currentLoggedInUsername = (() => {
    try {
      const cached = localStorage.getItem('user')
      if (!cached) return ''
      return JSON.parse(cached)?.username || ''
    } catch {
      return ''
    }
  })()
  const isOwnProfile = !routeUsername || routeUsername === currentLoggedInUsername

  // Canonicalize `/profile` to `/:username` once we know the signed-in username.
  useEffect(() => {
    if (routeUsername) return
    if (!user?.username) return
    navigate(`/${user.username}`, { replace: true })
  }, [navigate, routeUsername, user?.username])

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if user data is already cached in localStorage
      const cachedUser = localStorage.getItem('user');
      const cacheTimestamp = localStorage.getItem('userCacheTimestamp');
      const now = Date.now();

      try {
        const currentUser = cachedUser ? normalizeProfileUser({ user: JSON.parse(cachedUser) }) : null

        // Only use the short-lived cache for the signed-in user's own profile.
        if (!routeUsername && cachedUser && cacheTimestamp) {
          const cacheAge = now - parseInt(cacheTimestamp)
          if (cacheAge < 30 * 1000) {
            setUser(currentUser)
            setLoading(false)
            return
          }
        }

        if (!routeUsername || currentUser?.username === routeUsername) {
          const response = await usernameAPI.getUserProfile()
          if (response.success) {
            const normalizedUser = normalizeProfileUser(response)
            setUser(normalizedUser)
            // Cache the user data with timestamp
            localStorage.setItem('user', JSON.stringify(normalizedUser))
            localStorage.setItem('userCacheTimestamp', now.toString())
          } else {
            console.error('Failed to load profile:', response.message)
          }
        } else {
          const response = await usernameAPI.getUserProfileByUsername(routeUsername)
          if (response.success) {
            setUser(normalizeProfileUser(response))
          } else {
            console.error('Failed to load profile:', response.message)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [routeUsername])

  // Fetch user posts when user data is available
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id) return;
      
      // Only show loading if this is not the initial load
      if (posts.length > 0) {
        setPostsLoading(true);
      }
      
      try {
        const response = await postsAPI.getUserPosts(user.id);
        if (response.success && response.data) {
          setPosts(response.data.posts || []);
        } else {
          console.error('Failed to fetch posts:', response.message);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user?.id]);

  // Format date to show relative time or proper date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    // For older posts, show formatted date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleProfilePictureUpload = (newImageUrl) => {
    // Update user state with new profile picture
    if (user) {
      setUser({ ...user, profile_picture_url: newImageUrl })
      // Update cached user data
      localStorage.setItem('user', JSON.stringify({ ...user, profile_picture_url: newImageUrl }))
    }
  }

  const handleDeletePost = (deletedPostId) => {
    // Remove the deleted post from the posts list
    setPosts(prevPosts => prevPosts.filter(post => post.post_id !== deletedPostId));
  }

  const refreshPosts = async () => {
    if (!user?.id) return;
    
    setPostsLoading(true);
    try {
      const response = await postsAPI.getUserPosts(user.id);
      if (response.success && response.data) {
        setPosts(response.data.posts || []);
      } else {
        console.error('Failed to refresh posts:', response.message);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  const dropdownItems = [
    {
      label: 'Upload cover',
      icon: <Plus size={18} />,
      onClick: () => {}
    },
    {
      label: 'View cover',
      icon: <ExternalLink size={18} />,
      onClick: () => {}
    },
    {
      label: 'Remove cover',
      icon: '🗑️',
      onClick: () => {},
      danger: true
    }
  ]

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Tabs */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Profile</a>
        </div>

        {/* Feed Container */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          
          {/* Profile Header */}
          <div className="mb-6">
            {/* Cover + Avatar */}
            <div className="overflow-hidden mb-4 -mx-4 -mt-4 relative">
              <div className="h-40 relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.4) 30px, rgba(255,255,255,0.4) 31px)` }}
                />
                {isOwnProfile && (
                  <div className="absolute top-3 right-3">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <MoreHorizontal className="w-5 h-5 text-white group-hover:text-black" />
                    </button>
                  </div>
                )}
              </div>
              
              {isOwnProfile && (
                <DropdownMenu 
                  isOpen={showDropdown} 
                  onClose={() => setShowDropdown(false)}
                  items={dropdownItems}
                />
              )}

              <div className="px-4 pb-5">
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="relative">
                    {loading ? (
                      <ProfilePictureSkeleton />
                    ) : isOwnProfile ? (
                      <ProfilePictureUpload 
                        currentImage={user?.profile_picture_url || DEFAULT_PROFILE_IMAGE}
                        onUploadSuccess={handleProfilePictureUpload}
                        userId={user?.id}
                      />
                    ) : (
                      <img
                        src={user?.profile_picture_url || DEFAULT_PROFILE_IMAGE}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-white"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                        }}
                      />
                    )}
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <div className="h-8 bg-gray-300 rounded-lg w-48 animate-pulse"></div>
                  ) : (
                    user?.full_name || 'Unknown'
                  )}
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  {loading ? (
                    <div className="h-4 bg-gray-300 rounded-lg w-24 animate-pulse"></div>
                  ) : (
                    `@${user?.username || 'loading'}`
                  )}
                </div>
                {/* About */}
                {loading ? (
                  <div className="mt-1 h-4 bg-gray-300 rounded-lg w-64 animate-pulse"></div>
                ) : (
                  user?.bio?.trim() && (
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed max-w-md italic">
                      &ldquo;{user.bio}&rdquo;
                    </p>
                  )
                )}
                <div className={`flex items-center gap-3 text-gray-500 text-sm ${user?.bio?.trim() ? 'mt-2' : 'mt-3'}`}>
                  <span className="flex items-center gap-1.5 text-xs bg-black text-white px-2 py-0.5 rounded-full">
                    <GraduationCap size={12} />
                    Student
                  </span>
                  <span>•</span>
                  <Link to="/connections" className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {(user?.connected_dps || []).slice(0, 4).map((src, i) => (
                        <img
                          key={`${src || 'default'}-${i}`}
                          src={src || DEFAULT_PROFILE_IMAGE}
                          alt="connection"
                          className="w-4 h-4 rounded-full border border-white object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-black font-medium cursor-pointer hover:underline">
                      {user?.connected_count ?? 0} connections
                    </span>
                  </Link>
                </div>

                
                {isOwnProfile && (
                  <button className="w-full bg-white hover:bg-gray-50 text-black text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 border border-gray-300">
                    <Edit3 size={14} /> Edit Profile
                  </button>
                )}

                {/* Tabs */}
                <div className="mt-6">
                  <div className="flex justify-around">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 font-medium text-sm transition-colors ${
                          activeTab === tab
                            ? 'text-black'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Subtle border line */}
                  <div className="mt-1 mb-0.5 border-t border-dashed border-gray-300 -mx-4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Posts' && (
            <>
              {/* Post Input */}
              {isOwnProfile && <PostInput userProfile={user} onPostCreated={refreshPosts} />}

              {/* Posts */}
              <div className="space-y-4">
                {postsLoading ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.post_id} post={{
                      id: post.post_id,
                      post_id: post.post_id,
                      author: post.author, // Pass the full author object from backend
                      author_id: post.author?.id,
                      time: formatDate(post.created_at),
                      content: post.caption,
                      profileImage: user?.profile_picture_url || DEFAULT_PROFILE_IMAGE,
                      media_urls: post.media_urls,
                      media_type: post.media_type,
                      media_dimensions: post.media_dimensions,
                      is_private: post.is_private,
                      likes: Math.floor(Math.random() * 50) + 5,
                      comments: Math.floor(Math.random() * 20) + 1,
                      shares: Math.floor(Math.random() * 10) + 1
                    }} currentUser={user} onDeletePost={handleDeletePost} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No posts yet. Create your first post above!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'Skills' && (
            <div className="pt-2 pb-3 space-y-2.5">
              {skills.map((skill, index) => {
                // Assign random level for now (you can replace with real data later)
                const levels = ['Beginner', 'Medium', 'Expert']
                const level = levels[index % 3]

                return (
                  <div key={index} className="border border-gray-200 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-800">{skill}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${level === 'Expert' ? 'bg-black text-white' : ''}
                        ${level === 'Medium' ? 'bg-gray-200 text-gray-800' : ''}
                        ${level === 'Beginner' ? 'bg-gray-100 text-gray-500' : ''}
                      `}>
                        {level}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full
                          ${level === 'Expert' ? 'w-[90%] bg-black' : ''}
                          ${level === 'Medium' ? 'w-[60%] bg-gray-500' : ''}
                          ${level === 'Beginner' ? 'w-[30%] bg-gray-300' : ''}
                        `}
                      />
                    </div>
                  </div>
                )
              })}

              <div className="text-center pt-4 text-gray-400 text-sm">
                <p>Update your skills to improve your profile 🚀</p>
              </div>
            </div>
          )}

          {activeTab === 'Educations' && (
            <div className="pt-2 pb-3 space-y-2.5">

              {/* Graduation */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-sm text-gray-900">Graduation</h3>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded">8.2 CGPA</span>
                </div>
                <p className="text-sm text-gray-700">B.Tech in Computer Science</p>
                <p className="text-xs text-gray-500">MMU University • 2021 - 2025</p>
              </div>

              {/* 12th */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-sm text-gray-900">12th (Intermediate)</h3>
                  <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">78%</span>
                </div>
                <p className="text-sm text-gray-700">Science (PCM)</p>
                <p className="text-xs text-gray-500">CBSE Board • 2019 - 2021</p>
              </div>

              {/* 10th */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-sm text-gray-900">10th (Matriculation)</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">85%</span>
                </div>
                <p className="text-sm text-gray-700">General Studies</p>
                <p className="text-xs text-gray-500">CBSE Board • 2018 - 2019</p>
              </div>

              <div className="text-center pt-4 text-gray-400 text-sm">
                <p>Keep your education details updated 🎓</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
