import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        navigate("/dashboard");
      }
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6CBBA2] transition";

  return (
    <div className="min-h-screen bg-[#f5f7f6] dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      {/* Login Box */}
      <div className="flex justify-center items-center min-h-[85vh] px-4 py-10">
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 w-full max-w-md rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6 text-center">
            Welcome Back
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2F5373] dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2F5373] dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#6CBBA2] text-white py-2.5 rounded-md font-semibold hover:bg-[#2F5373] transition"
          >
            Login
          </button>

          <p className="mt-5 text-sm text-center text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#6CBBA2] font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;