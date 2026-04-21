import React from 'react'

const Footer = () => {
  return (
    <section className='bg-blue-900 p-20'>
        <div className='flex space-x-17 justify-center'>
            {/* About */}
            <div>
                <h1 className='pb-5 text-2xl text-white'><strong>About the platform</strong></h1>
                <p className='text-gray-200'>Our platform allows users to easily book health checkup <br /> appointments and choose from different medical packages for <br /> better health monitoring.</p>
            </div>

            {/* Quick Links */}
            <div className=''>
                <h1 className='pb-5 text-2xl text-white'>Quick Links</h1>
                <div className='text-gray-200'>
                    <a href="">Home</a><br />
                    <a href="">Health Packages</a><br />
                    <a href="">Book Appointment</a><br />
                    <a href="">My Appointment</a><br /><br />
                </div>
            </div>

            {/* Contact Information */}
            <div className='text-gray-200'>
                <h1 className='pb-5 text-2xl text-white'>Contact Info</h1>
                <p><strong>Phone Number :</strong> +233 55 124 55 47</p>
                <p><strong>Email :</strong>  morganisaackojo5547@gmail.com</p>
                <p><strong>Location :</strong>  Accra-Ghana</p>
            </div>

            {/* Social Media Links */}
            <div>
                <h1 className='pb-5 text-xl text-white'>Social Media</h1>
                <div className='text-gray-200'>
                    <a href="">Facebook</a><br />
                    <a href="">Instagram</a><br />
                    <a href="">Twitter</a><br />
                    <a href="">LinkedIn</a><br />
                </div>
            </div>
        </div>

        {/* Copy Right */}
        <hr className='text-gray-400'/>
        <h1 className='text-center text-gray-300 pt-10'>© 2026 Health Checkup System. All rights reserved.</h1>
    </section>
  )
}

export default Footer