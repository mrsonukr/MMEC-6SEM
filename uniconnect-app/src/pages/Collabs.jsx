import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {
  Handshake, Search, Plus, Code2, Brain, Palette,
  X, Send, ChevronRight, Zap, BookOpen, Users,
  ArrowLeftRight, Trophy, Clock, Star
} from 'lucide-react'

const hackathonRequests = [
  {
    id: 1, name: 'Priya Verma', avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    event: 'Hackathon 2026', eventDate: 'April 12', role: 'Looking for: Frontend Dev',
    skills: ['React', 'Tailwind', 'Figma'], mySkills: ['Node.js', 'MongoDB'],
    bio: 'I have a solid project idea in EdTech. Need someone who can build a polished UI. I handle all backend logic.',
    teamSize: '2/4 filled', online: true,
  },
  {
    id: 2, name: 'Ankit Sharma', avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    event: 'HackMMU Spring', eventDate: 'April 28', role: 'Looking for: ML Engineer',
    skills: ['Python', 'TensorFlow', 'FastAPI'], mySkills: ['React', 'AWS'],
    bio: 'Building an AI-powered recommendation engine. Need someone who can train and deploy models. Stack: Python + React.',
    teamSize: '1/3 filled', online: false,
  },
  {
    id: 3, name: 'Deepak Nair', avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    event: 'Hackathon 2026', eventDate: 'April 12', role: 'Looking for: UI/UX Designer',
    skills: ['Figma', 'Prototyping', 'Motion'], mySkills: ['Vue.js', 'Django'],
    bio: 'Full-stack dev with an idea for a community health app. Need someone to design user flows and components.',
    teamSize: '3/4 filled', online: true,
  },
  {
    id: 4, name: 'Neha Singh', avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    event: 'Code Sprint 2026', eventDate: 'May 5', role: 'Looking for: Backend Dev',
    skills: ['Node.js', 'PostgreSQL', 'Redis'], mySkills: ['Flutter', 'Firebase'],
    bio: 'Working on a fintech mobile app. Need backend support — APIs, auth, and DB design. Mobile frontend is mine.',
    teamSize: '2/3 filled', online: true,
  },
]

const skillExchanges = [
  {
    id: 1, name: 'Rohan Mehta', avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    offering: ['Python', 'Data Science', 'Pandas'], wanting: ['React', 'JavaScript', 'CSS'],
    offerIcon: Brain, wantIcon: Code2, sessions: '1hr/week', mode: 'Online',
    bio: 'Data science student. Can teach Python, ML basics in exchange for modern web dev skills.',
    rating: 4.8, exchanges: 6, online: true,
  },
  {
    id: 2, name: 'Shruti Agarwal', avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    offering: ['Figma', 'UI Design', 'Branding'], wanting: ['Node.js', 'Backend Dev', 'APIs'],
    offerIcon: Palette, wantIcon: Code2, sessions: '2hr/week', mode: 'Online / Campus',
    bio: "UX designer looking to understand backends. I'll help you level up your design skills in return!",
    rating: 4.9, exchanges: 11, online: false,
  },
  {
    id: 3, name: 'Arjun Patel', avatar: 'https://randomuser.me/api/portraits/men/58.jpg',
    offering: ['Java', 'DSA', 'System Design'], wanting: ['Machine Learning', 'Python', 'PyTorch'],
    offerIcon: Code2, wantIcon: Brain, sessions: '1.5hr/week', mode: 'Online',
    bio: 'Strong in Java and DSA interviews. Want to pivot into ML — happy to help you crack placement rounds.',
    rating: 4.7, exchanges: 9, online: true,
  },
  {
    id: 4, name: 'Kavya Reddy', avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    offering: ['Public Speaking', 'Pitching', 'Communication'], wanting: ['Web Dev', 'React', 'Portfolio Help'],
    offerIcon: Star, wantIcon: Code2, sessions: 'Flexible', mode: 'Campus preferred',
    bio: 'Won 3 debate competitions. Can help you articulate projects, prepare for interviews, or pitch ideas.',
    rating: 5.0, exchanges: 4, online: false,
  },
]

const mySkillBadges = ['React', 'Node.js', 'MongoDB', 'TypeScript']

