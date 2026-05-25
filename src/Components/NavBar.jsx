import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../Context/authStore";
import logo from "../assets/Images/logo.png";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">

          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-cover rounded-full bg-white p-1"
          />

          <div className="leading-tight">

            <h1 className="text-sm md:text-base font-bold tracking-wide">
              HERBAL HOMEOPATHIC
            </h1>

            <h2 className="text-green-400 text-[10px] md:text-xs tracking-[2px] font-semibold">
              CENTER
            </h2>

          </div>

        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">

          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>

          <Link to="/Packages" className="hover:text-green-400 transition">
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
            <div className="bg-blue-800 px-3 py-1 rounded-lg text-xs">
              <p className="text-gray-300">Welcome</p>

              <p className="font-semibold truncate max-w-[100px]">
                {user.email}
              </p>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition">
                Login
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-950 border-t border-blue-800 px-4 py-4 flex flex-col gap-4 text-sm">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            to="/Packages"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-400 transition"
          >
            Packages
          </Link>

          <Link
            to="/BookAppointment"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-400 transition"
          >
            Book Appointment
          </Link>

          <Link
            to="/myAppointment"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-400 transition"
          >
            My Appointment
          </Link>

        </div>
      )}

    </nav>
  );
};

export default NavBar;