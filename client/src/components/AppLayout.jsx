import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Users,
  History,
  LogOut,
  Menu,
} from "lucide-react";

// NAV structure using query parameters to showcase different methods/tabs
const NAV = {
  customer: [
    { label: "Overview", path: "/customer?view=overview", icon: LayoutDashboard },
    { label: "My Complaints", path: "/customer?view=my-complaints", icon: ClipboardList },
    { label: "Raise Complaint", path: "/customer?view=raise-complaint", icon: PlusCircle },
  ],
  agent: [
    { label: "Overview", path: "/agent?view=overview", icon: LayoutDashboard },
    { label: "Assigned Cases", path: "/agent?view=assigned-complaints", icon: ClipboardList },
    { label: "Resolved Archives", path: "/agent?view=resolved-archives", icon: History },
  ],
  admin: [
    { label: "Overview", path: "/admin?view=overview", icon: LayoutDashboard },
    { label: "All Complaints", path: "/admin?view=all-complaints", icon: ClipboardList },
    { label: "Manage Agents", path: "/admin?view=manage-agents", icon: Users },
  ],
};

const PANEL_TITLES = {
  customer: "Customer Panel",
  agent: "Agent Support Panel",
  admin: "Administrator Portal",
};

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const role = user?.role;
  const navItems = NAV[role] ?? [];
  const panelTitle = (PANEL_TITLES[role] ?? "Panel").toUpperCase();

  const isTabActive = (itemPath) => {
    const currentPath = location.pathname + location.search;
    
    // If exact match
    if (currentPath === itemPath) return true;
    
    // Default fallback to "overview" if no query parameter is provided
    if (
      itemPath.includes("view=overview") &&
      location.search === "" &&
      location.pathname === itemPath.split("?")[0]
    ) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col
          transform transition-transform duration-300 ease-in-out border-r border-slate-800
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        {/* Panel title & Logo */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/45">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
              <svg
                className="h-5 w-5 text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="min-w-0">
              {role === "admin" && (
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">
                  ADMIN PORTAL
                </span>
              )}
              {role === "agent" && (
                <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase whitespace-nowrap">
                  AGENT SUPPORTIVE PANEL
                </span>
              )}
              {user?.name && (
                <p
                  className={`font-extrabold text-white tracking-wide truncate max-w-[150px] ${
                    role === "customer" ? "text-base py-1" : "text-sm mt-0.5"
                  }`}
                  title={user.name.toUpperCase()}
                >
                  {user.name.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const active = isTabActive(item.path);
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-xl
                      transition-all duration-200 text-sm font-medium
                      ${
                        active
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }
                    `}
                  >
                    <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/10">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors duration-200 text-sm font-medium"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 text-2xl leading-none"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-bold text-gray-800">{panelTitle}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
