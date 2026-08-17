import React, { useEffect } from 'react'
import { Check, Zap, Truck, UserPlus, Star } from "lucide-react"
import usePackageStore from '../Context/packageStore'
import { useNavigate } from 'react-router-dom'

const Package = () => {

  const navigate = useNavigate()
  const packages = usePackageStore((state) => state.packages)
  const fetchPackages = usePackageStore((state) => state.fetchPackages)

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const visible = packages.filter((p) => !p.disabled)

  const pkgFeatureIcons = {
    "Basic Checkup": <Check className="w-4 h-4 text-green-400" />,
    "Full Body Scan": <Zap className="w-4 h-4 text-blue-400" />,
    "Home Visit": <Truck className="w-4 h-4 text-yellow-400" />,
    "Consultation": <UserPlus className="w-4 h-4 text-purple-400" />,
    "Premium Package": <Star className="w-4 h-4 text-amber-500" />,
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-bold text-3xl md:text-4xl text-blue-900">
          Our Health Packages
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Choose from our available medical checkup packages designed to keep you healthy and safe.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

        {visible.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 group"

          >

            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5">

              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {pkgFeatureIcons[item.name] || (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-xl text-blue-900">
                    {item.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <p className="text-green-600 font-bold mt-2 text-lg">
                GHS {item.price}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() =>
                    navigate('/bookappointment', {
                      state: { selectedPackage: item }
                    })
                  }
                  className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7a5 5 0 0 1 5 5h2.3l-.5 8.5a3.5 3.5 0 0 1-7 0L6.3 15.8a3.5 3.5 0 0 1-7-0V7a5 5 0 0 1 10 0z" />
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Book Now
                </button>

                {item.disabled && (
                  <button
                    disabled
                    className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition font-medium text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="8" x2="16" y2="16" />
                    </svg>
                    Unavailable
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Package