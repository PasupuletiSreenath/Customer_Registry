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
  ChevronDown,
  User,
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
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
          <button 
            onClick={() => navigate(`/${user?.role || ''}`)}
            className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity focus:outline-none"
          >
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
          </button>
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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top header (Desktop & Mobile) */}
        <header className="flex-shrink-0 flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100 px-4 py-3 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 text-2xl leading-none md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
            <span className="font-bold text-gray-800 md:hidden">{panelTitle}</span>
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-xl transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
