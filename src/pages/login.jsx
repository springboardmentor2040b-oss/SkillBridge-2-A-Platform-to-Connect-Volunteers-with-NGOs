import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      alert("Login successful ✅");
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="SkillBridge Logo"
            className="w-[90px] h-[45px] object-contain"
          />
          <span className="text-3xl font-semibold text-[#2F5373]">
            SkillBridge
          </span>
        </div>

        <div className="flex gap-6 text-[#2F5373] font-medium">
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>
        </div>
      </div>

      {/* Login Box */}
      <div className="flex justify-center items-center h-[85vh]">
        <div className="bg-white p-8 w-[360px] rounded-xl shadow-lg text-center">

          <h2 className="text-2xl font-semibold text-[#2F5373] mb-6">
            Login
          </h2>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
          />

          {/* Fixed space for error (no layout shift) */}
          <div className="h-[18px] text-red-500 text-sm text-left">
            {errors.email}
          </div>

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
          />

          {/* Fixed space for error */}
          <div className="h-[18px] text-red-500 text-sm text-left mb-2">
            {errors.password}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#6CBBA2] text-white py-2 rounded-md font-medium hover:bg-[#2F5373] transition"
          >
            Login
          </button>

          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#6CBBA2] font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
