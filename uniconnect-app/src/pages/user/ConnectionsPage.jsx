import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { Link } from 'react-router-dom'
import { Search, X, Users } from 'lucide-react'
import Spinner from '../../components/Spinner'
import { connectionsAPI } from '../../utils/api'

const DEFAULT_PROFILE_IMAGE = '/images/default_profile.png'
const PAGE_LIMIT = 20

export default function ConnectionsPage() {
  const { username: routeUsername } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [connections, setConnections] = useState([])
  const [totalConnections, setTotalConnections] = useState(0)
  const [nextOffset, setNextOffset] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [disconnecting, setDisconnecting] = useState({})

  const loadConnections = async ({ reset = false, nextOffsetValue = 0 } = {}) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await connectionsAPI.getConnections({
        limit: PAGE_LIMIT,
        offset: nextOffsetValue,
        q: searchQuery,
        username: routeUsername,
      })

      if (response.success) {
        const results = response.results || []
        setConnections(prev => (reset ? results : [...prev, ...results]))
        if (!searchQuery.trim()) {
          setTotalConnections(response.total ?? results.length)
        }
        setNextOffset(response.next_offset ?? null)
        setHasMore(response.has_more ?? false)
        setError('')
      } else {
        setError(response.message || 'Failed to load connections')
      }
    } catch (err) {
      setError(err.message || 'Failed to load connections')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnections([])
      setNextOffset(null)
      setHasMore(false)
      loadConnections({ reset: true, nextOffsetValue: 0 })
    }, 350)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleClear = () => setSearchQuery('')

  const handleLoadMore = () => {
    if (nextOffset === null || loadingMore) return
    loadConnections({ nextOffsetValue: nextOffset })
  }

  const handleDisconnect = async (person) => {
    const username = person.username?.trim()
    if (!username) return

    const snapshot = connections
    const snapshotTotal = totalConnections
    setDisconnecting(prev => ({ ...prev, [username]: true }))
    setConnections(prev => prev.filter(item => item.username !== username))
    setTotalConnections(prev => Math.max(prev - 1, 0))

    try {
      const response = await connectionsAPI.disconnectUser(username)
      if (!response.success) {
        throw new Error(response.message || 'Failed to disconnect')
      }
    } catch (err) {
      setConnections(snapshot)
      setTotalConnections(snapshotTotal)
      setError(err.message || 'Failed to disconnect')
    } finally {
      setDisconnecting(prev => ({ ...prev, [username]: false }))
    }
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">
            {loading ? 'Connections' : `Connections (${totalConnections})`}
          </a>
        </div>

        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          {!error || !routeUsername || !error.toLowerCase().includes('not found') ? (
            <>
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search connections"
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
            </>
          ) : null}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : error && routeUsername && error.toLowerCase().includes('not found') ? (
            <div className="text-center py-12 text-gray-600">
              Sorry, this page isn't available.
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery.trim()
                ? `No connections found for "${searchQuery.trim()}"`
                : routeUsername
                  ? `No connections found for "${routeUsername}"`
                  : 'No connections yet.'}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {connections.map((person, index) => (
                  <div key={person.id || person.username || index}>
                    <div className="flex items-center justify-between p-3 rounded-lg">
                      <Link
                        to={person.username ? `/${person.username}` : '#'}
                        className="flex items-center gap-3 min-w-0"
                        onClick={(e) => {
                          if (!person.username) e.preventDefault()
                        }}
                      >
                        <img
                          src={person.dp || DEFAULT_PROFILE_IMAGE}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {person.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {person.username}
                          </p>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleDisconnect(person)}
                        disabled={disconnecting[person.username]}
                        className="px-4 py-1.5 bg-white text-black border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Disconnect
                      </button>
                    </div>
                    {index < connections.length - 1 && (
                      <div className="border-t border-gray-100"></div>
                    )}
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
