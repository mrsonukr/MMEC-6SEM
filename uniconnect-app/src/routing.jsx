import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthPage from './pages/AuthPage'
import LoginPage from './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/user/HomePage'
import Profile from './pages/user/Profile'
import SearchPage from './pages/user/SearchPage'

// Routes that should not be accessible directly without proper context
const protectedRoutes = {
  '/auth': {
    allowed: () => {
      // Allow only if coming from OAuth with proper parameters
      const params = new URLSearchParams(window.location.search)
      return params.has('success') || params.has('error')
    },
    fallback: '/login'
  },
  '/forgot-password': {
    allowed: () => {
      // Allow direct access for password reset requests
      return true
    },
    fallback: '/login'
  },
  '/reset-password': {
    allowed: () => {
      // Allow only if coming from email with token
      const params = new URLSearchParams(window.location.search)
      return params.has('token')
    },
    fallback: '/login'
  }
}

// Routes that should redirect logged-in users to /
const authRoutes = ['/login', '/login-new']

// Routes that require authentication (user directory pages)
const protectedAuthRoutes = ['/', '/profile', '/search', '/home']

// Check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('authToken')
  // Only check for token presence, user data is optional for auth
  return !!token
}

// Route Protection Component
const ProtectedRoute = ({ children, path }) => {
  const protection = protectedRoutes[path]
  
  // Check for protected routes (auth, reset-password, etc.)
  if (protection && !protection.allowed()) {
    return <Navigate to={protection.fallback} replace />
  }
  
  // Check for auth routes - redirect logged-in users to /
  if (authRoutes.includes(path) && isUserLoggedIn()) {
    return <Navigate to="/" replace />
  }
  
  // Check for protected auth routes - require login
  if (protectedAuthRoutes.includes(path) && !isUserLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const noHeaderRoutes = ['/login-new', '/login', '/forgot-password', '/reset-password', '/', '/home', '/profile', '/search', '/welcome', '/auth']

function Layout() {
  const location = useLocation()
  const showHeader = !noHeaderRoutes.includes(location.pathname)
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/admin" element={<Home />} />
        <Route path="/login" element={
          <ProtectedRoute path="/login">
            <LoginPage />
          </ProtectedRoute>
        } />
        <Route path="/auth" element={
          <ProtectedRoute path="/auth">
            <AuthPage />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute path="/forgot-password">
            <ForgotPassword />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute path="/reset-password">
            <ResetPassword />
          </ProtectedRoute>
        } />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/" element={
          <ProtectedRoute path="/">
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/profile" element={
          <ProtectedRoute path="/profile">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute path="/search">
            <SearchPage />
          </ProtectedRoute>
        } />
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
