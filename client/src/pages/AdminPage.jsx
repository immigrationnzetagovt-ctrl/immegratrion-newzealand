import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Menu, 
  X, 
  ShieldAlert, 
  RefreshCw, 
  LogOut, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  UserCheck, 
  User, 
  FileText 
} from "lucide-react";
import api from "../api/axios";
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
  const [dialog, setDialog] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewProfileUser, setViewProfileUser] = useState(null); // For viewing full applicant profile popup
  const [editForm, setEditForm] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const applicantFields = [
    ["familyName", "Family Name", "text"],
    ["email", "Email", "email"],
    ["passportNumber", "Passport Number", "text"],
    ["documentNumber", "Document Number", "text"],
    ["dateOfBirth", "Date of Birth", "date"],
    ["gender", "Gender", "select", ["Male", "Female", "Other", "Prefer not to say"]],
    ["nationality", "Nationality (2-letter country code)", "text"],
    ["visaCategory", "Visa Category", "select", ["Visitor", "Student", "Work", "Business", "Transit"]],
    ["visaIssueDate", "Visa Issue Date", "date"],
    ["visaStartDate", "Visa Start Date", "date"],
    ["visaExpiryDate", "Visa Expiry Date", "date"],
    ["firstEntryDate", "First Entry Date", "date"],
    ["tnzClientNumber", "TNZ Client Number", "text"],
    ["numberOfEntries", "Number of Entries", "select", ["Single", "Multiple"]],
    ["travelExpiryDate", "Travel Expiry Date", "date"],
    ["applicationNumber", "Application Number", "text"],
    ["visaConditions", "Visa Conditions", "textarea"],
    ["identityVerified", "Identity Verification Status", "select", ["true", "false"]],
  ];

  const handleCopy = (text, label) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(String(text));
    setToastMessage(`Copied ${label || "field"}: ${text}`);
    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", {
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

  const logout = useCallback(() => {
    setToken("");
    setUsers([]);
    setAdminId("");
    setPassword("");
    setDialog("");
    setSelectedUser(null);
    setViewProfileUser(null);
    setNewPassword("");
    setConfirmNewPassword("");
    sessionStorage.removeItem("adminToken");
  }, []);

  const fetchUsers = useCallback(async (adminTokenOverride) => {
    const activeToken = adminTokenOverride || token || sessionStorage.getItem("adminToken");
    if (!activeToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/users", {
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
  }, [logout, token]);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [fetchUsers, token]);

  const closeDialog = () => {
    setError("");
    setDialog("");
    setSelectedUser(null);
    setEditForm({});
    setNewPassword("");
    setConfirmNewPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const reportActionError = (err, fallback) => {
    const validationErrors = err.response?.data?.errors;
    const message = Array.isArray(validationErrors)
      ? `${err.response?.data?.message || fallback}: ${validationErrors
          .map(({ field, message: fieldMessage }) => `${field}: ${fieldMessage}`)
          .join("; ")}`
      : err.response?.data?.message || fallback;
    if (err.response?.status === 401 || err.response?.status === 403) {
      logout();
    }
    setError(message);
    setNotice("");
  };

  const openEditDialog = (user) => {
    setError("");
    setNotice("");
    setSelectedUser(user);
    setEditForm(
      Object.fromEntries(
        applicantFields.map(([field]) => {
          const value = user[field];
          return [
            field,
            field.endsWith("Date") || field === "dateOfBirth"
              ? value
                ? String(value).slice(0, 10)
                : ""
              : field === "identityVerified"
                ? value === true
                  ? "true"
                  : "false"
                : value ?? "",
          ];
        })
      )
    );
    setDialog("edit");
  };

  const openResetDialog = (user) => {
    setError("");
    setNotice("");
    setSelectedUser(user);
    setNewPassword("");
    setConfirmNewPassword("");
    setDialog("reset");
  };

  const saveApplicant = async (event) => {
    event.preventDefault();
    if (!selectedUser || actionLoading) return;

    setActionLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await api.put(
        `/admin/users/${selectedUser._id}`,
        {
          ...editForm,
          nationality: String(editForm.nationality).toUpperCase(),
          identityVerified: editForm.identityVerified === "true",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === selectedUser._id ? response.data.user : user
        )
      );
      setNotice("Applicant information updated successfully.");
      closeDialog();
    } catch (err) {
      reportActionError(err, "Unable to update applicant.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteApplicant = async (user) => {
    const displayName = `${user.familyName || "Applicant"} (${user.email})`;
    if (
      !window.confirm(
        `Permanently delete ${displayName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    setActionLoading(true);
    try {
      await api.delete(`/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser._id !== user._id)
      );
      setNotice(`${displayName} was deleted successfully.`);
    } catch (err) {
      reportActionError(err, "Unable to delete applicant.");
    } finally {
      setActionLoading(false);
    }
  };

  const resetApplicantPassword = async (event) => {
    event.preventDefault();
    if (!selectedUser || actionLoading) return;
    if (newPassword !== confirmNewPassword) {
      setError("The new password and confirmation do not match.");
      setNotice("");
      return;
    }
    if (newPassword.length === 0) {
      setError("Enter a new password.");
      setNotice("");
      return;
    }

    setActionLoading(true);
    setError("");
    setNotice("");
    try {
      await api.patch(
        `/admin/users/${selectedUser._id}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotice(`Password reset successfully for ${selectedUser.email}.`);
      closeDialog();
    } catch (err) {
      reportActionError(err, "Unable to reset applicant password.");
    } finally {
      setActionLoading(false);
    }
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
      <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] flex flex-col antialiased">
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
              {notice && (
                <div role="status" className="p-3 mb-6 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xs">
                  {notice}
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
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased relative">
      
      {/* Floating Copy Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003399] text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2 border border-blue-400 animate-bounce">
          <Check className="w-4 h-4 text-green-300" />
          <span>{toastMessage}</span>
        </div>
      )}

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
        <main className="flex-1 pt-6 px-4 sm:pl-9 sm:pr-12 max-w-[1450px] pb-16 overflow-x-hidden">
          
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
              Review, search, and manage registered visa applicant records. Click any cell to instantly copy text.
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

          {notice && (
            <div role="status" className="p-3 mb-6 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xs">
              {notice}
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
          <div className="bg-[#f9fafc] border border-[#cad8e6] p-4 rounded-[2px] mb-6 max-w-[1350px]">
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
                    <th className="text-center py-2.5 px-3 font-bold uppercase tracking-wider text-[11px] w-[110px]">
                      Profile
                    </th>
                    {visibleFields.map((field) => (
                      <th key={field} className="text-left py-2.5 px-3 font-bold uppercase tracking-wider text-[11px]">
                        {field.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                    <th className="text-left py-2.5 px-3 font-bold uppercase tracking-wider text-[11px]">
                      Management Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id || user.id || index} 
                      className="border-b border-[#e2e8f0] hover:bg-[#f4f7fa] transition-colors group"
                    >
                      {/* View Profile Button */}
                      <td className="py-2 px-3 text-center border-r border-[#edf0f5]">
                        <button
                          type="button"
                          onClick={() => setViewProfileUser(user)}
                          className="px-2.5 py-1 bg-[#005ba4] hover:bg-[#004a87] text-white text-[11px] font-bold rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>

                      {visibleFields.map((field) => {
                        const cellVal = formatValue(user[field]);
                        return (
                          <td 
                            key={field} 
                            onClick={() => handleCopy(cellVal, field.replace(/([A-Z])/g, " $1"))}
                            title="Click to copy value"
                            className="py-2.5 px-3 text-[#222222] max-w-[260px] truncate cursor-pointer hover:bg-[#e0ecf8] transition-colors relative group/cell"
                          >
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
                              <span className="flex items-center justify-between gap-2">
                                <span>{cellVal}</span>
                                {cellVal !== "—" && (
                                  <Copy className="w-3 h-3 text-[#003399] opacity-0 group-hover/cell:opacity-100 transition-opacity shrink-0" />
                                )}
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Management Action Buttons */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditDialog(user)}
                            disabled={actionLoading}
                            className="px-2 py-1 bg-[#005ba4] hover:bg-[#004a87] text-white text-[11px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteApplicant(user)}
                            disabled={actionLoading}
                            className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => openResetDialog(user)}
                            disabled={actionLoading}
                            className="px-2 py-1 bg-white border border-[#7f9db9] hover:bg-slate-50 text-[#003399] text-[11px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                          >
                            Reset PWD
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ================= USER DETAIL POPUP MODAL ================= */}
      {viewProfileUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#cad8e6] w-full max-w-[800px] rounded-[2px] shadow-2xl overflow-hidden my-8">
            
            <div className="bg-[#005aa9] px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-200" />
                <h2 className="text-[18px] font-bold tracking-tight">
                  Applicant Profile: {viewProfileUser.familyName || "Details"}
                </h2>
              </div>
              <button
                onClick={() => setViewProfileUser(null)}
                className="text-white hover:bg-[#004a87] p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#eef4f9] p-4 border border-[#cad8e6] rounded-[2px] gap-2">
                <div>
                  <p className="text-[11px] text-[#003399] font-bold uppercase tracking-wider">Account ID</p>
                  <p className="text-[13px] font-mono font-bold text-[#222222]">{viewProfileUser._id || viewProfileUser.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#555]">Verification Status:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-[2px] ${
                    viewProfileUser.identityVerified ? "bg-green-100 text-green-800 border border-green-300" : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}>
                    {viewProfileUser.identityVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-[#003399] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Personal & Passport Information (Click any to copy)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  {[
                    ["Family Name", viewProfileUser.familyName],
                    ["Email Address", viewProfileUser.email],
                    ["Passport Number", viewProfileUser.passportNumber],
                    ["Document Number", viewProfileUser.documentNumber],
                    ["Date of Birth", viewProfileUser.dateOfBirth],
                    ["Gender", viewProfileUser.gender],
                    ["Nationality", viewProfileUser.nationality],
                    ["INZ Client Number", viewProfileUser.tnzClientNumber],
                  ].map(([label, val]) => (
                    <div 
                      key={label}
                      onClick={() => handleCopy(val, label)}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px] flex justify-between items-center hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="block text-[11px] font-bold text-[#003399] uppercase">{label}</span>
                        <span className="text-[13px] text-[#222222] font-semibold">{formatValue(val)}</span>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-[#003399] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-[14px] font-bold text-[#003399] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Visa & Application Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  {[
                    ["Visa Category", viewProfileUser.visaCategory],
                    ["Visa Issue Date", viewProfileUser.visaIssueDate],
                    ["Visa Start Date", viewProfileUser.visaStartDate],
                    ["Visa Expiry Date", viewProfileUser.visaExpiryDate],
                    ["First Entry Date", viewProfileUser.firstEntryDate],
                    ["Number of Entries", viewProfileUser.numberOfEntries],
                    ["Travel Expiry Date", viewProfileUser.travelExpiryDate],
                    ["Application Number", viewProfileUser.applicationNumber],
                  ].map(([label, val]) => (
                    <div 
                      key={label}
                      onClick={() => handleCopy(val, label)}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px] flex justify-between items-center hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="block text-[11px] font-bold text-[#003399] uppercase">{label}</span>
                        <span className="text-[13px] text-[#222222] font-semibold">{formatValue(val)}</span>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-[#003399] shrink-0" />
                    </div>
                  ))}
                </div>

                {viewProfileUser.visaConditions && (
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-[#003399] uppercase mb-1">Visa Conditions (Click to copy)</span>
                    <div 
                      onClick={() => handleCopy(viewProfileUser.visaConditions, "Visa Conditions")}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-[2px] text-[12px] text-[#222222] leading-relaxed whitespace-pre-line cursor-pointer hover:bg-blue-50/50"
                    >
                      {viewProfileUser.visaConditions}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="bg-[#f4f6fa] border-t border-[#cad8e6] px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewProfileUser(null)}
                className="px-5 py-1.5 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT / RESET DIALOGS ================= */}
      {dialog && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="applicant-dialog-title"
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#cad8e6] rounded-[2px] shadow-lg"
          >
            <div className="sticky top-0 bg-[#dbe6f1] border-b border-[#cad8e6] px-5 py-3 flex items-center justify-between">
              <h2 id="applicant-dialog-title" className="text-[17px] font-bold text-[#003399]">
                {dialog === "edit" ? "Edit Applicant Information" : "Reset Applicant Password"}
              </h2>
              <button
                type="button"
                onClick={closeDialog}
                disabled={actionLoading}
                aria-label="Close dialog"
                className="text-[#003399] hover:text-[#004a87] disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <div role="alert" className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                {error}
              </div>
            )}

            {dialog === "edit" ? (
              <form onSubmit={saveApplicant} className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applicantFields.map(([field, label, type, options]) => (
                    <div key={field} className={type === "textarea" ? "sm:col-span-2" : ""}>
                      <label htmlFor={`edit-${field}`} className="block text-[13px] font-bold text-[#222222] mb-1">
                        {label}{field === "visaConditions" ? "" : " *"}
                      </label>
                      {type === "select" ? (
                        <select
                          id={`edit-${field}`}
                          value={editForm[field] ?? ""}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, [field]: event.target.value }))
                          }
                          required
                          className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                        >
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {field === "identityVerified"
                                ? option === "true"
                                  ? "Verified"
                                  : "Pending"
                                : option}
                            </option>
                          ))}
                        </select>
                      ) : type === "textarea" ? (
                        <textarea
                          id={`edit-${field}`}
                          value={editForm[field] ?? ""}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, [field]: event.target.value }))
                          }
                          maxLength={10000}
                          className="w-full min-h-20 p-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                        />
                      ) : (
                        <input
                          id={`edit-${field}`}
                          type={type}
                          value={editForm[field] ?? ""}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, [field]: event.target.value }))
                          }
                          required
                          className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-white border border-[#7f9db9] hover:bg-slate-50 text-[#003399] text-[13px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={resetApplicantPassword} className="p-5 max-w-xl">
                <p className="mb-4 text-[13px] text-[#222222]">
                  Set a new password for {selectedUser.familyName} ({selectedUser.email}).
                </p>
                {[
                  ["new-password", "New Password", newPassword, setNewPassword, showNewPassword, setShowNewPassword],
                  ["confirm-new-password", "Confirm New Password", confirmNewPassword, setConfirmNewPassword, showConfirmPassword, setShowConfirmPassword],
                ].map(([id, label, value, setValue, visible, setVisible]) => (
                  <div key={id} className="mb-4">
                    <label htmlFor={id} className="block text-[13px] font-bold text-[#222222] mb-1">
                      {label} *
                    </label>
                    <div className="relative">
                      <input
                        id={id}
                        type={visible ? "text" : "password"}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        autoComplete="new-password"
                        required
                        className="w-full h-[32px] px-2.5 pr-10 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                      />
                      <button
                        type="button"
                        onClick={() => setVisible((current) => !current)}
                        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                        className="absolute inset-y-0 right-0 px-2.5 text-[#003399] cursor-pointer"
                      >
                        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-white border border-[#7f9db9] hover:bg-slate-50 text-[#003399] text-[13px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
