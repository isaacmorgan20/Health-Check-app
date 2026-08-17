import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useUserStore from '../Context/UserStore'
import useAgentStore from '../Context/agentStore'
import useAuthStore from '../Context/authStore'
import usePackageStore from '../Context/packageStore'
import useClinicStore from '../Context/clinicStore'
import promos from '../Data/promos'
import { verifyPayment } from '../Utils/notify'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

const makeReference = () =>
  "HC-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)

const stamp = () => Date.now()

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

const toDateKey = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const formatTimeLabel = (slot) => {
  const [h, m] = slot.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`
}

const Book = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedPackage = location.state?.selectedPackage
  const addNewUser = useUserStore((state) => state.addNewUser)
  const updateUser = useUserStore((state) => state.updateUser)
  const authUser = useAuthStore((state) => state.user)

  const packages = usePackageStore((state) => state.packages)
  const fetchPackages = usePackageStore((state) => state.fetchPackages)

  const clinicSettings = useClinicStore((state) => state.settings)
  const listenToSettings = useClinicStore((state) => state.listenToSettings)

  useEffect(() => {
    fetchPackages()
    const unsubSettings = listenToSettings()
    return () => unsubSettings && unsubSettings()
  }, [fetchPackages, listenToSettings])

  const timeSlots = clinicSettings.timeSlots || []
  const weeklyHours = clinicSettings.weeklyHours || {}
  const blockedDates = clinicSettings.blockedDates || []
  const blockedSlots = clinicSettings.blockedSlots || []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDateKey = toDateKey(today)
  const maxDateKey = `${today.getFullYear()}-12-31`

  const availableDates = []
  {
    for (let i = 0; i < 400; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getFullYear() !== today.getFullYear()) break
      const key = toDateKey(d)
      const dayKey = DAY_KEYS[d.getDay()]
      if (blockedDates.includes(key)) continue
      if (!weeklyHours[dayKey]) continue
      availableDates.push(key)
    }
  }

  const isOpenDate = (key) => {
    const d = new Date(key + "T00:00:00")
    if (d < today) return false
    if (d.getFullYear() !== today.getFullYear()) return false
    const dayKey = DAY_KEYS[d.getDay()]
    if (!weeklyHours[dayKey]) return false
    if (blockedDates.includes(key)) return false
    return timeSlots.some(
      (slot) => !blockedSlots.some((b) => b.date === key && b.time === slot)
    )
  }

  const bookingDraft = useAgentStore((state) => state.bookingDraft)
  const autoSubmit = useAgentStore((state) => state.autoSubmit)
  const clearBookingDraft = useAgentStore((state) => state.clearBookingDraft)

  const agentPackage = bookingDraft?.packageId
    ? packages.find((p) => String(p.seedId ?? p.id) === String(bookingDraft.packageId))
    : null

  const initialPackage = agentPackage || selectedPackage

  const [name, setName] = useState(bookingDraft?.name || "")
  const [contact, setContact] = useState(bookingDraft?.contact || "")
  const [email, setEmail] = useState(bookingDraft?.email || "")
  const [date, setDate] = useState(bookingDraft?.date || "")
  const [time, setTime] = useState(bookingDraft?.time || "")
  const [notes, setNotes] = useState(bookingDraft?.notes || "")
  const [selected, setSelected] = useState(initialPackage?.name)
  const [paymentMethod, setPaymentMethod] = useState("clinic")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(null)

  const effectiveDate = availableDates.includes(date) ? date : (availableDates[0] || "")
  const dateSlots = timeSlots.filter(
    (slot) => !blockedSlots.some((b) => b.date === effectiveDate && b.time === slot)
  )
  const effectiveTime = dateSlots.includes(time) ? time : (dateSlots[0] || "")

  const submittedRef = useRef(false)

  const selectable = packages.filter((p) => !p.disabled)
  const selectedPkg = selectable.find((p) => p.name === selected)
  const price = selectedPkg?.price || 0
  const discount = promoApplied?.discount || 0
  const finalPrice = Math.round(price * (1 - discount / 100))

  const notifyBooking = async (appointment, reference) => {
    if (!appointment.email) return
    try {
      await fetch(`${BACKEND_URL}/notify-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: appointment.email,
          name: appointment.name,
          package: appointment.package,
          date: appointment.date,
          time: appointment.time,
          reference: reference || null,
        }),
      })
    } catch (error) {
      console.error("Notify failed:", error)
    }
  }

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
const resetFields = useCallback(() => {
    setName("")
    setContact("")
    setEmail("")
    setDate("")
    setTime("")
    setNotes("")
    setPromoCode("")
    setPromoApplied(null)
    setPaymentMethod("clinic")
  }, [])

  const saveAppointment = useCallback(async (fields) => {
    const pkg = packages.find((p) => p.name === fields.package && !p.disabled) || null
    const pkgPrice = pkg?.price || 0
    const discountPct = promoApplied?.discount || 0
    const appointment = {
      name: fields.name,
      contact: fields.contact,
      email: fields.email,
      date: fields.date,
      time: fields.time,
      notes: fields.notes,
      package: pkg?.name || fields.package,
      price: Math.round(pkgPrice * (1 - discountPct / 100)),
      originalPrice: pkgPrice,
      userUid: authUser?.uid,
      paymentStatus: paymentMethod === "online" ? "unpaid" : "clinic",
      ...(promoApplied ? { promoCode: promoApplied.code, discountPct } : {}),
      createdAt: stamp(),
    }
    try {
      const docId = await addNewUser(appointment)
      resetFields()
      return docId
    } catch (error) {
      alert(error.message)
      return null
    }
  }, [packages, promoApplied, authUser, paymentMethod, addNewUser, resetFields])

  const openPaystack = (appointment, amount, docId) => {
    if (!PAYSTACK_PUBLIC_KEY || !window.PaystackPop) {
      alert("Online payment is not configured yet. Your appointment is saved — pay at the clinic.")
      return
    }
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: appointment.email || authUser?.email || "guest@herbalcenter.app",
      amount: Math.round(amount * 100),
      currency: "GHS",
      ref: makeReference(),
      callback: async (response) => {
        const result = await verifyPayment(response.reference)
        if (result.verified === false) {
          alert("Payment could not be verified yet. Your appointment is saved — we will confirm shortly.")
          navigate("/MyAppointment")
          return
        }
        await updateUser(docId, {
          paymentStatus: "paid",
          paymentReference: response.reference,
          paidAt: stamp(),
        })
        notifyBooking(appointment, response.reference)
        alert("Payment successful! Your appointment is confirmed.")
        navigate("/MyAppointment")
      },
      onClose: () => {
        alert("Payment window closed. Your appointment is saved — you can pay from My Appointments.")
        navigate("/MyAppointment")
      },
    })
    handler.openIframe()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const appointment = {
      name, contact, email,
      date: effectiveDate,
      time: effectiveTime,
      notes: notes || "Booked via Herbal Center",
      package: selected,
    }

    const docId = await saveAppointment(appointment)
    if (!docId) return

    if (paymentMethod === "online" && PAYSTACK_PUBLIC_KEY) {
      openPaystack(appointment, finalPrice, docId)
    } else {
      if (paymentMethod === "online") {
        alert("Online payment is not configured yet. Your appointment is saved — pay from My Appointments.")
      }
      notifyBooking(appointment)
      navigate("/MyAppointment")
    }
  }

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    const found = promos.find((p) => p.code === code)
    if (found) {
      setPromoApplied(found)
      alert(`Promo applied: ${found.discount}% off`)
    } else {
      setPromoApplied(null)
      alert("That promo code is not valid.")
    }
  }

  // Auto-submit when the AI agent has all the required details
  useEffect(() => {
    if (!autoSubmit || submittedRef.current) return
    if (!name || !contact || !effectiveDate || !effectiveTime) return

    submittedRef.current = true

    const timer = setTimeout(async () => {
      const fields = {
        name, contact, email,
        date: effectiveDate,
        time: effectiveTime,
        notes: notes || "Booked via HealthAssist AI",
        package: initialPackage?.name,
      }
      await saveAppointment(fields)
      notifyBooking(fields)
      clearBookingDraft()
      navigate("/MyAppointment")
    }, 0)

    return () => clearTimeout(timer)
  }, [autoSubmit, name, contact, email, effectiveDate, effectiveTime, notes, initialPackage, clearBookingDraft, saveAppointment, navigate])

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

          <h2 className="font-semibold text-blue-900 text-lg">
            Selected Package
          </h2>

          {initialPackage ? (
            <>
              <h1 className="mt-3 text-gray-700">
                <strong>Name:</strong> {initialPackage.name}
              </h1>

              {promoApplied ? (
                <>
                  <p className="text-gray-500 mt-1 line-through">
                    <strong>Original:</strong> GHC {initialPackage.price}
                  </p>
                  <p className="text-green-600 font-bold mt-1">
                    <strong>Discounted:</strong> GHC {Math.round(initialPackage.price * (1 - discount / 100))}
                    {" "}({promoApplied.code} applied)
                  </p>
                </>
              ) : (
                <p className="text-green-600 font-bold mt-1">
                  <strong>Price:</strong> GHC {initialPackage.price}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600 text-sm mt-2">
              Please select a package from the Packages page.
            </p>
          )}

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
              required
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
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Package
            </label>

            <select
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value)
                setPromoApplied(null)
                setPromoCode("")
              }}
            >
              {initialPackage && (
                <option value={initialPackage.name}>
                  {initialPackage.name}
                </option>
              )}

              {selectable.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} - GHS {item.price}
                </option>
              ))}
            </select>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                min={minDateKey}
                max={maxDateKey}
                value={effectiveDate}
                onChange={(e) => {
                  const key = e.target.value
                  if (isOpenDate(key)) {
                    setDate(key)
                    setTime("")
                  } else {
                    alert("That date is not available for booking. Please pick an open date.")
                  }
                }}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Pick any open date. Closed days and booked slots are not selectable.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              {dateSlots.length === 0 ? (
                <p className="mt-1 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
                  All time slots for this date are booked. Please pick another date.
                </p>
              ) : (
                <select
                  value={effectiveTime}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {dateSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatTimeLabel(slot)}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Promo Code */}
          <div>
            <label className="text-sm font-medium text-gray-700">Promo Code</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter promo code (e.g. WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 rounded-lg transition text-sm font-semibold"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-green-600 text-sm mt-1">
                {promoApplied.code} applied — {promoApplied.discount}% off
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <label
                className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === "clinic" ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "clinic"}
                  onChange={() => setPaymentMethod("clinic")}
                  className="accent-green-600"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pay at Clinic</p>
                  <p className="text-xs text-gray-500">Cash or Momo on arrival</p>
                </div>
              </label>

              <label
                className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === "online" ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="accent-green-600"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pay Online</p>
                  <p className="text-xs text-gray-500">Mobile Money / Card via Paystack</p>
                </div>
              </label>
            </div>
            {paymentMethod === "online" && !PAYSTACK_PUBLIC_KEY && (
              <p className="text-amber-600 text-sm mt-1">
                Online payment is not configured yet — add your Paystack public key to enable it.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              placeholder="Any information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Total */}
          <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <span className="font-semibold text-blue-900">Total</span>
            <span className="font-bold text-xl text-blue-900">
              GHC {finalPrice || price}
              {discount > 0 && (
                <span className="text-sm text-gray-500 font-normal line-through ml-2">
                  GHC {price}
                </span>
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
          >
            {paymentMethod === "online" ? "Book & Pay" : "Book Appointment"}
          </button>

        </form>

      </div>
    </section>
  )
}

export default Book