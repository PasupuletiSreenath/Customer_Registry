import { useEffect, useState } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { CheckCircle2, Inbox, UserPlus, X } from "lucide-react";

const STATUS_STYLES = {
  open: "text-rose-600 bg-rose-50 ring-rose-200",
  "in-progress": "text-amber-600 bg-amber-50 ring-amber-200",
  escalated: "text-red-600 bg-red-50 ring-red-200",
  resolved: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  closed: "text-slate-600 bg-slate-100 ring-slate-200",
};

const statusClasses = (status) =>
  STATUS_STYLES[status] || "text-slate-600 bg-slate-100 ring-slate-200";

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);

  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [creatingAgent, setCreatingAgent] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const { data: cData } = await API.get("/complaints");
      const { data: uData } = await API.get("/users?role=agent");

      setComplaints(cData.complaints || cData);
      setAgents(uData.users || uData);
    } catch (err) {
      console.log(err);
      showToast("Failed to load data", "error");
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

      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? data.complaint : c)),
      );

      showToast("Agent assigned successfully", "success");
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast(err.response?.data?.message || "Assignment failed", "error");
    }
  };

  const closeAgentModal = () => {
    setShowAgentModal(false);
    setAgentForm({ name: "", email: "", password: "" });
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();

    if (!agentForm.name || !agentForm.email || !agentForm.password) {
      return showToast("All fields are required", "warning");
    }

    setCreatingAgent(true);

    try {
      await API.post("/users/agent", agentForm);
      showToast("Agent created", "success");
      closeAgentModal();
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast(
        err.response?.data?.message || "Failed to create agent",
        "error",
      );
    } finally {
      setCreatingAgent(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Assign incoming complaints to the right agent.
          </p>
        </div>

        <button
          onClick={() => setShowAgentModal(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Add Agent
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-2xl border border-slate-200 transition-shadow hover:shadow-md"
          >
            {/* Title */}
            <h3 className="font-semibold text-slate-900">{c.title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {c.description}
            </p>

            {/* Status */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses(c.status)}`}
              >
                {c.status}
              </span>
            </div>

            {/* Assign section */}
            <div className="mt-4">
              {c.assignedAgent ? (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 px-3 py-2 rounded-lg text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
                  Assigned to {c.assignedAgent.name}
                </div>
              ) : (
                <select
                  onChange={(e) => handleAssign(c._id, e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Assign agent
                  </option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              )}
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
          <p className="text-sm text-slate-500">No complaints found</p>
        </div>
      )}

      {/* Add Agent modal */}
      {showAgentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          onClick={closeAgentModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6"
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Add agent
              </h2>
              <button
                onClick={closeAgentModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              Create login credentials for a new support agent.
            </p>

            <form onSubmit={handleCreateAgent} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Name
                </label>
                <input
                  className="border border-slate-200 p-2.5 w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Agent's full name"
                  value={agentForm.name}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-slate-200 p-2.5 w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="agent@company.com"
                  value={agentForm.email}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Temporary password
                </label>
                <input
                  type="text"
                  className="border border-slate-200 p-2.5 w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Share this with the agent securely"
                  value={agentForm.password}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, password: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={closeAgentModal}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingAgent}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  {creatingAgent ? "Creating..." : "Create agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
