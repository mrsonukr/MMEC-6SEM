import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usernameAPI } from '../utils/api'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Clear old session data and set fresh session
  const clearOldSessionAndSetNew = (sessionToken) => {
    // Clear old session data
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedUser')
    
    // Set fresh session token
    localStorage.setItem('authToken', sessionToken)
  }

  // Check username status and handle redirect
  const checkUsernameStatusAndRedirect = async (sessionToken) => {
    try {
      setLoading(true)
      // Clear old session and set fresh token
      clearOldSessionAndSetNew(sessionToken)
      
      // Check username status from backend
      const response = await usernameAPI.checkUsernameStatus()
      
      if (response.success) {
        if (response.username) {
          // User has username, redirect to home
          navigate('/')
        }
        // If no username, stay on this page to show success message
      } else {
        throw new Error(response.message || 'Failed to check username status')
      }
    } catch (error) {
      console.error('Error checking username status:', error)
      // On error, redirect to welcome page
      navigate('/welcome')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const success = searchParams.get('success')
    const err = searchParams.get('error')
    const accessToken = searchParams.get('access_token')
    const sessionId = searchParams.get('session_id')
    const usernameParam = searchParams.get('username')

    if (success === 'true') {
      const token = sessionId || accessToken
      
      if (token) {
        // Clear old session data before setting new one
        clearOldSessionAndSetNew(token)
        
        // Check username parameter from backend
        if (usernameParam === 'false') {
          // Backend says no username, go to welcome page
          navigate('/welcome')
        } else {
          // Backend says username exists, check username status and go to dashboard
          checkUsernameStatusAndRedirect(token)
        }
      }
    }

    if (err) {
      // On error, redirect to login page
      navigate('/login')
    }
  }, [])

  // Show only loading state on white background
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Show blank white page while processing
  return (
    <div className="min-h-screen bg-white">
      {/* Empty white page */}
    </div>
  )
}
