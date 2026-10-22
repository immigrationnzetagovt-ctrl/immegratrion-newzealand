import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Menu, X, ShieldAlert, RefreshCw, LogOut, Search, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "../assets/immegration.png";

export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => sessionStorage.getItem("adminToken") || "");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSensitive, setShowSensitive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Base URL matching your backend setup
  const ADMIN_API_BASE = "http://localhost:5001/api/admin";

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${ADMIN_API_BASE}/login`, {
        adminId,
        password,
      });
      const adminToken = response.data.token;
      if (!adminToken) {
        throw new Error("Admin token was not returned by the server.");
      }
      
      sessionStorage.setItem("adminToken", adminToken);
      setToken(adminToken);
      setPassword("");

      await fetchUsers(adminToken);
    } catch (err) {
      setToken("");
      setUsers([]);
      sessionStorage.removeItem("adminToken");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (adminTokenOverride) => {
    const activeToken = adminTokenOverride || token;
    if (!activeToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${ADMIN_API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch users. Please log in again."
      );
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUsers([]);
    setAdminId("");
    setPassword("");
    sessionStorage.removeItem("adminToken");
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .filter((value) => value !== null && typeof value !== "object")
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const excludedFields = [
    "__v",
    "password",
    "passwordHash",
    "resetPasswordToken",
    "verificationToken",
  ];

  const allFields = [
    ...new Set(
      filteredUsers.flatMap((user) =>
        Object.keys(user).filter((key) => !excludedFields.includes(key))
      )
    ),
  ];

  const sensitiveFields = [
    "passportNumber",
    "documentNumber",
    "dateOfBirth",
    "visaStartDate",
  ];

  const visibleFields = allFields.filter(
    (field) => showSensitive || !sensitiveFields.includes(field)
  );

  // If not logged in, render themed Admin Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] flex flex-col antialiased select-none">
        <header className="bg-[#005aa9] h-[70px] sm:h-[86px] px-4 sm:px-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Immigration New Zealand"
              className="h-10 sm:h-[52px] object-contain brightness-0 invert"
            />
          </div>
          <div className="text-white text-[12px] flex items-center gap-1.5">
            <span className="font-normal">Private Administration</span>
          </div>
        </header>

        <div className="bg-[#dbe6f1] h-[34px] px-4 sm:px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4]">
          <span className="font-bold">Admin Login</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 bg-[#f4f6fa]">
          <div className="w-full max-w-[420px] bg-white border border-[#cad8e6] rounded-[2px] p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-[22px] font-normal text-[#003399] mb-1">Admin Portal</h1>
              <p className="text-[13px] text-[#222222]">Sign in with your administrator credentials.</p>
            </div>

            <form onSubmit={login} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                  Admin ID *
                </label>
                <input
                  type="email"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              {error && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard Layout matching VisaView Portal Theme
  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased select-none">
      
      {/* Top Header Bar */}
      <header className="bg-[#005aa9] h-[70px] sm:h-[86px] px-4 sm:px-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white p-1 hover:bg-[#004a87] rounded"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img
            src={logo}
            alt="Immigration New Zealand"
            className="h-10 sm:h-[52px] object-contain brightness-0 invert"
          />
        </div>
        <div className="text-white text-[12px] flex items-center gap-3">
          <span className="font-normal hidden sm:inline">Role: Administrator</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-[#004a87] hover:bg-[#003866] text-white px-3 py-1 rounded-[2px] font-medium border border-white/20 cursor-pointer text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-4 sm:px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4] overflow-x-auto whitespace-nowrap">
        <Link to="/" className="flex items-center gap-1 hover:underline text-[#003399] shrink-0 font-normal">
          <Home className="w-3.5 h-3.5 text-[#222222]" />
          <span>Home</span>
        </Link>
        <span className="text-[#333333]">&gt;</span>
        <span className="hover:underline cursor-pointer shrink-0 font-normal">VisaView</span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#222222] font-bold shrink-0">Private Administration Panel</span>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 relative">
        
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-[215px] bg-[#eef4f9] border-r border-[#cad8e6] pt-6 pr-4 pl-0 shrink-0 transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <h2 className="text-[17px] font-bold text-[#003399] mb-3 pl-4">VisaView</h2>
          <ul className="space-y-2 text-[13px] text-[#003399]">
            <li className="flex items-start gap-1.5 font-bold cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Applicant Records</span>
            </li>
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4 font-normal">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>System Health</span>
            </li>
          </ul>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}

        {/* Right Main Content Area */}
        <main className="flex-1 pt-6 px-4 sm:pl-9 sm:pr-12 max-w-[1400px] pb-16 overflow-x-hidden">
          
          {/* Top Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13px] mb-6 border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="font-normal text-[#333333]">Mode:</span>{" "}
              <span className="font-bold text-[#222222]">Full Administrative Database View</span>
            </div>
          </div>

          {/* Title and Overview */}
          <div className="space-y-1 mb-6">
            <h1 className="text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-2">
              Applicant Records Management
            </h1>
            <p className="text-[13px] font-normal text-[#222222]">
              Review, search, and manage registered visa applicant records and verification statuses.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div role="alert" className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-[850px]">
            {[
              ["Total Applicants", users.length],
              ["Identity Verified", users.filter((u) => u.identityVerified === true).length],
              ["Pending Verification", users.filter((u) => u.identityVerified !== true).length],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#eef4f9] border border-[#cad8e6] p-4 rounded-[2px]">
                <p className="text-[12px] font-bold text-[#003399] uppercase tracking-wide">{label}</p>
                <p className="text-[24px] font-normal text-[#222222] mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="bg-[#f9fafc] border border-[#cad8e6] p-4 rounded-[2px] mb-6 max-w-[1300px]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-[350px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-[32px] pl-9 pr-3 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowSensitive((current) => !current)}
                  className="px-4 py-1.5 bg-white border border-[#7f9db9] hover:bg-slate-50 text-[#003399] text-[13px] font-bold rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showSensitive ? "Hide Sensitive Fields" : "Show Sensitive Fields"}</span>
                </button>

                <button
                  onClick={() => fetchUsers()}
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          {loading && users.length === 0 ? (
            <div className="py-12 flex items-center justify-center gap-3 text-[#003399]">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">Loading applicant records...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-[#f9fafc] border border-[#cad8e6] p-8 text-center text-[#555] rounded-[2px]">
              No applicant records found matching your search criteria.
            </div>
          ) : (
            <div className="border border-[#cad8e6] overflow-x-auto rounded-[2px] bg-white shadow-xs">
              <table className="w-full border-collapse text-[12px] whitespace-nowrap">
                <thead>
                  <tr className="bg-[#dbe6f1] text-[#003399] border-b border-[#cad8e6]">
                    {visibleFields.map((field) => (
                      <th key={field} className="text-left py-2.5 px-3 font-bold uppercase tracking-wider text-[11px]">
                        {field.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id || user.id || index} 
                      className="border-b border-[#e2e8f0] hover:bg-[#f4f7fa] transition-colors"
                    >
                      {visibleFields.map((field) => (
                        <td key={field} className="py-2.5 px-3 text-[#222222] max-w-[260px] truncate">
                          {field === "identityVerified" ? (
                            <span
                              style={{
                                color: user[field] ? "#15803d" : "#b45309",
                                fontWeight: "bold",
                              }}
                            >
                              {user[field] ? "Verified" : "Pending"}
                            </span>
                          ) : (
                            formatValue(user[field])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
