import React from 'react'
import { Link } from 'react-router-dom'

const HeroPage = () => {
  return (
    <section className="relative h-[90vh] w-full bg-[url('/src/assets/Images/checkup.jpg')] bg-cover bg-center">

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-black/60 to-black/40"></div>

      {/* Content container */}
      <div className="relative z-10 flex items-center h-full">

        <div className="max-w-6xl mx-auto px-6 w-full">

          <div className="text-white max-w-2xl">

            {/* Badge */}
            <span className="bg-blue-600/30 border border-blue-300/30 text-sm px-4 py-1 rounded-full">
              Trusted Healthcare Platform
            </span>

            {/* Title */}
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              Book Your Health Checkup Easily
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-gray-200 text-lg">
              Schedule medical checkups quickly and choose from different health packages designed for your wellbeing.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">

              <Link to="/BookAppointment">
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
                  Book Appointment
                </button>
              </Link>

              <Link to="/Packages">
                <button className="border border-white/40 hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold transition">
                  View Packages
                </button>
              </Link>

            </div>

            {/* Small stats */}
            <div className="mt-10 flex gap-6 text-sm text-gray-300">

              <div>
                <p className="text-white text-xl font-bold">500+</p>
                <p>Patients Served</p>
              </div>

              <div>
                <p className="text-white text-xl font-bold">20+</p>
                <p>Health Packages</p>
              </div>

              <div>
                <p className="text-white text-xl font-bold">24/7</p>
                <p>Support</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default HeroPage