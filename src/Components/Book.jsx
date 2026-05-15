import React, { useState } from 'react'
import useUserStore from '../Context/UserStore'

const Book = () => {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

  const addNewUser = useUserStore((state) => state.addNewUser)

  const handleSubmit = (e) => {
    e.preventDefault()

    const newUser = {
      name,
      contact,
      email,
      date,
      time,
      notes,
    }

    addNewUser(newUser)

    setName("")
    setContact("")
    setEmail("")
    setDate("")
    setTime("")
    setNotes("")
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          Book Appointment
        </h1>

        <p className="text-gray-600 mt-3">
          Fill in your details to schedule your health checkup.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-10 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

        {/* Icon */}
        <div className="text-blue-600 text-4xl mb-4">
          <i className="fas fa-calendar-check"></i>
        </div>

        {/* Selected Package */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="font-semibold text-blue-900">
            Selected Package:
          </h2>
          <p className="text-gray-600 text-sm">
            Please select a package from the Packages page
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              placeholder="Any information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
          >
            Book Appointment
          </button>

        </form>

      </div>
    </section>
  )
}

export default Book