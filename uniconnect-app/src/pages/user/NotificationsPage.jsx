import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Users, Calendar, UserPlus, Share2, Bell } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Spinner from '../../components/Spinner'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'like',
          user: {
            username: 'john_doe',
            full_name: 'John Doe',
            profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          action: 'liked your post',
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          type: 'comment',
          user: {
            username: 'sarah_smith',
            full_name: 'Sarah Smith',
            profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
          },
          action: 'commented: "Great post! Thanks for sharing"',
          time: '4 hours ago',
          read: false
        },
        {
          id: 3,
          type: 'follow',
          user: {
            username: 'mike_wilson',
            full_name: 'Mike Wilson',
            profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          },
          action: 'started following you',
          time: '6 hours ago',
          read: true
        },
        {
          id: 4,
          type: 'event',
          user: {
            username: 'tech_enthusiast',
            full_name: 'Alex Johnson',
            profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          action: 'created a new event: Tech Meetup 2026',
          time: '1 day ago',
          read: true
        },
        {
          id: 5,
          type: 'share',
          user: {
            username: 'lisa_anderson',
            full_name: 'Lisa Anderson',
            profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
          },
          action: 'shared your post',
          time: '2 days ago',
          read: true
        },
        {
          id: 6,
          type: 'connection',
          user: {
            username: 'dr_emily_zhang',
            full_name: 'Dr. Emily Zhang',
            profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
          },
          action: 'accepted your connection request',
          time: '3 days ago',
          read: true
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-red-500" />
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />
      case 'follow': return <UserPlus size={16} className="text-green-500" />
      case 'event': return <Calendar size={16} className="text-purple-500" />
      case 'share': return <Share2 size={16} className="text-orange-500" />
      case 'connection': return <Users size={16} className="text-indigo-500" />
      default: return <Bell size={16} className="text-gray-500" />
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Title */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <span className="text-black">Notifications</span>
        </div>

        {/* Notifications Content */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          
          {/* Notifications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`bg-white cursor-pointer transition-colors ${
                    !notification.read ? '' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {/* Thread-style notification card */}
                  <div className="flex items-start gap-3 p-3">
                    {/* User Avatar */}
                    <img
                      src={notification.user.profile_picture_url}
                      alt={notification.user.full_name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                      }}
                    />

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {notification.user.full_name}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>

                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  {/* Separator Line */}
                  <div className="border-t border-gray-200 -mx-4"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
