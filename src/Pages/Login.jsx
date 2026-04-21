// ======== PREVIOUS CODE ===============

// import React, { useState } from 'react'
// import useAuthStore from '../Context/authStore'

// const Login = () => {
//   const login = useAuthStore((state) => state.Login)

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleLogin = async (e) => {
//     e.preventDefault()

//     if (!email.trim() || !password.trim()) {
//       alert("Please fill the form");
//       return;
//     }

//     try {
//       await login({ email, password });
//       alert("LogIn successfully");
//     } catch (error) {
//       alert(error.message)
//     }

//   }




//   return (
//     <section>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} />
//         <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />

//         <button>Login</button>
//       </form>
//     </section>
//   )
// }

// export default Login

// ============== CURRENT CODE ==================

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../Context/authStore'

const Login = () => {
  const login = useAuthStore((state) => state.Login)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      alert("Please fill the form")
      return
    }

    try {
      await login({ email, password })
      alert("Login successfully")
      navigate("/") // go to home after login
    } catch (error) {
      alert(error.message)
    }

    setEmail("");
    setPassword("")
  }

  return (
    <section className='bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 p-24'>
      <h1 className='text-center font-bold text-3xl mt-5'>Herbal center</h1>

    <div className='shadow-2xl rounded-lg bg-white w-110 h-100 ml-100 mt-10 p-7'>
      <p className='text-center font-bold text-xl pb-3'>Log in to your account</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border-1 rounded-lg p-3 w-full border-gray-300'
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border-1 rounded-lg p-3 w-full border-gray-300'
        />
        <br /><br />
        <button type="submit" className='bg-green-600 hover:bg-green-500 text-white rounded-lg w-full p-2'>Login</button>
      </form>

      <br /><br />

      {/* ✅ Toggle link */}
      <p className='text-center'>
        No account?{" "}
        <Link to="/register" className='text-blue-800'>
         <strong>Create Account</strong>
        </Link>
      </p>
    </div>
    </section>
  )
}

export default Login