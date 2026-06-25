import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Agent = () => {
  const [complaints, setComplaints] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints/assigned");
      setComplaints(data.complaints || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      logout();
      navigate("/login");
    }
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "in-progress") return "bg-blue-100 text-blue-700";
    if (status === "resolved") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* Title + Status */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>

              <span
                className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                  c.status,
                )}`}
              >
                {c.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-2 text-sm">{c.description}</p>

            {/* Customer Info */}
            <p className="text-sm mt-3">
              <span className="font-medium text-gray-700">Customer:</span>{" "}
              {c.user?.name || "Unknown"}
            </p>

            {/* Status Dropdown */}
            <div className="mt-4">
              <select
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-3">
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {complaints.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No assigned complaints
        </p>
      )}
    </div>
  );
};

export default Agent;
