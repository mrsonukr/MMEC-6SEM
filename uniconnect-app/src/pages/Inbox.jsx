import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Search, Send, MoreHorizontal, Phone, Video, Smile, Paperclip } from 'lucide-react'

const conversations = [
  { id: 1, name: 'Rahul Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', lastMsg: 'Hey! Are you joining the hackathon?', time: '2m', unread: 2, online: true },
  { id: 2, name: 'Priya Verma', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', lastMsg: 'Can you review my React project?', time: '10m', unread: 1, online: true },
  { id: 3, name: 'Startup Team', avatar: 'https://randomuser.me/api/portraits/men/20.jpg', lastMsg: 'We have a meeting at 7 PM.', time: '1h', unread: 0, online: false },
  { id: 4, name: 'Ankit Kumar', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', lastMsg: 'Thanks for the feedback!', time: '3h', unread: 0, online: false },
  { id: 5, name: 'Design Team', avatar: 'https://randomuser.me/api/portraits/women/21.jpg', lastMsg: 'New Figma file shared.', time: 'Yesterday', unread: 0, online: true },
]

const mockMessages = [
  { id: 1, from: 'them', text: 'Hey! Are you joining the hackathon this year?', time: '2:30 PM' },
  { id: 2, from: 'me', text: 'Yes absolutely! I\'m building something with React and Node. You?', time: '2:31 PM' },
  { id: 3, from: 'them', text: 'Same here! Would you want to team up? I\'m strong on the backend side.', time: '2:32 PM' },
  { id: 4, from: 'me', text: 'That sounds great actually. Let\'s set up a quick call this week?', time: '2:33 PM' },
  { id: 5, from: 'them', text: 'Perfect! I\'ll send you a calendar invite. So excited about this!', time: '2:34 PM' },
]

export default function Inbox() {
  const [activeConv, setActiveConv] = useState(conversations[0])
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: message, time: 'Now' }])
    setMessage('')
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] page-enter">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex overflow-hidden" style={{ height: '100vh' }}>

        {/* Conversations list */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-[#111]/[0.07] bg-[#111111]">
          <div className="p-5 border-b border-[#111]/[0.07]">
            <h2 className="font-display text-xl font-semibold text-[#F9FAFB] mb-4">Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#111]/[0.12] bg-[#0A0A0A] text-xs text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filtered.map((conv, i) => (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-b border-[#111]/[0.07]
                  ${activeConv.id === conv.id ? 'bg-violet-950/40' : 'hover:bg-violet-950/40'}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-800/50 ring-offset-1" />
                  {conv.online && (
                    <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[color:var(--ivory)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-[#F9FAFB] truncate">{conv.name}</p>
                    <span className="text-[10px] text-[#6B7280] ml-2 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] truncate">{conv.lastMsg}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full btn-gold flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A]">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#111111] border-b border-[#111]/[0.07]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeConv.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-800/50" />
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[color:var(--ivory)]" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F9FAFB]">{activeConv.name}</p>
                <p className="text-xs text-[#6B7280]">{activeConv.online ? 'Online now' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="p-2 rounded-xl text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 transition-all">
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                {msg.from === 'them' && (
                  <img src={activeConv.avatar} className="w-7 h-7 rounded-full mr-2.5 mt-1 flex-shrink-0 object-cover" />
                )}
                <div className={`max-w-xs lg:max-w-md`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${msg.from === 'me'
                      ? 'btn-gold text-white rounded-br-sm'
                      : 'bg-[#111111] text-[#F9FAFB] border border-[#111]/[0.07] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-[#6B7280] mt-1 ${msg.from === 'me' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-[#111111] border-t border-[#111]/[0.07]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[Paperclip, Smile].map((Icon, i) => (
                  <button key={i} className="p-2 rounded-lg text-[#6B7280] hover:text-violet-400 hover:bg-violet-950/40 transition-all">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Write a message…"
                className="flex-1 bg-[#0A0A0A] border border-[#111]/[0.12] rounded-full px-5 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all placeholder:text-[#6B7280]"
              />
              <button
                onClick={sendMessage}
                className="btn-gold p-2.5 rounded-full flex-shrink-0"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
