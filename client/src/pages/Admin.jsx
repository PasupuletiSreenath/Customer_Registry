import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchData = async () => {
    try {
      const { data: cData } = await API.get("/complaints");
      const { data: uData } = await API.get("/users?role=agent");

      setComplaints(cData.complaints || cData);
      setAgents(uData.users || uData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (complaintId, agentId) => {
    if (!agentId) return;

    try {
      const { data } = await API.put(`/complaints/${complaintId}/assign`, {
        agentId,
      });

      // ✅ instant UI update (no refresh needed)
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? data.complaint : c)),
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* TITLE */}
            <h3 className="font-semibold text-lg">{c.title}</h3>

            <p className="text-gray-600 text-sm mt-1">{c.description}</p>

            {/* STATUS */}
            <div className="mt-2">
              <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                {c.status}
              </span>
            </div>

            {/* ASSIGNED SECTION */}
            <div className="mt-4">
              {c.assignedAgent ? (
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
                  ✅ Assigned to: {c.assignedAgent.name}
                </div>
              ) : (
                <select
                  onChange={(e) => handleAssign(c._id, e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Assign Agent</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* DATE */}
            <p className="text-xs text-gray-400 mt-3">
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
            </p>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {complaints.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No complaints found</p>
      )}
    </div>
  );
};

export default Admin;
