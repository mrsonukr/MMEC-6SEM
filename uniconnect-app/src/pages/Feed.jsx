// Redirect to /feed
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function FeedRedirect() {
  const navigate = useNavigate()
  useEffect(() => navigate('/feed', { replace: true }), [])
  return null
}
