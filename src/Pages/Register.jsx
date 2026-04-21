import React from 'react'
import useAuthStore from '../Context/authStore'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const Register = useAuthStore((state) => state.Register)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please create a form")
    };


    try {
      await Register({ name, email, password });
      alert("Successful")

      navigate("/")
    } catch (error) {
      alert(error.message)
    }

    setEmail("");
    setName("");
    setPassword("");

  }

  return (
    <section className='bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 p-21'>
      <h1 className='text-center font-bold text-3xl'>Herbal center</h1>
    
      <div className='shadow-2xl rounded-lg bg-white w-110 h-110 ml-100 mt-10 p-7'>
        <p className='text-center font-bold text-xl pb-3'>Create an Account</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-1 rounded-lg p-3 w-full  border-gray-300' />
          <br /><br />
          <input
            type="email"
            placeholder='someone426@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-1 rounded-lg p-3 w-full  border-gray-300'
          />
          <br /><br />
          <input
            type="password"
            placeholder='Your password'
            value={password} onChange={(e) => setPassword(e.target.value)}
            className='border-1 rounded-lg p-3 w-full  border-gray-300'
          />
          <br /><br />

          <button className='bg-green-600 hover:bg-green-500 text-white rounded-lg w-full p-2'>Create Account</button>
        </form>
        <br /><br />

        <p className='text-center'>
          Have an account?{" "}
          <Link to="/login" className='text-blue-800'>
            <strong>Login</strong>
          </Link>
        </p>
      </div>
    </section>

  )
}

export default Register