function SkillBadge({ label, variant = 'default' }) {
  const styles = {
    default: 'bg-[#1A1A1A] text-[#D1D5DB] border-[#111]/[0.12]',
    accent: 'bg-violet-950/40 text-violet-400 border-violet-700/40',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${styles[variant]}`}>
      {label}
    </span>
  )
}

function HackathonCard({ req, onConnect }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="card overflow-hidden animate-fade-up">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img src={req.avatar} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-violet-800/50" />
            {req.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#F9FAFB]">{req.name}</p>
              <span className="text-[10px] bg-violet-950/40 text-violet-400 border border-violet-700/40 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                {req.teamSize}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Trophy size={10} className="text-amber-400" />
              <p className="text-xs text-violet-400 font-medium">{req.event}</p>
              <span className="text-[#6B7280] text-xs">· {req.eventDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-violet-950/40 rounded-xl mb-3 border border-violet-700/40">
          <Zap size={11} className="text-violet-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-violet-400">{req.role}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {req.skills.map(s => <SkillBadge key={s} label={s} variant="accent" />)}
        </div>

        <p className={`text-xs text-[#D1D5DB] leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {req.bio}
        </p>
        {req.bio.length > 80 && (
          <button onClick={() => setExpanded(e => !e)} className="text-[10px] text-violet-400 mt-1 hover:underline">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="mt-3 pt-3 border-t border-[#111]/[0.07] flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#6B7280] font-medium">Your skills:</span>
          {mySkillBadges.map(s => <SkillBadge key={s} label={s} />)}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 flex gap-2">
        <button onClick={() => onConnect(req)} className="flex-1 btn-gold py-2 text-xs rounded-xl flex items-center justify-center gap-1.5">
          <Send size={12} /> Request to Join
        </button>
        <button className="px-3 py-2 rounded-xl border border-[#111]/[0.12] text-[#6B7280] hover:border-violet-500 hover:text-violet-400 transition-all text-xs">
          Save
        </button>
      </div>
    </div>
  )
}

function SkillExchangeCard({ ex, onConnect }) {
  const OfferIcon = ex.offerIcon
  const WantIcon = ex.wantIcon
  return (
    <div className="card overflow-hidden animate-fade-up">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3 sm:mb-4">
          <div className="relative flex-shrink-0">
            <img src={ex.avatar} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-violet-800/50" />
            {ex.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#F9FAFB]">{ex.name}</p>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-[#F9FAFB]">{ex.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6B7280] flex-wrap">
              <span className="flex items-center gap-1"><Clock size={9} />{ex.sessions}</span>
              <span>·</span><span>{ex.mode}</span>
              <span>·</span><span className="text-emerald-500 font-medium">{ex.exchanges} done</span>
            </div>
          </div>
        </div>

        {/* Skill swap */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="flex-1 bg-violet-950/40 rounded-xl p-2.5 sm:p-3 border border-violet-700/40">
            <div className="flex items-center gap-1 mb-1.5">
              <OfferIcon size={11} className="text-violet-400" />
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wide">Offers</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ex.offering.map(s => (
                <span key={s} className="text-[10px] bg-[#111] text-violet-400 px-1.5 py-0.5 rounded-full border border-violet-700/40 font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#111]/[0.12] flex items-center justify-center">
            <ArrowLeftRight size={11} className="text-[#6B7280]" />
          </div>

          <div className="flex-1 bg-emerald-950/30 rounded-xl p-2.5 sm:p-3 border border-emerald-800/40">
            <div className="flex items-center gap-1 mb-1.5">
              <WantIcon size={11} className="text-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Wants</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ex.wanting.map(s => (
                <span key={s} className="text-[10px] bg-[#111] text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-800/40 font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#D1D5DB] leading-relaxed line-clamp-2">{ex.bio}</p>
      </div>

      <div className="px-4 sm:px-5 pb-4 flex gap-2">
        <button onClick={() => onConnect(ex)} className="flex-1 btn-gold py-2 text-xs rounded-xl flex items-center justify-center gap-1.5">
          <ArrowLeftRight size={11} /> Propose Exchange
        </button>
        <button className="px-3 py-2 rounded-xl border border-[#111]/[0.12] text-[#6B7280] hover:border-violet-500 hover:text-violet-400 transition-all text-xs">
          Message
        </button>
      </div>
    </div>
  )
}

function ConnectModal({ target, type, onClose }) {
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const placeholder = type === 'hackathon'
    ? `Hi ${target?.name?.split(' ')[0]}, I'd love to join your team!`
    : `Hi ${target?.name?.split(' ')[0]}, I'd love to exchange skills!`

  if (!target) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4 animate-fade-in">
      <div className="card w-full sm:max-w-md p-5 sm:p-6 animate-fade-up rounded-b-none sm:rounded-2xl">
        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-violet-950/40 border border-violet-700/40 flex items-center justify-center mx-auto mb-4">
              <Send size={22} className="text-violet-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#F9FAFB] mb-2">Request Sent!</h3>
            <p className="text-sm text-[#6B7280] mb-6">{target.name} will be notified.</p>
            <button onClick={onClose} className="btn-gold px-8 py-2.5 rounded-full text-sm">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3">
                <img src={target.avatar} className="w-10 h-10 rounded-full ring-2 ring-violet-800/50" />
                <div>
                  <p className="text-sm font-semibold text-[#F9FAFB]">{target.name}</p>
                  <p className="text-xs text-[#6B7280]">{type === 'hackathon' ? target.event : 'Skill Exchange'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#1A1A1A] transition-all">
                <X size={16} />
              </button>
            </div>

            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
              {type === 'hackathon' ? 'Your pitch to join' : 'Your exchange proposal'}
            </label>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full bg-[#1A1A1A] border border-[#111]/[0.12] rounded-xl px-4 py-3 text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-800/50 transition-all resize-none placeholder:text-[#6B7280]"
            />

            <div className="flex gap-3 mt-4 sm:mt-5">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#111]/[0.12] text-sm text-[#6B7280] hover:bg-[#1A1A1A] transition-all">
                Cancel
              </button>
              <button
                onClick={() => setSent(true)}
                disabled={!msg.trim()}
                className="flex-1 btn-gold py-2.5 rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Send size={13} /> Send Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function PostRequestModal({ type, onClose }) {
  const [form, setForm] = useState({ title: '', skills: '', about: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4 animate-fade-in">
      <div className="card w-full sm:max-w-md p-5 sm:p-6 animate-fade-up rounded-b-none sm:rounded-2xl">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-violet-950/40 border border-violet-700/40 flex items-center justify-center mx-auto mb-4">
              <Handshake size={24} className="text-violet-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#F9FAFB] mb-2">Posted!</h3>
            <p className="text-sm text-[#6B7280] mb-6">Your request is live. Others can now find and connect with you.</p>
            <button onClick={onClose} className="btn-gold px-8 py-2.5 rounded-full text-sm">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F9FAFB]">
                {type === 'hackathon' ? 'Find Teammates' : 'Propose Skill Exchange'}
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#1A1A1A] transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[
                { label: type === 'hackathon' ? 'Event / Hackathon Name' : 'What I can teach', field: 'title', placeholder: type === 'hackathon' ? 'e.g. Hackathon 2026' : 'e.g. Python, ML' },
                { label: type === 'hackathon' ? 'Skills you need' : 'What I want to learn', field: 'skills', placeholder: type === 'hackathon' ? 'e.g. React, Node.js' : 'e.g. React, Web Dev' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">{label}</label>
                  <input
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#1A1A1A] border border-[#111]/[0.12] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280] text-[#F9FAFB]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Short description</label>
                <textarea
                  value={form.about}
                  onChange={e => setForm({ ...form, about: e.target.value })}
                  rows={3}
                  placeholder="Describe your idea and what makes a great teammate…"
                  className="w-full bg-[#1A1A1A] border border-[#111]/[0.12] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-all resize-none placeholder:text-[#6B7280] text-[#F9FAFB]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-5">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#111]/[0.12] text-sm text-[#6B7280] hover:bg-[#1A1A1A] transition-all">
                Cancel
              </button>
              <button
                onClick={() => setSubmitted(true)}
                disabled={!form.title || !form.skills}
                className="flex-1 btn-gold py-2.5 rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Plus size={13} /> Post Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Collabs() {
  const [tab, setTab] = useState('hackathon')
  const [search, setSearch] = useState('')
  const [connectTarget, setConnectTarget] = useState(null)
  const [connectType, setConnectType] = useState(null)
  const [postModal, setPostModal] = useState(null)

  const filteredHack = hackathonRequests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.event.toLowerCase().includes(search.toLowerCase()) ||
    r.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredExchange = skillExchanges.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.offering.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    r.wanting.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-5 sm:mb-8 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Handshake size={16} className="text-violet-400" />
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F9FAFB]">Collabs</h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280]">Find teammates or exchange skills with peers</p>
            </div>
            <button
              onClick={() => setPostModal(tab)}
              className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">{tab === 'hackathon' ? 'Find Teammates' : 'Propose Exchange'}</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8 animate-fade-up stagger-1">
            {[
              { icon: Trophy, label: 'Hackathon Slots', value: hackathonRequests.length },
              { icon: ArrowLeftRight, label: 'Skill Exchanges', value: skillExchanges.length },
              { icon: Users, label: 'Collaborators', value: 142 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-950/40 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-violet-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#F9FAFB] leading-none">{value}</p>
                  <p className="text-[9px] sm:text-[10px] text-[#6B7280] mt-0.5 truncate">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fade-up stagger-2">
            <div className="flex bg-[#1A1A1A] rounded-xl p-1 gap-1">
              <button
                onClick={() => setTab('hackathon')}
                className={`flex items-center justify-center gap-1.5 flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${tab === 'hackathon' ? 'bg-[#111] text-violet-400 shadow-sm border border-[#111]/[0.07]' : 'text-[#6B7280] hover:text-[#F9FAFB]'}`}
              >
                <Trophy size={13} /> <span className="hidden xs:inline">Hackathon Teams</span><span className="xs:hidden">Teams</span>
              </button>
              <button
                onClick={() => setTab('exchange')}
                className={`flex items-center justify-center gap-1.5 flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${tab === 'exchange' ? 'bg-[#111] text-violet-400 shadow-sm border border-[#111]/[0.07]' : 'text-[#6B7280] hover:text-[#F9FAFB]'}`}
              >
                <ArrowLeftRight size={13} /> <span className="hidden xs:inline">Skill Exchange</span><span className="xs:hidden">Exchange</span>
              </button>
            </div>

            <div className="relative flex-1 sm:max-w-sm">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tab === 'hackathon' ? 'Search by skill or event…' : 'Search by skill…'}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#111]/[0.12] bg-[#111111] text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          {/* My skills */}
          <div className="card p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3 animate-fade-up stagger-3">
            <div className="w-8 h-8 rounded-xl bg-violet-950/40 flex items-center justify-center flex-shrink-0">
              <BookOpen size={14} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-[#F9FAFB]">Your skills are visible to others</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {mySkillBadges.map(s => <SkillBadge key={s} label={s} variant="accent" />)}
              </div>
            </div>
            <button className="text-xs text-violet-400 hover:underline font-medium flex items-center gap-0.5 flex-shrink-0">
              Edit <ChevronRight size={11} />
            </button>
          </div>

          {/* Cards grid */}
          {tab === 'hackathon' ? (
            <>
              <p className="text-xs text-[#6B7280] mb-3 sm:mb-4 font-medium uppercase tracking-widest">
                {filteredHack.length} open requests
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {filteredHack.map(req => (
                  <HackathonCard key={req.id} req={req} onConnect={r => { setConnectTarget(r); setConnectType('hackathon') }} />
                ))}
              </div>
              {filteredHack.length === 0 && (
                <div className="text-center py-16 text-[#6B7280] text-sm">
                  No requests match "<span className="text-violet-400">{search}</span>"
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-xs text-[#6B7280] mb-3 sm:mb-4 font-medium uppercase tracking-widest">
                {filteredExchange.length} skill exchanges available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {filteredExchange.map(ex => (
                  <SkillExchangeCard key={ex.id} ex={ex} onConnect={e => { setConnectTarget(e); setConnectType('exchange') }} />
                ))}
              </div>
              {filteredExchange.length === 0 && (
                <div className="text-center py-16 text-[#6B7280] text-sm">
                  No exchanges match "<span className="text-violet-400">{search}</span>"
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {connectTarget && (
        <ConnectModal target={connectTarget} type={connectType} onClose={() => { setConnectTarget(null); setConnectType(null) }} />
      )}
      {postModal && (
        <PostRequestModal type={postModal} onClose={() => setPostModal(null)} />
      )}
    </div>
  )
}
