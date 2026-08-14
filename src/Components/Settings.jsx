import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  User,
  Mail,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react'
import useAuthStore from '../Context/authStore'

const SettingsContent = () => {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const Logout = useAuthStore((state) => state.Logout)
  const UpdateProfile = useAuthStore((state) => state.UpdateProfile)
  const [name, setName] = useState(profile?.name || '')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await UpdateProfile({ name: name.trim() })
    setSaving(false)
  }

  const handleLogout = async () => {
    await Logout()
    navigate('/login')
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 flex items-center justify-center gap-3">
          <SettingsIcon className="w-8 h-8" /> Settings
        </h1>
        <p className="text-gray-600 mt-3">
          Manage your account and preferences.
        </p>
      </div>

      <div className="mt-10 max-w-2xl mx-auto space-y-6">

        {/* Profile */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" /> Profile
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              {profile?.email || user?.email}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-gray-400 text-xs break-all">Account ID: {user?.uid}</span>
            </p>
          </div>
        </div>

        {/* Edit display name */}
        <form onSubmit={handleSave} className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">Display Name</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : <span className="flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
          </button>
        </form>

        {/* Account */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Account</h2>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

      </div>
    </section>
  )
}

export default SettingsContent