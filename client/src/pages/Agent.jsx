import { useEffect, useState } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Inbox } from "lucide-react";

const STATUS_STYLES = {
  open: "text-rose-600 bg-rose-50 ring-rose-200",
  "in-progress": "text-amber-600 bg-amber-50 ring-amber-200",
  escalated: "text-red-600 bg-red-50 ring-red-200",
  resolved: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  closed: "text-slate-600 bg-slate-100 ring-slate-200",
};

const Agent = () => {
  const [complaints, setComplaints] = useState([]);

  const { showToast } = useToast();

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints/assigned");
      setComplaints(data.complaints || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Failed to load complaints", "error");
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      showToast("Status updated", "success");
      fetchComplaints();
    } catch (err) {
      console.log(err);
      showToast(
        err.response?.data?.message || "Failed to update status",
        "error",
      );
    }
  };

  const getStatusColor = (status) =>
    STATUS_STYLES[status] || "text-slate-600 bg-slate-100 ring-slate-200";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Agent Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cases assigned to you, ready to work.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-2xl border border-slate-200 transition-shadow hover:shadow-md"
          >
            {/* Title + Status */}
            <div className="flex justify-between items-start gap-3">
              <h3 className="font-semibold text-slate-900">{c.title}</h3>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(c.status)}`}
              >
                {c.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {c.description}
            </p>

            {/* Customer info */}
            <p className="text-sm text-slate-600 mt-3">
              <span className="font-medium text-slate-700">Customer:</span>{" "}
              {c.customer?.name || "Unknown"}
            </p>

            {/* Status dropdown */}
            <div className="mt-4">
              <select
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Date */}
            <p className="text-xs text-slate-400 font-mono mt-3">
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {complaints.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <Inbox className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm text-slate-500">No assigned complaints</p>
        </div>
      )}
    </div>
  );
};

export default Agent;
