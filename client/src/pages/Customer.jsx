import { useEffect, useState } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";

const STATUS_STYLES = {
  open: "text-rose-600 bg-rose-50 ring-rose-200",
  "in-progress": "text-amber-600 bg-amber-50 ring-amber-200",
  escalated: "text-red-600 bg-red-50 ring-red-200",
  resolved: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  closed: "text-slate-600 bg-slate-100 ring-slate-200",
};

const statusClasses = (status) =>
  STATUS_STYLES[status] || "text-slate-600 bg-slate-100 ring-slate-200";

const Customer = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const { showToast } = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return showToast("All fields are required", "warning");
    }

    try {
      if (editingId) {
        await API.put(`/complaints/${editingId}`, form);
        showToast("Complaint updated", "success");
      } else {
        await API.post("/complaints", form);
        showToast("Complaint submitted", "success");
      }

      setForm({ title: "", description: "" });
      setEditingId(null);
      fetchComplaints();
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      await API.delete(`/complaints/${id}`);
      showToast("Complaint deleted", "info");
      fetchComplaints();
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Failed to delete", "error");
    }
  };

  const handleEdit = (c) => {
    setForm({ title: c.title, description: c.description });
    setEditingId(c._id);
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "open").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Raise a complaint and track it through to resolution.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          {editingId ? "Edit complaint" : "Raise a complaint"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            className="border border-slate-200 p-2.5 w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border border-slate-200 p-2.5 w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shrink-0 transition-colors">
            {editingId ? (
              "Update"
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Submit
              </>
            )}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 font-mono">
            {total}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <h2 className="mt-1 text-2xl font-semibold text-rose-600 font-mono">
            {pending}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <p className="text-xs font-medium text-slate-500">Resolved</p>
          <h2 className="mt-1 text-2xl font-semibold text-emerald-600 font-mono">
            {resolved}
          </h2>
        </div>
      </div>

      {/* List */}
      <h2 className="text-sm font-semibold text-slate-900 mb-4">
        My complaints
      </h2>

      {complaints.length > 0 ? (
        <div className="grid gap-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-semibold text-slate-900">{c.title}</h3>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses(c.status)}`}
                >
                  {c.status}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {c.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(c)}
                  className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="inline-flex items-center gap-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <Inbox className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm text-slate-500">No complaints found</p>
        </div>
      )}
    </div>
  );
};

export default Customer;
