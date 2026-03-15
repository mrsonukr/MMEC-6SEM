import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { MapPin, Briefcase, GraduationCap, Plus, Edit3, ExternalLink, Award, Users } from 'lucide-react'

const posts = [
  { text: 'Excited to collaborate with amazing developers for Hackathon 2026 🚀', time: '2 hours ago' },
  { text: 'Just completed a React project. Learned a lot about modern UI design principles!', time: '1 day ago' },
]

const skills = ['React', 'Node.js', 'MongoDB', 'UI Design', 'Figma', 'TypeScript', 'Next.js']

const connections = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Cover + Avatar */}
          <div className="card overflow-hidden mb-5 animate-fade-up">
            {/* Cover image */}
            <div className="h-40 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #312E81 100%)' }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(99,102,241,0.4) 30px, rgba(99,102,241,0.4) 31px)` }}
              />
              <div className="absolute top-4 right-4">
                <button className="flex items-center gap-1.5 bg-[#111111]/10 hover:bg-[#111111]/20 text-[#D1D5DB] text-xs px-3 py-1.5 rounded-full border border-[#111]/10 transition-all">
                  <Edit3 size={11} /> Edit Cover
                </button>
              </div>
            </div>

            {/* Avatar + info */}
            <div className="px-6 pb-5">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    className="w-20 h-20 rounded-full ring-4 ring-[color:var(--ivory)] object-cover"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[color:var(--ivory)]" />
                </div>
                <div className="flex gap-2 mb-1">
                  <button className="btn-outline text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
                    <Edit3 size={12} /> Edit Profile
                  </button>
                  <button className="btn-gold text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
                    <Plus size={12} /> Connect
                  </button>
                </div>
              </div>

              <h1 className="font-display text-2xl font-semibold text-[#F9FAFB]">Rahul Sharma</h1>
              <p className="text-sm text-[#D1D5DB] mt-0.5">Full Stack Developer · React · Node.js</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1"><MapPin size={11} /> Delhi, India</span>
                <span className="flex items-center gap-1"><GraduationCap size={11} /> MMU University</span>
                <span className="flex items-center gap-1"><Briefcase size={11} /> Apple Corporation</span>
                <span className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {connections.map((src, i) => (
                      <img key={i} src={src} className="w-4 h-4 rounded-full border border-[color:var(--ivory)]" />
                    ))}
                  </div>
                  <span className="text-violet-400 font-medium cursor-pointer hover:underline">60 connections</span>
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-t border-[#111]/[0.07] flex gap-1 overflow-x-auto no-scrollbar">
              {['about', 'experience', 'projects', 'activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-sm font-medium capitalize transition-all border-b-2 whitespace-nowrap
                    ${activeTab === tab
                      ? 'border-[color:var(--accent)] text-violet-400'
                      : 'border-transparent text-[#6B7280] hover:text-[#F9FAFB]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-3 gap-5">

            {/* Left sidebar */}
            <div className="space-y-5">

              {/* Skills */}
              <div className="card p-5 animate-fade-up stagger-1">
                <h3 className="font-display text-base font-semibold text-[#F9FAFB] mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill}
                      className="px-3 py-1 text-xs font-medium bg-violet-950/40 text-violet-400 border border-[#111]/[0.07] rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connections */}
              <div className="card p-5 animate-fade-up stagger-2">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={14} className="text-violet-400" />
                  <h3 className="font-display text-base font-semibold text-[#F9FAFB]">Connections</h3>
                </div>
                <div className="flex -space-x-2 mb-2">
                  {connections.map((src, i) => (
                    <img key={i} src={src} className="w-10 h-10 rounded-full ring-2 ring-[color:var(--ivory)] object-cover" />
                  ))}
                </div>
                <p className="text-xs text-[#6B7280]">60 connections · 12 mutual</p>
              </div>

              {/* Groups */}
              <div className="card p-5 animate-fade-up stagger-3">
                <h3 className="font-display text-base font-semibold text-[#F9FAFB] mb-4">Groups</h3>
                <div className="space-y-2.5">
                  {['React Developers', 'Startup Builders', 'UI/UX Designers', 'AI Enthusiasts'].map((g, i) => (
                    <div key={g} className="flex items-center gap-2.5 group cursor-pointer">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                        style={{
                          background: ['#FAF6EF', '#FAF6EF', '#FAF6EF', '#FAF6EF'][i],
                          border: '1px solid var(--border)',
                        }}
                      >
                        {['🚀','💡','🎨','🧠'][i]}
                      </div>
                      <span className="text-sm text-[#D1D5DB] group-hover:text-violet-400 transition-colors">{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div className="card p-5 animate-fade-up stagger-4">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={14} className="text-violet-400" />
                  <h3 className="font-display text-base font-semibold text-[#F9FAFB]">Certificates</h3>
                </div>
                <div className="space-y-2.5">
                  {['Google UX Design', 'Meta Frontend Dev', 'AWS Cloud Practitioner'].map(c => (
                    <div key={c} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] flex-shrink-0" />
                      <span className="text-sm text-[#D1D5DB]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-span-2 space-y-5">

              {/* About */}
              {activeTab === 'about' && (
                <div className="card p-6 animate-fade-up">
                  <h3 className="font-display text-lg font-semibold text-[#F9FAFB] mb-3">About Me</h3>
                  <div className="divider-glow mb-4" />
                  <p className="text-sm text-[#D1D5DB] leading-relaxed">
                    Passionate full stack developer who enjoys building scalable web applications and collaborating with talented teams.
                    I thrive in collaborative environments, enjoy mentoring junior developers, and am always looking for the next challenge.
                    Open to internship and freelance opportunities.
                  </p>
                </div>
              )}

              {/* Experience */}
              {(activeTab === 'about' || activeTab === 'experience') && (
                <div className="card p-6 animate-fade-up">
                  <h3 className="font-display text-lg font-semibold text-[#F9FAFB] mb-3">Experience</h3>
                  <div className="divider-glow mb-5" />
                  <div className="space-y-5">
                    {[
                      { role: 'Freelance Art Director', company: 'Apple Corporation', period: '2022 – Present', desc: 'Leading creative campaigns and visual design direction for product launches.' },
                      { role: 'UX Designer', company: 'Apple Corporation', period: '2017 – 2022', desc: 'Designed user interfaces for iOS and macOS applications.' },
                    ].map((exp, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-[#111]/[0.07] flex items-center justify-center flex-shrink-0">
                          <Briefcase size={16} className="text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#F9FAFB]">{exp.role}</p>
                          <p className="text-xs text-violet-400 mt-0.5">{exp.company}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{exp.period}</p>
                          <p className="text-xs text-[#D1D5DB] mt-2 leading-relaxed">{exp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(activeTab === 'about' || activeTab === 'projects') && (
                <div className="card p-6 animate-fade-up">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold text-[#F9FAFB]">Projects</h3>
                    <button className="btn-gold text-xs px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="divider-glow mb-5" />
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'UniConnect', desc: 'Social network for university collaboration.', tags: ['React', 'Node', 'MongoDB'] },
                      { name: 'Task Manager', desc: 'Productivity app for managing projects.', tags: ['Next.js', 'Express'] },
                      { name: 'Portfolio CMS', desc: 'Content management for creative portfolios.', tags: ['Remix', 'Prisma'] },
                      { name: 'AI Chat Bot', desc: 'Smart assistant for student queries.', tags: ['Python', 'FastAPI'] },
                    ].map((proj, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[#111]/[0.07] bg-[#0A0A0A] hover:border-violet-500 hover:bg-violet-950/40 transition-all group cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-[#F9FAFB] group-hover:text-violet-400 transition-colors">{proj.name}</h4>
                          <ExternalLink size={12} className="text-[#6B7280] group-hover:text-violet-400 transition-colors mt-0.5" />
                        </div>
                        <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-[#111111] border border-[#111]/[0.07] text-[#6B7280] rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity */}
              {(activeTab === 'about' || activeTab === 'activity') && (
                <div className="card p-6 animate-fade-up">
                  <h3 className="font-display text-lg font-semibold text-[#F9FAFB] mb-3">Recent Activity</h3>
                  <div className="divider-glow mb-5" />
                  <div className="space-y-4">
                    {posts.map((post, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[#111]/[0.07] bg-[#0A0A0A] hover:border-violet-500 hover:bg-violet-950/40 transition-all cursor-pointer">
                        <p className="text-sm text-[#D1D5DB] leading-relaxed">{post.text}</p>
                        <p className="text-xs text-[#6B7280] mt-2">{post.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
