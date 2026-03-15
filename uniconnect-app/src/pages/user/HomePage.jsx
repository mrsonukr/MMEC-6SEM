import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import PostCard from '../../components/PostCard'
import SuggestionCard from '../../components/SuggestionCard'
import { PenLine, Hash, TrendingUp, Flame, Sparkles, Zap } from 'lucide-react'

const posts = [
  { name:'Ann Levin', avatar:'https://randomuser.me/api/portraits/women/44.jpg', time:'2 hours ago', text:'Hello everybody! We are preparing a new campaign for our upcoming design showcase. So excited to share it with the community 🎨', image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
  { name:'James Dorwart', avatar:'https://randomuser.me/api/portraits/men/32.jpg', time:'5 hours ago', text:'Just wrapped up an amazing collab shoot in the mountains. The golden hour light was absolutely breathtaking 🏔️', image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4' },
  { name:'Jocelyn Westervelt', avatar:'https://randomuser.me/api/portraits/women/21.jpg', time:'Yesterday', text:'New reel dropping tonight. Stay tuned! Working on something special for the frontend community 💻', image:'' },
]

const trends = [
  { tag:'ReactDevelopment', hot:true, posts:'2.1K' },
  { tag:'Hackathon',        hot:true, posts:'1.8K' },
  { tag:'OpenSource',       hot:false,posts:'4.5K' },
  { tag:'StartupIdeas',     hot:false,posts:'980' },
  { tag:'UIDesign',         hot:false,posts:'3.2K' },
]

export default function HomePage() {
  const [showCompose, setShowCompose] = useState(false)
  const [postText, setPostText] = useState('')

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen"><Sidebar /></div>
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-5xl flex gap-7 px-6 py-8">

          {/* Feed */}
          <div className="flex-1 max-w-2xl space-y-4">
            {/* Compose */}
            <div className="card animate-fade-up p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" className="w-10 h-10 rounded-full ring-2 ring-violet-800/40 ring-offset-1 ring-offset-[#111] object-cover" />
                  <span className="absolute bottom-0 right-0 live-dot w-2.5 h-2.5 border-2 border-[#111]" />
                </div>
                <button onClick={() => setShowCompose(s=>!s)}
                  className="flex-1 text-left text-sm text-[#4B5563] bg-white/[0.04] hover:bg-violet-950/30 border border-[#111]/[0.07] hover:border-violet-700/40 rounded-full px-5 py-2.5 transition-all duration-250">
                  {showCompose ? "What's on your mind?" : "Share something with your network…"}
                </button>
                <button onClick={() => setShowCompose(s=>!s)}
                  className="p-2.5 rounded-xl bg-violet-950/50 text-violet-400 hover:bg-violet-600 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
                  <PenLine size={15} />
                </button>
              </div>

              {showCompose && (
                <div className="animate-fade-up">
                  <textarea autoFocus value={postText} onChange={e=>setPostText(e.target.value)}
                    placeholder="What's on your mind?" rows={3}
                    className="w-full bg-white/[0.04] border border-[#111]/[0.10] rounded-2xl px-4 py-3 text-sm text-[#F9FAFB] resize-none focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-900/40 transition-all placeholder:text-[#4B5563]"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-1">
                      {['📷','🎬','📅','😊'].map(e => (
                        <button key={e} className="text-lg p-1.5 rounded-lg hover:bg-white/[0.05] transition-all hover:scale-110 active:scale-95">{e}</button>
                      ))}
                    </div>
                    <button onClick={() => {setShowCompose(false);setPostText('')}} className="btn-gold px-5 py-2 rounded-full text-sm">Post</button>
                  </div>
                </div>
              )}
            </div>

            {posts.map((post,i) => (
              <div key={i} className="animate-fade-up" style={{animationDelay:`${(i+1)*100}ms`}}>
                <PostCard {...post} />
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="hidden lg:flex flex-col gap-4 w-72">
            <div className="animate-slide-right stagger-1"><SuggestionCard /></div>

            <div className="card animate-slide-right stagger-2 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-violet-400" />
                <h3 className="font-semibold text-sm text-[#F9FAFB]">Trending</h3>
              </div>
              <div className="space-y-0.5">
                {trends.map((t,i) => (
                  <div key={t.tag} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] cursor-pointer group transition-all duration-150 active:scale-[0.98]">
                    <Hash size={11} className="text-[#4B5563] group-hover:text-violet-400 transition-colors flex-shrink-0" />
                    <span className="text-sm text-[#9CA3AF] group-hover:text-violet-400 transition-colors font-medium flex-1">{t.tag}</span>
                    <span className="text-[10px] text-[#4B5563]">{t.posts}</span>
                    {t.hot && <Flame size={12} className="text-orange-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card animate-slide-right stagger-3 p-5 relative overflow-hidden"
              style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(6,182,212,0.08) 100%)'}}>
              <div className="absolute inset-0 bg-[#111] opacity-60 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-violet-400" />
                  <h3 className="text-sm font-semibold text-[#F9FAFB]">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {[
                    {label:'Find Teammates',sub:'Hackathon slots open',emoji:'🏆'},
                    {label:'Skill Exchange', sub:'Trade what you know', emoji:'🔄'},
                    {label:'Browse Jobs',    sub:'5 new this week',    emoji:'💼'},
                  ].map(({label,sub,emoji}) => (
                    <button key={label} className="w-full text-left px-3 py-2.5 rounded-xl border border-[#111]/[0.08] hover:bg-white/[0.06] hover:border-violet-700/40 transition-all duration-200 group active:scale-[0.98]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base group-hover:scale-110 transition-transform duration-200 inline-block">{emoji}</span>
                        <div>
                          <p className="text-xs font-semibold text-[#E5E7EB] leading-tight">{label}</p>
                          <p className="text-[10px] text-[#4B5563] mt-0.5">{sub}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowCompose(true)}
        className="fixed bottom-8 right-8 btn-gold px-5 py-3 rounded-full text-sm flex items-center gap-2 animate-float z-30">
        <PenLine size={15} /> New Post
      </button>
    </div>
  )
}
