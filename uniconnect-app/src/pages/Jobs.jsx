import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Briefcase, MapPin, Clock, Building, Search, Bookmark, ExternalLink, Filter } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechNova',
    logo: 'https://i.pravatar.cc/100?img=60',
    location: 'Remote',
    type: 'Internship',
    salary: '₹15,000/mo',
    posted: '2 days ago',
    tags: ['React', 'TypeScript', 'CSS'],
    desc: 'Join our frontend team to build beautiful, performant interfaces for our SaaS platform. Mentorship provided.',
    featured: true,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'DesignLab',
    logo: 'https://i.pravatar.cc/100?img=61',
    location: 'Delhi, India',
    type: 'Part-time',
    salary: '₹25,000/mo',
    posted: '3 days ago',
    tags: ['Figma', 'Prototyping', 'User Research'],
    desc: 'Looking for a creative designer to shape user experiences for our mobile apps.',
    featured: false,
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'CloudStack Inc.',
    logo: 'https://i.pravatar.cc/100?img=62',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹8–12 LPA',
    posted: '1 week ago',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    desc: 'Build scalable microservices and APIs for our growing cloud infrastructure team.',
    featured: false,
  },
  {
    id: 4,
    title: 'Data Science Intern',
    company: 'Analytics Hub',
    logo: 'https://i.pravatar.cc/100?img=63',
    location: 'Remote',
    type: 'Internship',
    salary: '₹12,000/mo',
    posted: '5 days ago',
    tags: ['Python', 'ML', 'Pandas'],
    desc: 'Work on real-world ML projects and data pipelines alongside senior data scientists.',
    featured: false,
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'InfraBase',
    logo: 'https://i.pravatar.cc/100?img=64',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹10–15 LPA',
    posted: '2 weeks ago',
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    desc: 'Maintain and improve our deployment pipelines and cloud infrastructure.',
    featured: false,
  },
]

const types = ['All', 'Internship', 'Part-time', 'Full-time']

export default function Jobs() {
  const [saved, setSaved] = useState(new Set())
  const [applied, setApplied] = useState(new Set())
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const toggleSave = (id) => {
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }
  const toggleApply = (id) => {
    setApplied(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  const filtered = jobs.filter(j =>
    (filter === 'All' || j.type === filter) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()))
  )

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
                <Briefcase size={18} className="text-violet-400" />
                <h1 className="font-display text-3xl font-semibold text-[#F9FAFB]">Jobs & Referrals</h1>
              </div>
              <p className="text-sm text-[#6B7280]">Find opportunities tailored for students</p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up stagger-1">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs or companies…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#111]/[0.12] bg-[#111111] text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
            </div>
            <div className="flex gap-2">
              {types.map(t => (
                <button key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all
                    ${filter === t
                      ? 'btn-gold text-white'
                      : 'border border-[#111]/[0.12] text-[#6B7280] bg-[#111111] hover:border-violet-500 hover:text-violet-400'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up stagger-2">
            {[
              { label: 'Open Positions', value: jobs.length },
              { label: 'Applications Sent', value: applied.size },
              { label: 'Saved Jobs', value: saved.size },
            ].map(({ label, value }) => (
              <div key={label} className="card p-4 text-center">
                <p className="font-display text-2xl font-semibold text-violet-400">{value}</p>
                <p className="text-xs text-[#6B7280] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Job cards */}
          <div className="space-y-4">
            {filtered.map((job, idx) => (
              <div key={job.id}
                className={`card p-5 animate-fade-up ${job.featured ? 'ring-1 ring-[color:var(--accent)]' : ''}`}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {job.featured && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">✦ Featured</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <img src={job.logo} className="w-12 h-12 rounded-xl object-cover border border-[#111]/[0.07] flex-shrink-0" />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-[#F9FAFB] mb-0.5">{job.title}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                          <Building size={11} />
                          <span>{job.company}</span>
                          <span className="text-[color:var(--border-strong)]">·</span>
                          <MapPin size={11} />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium text-violet-400 bg-violet-950/40 border border-[#111]/[0.07] px-2.5 py-1 rounded-full">
                          {job.type}
                        </span>
                        <button onClick={() => toggleSave(job.id)}
                          className={`p-1.5 rounded-lg transition-all ${saved.has(job.id) ? 'text-violet-400' : 'text-[#6B7280] hover:text-violet-400'}`}
                        >
                          <Bookmark size={15} fill={saved.has(job.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#D1D5DB] mt-2 leading-relaxed">{job.desc}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-[10px] font-medium bg-[#0A0A0A] border border-[#111]/[0.07] text-[#6B7280] rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Clock size={11} />{job.posted}</span>
                        <span className="font-medium text-[#F9FAFB]">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-xl text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 transition-all">
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => toggleApply(job.id)}
                          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all
                            ${applied.has(job.id)
                              ? 'bg-violet-950/40 text-violet-400 border border-[#111]/[0.12]'
                              : 'btn-gold'
                            }`}
                        >
                          {applied.has(job.id) ? '✓ Applied' : 'Apply Now'}
                        </button>
                      </div>
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
