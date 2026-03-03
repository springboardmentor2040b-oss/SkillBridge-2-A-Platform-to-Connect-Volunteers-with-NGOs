import React, { useEffect, useState } from "react";

function ViewOpportunities() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [opportunities, setOpportunities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    location: "",
    duration: "",
    required_skills: ""
  });
  const [loadingId, setLoadingId] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  // FETCH ALL OPPORTUNITIES
  useEffect(() => {
    fetch("http://localhost:5000/api/opportunities")
      .then(res => res.json())
      .then(data => {
        setOpportunities(data);

        // Initialize countdowns immediately
        const initialCountdowns = {};
        data.forEach((opp) => {
          if (opp.expiryDate) {
            const diff = new Date(opp.expiryDate) - new Date();
            initialCountdowns[opp._id] = formatDiff(diff);
          }
        });
        setCountdowns(initialCountdowns);
      })
      .catch(err => console.log(err));
  }, []);

  // Countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};

      opportunities.forEach((opp) => {
        if (!opp.expiryDate) return;

        const diff = new Date(opp.expiryDate) - new Date();
        newCountdowns[opp._id] = formatDiff(diff);
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [opportunities]);

  // Helper to format time difference
  const formatDiff = (diff) => {
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // DELETE
  const deleteOpportunity = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/opportunities/${id}`, {
        method: "DELETE"
      });

      setOpportunities(prev => prev.filter((opp) => opp._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // START EDIT
  const startEdit = (opp) => {
    setEditingId(opp._id);
    setEditData({
      title: opp.title || "",
      description: opp.description || "",
      location: opp.location || "",
      duration: opp.duration || "",
      required_skills: opp.required_skills?.join(", ") || ""
    });
  };

  // UPDATE
  const handleUpdate = async (id) => {
    setLoadingId(id);
    try {
      const updatedData = {
        title: editData.title,
        description: editData.description,
        location: editData.location,
        duration: editData.duration,
        required_skills: editData.required_skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      };

      const res = await fetch(`http://localhost:5000/api/opportunities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) throw new Error("Failed to update opportunity");

      const updatedOpp = await res.json();
      setOpportunities(prev => prev.map(opp => (opp._id === id ? updatedOpp : opp)));
      setEditingId(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Opportunities</h2>

      {opportunities.length === 0 && <p>No opportunities available.</p>}

      {opportunities.map((opp) => (
        <div key={opp._id} className="border p-4 mb-4 rounded shadow bg-white">
          {editingId === opp._id ? (
            <>
              <input
                className="border p-2 mb-2 w-full"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                className="border p-2 mb-2 w-full"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description"
              />
              <input
                className="border p-2 mb-2 w-full"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="Location"
              />
              <input
                className="border p-2 mb-2 w-full"
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                placeholder="Duration"
              />
              <input
                className="border p-2 mb-2 w-full"
                value={editData.required_skills}
                onChange={(e) => setEditData({ ...editData, required_skills: e.target.value })}
                placeholder="React, Node, MongoDB"
              />
              <button
                type="button"
                onClick={() => handleUpdate(opp._id)}
                className={`bg-green-600 text-white px-3 py-1 mr-2 rounded ${
                  loadingId === opp._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingId === opp._id}
              >
                {loadingId === opp._id ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg">{opp.title}</h3>
              <p className="mb-2">{opp.description}</p>
              <p className="text-sm"><strong>Location:</strong> {opp.location}</p>
              <p className="text-sm"><strong>Duration:</strong> {opp.duration}</p>
              <p className="text-sm"><strong>Skills:</strong> {opp.required_skills?.join(", ")}</p>

              {/* Countdown */}
              <p className="text-sm font-semibold text-red-600">
                Expires in: {countdowns[opp._id] || "Calculating..."}
              </p>

              {user && user.role?.toLowerCase() === "ngo" && (
                <>
                  <button
                    type="button"
                    onClick={() => startEdit(opp)}
                    className="bg-yellow-500 text-white px-3 py-1 mt-3 mr-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteOpportunity(opp._id)}
                    className="bg-red-500 text-white px-3 py-1 mt-3 rounded"
                  >
                    Delete
                  </button>
                </>
              )}

              {user && user.role?.toLowerCase() === "volunteer" && (
                <button
                  type="button"
                  className="bg-blue-500 text-white px-3 py-1 mt-3 rounded"
                >
                  Apply
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewOpportunities;