import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../Context/authStore'

const NavBar = () => {
    const user = useAuthStore((state) => state.user)
    return (
        <section className='justify-between items-center flex bg-blue-900 text-white p-5'>
            {/* Logo */}
            <div>
                <Link to={"/"}><strong>Herbal Homeopathic center</strong></Link>
            </div>
            {/* links */}
            <div className='space-x-7'>
                <Link to={'/'}>Home</Link>
                <Link to={'/Packages'}>Packages</Link>
                <Link to={'/BookAppointment'}>Book Appointment</Link>
                <Link to={'/myAppointment'}>My Appointment</Link>
            </div>
            {/* login */}
            <div className='space-x-7 '>

                {user ? (
                    <p className="font-bold">Welcome {user.email}</p>
                ) : (
                    <Link to="/login">
                        <button className="bg-green-600 text-white p-2 rounded">
                            Login
                        </button>
                    </Link>
                )}
            </div>

        </section>
    )
}

export default NavBar