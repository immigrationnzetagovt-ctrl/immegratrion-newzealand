import { Navigate, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import FrontendLogin from "./pages/FrontendLogin.jsx";
import Login from "./pages/Login.jsx";
import Information from "./pages/Information.jsx";
import VisaPdfView from "./pages/VisaPdfView.jsx";
import VerifyIdentity from "./pages/VerifyIdentity.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<FrontendLogin />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login-account" element={<Login />} />

        {/* Protected Routes (Require Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/verify-identity" element={<VerifyIdentity />} />
          <Route path="/information" element={<Information />} />
          <Route path="/visa-record" element={<VisaPdfView />} />
          <Route path="/admin-page" element={<AdminPage />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
