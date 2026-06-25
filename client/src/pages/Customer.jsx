import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints");

      if (Array.isArray(data)) setComplaints(data);
      else if (Array.isArray(data.complaints)) setComplaints(data.complaints);
      else setComplaints([]);
    } catch (err) {
      console.log(err);
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return alert("All fields required ⚠️");
    }

    try {
      if (editingId) {
        await API.put(`/complaints/${editingId}`, form);
        alert("Updated ✅");
      } else {
        await API.post("/complaints", form);
        alert("Submitted ✅");
      }

      setForm({ title: "", description: "" });
      setEditingId(null);
      fetchComplaints();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error ❌");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // Edit
  const handleEdit = (c) => {
    setForm({ title: c.title, description: c.description });
    setEditingId(c._id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow p-5">
        <h2 className="text-xl font-bold mb-5">Customer Panel</h2>

        <ul className="space-y-3">
          <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
          <li className="hover:text-blue-600 cursor-pointer">My Complaints</li>

          <li onClick={handleLogout} className="text-red-500 cursor-pointer">
            Logout
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          </div>

          {/* Form */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Complaint" : "Raise Complaint"}
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button className="bg-blue-600 text-white px-4 rounded">
                {editingId ? "Update" : "Submit"}
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow text-center">
              <p>Total</p>
              <h2>{complaints.length}</h2>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p>Pending</p>
              <h2>{complaints.filter((c) => c.status === "pending").length}</h2>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p>Resolved</p>
              <h2>
                {complaints.filter((c) => c.status === "resolved").length}
              </h2>
            </div>
          </div>

          {/* List */}
          <h2 className="text-xl font-semibold mb-4">My Complaints</h2>

          {complaints.length > 0 ? (
            <div className="grid gap-4">
              {complaints.map((c) => (
                <div key={c._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{c.title}</h3>

                    <span className="text-sm px-2 py-1 bg-gray-200 rounded">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2">{c.description}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-400 px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No complaints found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customer;
