import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useAuthStore from "../Context/authStore"
import useUserStore from "../Context/UserStore"
import useToast from "../Components/UIToast"

const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile } = useAuthStore((state) => state)
  const { profiles, fetchProfiles, updateUser, deleteUser } = useUserStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [locationPref, setLocationPref] = useState("")
  const [healthGoals, setHealthGoals] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const { success: showToast, error: showError } = useToast()

  useEffect(() => {
    if (user) {
      const getProfile = profiles.find((p) => p.uid === user.uid)
      if (getProfile) {
        setName(getProfile.name || "")
        setBirthdate(getProfile.birthdate || "")
        setLocationPref(getProfile.location || "")
        setHealthGoals(getProfile.healthGoals || "")
        setImageUrl(getProfile.imageUrl || "")
      }
    }
  }, [user, profiles])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const updateData = {
        name,
        birthdate: birthdate || undefined,
        location: locationPref || undefined,
        healthGoals: healthGoals || undefined,
        imageUrl: imageUrl || undefined,
      }
      await updateUser(user.uid, updateData)
      setSuccessMsg("Profile updated successfully!")
      setIsLoading(false)
      showToast("Profile updated successfully!")
    } catch (err) {
      showError(err.message || "Failed to update profile")
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    try {
      await deleteUser(user.uid)
      setSuccessMsg("Account deleted successfully!")
      showToast("Account deleted successfully!")
      navigate("/")
    } catch (err) {
      showError(err.message || "Failed to delete account")
    }
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mt-2 object-cover border-2 border-blue-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mt-2 text-blue-500 font-bold">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <button
            onClick={() => setShowImageUpload(true)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-blue-500 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.88 7.88l1.86 1.86a5.5 5.5 0 0 0 7.78 0l4.59-4.59a5.5 5.5 0 0 0 0-7.78z" />
              <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0" fill="none" />
            </svg>
            Upload Picture
          </button>
        </div>

        {successMsg && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 animate-fade-in">
            {successMsg}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              min="1900-01-01"
            />
            <p className="text-xs text-gray-500">Optional - used for age-based health insights</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Preference</label>
            <input
              type="text"
              value={locationPref}
              onChange={(e) => setLocationPref(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Accra, Kumasi, Tamale"
            />
            <p className="text-xs text-gray-500">Helps find nearby providers</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Health Goals</label>
            <textarea
              value={healthGoals}
              onChange={(e) => setHealthGoals(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none transition"
              placeholder="e.g. Lose weight, manage diabetes, exercise more"
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">Track your health objectives</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              onClick={handleUpdate}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-lg font-medium text-sm transition"
            >
              Delete Account
            </button>
          </div>
        </form>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-zxl z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-zxl z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full border border-gray-200 flex flex-col items-center gap-6">
              <h3 className="text-xl font-bold text-gray-900">Update Profile Picture</h3>
              <p className="text-gray-500 mb-6">Upload a new profile picture</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => setImageUrl(e.target.result)
                    reader.readAsDataURL(file)
                  }
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm transition"
              />
              <button
                onClick={() => setShowImageUpload(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile