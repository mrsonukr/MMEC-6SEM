import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveRight, ArrowLeft, LogOut } from 'lucide-react'
import Button from '../components/ui/Button'
import { usernameAPI } from '../utils/api'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)

  // CSS for hiding scrollbar
  const scrollbarHideStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }

  // Load username suggestions from backend on component mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoadingSuggestions(true)
        const response = await usernameAPI.getUsernameSuggestions()
        if (response.success) {
          setSuggestions(response.suggestions || [])
        }
      } catch (error) {
        console.error('Failed to load suggestions:', error)
        // Fallback to local suggestions if API fails
      } finally {
        setLoadingSuggestions(false)
      }
    }

    loadSuggestions()
  }, [])

  // Generate username suggestions based on current input (fallback)
  const generateLocalSuggestions = (input) => {
    if (!input || input.length > 15) return [] // Hide suggestions if text is too long
    
    const base = input.toLowerCase().replace(/[^a-z0-9]/g, '')
    const localSuggestions = [
      base,
      base + '123',
      base + '_official',
      base + '_' + Math.floor(Math.random() * 1000),
      'the_' + base,
      base + 'dev',
      base + 'tech',
      base + 'pro'
    ]
    
    return localSuggestions.filter((suggestion, index, self) => 
      self.indexOf(suggestion) === index && suggestion !== base
    ).slice(0, 8) // 8 suggestions for horizontal scroll
  }

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameError('')
      return
    }

    try {
      setCheckingUsername(true)
      const response = await usernameAPI.checkUsernameAvailability(username)
      if (response.success && !response.available) {
        setUsernameError('Username is already taken')
      } else {
        setUsernameError('')
      }
    } catch (error) {
      console.error('Failed to check username availability:', error)
      setUsernameError('')
    } finally {
      setCheckingUsername(false)
    }
  }

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required')
      return
    }
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return
    }
    if (username.length > 20) {
      setUsernameError('Username must be less than 20 characters')
      return
    }

    setIsSubmitting(true)
    setUsernameError('')

    try {
      const response = await usernameAPI.setUsername(username)
      if (response.success) {
        // Store username in localStorage
        localStorage.setItem('username', username)
        // Navigate to home page
        navigate('/')
      } else {
        setUsernameError(response.message || 'Failed to set username')
      }
    } catch (error) {
      setUsernameError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion)
  }

  const handleContinue = async () => {
    if (!username.trim()) return
    
    setIsSubmitting(true)
    setUsernameError('')
    
    try {
      // Call backend API to set username
      const response = await usernameAPI.setUsername(username.trim())
      
      if (response.success) {
        // Store username and redirect to home
        localStorage.setItem('selectedUser', username.trim())
        navigate('/')
      } else {
        setUsernameError(response.message || 'Failed to set username')
      }
    } catch (error) {
      console.error('Failed to set username:', error)
      setUsernameError(error.message || 'Failed to set username. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username.trim()) {
      handleContinue()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-white hidden md:block">
        <img src="/loginpage.jpg" alt="welcome" className="w-full p-5 h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-start md:items-center justify-center bg-white px-8 pt-16 md:pt-0">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-16 object-contain"
            />
          </div>

          {/* HEADING */}
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create Your Username
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Choose a unique username to get started with UniConnect
          </p>

          {/* USERNAME INPUT */}
          <div className="mb-8">
            <div className="relative">
              <span className="absolute left-1 top-3 text-black text-base font-medium pointer-events-none">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className={`w-full pl-6 pr-4 py-3 border-b ${usernameError ? 'border-red-500' : 'border-gray-300'} bg-transparent text-gray-800 focus:outline-none peer`}
                disabled={isSubmitting}
              />
              {/* Animated line */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black transform scale-x-0 origin-center transition-transform duration-300 peer-focus:scale-x-100"></span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Choose a unique username for your profile
            </p>

            {/* Username Error Message */}
            {usernameError && (
              <p className="text-xs text-red-500 mt-2">
                {usernameError}
              </p>
            )}

            {/* USERNAME SUGGESTIONS */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">
                {loadingSuggestions ? '' : 'Suggestions:'}
              </p>
              <div className="flex gap-2 overflow-x-auto max-h-8" style={scrollbarHideStyle}>
                {(username ? generateLocalSuggestions(username) : suggestions).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    @{suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTINUE BUTTON */}
          <Button
            fullWidth
            icon={<MoveRight size={18} />}
            onClick={handleContinue}
            disabled={!username.trim() || isSubmitting || usernameError || checkingUsername}
          >
            {isSubmitting ? 'Continuing...' : 'Continue'}
          </Button>

          {/* LOGOUT BUTTON */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-500 hover:text-red-600 transition flex items-center gap-2 mx-auto"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
