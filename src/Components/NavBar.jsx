import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../Context/authStore'
import logo from '../assets/Images/logo.png'

const NavBar = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-cover rounded-full bg-white p-1"
          />

          <div className="leading-tight">

            <h1 className="text-sm md:text-lg font-bold tracking-wide">
              HERBAL HOMEOPATHIC
            </h1>

            <h2 className="text-green-400 text-xs md:text-sm tracking-[3px] font-semibold">
              CENTER
            </h2>

            <p className="text-[10px] text-gray-300 hidden md:block">
              Your Health, Our Priority
            </p>

          </div>

        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">

          <Link
            to="/"
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            to="/Packages"
            className="hover:text-green-400 transition"
          >
            Packages
          </Link>

          <Link
            to="/BookAppointment"
            className="hover:text-green-400 transition"
          >
            Book Appointment
          </Link>

          <Link
            to="/myAppointment"
            className="hover:text-green-400 transition"
          >
            My Appointment
          </Link>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {user ? (
            <div className="bg-blue-800 px-3 py-1 rounded-xl text-xs shadow">
              <p className="text-gray-300">
                Welcome
              </p>

              <p className="font-semibold truncate max-w-[120px]">
                {user.email}
              </p>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl text-sm font-semibold transition shadow">
                Login
              </button>
            </Link>
          )}

        </div>

      </div>

    </nav>
  )
}

export default NavBar