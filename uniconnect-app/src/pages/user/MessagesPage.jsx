import { useState, useEffect } from 'react'
import { Search, Send, Paperclip, Smile, MoreHorizontal, Phone, Video } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Spinner from '../../components/Spinner'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulate fetching conversations
    setTimeout(() => {
      setConversations([
        {
          id: 1,
          user: {
            username: 'john_doe',
            full_name: 'John Doe',
            profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          lastMessage: 'Hey! How are you doing?',
          time: '2 min ago',
          unread: 2,
          online: true
        },
        {
          id: 2,
          user: {
            username: 'sarah_smith',
            full_name: 'Sarah Smith',
            profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
          },
          lastMessage: 'Thanks for the help!',
          time: '1 hour ago',
          unread: 0,
          online: false
        },
        {
          id: 3,
          user: {
            username: 'mike_wilson',
            full_name: 'Mike Wilson',
            profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          },
          lastMessage: 'See you tomorrow!',
          time: '3 hours ago',
          unread: 0,
          online: true
        },
        {
          id: 4,
          user: {
            username: 'lisa_anderson',
            full_name: 'Lisa Anderson',
            profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
          },
          lastMessage: 'Great idea! Let\'s discuss more',
          time: '5 hours ago',
          unread: 1,
          online: false
        },
        {
          id: 5,
          user: {
            username: 'dr_emily_zhang',
            full_name: 'Dr. Emily Zhang',
            profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
          },
          lastMessage: 'The presentation went well',
          time: '1 day ago',
          unread: 0,
          online: false
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Simulate fetching messages for selected conversation
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: selectedConversation.user.username,
            content: 'Hey! How are you doing?',
            time: '2:30 PM',
            isMe: false
          },
          {
            id: 2,
            sender: 'me',
            content: 'I\'m doing great! Just working on some projects.',
            time: '2:32 PM',
            isMe: true
          },
          {
            id: 3,
            sender: selectedConversation.user.username,
            content: 'That sounds interesting! What kind of projects?',
            time: '2:33 PM',
            isMe: false
          },
          {
            id: 4,
            sender: 'me',
            content: 'Mostly web development and some AI stuff. You?',
            time: '2:35 PM',
            isMe: true
          },
          {
            id: 5,
            sender: selectedConversation.user.username,
            content: 'Nice! I\'ve been working on mobile apps lately.',
            time: '2:36 PM',
            isMe: false
          }
        ])
      }, 500)
    }
  }, [selectedConversation])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'me',
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation?.id 
            ? { ...conv, lastMessage: newMessage, time: 'Just now' }
            : conv
        )
      )
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Tabs */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Conversations</a>
        </div>
        {/* Messages Content */}
        <div className="flex-1 bg-white border border-gray-300 rounded-t-3xl w-full max-w-4xl mx-auto overflow-hidden pointer-events-auto">
          <div className="flex h-full ">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Search Bar */}
              <div className="pr-4 py-4 pl-4 border-b border-gray-200">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="relative">
                          <img
                            src={conversation.user.profile_picture_url}
                            alt={conversation.user.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                            }}
                          />
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.user.full_name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 -mt-1 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedConversation.user.profile_picture_url}
                        alt={selectedConversation.user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.user.full_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.online ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={20} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Video size={20} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isMe
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isMe ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Paperclip size={20} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Smile size={20} className="text-gray-600" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-0 px-4"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage()
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-black hover:bg-gray-800 text-white rounded-full transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Search size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
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
