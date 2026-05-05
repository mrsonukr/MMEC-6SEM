import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Spinner from '../../components/Spinner'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate fetching events with post-like structure
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Tech Meetup 2026',
          caption: '🚀 Annual technology meetup featuring latest innovations in AI, Web3, and startups. Join us for an amazing day of learning and networking! #TechMeetup #Innovation',
          date: '2026-05-15',
          time: '6:00 PM',
          location: 'University Auditorium',
          attendees: 45,
          image: 'https://images.unsplash.com/photo-1540575467063-178a50cfc7c7?w=400',
          author: {
            username: 'tech_enthusiast',
            full_name: 'Alex Johnson',
            profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          }
        },
        {
          id: 2,
          title: 'Career Fair 2026',
          caption: '🎯 Connect with top companies and explore career opportunities! Over 50+ companies participating. Don\'t miss this chance to land your dream job! #CareerFair #JobOpportunity',
          date: '2026-05-20',
          time: '10:00 AM',
          location: 'Main Campus',
          attendees: 120,
          image: 'https://images.unsplash.com/photo-1515187029135-18ee1d0e30b1?w=400',
          author: {
            username: 'career_builder',
            full_name: 'Sarah Chen',
            profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
          }
        },
        {
          id: 3,
          title: 'Web Development Workshop',
          caption: '💻 Hands-on workshop on modern web development techniques. Learn React, Node.js, and deployment strategies. Limited seats available! #WebDev #Workshop',
          date: '2026-05-25',
          time: '2:00 PM',
          location: 'Computer Lab',
          attendees: 30,
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
          author: {
            username: 'web_dev_guru',
            full_name: 'Mike Wilson',
            profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          }
        },
        {
          id: 4,
          title: 'AI Conference 2026',
          caption: '🤖 Exploring the future of artificial intelligence with industry experts. Keynotes, workshops, and networking sessions. #AI #Conference #FutureTech',
          date: '2026-06-01',
          time: '9:00 AM',
          location: 'Conference Center',
          attendees: 200,
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
          author: {
            username: 'ai_expert',
            full_name: 'Dr. Emily Zhang',
            profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
          }
        },
        {
          id: 5,
          title: 'Startup Pitch Night',
          caption: '🎤 Present your startup ideas to investors and win funding! Great opportunity for entrepreneurs. Register now! #Startup #Pitch #Investment',
          date: '2026-06-05',
          time: '7:00 PM',
          location: 'Innovation Hub',
          attendees: 80,
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
          author: {
            username: 'startup_founder',
            full_name: 'James Lee',
            profile_picture_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
          }
        },
        {
          id: 6,
          title: 'Design Thinking Workshop',
          caption: '🎨 Learn design thinking methodologies from industry experts. Perfect for designers, product managers, and innovators! #Design #Workshop #Innovation',
          date: '2026-06-10',
          time: '3:00 PM',
          location: 'Design Studio',
          attendees: 25,
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
          author: {
            username: 'design_master',
            full_name: 'Lisa Anderson',
            profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (date) => {
    const dateObj = new Date(date)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return dateObj.toLocaleDateString('en-US', options)
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        {/* Top Title */}
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <span className="text-black">Events</span>
        </div>

        {/* Plus Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50 pointer-events-auto"
        >
          <Plus size={24} />
        </button>

        {/* Events Content */}
        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          
          {/* Events Feed - Like Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : events.length > 0 ? (
              events.map(event => (
                <div key={event.id} className="bg-white">
                  {/* Author Header */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.author.profile_picture_url}
                        alt={event.author.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.author.full_name}</h3>
                        <p className="text-sm text-gray-500">@{event.author.username}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </div>
                  </div>

                  {/* Event Image */}
                  <div className="w-full rounded-lg overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full max-h-[400px] object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50cfc7c7?w=400'
                      }}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-3">
                    {/* Caption */}
                    <p className="text-gray-800 mb-3">
                      {event.caption}
                    </p>

                    {/* Event Info */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition-colors">
                      Register for Event
                    </button>
                  </div>
                  
                  {/* Separator Line */}
                  <div className="border-t border-gray-200 -mx-4"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to create an event!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Create Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                    placeholder="Describe your event"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Event location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Maximum number of attendees"
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
