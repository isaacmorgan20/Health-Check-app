import React from 'react'
import packs from '../Data/pack'

const Package = () => {
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

        {packs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
          >

            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover transform hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5">

              <h1 className="font-bold text-xl text-blue-900">
                {item.name}
              </h1>

              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {item.description}
              </p>

              <p className="text-green-600 font-bold mt-3 text-lg">
                {item.price}
              </p>

              <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition">
                Book Now
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Package