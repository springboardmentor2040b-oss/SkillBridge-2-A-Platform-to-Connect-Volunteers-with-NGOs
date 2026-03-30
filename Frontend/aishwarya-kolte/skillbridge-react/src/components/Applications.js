 import React, { useEffect, useState } from "react";
import axios from "axios";

function Applications({ user }) {

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {

    if (!user || user.role !== "ngo") return;

    axios
      .get(`http://localhost:5000/api/applications/ngo/${user._id}`)
      .then((res) => {
        setApplications(res.data);
        setFilteredApps(res.data);
      })
      .catch((err) => console.log(err));

  }, [user]);

  // Filter logic
  useEffect(() => {

    let data = applications;

    if (statusFilter !== "All") {
      data = data.filter(app => app.status === statusFilter);
    }

    if (search !== "") {
      data = data.filter(app =>
        app.volunteerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredApps(data);

  }, [search, statusFilter, applications]);

  // Reset filters
  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // Status counts
  const total = applications.length;
  const pending = applications.filter(a => a.status === "Pending").length;
  const accepted = applications.filter(a => a.status === "Accepted").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-2">Applications</h2>
      <p className="text-gray-500 mb-4">
        Manage volunteer applications for your opportunities.
      </p>

      {/* Search + Reset */}

      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Search volunteers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <button
          onClick={handleReset}
          className="border px-4 py-2 rounded"
        >
          Reset
        </button>

      </div>

      {/* Status Tabs */}

      <div className="flex gap-6 mb-6 font-medium">

        <button
          onClick={() => setStatusFilter("All")}
          className={statusFilter === "All" ? "text-blue-600" : ""}
        >
          All ({total})
        </button>

        <button
          onClick={() => setStatusFilter("Pending")}
          className={statusFilter === "Pending" ? "text-blue-600" : ""}
        >
          Pending ({pending})
        </button>

        <button
          onClick={() => setStatusFilter("Accepted")}
          className={statusFilter === "Accepted" ? "text-blue-600" : ""}
        >
          Accepted ({accepted})
        </button>

        <button
          onClick={() => setStatusFilter("Rejected")}
          className={statusFilter === "Rejected" ? "text-blue-600" : ""}
        >
          Rejected ({rejected})
        </button>

      </div>

      {/* No Applications */}

      {applications.length === 0 && (
        <p className="text-gray-500">No applications yet</p>
      )}

      {/* Application Cards */}

      {filteredApps.map((app) => (

        <div
          key={app._id}
          className="border rounded p-4 mb-4 shadow-sm"
        >

          <h3 className="font-semibold text-lg">
            {app.opportunityTitle}
          </h3>

          <p className="text-gray-600">
            {app.volunteerName}
          </p>

          <p className="text-sm text-gray-400">
            Applied on {new Date(app.createdAt).toLocaleDateString()}
          </p>

          <span
            className={`px-3 py-1 rounded text-sm
            ${
              app.status === "Pending"
                ? "bg-yellow-200 text-yellow-800"
                : app.status === "Accepted"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {app.status}
          </span>

        </div>

      ))}

    </div>

  );
}

export default Applications;
