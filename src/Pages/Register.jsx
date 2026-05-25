import React, { useState } from "react";
import useAuthStore from "../Context/authStore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const Register = useAuthStore((state) => state.Register);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await Register({ name, email, password });

      alert("Account created successfully");

      navigate("/");
    } catch (error) {
      alert(error.message);
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-lime-100 to-green-400 px-4 py-10">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-green-700">
            Herbal Center
          </h1>

          <p className="text-gray-500 mt-2">
            Create your wellness account
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>

            <label className="text-sm font-semibold text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Email */}
          <div>

            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="someone@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Password */}
          <div>

            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white py-3 rounded-xl font-semibold text-lg"
          >
            Create Account
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-green-700 font-bold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </section>
  );
};

export default Register;