import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { LogOut, User, Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (loading) return
    
    try {
      setLoading(true)
      
      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      // Navigate to login
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if there's an error
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: 'Update your profile information',
          action: () => navigate('/profile')
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your privacy settings',
          action: () => console.log('Privacy settings')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Configure notification preferences',
          action: () => console.log('Notification settings')
        },
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help and contact support',
          action: () => console.log('Help & support')
        }
      ]
    }
  ]

  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col absolute inset-0 pointer-events-none">
        <div className="flex gap-8 font-medium text-lg p-4 justify-center text-[#a9aba6] pointer-events-auto">
          <a href="#" className="text-black">Settings</a>
        </div>

        <div className="flex-1 p-4 bg-white border border-gray-300 rounded-t-3xl w-full max-w-2xl mx-auto overflow-y-auto pointer-events-auto no-scrollbar">
          <div className="space-y-6">
            {/* Logout Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Logout</h3>
                    <p className="text-sm text-gray-500">Sign out of your account</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            </div>

            {/* Other Settings Sections */}
            {settingsSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-1">
                  {section.title}
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* App Version */}
            <div className="text-center py-6 text-sm text-gray-500 border-t border-gray-200">
              <p>UniConnect Version 1.0.0</p>
              <p className="text-xs mt-1">© 2026 UniConnect. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
