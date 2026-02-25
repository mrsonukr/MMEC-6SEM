import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthPage from './pages/AuthPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/user/HomePage'

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
