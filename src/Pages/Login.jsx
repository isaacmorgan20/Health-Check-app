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

// import React, { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import useAuthStore from '../Context/authStore'

// const Login = () => {
//   const login = useAuthStore((state) => state.Login)
//   const navigate = useNavigate()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     if (!email.trim() || !password.trim()) {
//       alert("Please fill the form")
//       return
//     }

//     try {
//       await login({ email, password })
//       alert("Login successfully")
//       navigate("/") // go to home after login
//     } catch (error) {
//       alert(error.message)
//     }

//     setEmail("");
//     setPassword("")
//   }

//   return (
//     <section className='bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 p-24'>
//       <h1 className='text-center font-bold text-3xl mt-5'>Herbal center</h1>

//     <div className='shadow-2xl rounded-lg bg-white w-110 h-100 ml-100 mt-10 p-7'>
//       <p className='text-center font-bold text-xl pb-3'>Log in to your account</p>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className='border-1 rounded-lg p-3 w-full border-gray-300'
//         />
//         <br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className='border-1 rounded-lg p-3 w-full border-gray-300'
//         />
//         <br /><br />
//         <button type="submit" className='bg-green-600 hover:bg-green-500 text-white rounded-lg w-full p-2'>Login</button>
//       </form>

//       <br /><br />

//       {/* ✅ Toggle link */}
//       <p className='text-center'>
//         No account?{" "}
//         <Link to="/register" className='text-blue-800'>
//          <strong>Create Account</strong>
//         </Link>
//       </p>
//     </div>
//     </section>
//   )
// }

// export default Login


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../Context/authStore";

const Login = () => {
  const login = useAuthStore((state) => state.Login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await login({ email, password });
      alert("Login successful");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-lime-100 to-green-400 px-4">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-700">
            Herbal Center
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back to your wellness space
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white py-3 rounded-xl font-semibold text-lg"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </section>
  );
};

export default Login;