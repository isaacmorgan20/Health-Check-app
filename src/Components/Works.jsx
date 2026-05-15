import React from 'react'
import steps from '../Data/work'

const Works = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          How It Works
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Follow these simple steps to book your health checkup.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">

        {steps.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 p-6 border border-gray-100 text-center relative"
          >

            {/* Step Number Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md">
              {item.step}
            </div>

            {/* Content */}
            <div className="mt-6">

              <h2 className="text-xl font-bold text-blue-900">
                {item.title}
              </h2>

              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {item.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Works