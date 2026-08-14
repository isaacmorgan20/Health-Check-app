import React, { useEffect, useState } from 'react'
import useUserStore from '../Context/UserStore'
import useAuthStore from '../Context/authStore'

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

const MyAppoint = () => {
  const users = useUserStore((state) => state.users)
  const listenToUserAppointments = useUserStore((state) => state.listenToUserAppointments)
  const updateUser = useUserStore((state) => state.updateUser)
  const deleteUser = useUserStore((state) => state.deleteUser)
  const currentUser = useAuthStore((state) => state.user)

  const [reply, setReply] = useState({})

  useEffect(() => {
    const unsubscribe = listenToUserAppointments(currentUser?.uid)
    return () => unsubscribe && unsubscribe()
  }, [listenToUserAppointments, currentUser])

  const payNow = (user) => {
    if (!PAYSTACK_PUBLIC_KEY || !window.PaystackPop) {
      alert("Online payment is not configured yet. Please pay at the clinic.")
      return
    }
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email || currentUser?.email || "guest@herbalcenter.app",
      amount: Math.round((user.price || 0) * 100),
      currency: "GHS",
      ref: makeReference(),
      callback: async (response) => {
        await updateUser(user.id, {
          paymentStatus: "paid",
          paymentReference: response.reference,
          paidAt: Date.now(),
        })
        alert("Payment successful!")
      },
    })
    handler.openIframe()
  }

  const handleDelete = async (user) => {
    if (window.confirm("Cancel this appointment?")) {
      await deleteUser(user.id)
    }
  }

  const sendReply = async (user) => {
    const text = (reply[user.id] || "").trim()
    if (!text) return
    await updateUser(user.id, {
      messages: [
        ...(user.messages || []),
        { from: "client", text, at: Date.now() },
      ],
    })
    setReply((prev) => ({ ...prev, [user.id]: "" }))
  }

  const downloadReceipt = (user) => {
    const win = window.open("", "_blank", "width=600,height=700")
    win.document.write(`
      <html>
        <head><title>Receipt - Herbal Center</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
          h1 { color: #1e3a8a; margin: 0 0 4px; }
          .sub { color: #666; margin: 0 0 24px; }
          .box { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
          .row:last-child { border-bottom: none; }
          .total { display: flex; justify-content: space-between; font-weight: bold; margin-top: 16px; font-size: 18px; }
          .status { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px;
            ${user.paymentStatus === "paid" ? "background:#dcfce7;color:#166534;" : "background:#fef9c3;color:#854d0e;"} }
          @media print { .no-print { display: none; } }
        </style></head>
        <body>
          <h1>Herbal Homeopathic Center</h1>
          <p class="sub">Appointment Receipt</p>
          <div class="box">
            <div class="row"><span>Patient</span><strong>${user.name || "-"}</strong></div>
            <div class="row"><span>Package</span><strong>${user.package || "-"}</strong></div>
            <div class="row"><span>Date</span><strong>${user.date || "-"}</strong></div>
            <div class="row"><span>Time</span><strong>${user.time || "-"}</strong></div>
            <div class="row"><span>Payment</span><span class="status">${(user.paymentStatus || "unpaid").toUpperCase()}</span></div>
            ${user.promoCode ? `<div class="row"><span>Promo</span><strong>${user.promoCode}</strong></div>` : ""}
            ${user.paymentReference ? `<div class="row"><span>Reference</span><strong>${user.paymentReference}</strong></div>` : ""}
            <div class="total"><span>Total</span><span>GHC ${user.price || 0}</span></div>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#888;">
            Thank you for choosing Herbal Homeopathic Center.
          </p>
          <button class="no-print" onclick="window.print()" style="margin-top:20px;padding:10px 20px;border:none;background:#1e3a8a;color:#fff;border-radius:6px;cursor:pointer;">Print / Save as PDF</button>
        </body>
      </html>
    `)
    win.document.close()
  }

  const statusBadge = (user) => {
    const status = user.status || "Pending"
    const colors = {
      Confirmed: "bg-green-100 text-green-700",
      Completed: "bg-blue-100 text-blue-700",
      Cancelled: "bg-red-100 text-red-600",
      Pending: "bg-yellow-100 text-yellow-700",
    }
    return (
      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${colors[status] || colors.Pending}`}>
        {status}
      </span>
    )
  }

  const paymentBadge = (user) => {
    if (user.paymentStatus === "paid") {
      return <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Paid</span>
    }
    if (user.paymentStatus === "clinic") {
      return <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Pay at Clinic</span>
    }
    return <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">Payment Due</span>
  }

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
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-blue-900">
                    {user.name}
                  </h2>

                  <div className="flex gap-2">
                    {statusBadge(user)}
                    {paymentBadge(user)}
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">

                  <p><span className="font-semibold text-gray-800">Package:</span> {user.package || "-"}</p>

                  <p><span className="font-semibold text-gray-800">Contact:</span> {user.contact}</p>

                  <p><span className="font-semibold text-gray-800">Email:</span> {user.email || "-"}</p>

                  <p><span className="font-semibold text-gray-800">Time:</span> {user.time}</p>

                  <p><span className="font-semibold text-gray-800">Date:</span> {user.date || "Not set"}</p>

                  <p><span className="font-semibold text-gray-800">Price:</span> GHC {user.price || 0}</p>

                </div>

                {/* Notes */}
                {user.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Notes:</span> {user.notes}
                  </div>
                )}

                {/* Messages thread */}
                {(user.messages || []).length > 0 && (
                  <div className="mt-4 space-y-2">
                    {(user.messages || []).map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm max-w-[85%] ${
                          msg.from === "admin"
                            ? "bg-blue-50 border border-blue-100 text-blue-900"
                            : "bg-green-50 border border-green-100 text-green-900 ml-auto"
                        }`}
                      >
                        <p className="font-semibold text-xs mb-0.5">
                          {msg.from === "admin" ? "Clinic" : "You"}
                        </p>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply box */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message to the clinic..."
                    value={reply[user.id] || ""}
                    onChange={(e) => setReply({ ...reply, [user.id]: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={() => sendReply(user)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Send
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.paymentStatus === "unpaid" && PAYSTACK_PUBLIC_KEY && (
                    <button
                      onClick={() => payNow(user)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Pay Now
                    </button>
                  )}

                  {user.paymentStatus && (
                    <button
                      onClick={() => downloadReceipt(user)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Receipt
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(user)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  )
}

const makeReference = () =>
  "HC-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)

export default MyAppoint