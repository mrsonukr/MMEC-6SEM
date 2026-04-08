import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { Search, X } from 'lucide-react'

// Mock search results
const mockUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    username: '@sarahw',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 3,
    name: 'Mike Chen',
    username: '@mikec',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
  },
  {
    id: 4,
    name: 'Emma Davis',
    username: '@emmad',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  {
    id: 5,
    name: 'James Wilson',
    username: '@jamesw',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
  }
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowResults(query.length > 0)
  }

  const handleClear = () => {
    setSearchQuery('')
    setShowResults(false)
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Tabs */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Search</a>
        </div>

        {/* Search Container */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          
          {/* Search Header */}
          <div className="mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search"
                className="w-full pl-12 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="space-y-3">
              {mockUsers.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between p-3 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.username}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                      Connect
                    </button>
                  </div>
                  {index < mockUsers.length - 1 && (
                    <div className="border-t border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
