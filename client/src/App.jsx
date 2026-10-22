import { Navigate, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Login from "./pages/Login.jsx";
import Information from "./pages/Information.jsx";
import VisaPdfView from "./pages/VisaPdfView.jsx";
import VerifyIdentity from "./pages/VerifyIdentity.jsx";
import AdminPage from "./pages/AdminPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/information" element={<Information />} />
      <Route path="/visa-record" element={<VisaPdfView />} />
      <Route path="/verify-identity" element={<VerifyIdentity />} />˙
      <Route path="/admin-page" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
