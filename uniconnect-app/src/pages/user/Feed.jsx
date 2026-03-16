import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { Heart, MessageCircle, Share2, Image, Video, Calendar, TrendingUp, Sparkles, MoreHorizontal, Bookmark } from 'lucide-react'

const posts = [
  {
    id: 1,
    name: 'Rahul Sharma',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '2h ago',
    text: "Excited to collaborate with developers for Hackathon 2026 🚀 Building something amazing with React and Node.js. Who's joining the team?",
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd',
    likes: 24, comments: 8, shares: 3, isLiked: false,
  },
  {
    id: 2,
    name: 'Priya Verma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    time: '5h ago',
    text: 'Just finished designing a new UI for a productivity app. The focus was on minimalism and refined user experience. What do you think of this approach?',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d',
    likes: 42, comments: 15, shares: 7, isLiked: true,
  },
  {
    id: 3,
    name: 'Amit Kumar',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    time: '8h ago',
    text: 'Learning AI/ML has been truly transformative for my career. Started with Python basics and now building recommendation systems. The future is here! 🤖',
    likes: 67, comments: 23, shares: 12, isLiked: false,
  },
]

const trending = [
  { topic: '#Hackathon2026', posts: '2.1K posts' },
  { topic: '#ReactJS', posts: '1.8K posts' },
  { topic: '#AI_ML', posts: '3.2K posts' },
  { topic: '#WebDev', posts: '4.5K posts' },
]

export default function Feed() {
  const [likedPosts, setLikedPosts] = useState(new Set([2]))
  const [showCreate, setShowCreate] = useState(false)
  const [postText, setPostText] = useState('')
  const [savedPosts, setSavedPosts] = useState(new Set())

  const handleLike = (id) => {
    setLikedPosts(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const toggleSave = (id) => {
    setSavedPosts(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

            {/* Main feed */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">

              {/* Create post */}
              <div className="card overflow-hidden animate-fade-up">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <img src="https://randomuser.me/api/portraits/men/75.jpg"
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-violet-800/50 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div
                        onClick={() => setShowCreate(!showCreate)}
                        className="w-full bg-[#0A0A0A] hover:bg-violet-950/40 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm text-[#6B7280] cursor-pointer transition-all duration-200 border border-[#111]/[0.07] hover:border-violet-500"
                      >
                        Share something…
                      </div>

                      {showCreate && (
                        <div className="mt-4 space-y-4 animate-fade-up">
                          <textarea
                            value={postText}
                            onChange={e => setPostText(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full p-3 sm:p-4 border border-[#111]/[0.12] bg-[#0A0A0A] rounded-xl resize-none focus:ring-2 focus:ring-violet-800/50 focus:border-violet-500 outline-none transition-all text-sm text-[#F9FAFB]"
                            rows={4}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {[Image, Video, Calendar].map((Icon, i) => (
                                <button key={i} className="p-1.5 sm:p-2 text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 rounded-lg transition-all">
                                  <Icon size={16} />
                                </button>
                              ))}
                            </div>
                            <button
                              className="btn-gold px-4 sm:px-5 py-2 rounded-full text-sm"
                              onClick={() => { setShowCreate(false); setPostText('') }}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.map((post, idx) => (
                <div key={post.id} className="card overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="p-4 sm:p-5 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-violet-800/50 ring-offset-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F9FAFB] hover:text-violet-400 cursor-pointer transition-colors truncate">{post.name}</p>
                        <p className="text-xs text-[#6B7280]">{post.time}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleSave(post.id)}
                          className={`p-1.5 rounded-lg transition-all ${savedPosts.has(post.id) ? 'text-violet-400' : 'text-[#6B7280] hover:text-violet-400'}`}
                        >
                          <Bookmark size={15} fill={savedPosts.has(post.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#F9FAFB] hover:bg-violet-950/40 transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#D1D5DB] leading-relaxed mt-3">{post.text}</p>
                  </div>

                  {post.image && (
                    <div className="mx-4 sm:mx-5 mb-3 sm:mb-4 rounded-xl overflow-hidden">
                      <img src={post.image} className="w-full h-44 sm:h-56 object-cover hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between text-xs text-[#6B7280] border-t border-[#111]/[0.07]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 btn-gold rounded-full flex items-center justify-center">
                        <Heart size={9} className="text-white fill-white" />
                      </div>
                      <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                    </div>
                    <div className="flex gap-3">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-2 sm:px-5 py-1.5 sm:py-2 border-t border-[#111]/[0.07]">
                    <div className="flex justify-around sm:justify-between">
                      {[
                        { icon: Heart, label: 'Like', active: likedPosts.has(post.id), onClick: () => handleLike(post.id), activeClass: 'text-violet-400 bg-violet-950/40' },
                        { icon: MessageCircle, label: 'Comment', active: false, onClick: () => {}, activeClass: '' },
                        { icon: Share2, label: 'Share', active: false, onClick: () => {}, activeClass: '' },
                      ].map(({ icon: Icon, label, active, onClick, activeClass }) => (
                        <button key={label} onClick={onClick}
                          className={`flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                            ${active ? activeClass : 'text-[#6B7280] hover:bg-violet-950/40 hover:text-violet-400'}`}
                        >
                          <Icon size={14} fill={active && label === 'Like' ? 'currentColor' : 'none'} />
                          <span className="hidden xs:inline sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar — desktop only */}
            <div className="hidden lg:flex flex-col gap-5">
              <div className="card p-5 animate-fade-up stagger-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-violet-400" />
                  <h3 className="font-display text-sm font-semibold text-[#F9FAFB]">Trending Topics</h3>
                </div>
                <div className="space-y-1">
                  {trending.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-violet-950/40 cursor-pointer transition-all group">
                      <div>
                        <p className="text-sm font-medium text-[#F9FAFB] group-hover:text-violet-400 transition-colors">{t.topic}</p>
                        <p className="text-xs text-[#6B7280]">{t.posts}</p>
                      </div>
                      <Sparkles size={13} className="text-[#6B7280] group-hover:text-violet-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 animate-fade-up stagger-2 overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #0F172A, #1E1B4B)' }}
              >
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(99,102,241,0.5) 20px, rgba(99,102,241,0.5) 21px)` }}
                />
                <div className="relative z-10">
                  <h3 className="font-display text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-violet-400" /> Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Create Event', sub: 'Organize a meetup' },
                      { label: 'Find Jobs', sub: 'Explore opportunities' },
                      { label: 'Join Groups', sub: 'Connect with peers' },
                    ].map(({ label, sub }) => (
                      <button key={label} className="w-full text-left px-4 py-3 rounded-xl border border-[#111]/10 hover:border-violet-500 hover:bg-[#111111]/5 transition-all duration-200 group">
                        <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{label}</div>
                        <div className="text-xs text-[#6B7280]">{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
