import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

const API_URL = "http://localhost:5000/api/users/me";

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "", 
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.put(API_URL, formData, config);
      updateUser(data.user);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`${API_URL}/password`, passwordData, config);
      
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <User className="w-4 h-4" /> },
    { id: "address", label: "Address", icon: <MapPin className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile information and security preferences.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        {/* User Card Header */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 relative z-10">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 p-1 shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-indigo-600 font-black text-4xl border-2 border-white">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider text-xs font-bold border border-indigo-100">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row relative z-10 min-h-[400px]">
          {/* Vertical Tabs (Desktop) / Horizontal (Mobile) */}
          <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-100 p-4 sm:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60 ring-1 ring-indigo-500/10"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-6 sm:p-10 bg-white">
            
            {/* PERSONAL INFO TAB */}
            {activeTab === "personal" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                  <p className="text-sm text-slate-500">Update your contact details and how we can reach you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleProfileChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-xs font-normal text-slate-400">(read-only)</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed shadow-inner"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleProfileChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-xl hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Mailing Address</h3>
                  <p className="text-sm text-slate-500">Provide your address for correspondence and on-site support.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Address</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleProfileChange}
                      rows="4"
                      placeholder="123 Main Street, Suite 4B..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30 resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-xl hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Save Address
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* SECURITY / PASSWORD TAB */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
                  <p className="text-sm text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <div className="space-y-5 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        minLength={6}
                        placeholder="Min. 6 characters"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        minLength={6}
                        placeholder="Repeat new password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm bg-slate-50/30"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex max-w-lg justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-xl hover:shadow-rose-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
