import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import PostInput from '../../components/PostInput'
import PostCard from '../../components/PostCard'
import DropdownMenu from '../../components/DropdownMenu'
import { MapPin, Briefcase, GraduationCap, Plus, Edit3, ExternalLink, Award, Users, MoreHorizontal } from 'lucide-react'

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
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownItems = [
    {
      label: 'Upload cover',
      icon: <Plus size={18} />,
      onClick: () => console.log('Upload cover')
    },
    {
      label: 'View cover',
      icon: <ExternalLink size={18} />,
      onClick: () => console.log('View cover')
    },
    {
      label: 'Remove cover',
      icon: '🗑️',
      onClick: () => console.log('Remove cover'),
      danger: true
    }
  ]

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Tabs */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Profile</a>
        </div>

        {/* Feed Container */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          
          {/* Profile Header */}
          <div className="mb-6">
            {/* Cover + Avatar */}
            <div className="overflow-hidden mb-4 -mx-4 -mt-4 relative">
              <div className="h-40 relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.4) 30px, rgba(255,255,255,0.4) 31px)` }}
                />
                <div className="absolute top-3 right-3">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <MoreHorizontal className="w-5 h-5 text-white group-hover:text-black" />
                  </button>
                </div>
              </div>
              
              <DropdownMenu 
                isOpen={showDropdown} 
                onClose={() => setShowDropdown(false)}
                items={dropdownItems}
              />

              <div className="px-4 pb-5">
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="relative">
                    <img
                      src="https://randomuser.me/api/portraits/men/75.jpg"
                      className="w-20 h-20 rounded-full ring-4 ring-white object-cover"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900">Rahul Sharma</h1>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <p>@rahulsharma</p>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {connections.map((src, i) => (
                        <img key={i} src={src} className="w-4 h-4 rounded-full border border-white" />
                      ))}
                    </div>
                    <span className="text-black font-medium cursor-pointer hover:underline">60 connections</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> Delhi, India</span>
                  <span className="flex items-center gap-1"><GraduationCap size={11} /> MMU University</span>
                  <span className="flex items-center gap-1"><Briefcase size={11} /> Apple Corporation</span>
                </div>
                
                <button className="w-full bg-white hover:bg-gray-50 text-black text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 border border-gray-300">
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Post Input */}
          <PostInput />

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard key={index} post={{
                id: index + 1,
                author: "Rahul Sharma",
                time: post.time,
                content: post.text,
                profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
                likes: Math.floor(Math.random() * 50) + 5,
                comments: Math.floor(Math.random() * 20) + 1,
                shares: Math.floor(Math.random() * 10) + 1
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
