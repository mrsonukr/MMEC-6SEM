import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Users, Search, Plus, Lock, Globe } from 'lucide-react'

const groups = [
  { id: 1, name: 'Web Developers', members: 124, description: 'Discuss React, Node.js and full-stack projects.', tag: 'Technology', private: false, color: '#C9A96E' },
  { id: 2, name: 'AI Enthusiasts', members: 89, description: 'Talk about machine learning, LLMs and AI tools.', tag: 'Research', private: false, color: '#A8834A' },
  { id: 3, name: 'Startup Builders', members: 56, description: 'Find collaborators and build your startup ideas.', tag: 'Entrepreneurship', private: true, color: '#8C6D3F' },
  { id: 4, name: 'UI/UX Designers', members: 71, description: 'Share design inspiration and Figma tips.', tag: 'Design', private: false, color: '#C9A96E' },
  { id: 5, name: 'Open Source', members: 203, description: 'Contribute to open source and grow your portfolio.', tag: 'Community', private: false, color: '#A8834A' },
  { id: 6, name: 'Data Science', members: 45, description: 'Python, pandas, visualization and ML models.', tag: 'Research', private: true, color: '#8C6D3F' },
]
const avatarSeeds = [5, 8, 10, 15, 22]

export default function Groups() {
  const [search, setSearch] = useState('')
  const [joined, setJoined] = useState(new Set([1, 4]))

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  )

  const toggleJoin = (id) => {
    setJoined(prev => {
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

          {/* Header */}
          <div className="flex items-center justify-between mb-5 sm:mb-8 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-violet-400" />
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F9FAFB]">Groups</h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280]">Connect with communities that share your interests</p>
            </div>
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
              <Plus size={13} /> <span className="hidden sm:inline">Create Group</span><span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-5 sm:mb-8 animate-fade-up stagger-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#111]/[0.12] bg-[#111111] text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-800/50 transition-all placeholder:text-[#6B7280]"
            />
          </div>

          {/* Joined groups */}
          {joined.size > 0 && (
            <div className="mb-5 sm:mb-8 animate-fade-up stagger-2">
              <p className="text-xs text-[#6B7280] uppercase tracking-widest mb-2 sm:mb-3 font-medium">Your Groups</p>
              <div className="flex flex-wrap gap-2">
                {groups.filter(g => joined.has(g.id)).map(g => (
                  <span key={g.id} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-violet-950/40 text-violet-400 border border-[#111]/[0.12]">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filtered.map((group, idx) => (
              <div key={group.id}
                className="card card-interactive overflow-hidden animate-fade-up"
                style={{ animationDelay: `${idx * 70}ms`, opacity: 0 }}
              >
                <div className="h-12 sm:h-16 relative"
                  style={{ background: `linear-gradient(135deg, ${group.color}22 0%, ${group.color}44 100%)` }}
                >
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${group.color}40 10px, ${group.color}40 11px)` }}
                  />
                  <div className="absolute top-2 right-2">
                    {group.private
                      ? <Lock size={11} className="text-[#6B7280]" />
                      : <Globe size={11} className="text-[#6B7280]" />
                    }
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-sm font-semibold text-[#F9FAFB]">{group.name}</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-400 border border-[#111]/[0.07] ml-2 flex-shrink-0">
                      {group.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-1">{group.members} members</p>
                  <p className="text-xs text-[#D1D5DB] mb-3 sm:mb-4 leading-relaxed">{group.description}</p>

                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex -space-x-2">
                      {avatarSeeds.slice(0, 3).map((s, i) => (
                        <img key={i} src={`https://i.pravatar.cc/100?img=${s}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#111] object-cover" />
                      ))}
                    </div>
                    <span className="text-xs text-[#6B7280]">+{group.members - 3} more</span>
                  </div>

                  <button
                    onClick={() => toggleJoin(group.id)}
                    className={`w-full py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200
                      ${joined.has(group.id)
                        ? 'bg-violet-950/40 text-violet-400 border border-[#111]/[0.12]'
                        : 'btn-gold text-white'
                      }`}
                  >
                    {joined.has(group.id) ? '✓ Joined' : group.private ? 'Request to Join' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-[#6B7280]">
              No groups found for "<span className="text-violet-400">{search}</span>"
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
