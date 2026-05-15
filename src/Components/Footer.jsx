import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-950 to-blue-900 text-white pt-16 pb-8">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-4">

        {/* About */}
        <div>
          <h1 className="text-xl font-bold mb-4">About the Platform</h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our platform allows users to easily book health checkup appointments and choose from different medical packages for better health monitoring.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h1 className="text-xl font-bold mb-4">Quick Links</h1>

          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link className="hover:text-white transition" to="/">Home</Link></li>
            <li><Link className="hover:text-white transition" to="/packages">Health Packages</Link></li>
            <li><Link className="hover:text-white transition" to="/bookappointment">Book Appointment</Link></li>
            <li><Link className="hover:text-white transition" to="/myappointment">My Appointments</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h1 className="text-xl font-bold mb-4">Contact Info</h1>

          <div className="text-gray-300 text-sm space-y-2">
            <p><span className="font-semibold text-white">Phone:</span> +233 55 124 55 47</p>
            <p><span className="font-semibold text-white">Email:</span> morganisaackojo5547@gmail.com</p>
            <p><span className="font-semibold text-white">Location:</span> Accra, Ghana</p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h1 className="text-xl font-bold mb-4">Follow Us</h1>

          <div className="flex flex-col space-y-2 text-gray-300 text-sm">
            <a className="hover:text-white transition" href="#">Facebook</a>
            <a className="hover:text-white transition" href="#">Instagram</a>
            <a className="hover:text-white transition" href="#">Twitter</a>
            <a className="hover:text-white transition" href="#">LinkedIn</a>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-blue-800 mt-12 pt-6 text-center text-gray-400 text-sm">
        © 2026 Health Checkup System. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer