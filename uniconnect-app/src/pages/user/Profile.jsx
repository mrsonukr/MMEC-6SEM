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
    <div className="min-h-screen flex bg-gray-50 page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

          {/* Cover + Avatar */}
          <div className="card overflow-hidden mb-4 sm:mb-5 animate-fade-up bg-white rounded-xl border border-gray-200">
            <div className="h-28 sm:h-40 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #EC4899 100%)' }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.4) 30px, rgba(255,255,255,0.4) 31px)` }}
              />
              <div className="absolute top-3 right-3">
                <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full border border-white/20 transition-all">
                  <Edit3 size={11} /> Edit Cover
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 sm:pb-5">
              <div className="flex items-end justify-between -mt-8 sm:-mt-10 mb-3 sm:mb-4">
                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white object-cover"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-semibold text-gray-900">Rahul Sharma</h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 sm:mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={11} /> Delhi, India</span>
                <span className="flex items-center gap-1"><GraduationCap size={11} /> MMU University</span>
                <span className="flex items-center gap-1"><Briefcase size={11} /> Apple Corporation</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {connections.map((src, i) => (
                        <img key={i} src={src} className="w-4 h-4 rounded-full border border-white" />
                      ))}
                    </div>
                    <span className="text-violet-600 font-medium cursor-pointer hover:underline">60 connections</span>
                  </span>|
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors">
                    <Edit3 size={11} /> <span className="hidden sm:inline">Edit Profile</span><span className="sm:hidden">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
