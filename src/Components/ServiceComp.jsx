import React from 'react'
import services from '../Data/comp'

const ServiceComp = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-bold text-3xl md:text-4xl text-blue-900">
          About Our Service
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Our platform helps users book medical checkups easily and choose from different health packages for better health monitoring.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">

        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 p-6 border border-gray-100"
          >

            {/* Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover rounded-xl transform hover:scale-110 hover:rotate-1 transition duration-500"
              />
            </div>

            {/* Text */}
            <h2 className="mt-4 font-bold text-xl text-blue-900">
              {service.name}
            </h2>

            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  )
}

export default ServiceComp