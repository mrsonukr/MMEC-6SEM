import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthPage from './pages/AuthPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/user/HomePage'
import Groups from './pages/Groups'
import Inbox from './pages/Inbox'
import Events from './pages/Events'
import Jobs from './pages/Jobs'
import Notification from './pages/Notification'
import Profile from './pages/user/Profile'
import Feed from './pages/user/Feed'

const noHeaderRoutes = ['/login-new', '/login', '/forgot-password', '/reset-password', '/home']

function Layout() {
  const location = useLocation()
  const showHeader = !noHeaderRoutes.includes(location.pathname)
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/groups" element={<Groups />}/>
        <Route path="/inbox" element={<Inbox/>}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/jobs" element={<Jobs/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/feed" element={<Feed/>}/>
      </Routes>
    </>
  )
}

export default function Routing() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
