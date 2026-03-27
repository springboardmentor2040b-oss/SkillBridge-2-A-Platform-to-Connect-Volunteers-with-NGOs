import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PREDEFINED_SKILLS } from "../constants/skills";
import Navbar from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", role: "", skills: [],
    location: "", ngoName: "", organizationDescription: "", website: "",
    password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, skills: [...formData.skills, value] });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== value) });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email address";
    if (!formData.role) newErrors.role = "Select a role";
    if (formData.role === "Volunteer") {
      if (formData.skills.length === 0) newErrors.skills = "Select at least one skill";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }
    if (formData.role === "NGO") {
      if (!formData.ngoName.trim()) newErrors.ngoName = "Organization name is required";
      if (!formData.organizationDescription.trim()) newErrors.organizationDescription = "Description is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) newErrors.website = "Enter a valid website URL";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password))
      newErrors.password = "Password must contain 1 uppercase, 1 number & 1 special character";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validate()) {
      const success = await register(formData);
      if (success) navigate("/login");
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6CBBA2] transition";
  const labelClass = "block text-sm font-medium text-[#2F5373] dark:text-slate-300 mb-1";

  return (
    <div className="min-h-screen bg-[#f5f7f6] dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <div className="flex justify-center items-start py-10 px-4">
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6 text-center">Create Account</h2>

          {/* Name */}
          <div className="mb-3">
            <label className={labelClass}>Full Name</label>
            <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className={inputClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className={labelClass}>Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className={inputClass} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className={labelClass}>Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
              <option value="">Choose role</option>
              <option value="Volunteer">Volunteer</option>
              <option value="NGO">NGO</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* Volunteer Fields */}
          {formData.role === "Volunteer" && (
            <>
              <div className="mb-3">
                <label className={labelClass}>Select Skills</label>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_SKILLS.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <input type="checkbox" value={skill} checked={formData.skills.includes(skill)} onChange={handleSkillChange} className="accent-[#6CBBA2]" />
                      {skill}
                    </label>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </div>
              <div className="mb-3">
                <label className={labelClass}>Location</label>
                <input type="text" name="location" placeholder="Enter your location" value={formData.location} onChange={handleChange} className={inputClass} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
            </>
          )}

          {/* NGO Fields */}
          {formData.role === "NGO" && (
            <>
              <div className="mb-3">
                <label className={labelClass}>Organization Name</label>
                <input type="text" name="ngoName" placeholder="Enter organization name" value={formData.ngoName} onChange={handleChange} className={inputClass} />
                {errors.ngoName && <p className="text-red-500 text-xs mt-1">{errors.ngoName}</p>}
              </div>
              <div className="mb-3">
                <label className={labelClass}>Organization Description</label>
                <textarea name="organizationDescription" placeholder="Briefly describe your organization" value={formData.organizationDescription} onChange={handleChange}
                  className={`${inputClass} resize-none`} rows={3} />
                {errors.organizationDescription && <p className="text-red-500 text-xs mt-1">{errors.organizationDescription}</p>}
              </div>
              <div className="mb-3">
                <label className={labelClass}>Location</label>
                <input type="text" name="location" placeholder="Enter your location" value={formData.location} onChange={handleChange} className={inputClass} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div className="mb-3">
                <label className={labelClass}>Website <span className="text-slate-400 text-xs">(optional)</span></label>
                <input type="text" name="website" placeholder="https://yourwebsite.com" value={formData.website} onChange={handleChange} className={inputClass} />
                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
              </div>
            </>
          )}

          {/* Password */}
          <div className="mb-3">
            <label className={labelClass}>Password</label>
            <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className={inputClass} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className={labelClass}>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button onClick={handleRegister}
            className="w-full bg-[#6CBBA2] text-white py-2.5 rounded-md font-semibold hover:bg-[#2F5373] transition">
            Register
          </button>

          <p className="mt-5 text-sm text-center text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6CBBA2] font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;