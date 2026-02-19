import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/dashboard"); // Redirect to dashboard/home
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 sm:px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="SkillBridge Logo"
            className="w-[90px] h-[45px] object-contain"
          />
          <span className="text-2xl sm:text-3xl font-semibold text-[#2F5373]">
            SkillBridge
          </span>
        </div>
      </div>

      {/* Login Box */}
      <div className="flex justify-center items-center min-h-[85vh]">
        <div className="bg-white p-6 sm:p-8 w-full max-w-md mx-4 rounded-xl shadow-lg">

          <h2 className="text-2xl font-semibold text-[#2F5373] mb-6 text-center">
            Login
          </h2>



          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#6CBBA2] text-white py-2 rounded-md font-medium hover:bg-[#2F5373] transition"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-center">
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