import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Paths must exactly match routes defined in App.jsx.
// Unmatched paths hit the * catch-all which redirects to /login.
const NAV = {
  customer: [
    { label: "Dashboard", path: "/customer", icon: "🏠" },
    { label: "My Complaints", path: "/customer", icon: "📋" },
  ],
  agent: [
    { label: "Dashboard", path: "/agent", icon: "🏠" },
    { label: "Assigned Complaints", path: "/agent", icon: "📋" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "All Complaints", path: "/admin", icon: "📋" },
  ],
};

const PANEL_TITLES = {
  customer: "Customer Panel",
  agent: "Agent Panel",
  admin: "Admin Panel",
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
  const panelTitle = PANEL_TITLES[role] ?? "Panel";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        {/* Panel title */}
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">{panelTitle}</h2>
          {user?.name && (
            <p className="text-sm text-gray-500 mt-1 truncate">{user.name}</p>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-5">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left flex items-center gap-3 px-3 py-2 rounded
                      transition-colors duration-150
                      ${
                        active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-5 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded text-red-500 hover:bg-red-50 transition-colors duration-150"
          >
            <span>🚪</span>
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
