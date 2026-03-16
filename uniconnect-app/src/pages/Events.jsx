import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { CalendarDays, MapPin, Clock, Users, Plus, Search, ExternalLink } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Hackathon 2026',
    date: 'April 12, 2026',
    time: '9:00 AM – 9:00 PM',
    location: 'Online · Zoom',
    attendees: 342,
    tag: 'Technology',
    registered: false,
    featured: true,
    desc: 'Join developers worldwide and build amazing projects in 12 hours. Prizes worth ₹1,00,000. Open to all university students.',
  },
  {
    id: 2,
    title: 'UI/UX Design Workshop',
    date: 'April 18, 2026',
    time: '2:00 PM – 5:00 PM',
    location: 'MMU Campus, Hall A',
    attendees: 85,
    tag: 'Design',
    registered: true,
    featured: false,
    desc: 'Hands-on workshop covering Figma basics, design systems, and user research methodologies.',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    date: 'April 25, 2026',
    time: '6:00 PM – 9:00 PM',
    location: 'Innovation Hub, Delhi',
    attendees: 120,
    tag: 'Entrepreneurship',
    registered: false,
    featured: false,
    desc: 'Present your startup idea to investors and get valuable feedback from industry experts.',
  },
  {
    id: 4,
    title: 'AI/ML Seminar',
    date: 'May 2, 2026',
    time: '10:00 AM – 1:00 PM',
    location: 'Online · Google Meet',
    attendees: 215,
    tag: 'Research',
    registered: false,
    featured: false,
    desc: 'Deep dive into the latest developments in large language models and generative AI applications.',
  },
]

export default function Events() {
  const [registered, setRegistered] = useState(new Set([2]))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const tags = ['All', 'Technology', 'Design', 'Entrepreneurship', 'Research']
  const filtered = events.filter(e =>
    (filter === 'All' || e.tag === filter) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRegister = (id) => {
    setRegistered(prev => {
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
                <CalendarDays size={16} className="text-violet-400" />
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F9FAFB]">Events</h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280]">Discover and attend events in your network</p>
            </div>
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5">
              <Plus size={13} /> <span className="hidden sm:inline">Create Event</span><span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Featured event */}
          {events.filter(e => e.featured).map(event => (
            <div key={event.id}
              className="card overflow-hidden mb-5 sm:mb-8 animate-fade-up stagger-1 relative"
              style={{ background: 'linear-gradient(135deg, #0F172A, #1E1B4B)' }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(99,102,241,0.4) 30px, rgba(99,102,241,0.4) 31px)` }}
              />
              <div className="relative z-10 p-4 sm:p-7 flex flex-col md:flex-row md:items-center gap-4 sm:gap-6">
                <div className="flex-1">
                  <span className="text-[10px] font-semibold tracking-widest text-violet-400 uppercase mb-2 sm:mb-3 block">✦ Featured Event</span>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-white mb-2">{event.title}</h2>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] mb-3 sm:mb-4 leading-relaxed">{event.desc}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{event.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{event.attendees} attending</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleRegister(event.id)}
                  className={`w-full md:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm font-semibold flex-shrink-0 transition-all
                    ${registered.has(event.id)
                      ? 'bg-[#111111]/10 text-white border border-[#111]/20'
                      : 'btn-gold'
                    }`}
                >
                  {registered.has(event.id) ? '✓ Registered' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fade-up stagger-2">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#111]/[0.12] bg-[#111111] text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
            </div>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
              {tags.map(tag => (
                <button key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all flex-shrink-0
                    ${filter === tag
                      ? 'btn-gold text-white'
                      : 'border border-[#111]/[0.12] text-[#6B7280] bg-[#111111] hover:border-violet-500 hover:text-violet-400'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Events list */}
          <div className="space-y-3 sm:space-y-4">
            {filtered.filter(e => !e.featured).map((event, idx) => (
              <div key={event.id}
                className="card card-interactive p-4 sm:p-5 animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex gap-3 sm:gap-5">
                  {/* Date block */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-violet-950/40 border border-[#111]/[0.07] flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="text-xl sm:text-2xl font-display font-bold text-[#F9FAFB] leading-none">
                      {event.date.split(' ')[1]?.replace(',', '')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <h2 className="text-sm font-semibold text-[#F9FAFB]">{event.title}</h2>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-400 border border-[#111]/[0.07] flex-shrink-0">
                        {event.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#D1D5DB] mb-2 leading-relaxed line-clamp-2">{event.desc}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                      <span className="flex items-center gap-1"><Users size={10} />{event.attendees}</span>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center gap-2 mt-3">
                      <button className="p-1.5 rounded-xl text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 transition-all">
                        <ExternalLink size={13} />
                      </button>
                      <button
                        onClick={() => toggleRegister(event.id)}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all
                          ${registered.has(event.id)
                            ? 'bg-violet-950/40 text-violet-400 border border-[#111]/[0.12]'
                            : 'btn-gold'
                          }`}
                      >
                        {registered.has(event.id) ? '✓ Registered' : 'Register'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
