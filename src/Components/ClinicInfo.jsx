import React, { useEffect } from 'react'
import { MapPin, Phone, Clock } from 'lucide-react'
import useClinicStore from '../Context/clinicStore'

const ClinicInfo = () => {
  const settings = useClinicStore((state) => state.settings)
  const listenToSettings = useClinicStore((state) => state.listenToSettings)

  useEffect(() => {
    const unsubscribe = listenToSettings()
    return () => unsubscribe && unsubscribe()
  }, [listenToSettings])

  const hours = settings.hours || []
  const contactLines = [settings.phone, settings.email].filter(Boolean)

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
              {settings.location || "—"}
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Phone />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Contact</h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {contactLines.length ? (
                contactLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < contactLines.length - 1 && <br />}
                  </span>
                ))
              ) : (
                "—"
              )}
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Clock />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Opening Hours</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              {hours.length ? (
                hours.map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                    <span>{h.day}</span>
                    <span className="font-semibold text-blue-800">{h.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Hours not set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClinicInfo