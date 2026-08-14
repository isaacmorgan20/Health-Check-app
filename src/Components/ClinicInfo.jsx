import React from 'react'
import { MapPin, Phone, Clock } from 'lucide-react'

const ClinicInfo = () => {
  const hours = [
    { day: "Monday - Friday", time: "8:00 AM - 5:00 PM" },
    { day: "Saturday", time: "9:00 AM - 1:00 PM" },
    { day: "Sunday", time: "Closed" },
  ]

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
            Visit Our Center
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Come see us in person or reach out — we're here to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Location */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <MapPin />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Location</h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              12 Independence Avenue, Accra, Ghana
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Phone />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Contact</h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              +233 20 123 4567
              <br />
              care@herbalhomeopathic.app
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Clock />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Opening Hours</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between border-b border-gray-100 pb-2">
                  <span>{h.day}</span>
                  <span className="font-semibold text-blue-800">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClinicInfo