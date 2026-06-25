import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-4 flex gap-3">
        <Link
          to="/customer"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Customer
        </Link>
        <Link to="/agent" className="bg-green-500 text-white px-4 py-2 rounded">
          Agent
        </Link>
        <Link
          to="/admin"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Admin
        </Link>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
