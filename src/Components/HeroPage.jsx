import React from 'react'

const HeroPage = () => {
  return (
    <section className="bg-[url('/src/assets/Images/checkup.jpg')] bg-cover object-cover h-130 bg-center pt-20 relative lg:w-full md:w-full w-full lg:pb-20 md:pb-20 pb-20 lg:text-left md:text-left text-center ">
      <div className="bg-gradient-to-b from-blue-900/60 to to-black/50 inset-0 absolute"></div>
      <div className='relative lg:w-[1000px] md:w-[1000px] lg:px-6 md:px-20 mx-auto z-10'>
        <div className='text-white lg:w-[700px] md:w-[700px]'>
          <h1 className='lg:text-5xl md:text-5xl text-xl font-extrabold font-black tracking-tight leading-tight'>Book Your Health Checkup Easily</h1>
          <p className='lg:text-lg md:text-lg text-md pt-4 text-gray-200'>Schedule medical checkups quickly and choose from different health packages.</p>
          <button className='text-white rounded-lg bg-blue-900 p-3 hover:bg-blue-800'>Book Appointment</button>
        </div>
      </div>
    </section>

  )
}

export default HeroPage