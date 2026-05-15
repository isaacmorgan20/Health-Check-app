import React, { useEffect } from 'react'
import useUserStore from '../Context/UserStore'

const MyAppoint = () => {
  const users = useUserStore((state) => state.users)
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          My Appointments
        </h1>

        <p className="text-gray-600 mt-3">
          View your scheduled health checkups and appointment details.
        </p>
      </div>

      {/* Container */}
      <div className="mt-10 max-w-4xl mx-auto">

        {users.length === 0 ? (
          <div className="text-center bg-white shadow-md rounded-2xl p-10 border border-gray-100">
            <p className="text-gray-500 text-lg">
              No appointments booked yet.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Book a health checkup to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">

            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md hover:shadow-xl transition rounded-2xl border border-gray-100 p-6 border-l-4 border-blue-800"
              >

                {/* Top row */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-blue-900">
                    {user.name}
                  </h2>

                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Appointment
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">

                  <p><span className="font-semibold text-gray-800">Contact:</span> {user.contact}</p>

                  <p><span className="font-semibold text-gray-800">Email:</span> {user.email}</p>

                  <p><span className="font-semibold text-gray-800">Time:</span> {user.time}</p>

                  <p><span className="font-semibold text-gray-800">Date:</span> {user.date || "Not set"}</p>

                </div>

                {/* Notes */}
                {user.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Notes:</span> {user.notes}
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  )
}

export default MyAppoint