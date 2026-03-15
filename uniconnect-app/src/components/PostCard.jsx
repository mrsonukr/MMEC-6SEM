import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageCircle, MoreHorizontal, Bookmark, Share2 } from 'lucide-react'

export default function PostCard({ name='Ann Levin', avatar='https://randomuser.me/api/portraits/women/44.jpg', time='2 hours ago', text='Hello everybody!', image='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' }) {
  const [vote, setVote] = useState(null)
  const [upvotes, setUpvotes] = useState(24)
  const [saved, setSaved] = useState(false)
  const [popLike, setPopLike] = useState(false)

  const handleVote = (type) => {
    if (type === 'up') { setPopLike(true); setTimeout(() => setPopLike(false), 400) }
    if (vote === type) { setVote(null); type === 'up' ? setUpvotes(v => v-1) : null }
    else { if (vote==='up') setUpvotes(v=>v-1); setVote(type); if(type==='up') setUpvotes(v=>v+1) }
  }

  return (
    <div className="card card-interactive overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img src={avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-800/40 ring-offset-2 ring-offset-[#111] transition-transform duration-200 hover:scale-105 cursor-pointer" />
          <div>
            <p className="font-semibold text-sm text-[#F9FAFB] hover:text-violet-400 cursor-pointer transition-colors duration-150">{name}</p>
            <p className="text-xs text-[#4B5563] mt-0.5">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setSaved(s=>!s)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${saved ? 'text-violet-400 bg-violet-950/50' : 'text-[#4B5563] hover:text-violet-400 hover:bg-white/[0.05]'}`}>
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} className={saved ? 'animate-pop-in' : ''} />
          </button>
          <button className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#9CA3AF] hover:bg-white/[0.05] transition-all duration-200">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-sm text-[#D1D5DB] leading-relaxed">{text}</p>
      </div>

      {image && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden group/img cursor-pointer">
          <img src={image} className="w-full max-h-72 object-cover transition-transform duration-500 group-hover/img:scale-[1.03]" />
        </div>
      )}

      {/* Stats */}
      <div className="mx-5 pb-2 flex items-center justify-between text-xs text-[#4B5563]">
        <div className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center ${popLike ? 'animate-pop-in' : ''}`}>
            <ThumbsUp size={9} className="text-white" />
          </div>
          <span className="font-medium text-[#6B7280]">{upvotes}</span>
        </div>
        <div className="flex gap-3">
          <span className="hover:text-violet-400 cursor-pointer transition-colors">12 comments</span>
          <span className="hover:text-violet-400 cursor-pointer transition-colors">3 shares</span>
        </div>
      </div>

      <div className="mx-5 divider" />

      <div className="px-4 py-2 flex items-center gap-1">
        {[
          { icon: ThumbsUp,      label: 'Like',    active: vote==='up',   activeClass: 'bg-violet-950/60 text-violet-400', onClick: ()=>handleVote('up') },
          { icon: ThumbsDown,    label: 'Dislike', active: vote==='down', activeClass: 'bg-red-950/60 text-red-400',       onClick: ()=>handleVote('down') },
          { icon: MessageCircle, label: 'Comment', active: false,         activeClass: '',                                 onClick: ()=>{} },
          { icon: Share2,        label: 'Share',   active: false,         activeClass: '',                                 onClick: ()=>{} },
        ].map(({ icon: Icon, label, active, onClick, activeClass }) => (
          <button key={label} onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
              transition-all duration-200 active:scale-95
              ${active ? activeClass : 'text-[#6B7280] hover:bg-white/[0.05] hover:text-violet-400'}`}>
            <Icon size={14} fill={active && label==='Like' ? 'currentColor' : 'none'} className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
