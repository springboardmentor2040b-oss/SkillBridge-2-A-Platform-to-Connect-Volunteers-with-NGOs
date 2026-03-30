import React from "react";
import axios from 'axios';

function OpportunityCard({ opportunity }) {

  const applyForOpportunity = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/applications/apply", {
        volunteerId: user._id,
        opportunityId: opportunity._id,
      });

      alert(response.data.message);

    } catch (error) {
      console.error("Error:", error);
      alert("Error applying for opportunity");
    }
  };

  return (
    <div className="border p-4 rounded shadow mb-4">

      <h2 className="text-xl font-bold">{opportunity.title}</h2>

      <p>{opportunity.description}</p>

      <p>Location: {opportunity.location}</p>

      <p>Duration: {opportunity.duration}</p>

      <button
        onClick={applyForOpportunity}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
      >
        Apply
      </button>

    </div>
  );
}

export default OpportunityCard;