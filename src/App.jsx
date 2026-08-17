// =============== PREVIOUS CODE BUT WORKS =================

// import React, { useEffect, useState } from 'react'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import BookAppointment from './Pages/BookAppointment'
// import Packages from './Pages/Packages'
// import PackageDetails from './Pages/PackageDetails'
// import MyAppointment from './Pages/MyAppointment'
// import Login from './Pages/Login'
// import useAuthStore from './Context/authStore'
// import Register from './Pages/Register'
// import Home from './Pages/Home'

// const App = () => {
//   const user = useAuthStore((state) => state.user)
//   const profile = useAuthStore((state) => state.profile)
//   const loading = useAuthStore((state) => state.loading)
//   const ListenToAuth = useAuthStore((state) => state.ListenToAuth)
//   const Logout = useAuthStore((state) => state.Logout)

//   const [showLogin, setShowLogin] = useState(true)

//   useEffect(() => {
//     ListenToAuth();
//   }, [ListenToAuth])

//   if (loading) return <p>Loading....</p>


//   return (
//     <section>

//       {!user ? (
//         <>
//           {showLogin ? <Login /> : <Register />}

//           <p>
//             {showLogin ? "No account?" : "Already have an account?"}{" "}
//             <button onClick={() => setShowLogin(!showLogin)}>
//               {showLogin ? "Register" : "Login"}
//             </button>
//           </p>
//         </>
//       ) : (
//         <>
//           <p>
//             Logged in as: <strong>{profile?.name} || {user?.email}</strong>
//           </p>

//           <button onClick={Logout}>Logout</button>

//           <BrowserRouter>
//             <Routes>
//               <Route path='/' element={<Home />} />
//               <Route path='/BookAppointment' element={<BookAppointment />} />
//               <Route path='/PackageDetails' element={<PackageDetails />} />
//               <Route path='/Packages' element={<Packages />} />
//               <Route path='/PackageDetails' element={<PackageDetails />} />
//               <Route path='/MyAppointment' element={<MyAppointment />} />
//             </Routes>
//           </BrowserRouter>



//         </>
//       )}
//     </section>
//   )
// }

// export default App



// ============= CURRENT CODE ===============

import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BookAppointment from './Pages/BookAppointment'
import Packages from './Pages/Packages'
import PackageDetails from './Pages/PackageDetails'
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
  }, [])

  if (loading)  return <p className='text-center mt-70 font-bold text-2xl'>Loading...</p>

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
{user && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/BookAppointment" element={<BookAppointment />} />
            <Route path="/Packages" element={<Packages />} />
            <Route path="/PackageDetails" element={<PackageDetails />} />
            <Route path="/MyAppointment" element={<MyAppointment />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            {admin && <Route path="/admin" element={<Admin />} />}
          </>
        )}
        {user && (
          <div className="flex items-center gap-2">
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
        {!user && <Route path="*" element={<Navigate to="/login" />} />}
        {user && <Route path="*" element={<Navigate to="/" />} />}

      </Routes>
      {user && <Chatbot />}
    </BrowserRouter>
  )
}

export default App