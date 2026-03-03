import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function CreateOpportunity() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Hooks first (VERY IMPORTANT)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    location: ""
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");

  const skillsOptions = [
    { value: "Web Development", label: "Web Development" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Content Writing", label: "Content Writing" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "Mobile App Development", label: "Mobile App Development" },
    { value: "Teaching", label: "Teaching" },
    { value: "Translation", label: "Translation" },
    { value: "Event Management", label: "Event Management" }
  ];

  // ✅ Restrict access AFTER hooks
  if (!user || user.role !== "ngo") {
    return (
      <div className="text-center mt-20 text-red-600 text-xl">
        Only NGO can create opportunities.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    if (!formData.title || !formData.description || selectedSkills.length === 0) {
      setError("Please fill all required fields.");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/opportunities/create", // ✅ FIXED ROUTE
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            required_skills: selectedSkills.map(skill => skill.value),
            ngo_id: user._id
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Opportunity Created Successfully");
        navigate("/dashboard");
      } else {
        alert(data.message || "Server Error");
      }

    } catch (err) {
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create New Opportunity
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Title *</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Skills Multi Select */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Required Skills *</label>
          <Select
            options={skillsOptions}
            isMulti
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Select required skills..."
          />
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Duration</label>
          <input
            type="text"
            name="duration"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Create Opportunity
        </button>

      </div>
    </div>
  );
}

export default CreateOpportunity;