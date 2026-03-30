import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function CreateOpportunity() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
        "http://localhost:5000/api/opportunities/create",
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

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-3 rounded-lg"
        />

        <Select
          options={skillsOptions}
          isMulti
          value={selectedSkills}
          onChange={setSelectedSkills}
          placeholder="Select required skills..."
        />

        {/* Duration Dropdown */}
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border px-3 py-2 mt-3 rounded-lg"
        >
          <option value="">Select Duration</option>
          <option value="1 Week">1 Week</option>
          <option value="2 Weeks">2 Weeks</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full border px-3 py-2 mt-3 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg"
        >
          Create Opportunity
        </button>

      </div>
    </div>
  );
}

export default CreateOpportunity;