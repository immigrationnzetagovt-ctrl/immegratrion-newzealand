import { useState, useEffect } from "react";
import axios from "axios"; // Use native axios to bypass custom user interceptors

export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => sessionStorage.getItem("adminToken") || "");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSensitive, setShowSensitive] = useState(false);

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
      // Use native axios.post
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
      // Use native axios.get with explicit headers, completely bypassing user interceptors
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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f6fa",
      padding: "32px 20px",
      color: "#172033",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "1500px",
      margin: "0 auto",
    },
    card: {
      background: "#fff",
      padding: "32px",
      borderRadius: "14px",
      border: "1px solid #e3e8ef",
      boxShadow: "0 8px 30px rgba(15, 23, 42, 0.05)",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "12px 14px",
      border: "1px solid #d5dce7",
      borderRadius: "8px",
      fontSize: "14px",
      marginTop: "7px",
      outline: "none",
    },
    button: {
      padding: "12px 18px",
      border: "none",
      borderRadius: "8px",
      background: "#174ea6",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    },
    muted: {
      color: "#64748b",
      fontSize: "13px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
      whiteSpace: "nowrap",
    },
    th: {
      textAlign: "left",
      padding: "13px 15px",
      background: "#f1f5f9",
      borderBottom: "1px solid #e2e8f0",
      color: "#334155",
    },
    td: {
      padding: "13px 15px",
      borderBottom: "1px solid #edf0f5",
      maxWidth: "260px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, maxWidth: "430px", paddingTop: "7vh" }}>
          <div style={{ marginBottom: "26px" }}>
            <p style={{ ...styles.muted, letterSpacing: "2px" }}>
              PRIVATE ADMINISTRATION
            </p>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
              Admin Portal
            </h1>
            <p style={styles.muted}>Sign in with your administrator credentials.</p>
          </div>
          <form onSubmit={login} style={styles.card}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Admin ID
              <input
                style={styles.input}
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label
              style={{
                display: "block",
                marginTop: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Password
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && (
              <p style={{ color: "#b91c1c", fontSize: "13px", marginTop: "16px" }}>
                {error}
              </p>
            )}
            <button
              style={{ ...styles.button, width: "100%", marginTop: "24px" }}
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <div>
            <p style={{ ...styles.muted, letterSpacing: "2px" }}>
              PRIVATE ADMINISTRATION
            </p>
            <h1 style={{ fontSize: "30px", margin: "8px 0" }}>
              Applicant Records
            </h1>
            <p style={styles.muted}>
              Manage and review registered applicant information.
            </p>
          </div>
          <button onClick={logout} style={styles.button}>
            Log Out
          </button>
        </header>
        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            ["Total Applicants", users.length],
            [
              "Identity Verified",
              users.filter((user) => user.identityVerified === true).length,
            ],
            [
              "Pending Verification",
              users.filter((user) => user.identityVerified !== true).length,
            ],
          ].map(([label, value]) => (
            <div key={label} style={{ ...styles.card, padding: "22px" }}>
              <p style={styles.muted}>{label}</p>
              <h2 style={{ fontSize: "28px", margin: "8px 0 0" }}>
                {value}
              </h2>
            </div>
          ))}
        </section>
        <section style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 7px", fontSize: "20px" }}>
                All Applicants
              </h2>
              <p style={styles.muted}>
                {filteredUsers.length} records found
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowSensitive((current) => !current)}
                style={{
                  ...styles.button,
                  background: "#475569",
                }}
              >
                {showSensitive ? "Hide Sensitive Fields" : "Show Sensitive Fields"}
              </button>
              <button
                onClick={() => fetchUsers()}
                style={styles.button}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
          <input
            style={{ ...styles.input, marginBottom: "20px", maxWidth: "450px" }}
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading && users.length === 0 ? (
            <p>Loading applicant records...</p>
          ) : filteredUsers.length === 0 ? (
            <p style={styles.muted}>No applicant records found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {visibleFields.map((field) => (
                      <th key={field} style={styles.th}>
                        {field.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      {visibleFields.map((field) => (
                        <td key={field} style={styles.td}>
                          {field === "identityVerified" ? (
                            <span
                              style={{
                                color: user[field] ? "#15803d" : "#b45309",
                                fontWeight: "600",
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
        </section>
      </main>
    </div>
  );
}
