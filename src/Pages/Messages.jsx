import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar'
import Footer from '../Components/Footer'
import useUserStore from '../Context/UserStore'
import useAuthStore from '../Context/authStore'
import { ChevronLeft, MessageSquare } from 'lucide-react'

const stamp = () => Date.now()

const MessagesContent = () => {
  const users = useUserStore((state) => state.users)
  const listenToUserAppointments = useUserStore((state) => state.listenToUserAppointments)
  const updateUser = useUserStore((state) => state.updateUser)
  const currentUser = useAuthStore((state) => state.user)

  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState("")

  useEffect(() => {
    const unsubscribe = listenToUserAppointments(currentUser?.uid)
    return () => unsubscribe && unsubscribe()
  }, [listenToUserAppointments, currentUser])

  const conversations = [...users].sort((a, b) => {
    const aLast = (a.messages || []).at(-1)?.at || a.createdAt || 0
    const bLast = (b.messages || []).at(-1)?.at || b.createdAt || 0
    return bLast - aLast
  })

  const active = users.find((u) => u.id === activeId) || null

  const sendReply = async () => {
    const text = draft.trim()
    if (!text || !active) return
    await updateUser(active.id, {
      messages: [...(active.messages || []), { from: "client", text, at: stamp() }],
    })
    setDraft("")
  }

  if (active) {
    return (
      <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setActiveId(null)}
            className="flex items-center gap-1 text-blue-700 font-semibold mb-4 hover:underline"
          >
            <ChevronLeft size={18} /> Back to messages
          </button>

          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-blue-900">{active.name}</h2>
              <p className="text-sm text-gray-500">
                {active.package || "Appointment"} · {active.date || "Date TBD"} at {active.time || "—"}
              </p>
            </div>

            <div className="h-96 overflow-y-auto p-5 space-y-2 bg-gray-50">
              {(active.messages || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center mt-20">
                  No messages yet. Send a message to the clinic.
                </p>
              ) : (
                (active.messages || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm max-w-[85%] ${
                      msg.from === "admin"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-green-100 text-green-900 ml-auto"
                    }`}
                  >
                    <p className="font-semibold text-xs mb-0.5">
                      {msg.from === "admin" ? "Clinic" : "You"}
                    </p>
                    {msg.text}
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(msg.at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                className="flex-1 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={sendReply}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Messages</h1>
          <p className="text-gray-600 mt-3">
            Chat with the clinic about your appointments.
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center bg-white shadow-md rounded-2xl p-10 border border-gray-100">
            <MessageSquare className="mx-auto text-blue-200 w-12 h-12 mb-3" />
            <p className="text-gray-500">No appointments yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Book a checkup to start a conversation with the clinic.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-2xl overflow-hidden border border-gray-100">
            {conversations.map((u) => {
              const last = (u.messages || []).at(-1)
              return (
                <button
                  key={u.id}
                  onClick={() => setActiveId(u.id)}
                  className="w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-blue-50 transition flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-blue-900 truncate">
                      {u.package || "Appointment"} · {u.date || "Date TBD"}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {last
                        ? `${last.from === "admin" ? "Clinic: " : "You: "}${last.text}`
                        : "No messages yet — tap to message the clinic."}
                    </p>
                  </div>
                  {(u.messages || []).length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                      {(u.messages || []).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

const Messages = () => {
  return (
    <section>
      <NavBar />
      <MessagesContent />
      <Footer />
    </section>
  )
}

export default Messages