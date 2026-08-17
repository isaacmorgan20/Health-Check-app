import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BookAppointment from './Pages/BookAppointment'
import Packages from "./Pages/Packages"
import PackageDetails from "./Pages/PackageDetails"
import MyAppointment from './Pages/MyAppointment'
import Settings from './Pages/Settings'
import Messages from './Pages/Messages'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import Chatbot from './Components/Chatbot'
import Admin from './Components/Admin'
import Profile from './Components/Profile'
import useAuthStore from './Context/authStore'
import isAdmin from './Utils/admin'
import { useState } from 'react'

const App = () => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const ListenToAuth = useAuthStore((state) => state.ListenToAuth)
  const admin = isAdmin(user?.email)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const unsubscribe = ListenToAuth()
    return () => unsubscribe && unsubscribe()
  }, [ListenToAuth])

  if (loading)  return <p className='text-center mt-70 font-bold text-2xl'>Loading...</p>

  return (
    <BrowserRouter>
      {/* Language selector - outside Routes but inside BrowserRouter */}
      {user && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <span className="text-sm text-gray-400">Language: </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="tw">Twi</option>
            <option value="gh">Ga</option>
          </select>
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/BookAppointment" element={user ? <BookAppointment /> : <Navigate to="/login" replace />} />
        <Route path="/Packages" element={user ? <Packages /> : <Navigate to="/login" replace />} />
        <Route path="/PackageDetails" element={user ? <PackageDetails /> : <Navigate to="/login" replace />} />
        <Route path="/MyAppointment" element={user ? <MyAppointment /> : <Navigate to="/login" replace />} />
        <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={user && admin ? <Admin /> : <Navigate to="/" replace />} />

        {/* Redirect logic */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />

      </Routes>
      {user && <Chatbot />}
    </BrowserRouter>
  )
}

export default App