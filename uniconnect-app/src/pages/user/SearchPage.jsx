import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { Search, X, Loader2 } from 'lucide-react'
import { usersAPI, connectionsAPI } from '../../utils/api'

const DEFAULT_PROFILE_IMAGE = '/images/default_profile.png'

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await usersAPI.getSuggestions()

      if (response.success) {
        setResults(response.results || [])
      } else {
        setResults([])
        setError(response.message || 'Failed to load suggestions')
      }
    } catch (err) {
      setResults([])
      setError(err.message || 'Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }, [])

  const hasLoadedSuggestions = useRef(false)

  useEffect(() => {
    const query = searchQuery.trim()

    if (!query && !hasLoadedSuggestions.current) {
      hasLoadedSuggestions.current = true
      loadSuggestions()
      return
    }

    if (!query) {
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await usersAPI.searchUsers(query)

        if (cancelled) return

        if (response.success) {
          setResults(response.results || [])
        } else {
          setResults([])
          setError(response.message || 'Search failed')
        }
      } catch (err) {
        if (cancelled) return
        setResults([])
        setError(err.message || 'Search failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery, loadSuggestions])

  const handleClear = () => {
    setSearchQuery('')
    loadSuggestions()
  }

  const handleConnectToggle = async (user) => {
    const username = user.username?.trim()
    if (!username) return

    const currentIsConnected = user.isConnected === true
    const nextIsConnected = !currentIsConnected

    // Optimistic UI update so the change feels instant.
    setResults(prev =>
      prev.map(item =>
        item.username === username
          ? { ...item, isConnected: nextIsConnected }
          : item
      )
    )

    try {
      const response = currentIsConnected
        ? await connectionsAPI.disconnectUser(username)
        : await connectionsAPI.connectUser(username)

      if (!response.success) {
        throw new Error(response.message || 'Action failed')
      }
    } catch (err) {
      // Roll back optimistic update on failure.
      setResults(prev =>
        prev.map(item =>
          item.username === username
            ? { ...item, isConnected: currentIsConnected }
            : item
        )
      )
      setError(err.message || 'Connection update failed')
    }
  }

  const handleProfileClick = (username) => {
    if (username) {
      navigate(`/${username}`)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Search</a>
        </div>

        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people"
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

          {loading && searchQuery.trim() ? (
            <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery.trim() ? `No people found for "${searchQuery.trim()}"` : 'Search for people to connect with.'}
            </div>
          ) : (
            <>
              {!searchQuery.trim() && (
                <div className="text-sm text-gray-500 mb-3">Suggested for you</div>
              )}
              <div className="space-y-3">
                {results.map((user, index) => (
                  <div key={`${user.username}-${index}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg">
                      <div
                        className="flex items-center gap-3 min-w-0 cursor-pointer p-1 rounded-lg"
                        onClick={() => handleProfileClick(user.username)}
                      >
                        <img
                          src={user.dp || DEFAULT_PROFILE_IMAGE}
                          alt={user.name || user.username}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {user.name || user.username}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {user.username}
                          </p>
                        </div>
                      </div>
                      {user.show_btn !== false ? (
                        !user.isConnected ? (
                          <button
                            onClick={() => handleConnectToggle(user)}
                            className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Connect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnectToggle(user)}
                            className="px-4 py-1.5 bg-white text-black border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Disconnect
                          </button>
                        )
                      ) : null}
                    </div>
                    {index < results.length - 1 && (
                      <div className="border-t border-gray-100"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
