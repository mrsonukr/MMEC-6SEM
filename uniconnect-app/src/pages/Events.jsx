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

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={18} className="text-violet-400" />
                <h1 className="font-display text-3xl font-semibold text-[#F9FAFB]">Events</h1>
              </div>
              <p className="text-sm text-[#6B7280]">Discover and attend events in your network</p>
            </div>
            <button className="btn-gold px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
              <Plus size={15} /> Create Event
            </button>
          </div>

          {/* Featured event */}
          {events.filter(e => e.featured).map(event => (
            <div key={event.id}
              className="card overflow-hidden mb-8 animate-fade-up stagger-1 relative"
              style={{ background: 'linear-gradient(135deg, #0F172A, #1E1B4B)' }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(99,102,241,0.4) 30px, rgba(99,102,241,0.4) 31px)` }}
              />
              <div className="relative z-10 p-7 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <span className="text-[10px] font-semibold tracking-widest text-violet-400 uppercase mb-3 block">
                    ✦ Featured Event
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-white mb-2">{event.title}</h2>
                  <p className="text-sm text-[#9CA3AF] mb-4 leading-relaxed max-w-lg">{event.desc}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1.5"><CalendarDays size={12} />{event.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{event.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{event.location}</span>
                    <span className="flex items-center gap-1.5"><Users size={12} />{event.attendees} attending</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleRegister(event.id)}
                  className={`px-7 py-3 rounded-full text-sm font-semibold flex-shrink-0 transition-all
                    ${registered.has(event.id)
                      ? 'bg-[#111111]/10 text-white border border-[#111]/20 hover:bg-[#111111]/20'
                      : 'btn-gold'
                    }`}
                >
                  {registered.has(event.id) ? '✓ Registered' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up stagger-2">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#111]/[0.12] bg-[#111111] text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <button key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all
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
          <div className="space-y-4">
            {filtered.filter(e => !e.featured).map((event, idx) => (
              <div key={event.id}
                className="card card-interactive p-5 flex flex-col sm:flex-row sm:items-center gap-5 animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Date block */}
                <div className="w-16 h-16 rounded-2xl bg-violet-950/40 border border-[#111]/[0.07] flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                    {event.date.split(' ')[0]}
                  </span>
                  <span className="text-2xl font-display font-bold text-[#F9FAFB] leading-none">
                    {event.date.split(' ')[1]?.replace(',', '')}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <h2 className="text-base font-semibold text-[#F9FAFB]">{event.title}</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-400 border border-[#111]/[0.07] flex-shrink-0 mt-0.5">
                      {event.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#D1D5DB] mb-2 leading-relaxed">{event.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><Clock size={11} />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{event.attendees} attending</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 rounded-xl text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 transition-all">
                    <ExternalLink size={15} />
                  </button>
                  <button
                    onClick={() => toggleRegister(event.id)}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all
                      ${registered.has(event.id)
                        ? 'bg-violet-950/40 text-violet-400 border border-[#111]/[0.12]'
                        : 'btn-gold'
                      }`}
                  >
                    {registered.has(event.id) ? '✓ Registered' : 'Register'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
