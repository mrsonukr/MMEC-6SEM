import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Bell, Heart, MessageCircle, UserPlus, Briefcase, CalendarDays, Check } from 'lucide-react'

const allNotifications = [
  { id: 1, user: 'Rahul Sharma',        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',   action: 'liked your post',                    time: '2 min ago',   unread: true,  type: 'like' },
  { id: 2, user: 'Priya Verma',          avatar: 'https://randomuser.me/api/portraits/women/44.jpg', action: 'commented on your project',           time: '10 min ago',  unread: true,  type: 'comment' },
  { id: 3, user: 'Startup Community',    avatar: 'https://randomuser.me/api/portraits/men/20.jpg',   action: 'invited you to Hackathon 2026',        time: '1 hour ago',  unread: true,  type: 'event' },
  { id: 4, user: 'Ankit Kumar',          avatar: 'https://randomuser.me/api/portraits/men/12.jpg',   action: 'started following you',               time: '3 hours ago', unread: false, type: 'follow' },
  { id: 5, user: 'Design Group',         avatar: 'https://randomuser.me/api/portraits/women/21.jpg', action: 'posted a new update in UI/UX Designers', time: 'Yesterday', unread: false, type: 'group' },
  { id: 6, user: 'TechNova HR',          avatar: 'https://randomuser.me/api/portraits/men/55.jpg',   action: 'viewed your profile',                 time: 'Yesterday',   unread: false, type: 'job' },
  { id: 7, user: 'Jocelyn Westervelt',   avatar: 'https://randomuser.me/api/portraits/women/28.jpg', action: 'liked your comment',                  time: '2 days ago',  unread: false, type: 'like' },
]

const iconMap = {
  like:    { icon: Heart,         bg: 'bg-red-50',                    color: 'text-red-400' },
  comment: { icon: MessageCircle, bg: 'bg-blue-50',                   color: 'text-blue-400' },
  follow:  { icon: UserPlus,      bg: 'bg-violet-950/40',  color: 'text-violet-400' },
  event:   { icon: CalendarDays,  bg: 'bg-purple-50',                 color: 'text-purple-400' },
  job:     { icon: Briefcase,     bg: 'bg-emerald-50',                color: 'text-emerald-500' },
  group:   { icon: UserPlus,      bg: 'bg-violet-950/40',  color: 'text-violet-400' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [filter, setFilter] = useState('All')

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const filters = ['All', 'Unread', 'Likes', 'Comments', 'Follows']
  const typeMap = { Likes: 'like', Comments: 'comment', Follows: 'follow' }

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return n.unread
    return n.type === typeMap[filter]
  })

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell size={18} className="text-violet-400" />
                <h1 className="font-display text-3xl font-semibold text-[#F9FAFB]">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="btn-gold w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#6B7280]">Stay up to date with your network</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-[#F9FAFB] font-medium transition-colors"
              >
                <Check size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar animate-fade-up stagger-1">
            {filters.map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0
                  ${filter === f
                    ? 'btn-gold text-white'
                    : 'border border-[#111]/[0.12] text-[#6B7280] bg-[#111111] hover:border-violet-500 hover:text-violet-400'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            {filtered.map((n, idx) => {
              const { icon: Icon, bg, color } = iconMap[n.type] || iconMap.follow
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer animate-fade-up
                    ${n.unread
                      ? 'bg-violet-950/40 border-[#111]/[0.12] shadow-sm'
                      : 'bg-[#111111] border-[#111]/[0.07] hover:bg-violet-950/40 hover:border-[#111]/[0.12]'
                    }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Avatar with type badge */}
                  <div className="relative flex-shrink-0">
                    <img src={n.avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-800/50 ring-offset-1" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bg} border-2 border-[color:var(--ivory)] flex items-center justify-center`}>
                      <Icon size={11} className={color} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F9FAFB] leading-snug">
                      <span className="font-semibold">{n.user}</span>
                      {' '}
                      <span className="text-[#D1D5DB]">{n.action}</span>
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{n.time}</p>
                  </div>

                  {/* Unread dot */}
                  {n.unread && (
                    <div className="w-2 h-2 rounded-full bg-[color:var(--accent)] flex-shrink-0" />
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Bell size={32} className="text-[color:var(--accent-light)] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">No notifications here</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
