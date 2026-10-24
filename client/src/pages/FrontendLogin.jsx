import { useState } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Home, Menu, X, AlertCircle, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/immegration.png";

export default function FrontendLogin() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const success = login(email.trim(), password);
    if (success) {
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } else {
      setError("Invalid email address or password. Please check your credentials.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased select-none">
      
      {/* Official Top Header Bar */}
      <header className="bg-[#005aa9] h-[70px] sm:h-[86px] px-4 sm:px-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white p-1 hover:bg-[#004a87] rounded"
            aria-label="Toggle Navigation Sidebar"
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
          <span>Need an account?</span>
          <Link
            to="/create-account"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-[2px] font-bold border border-white/30 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Official Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-4 sm:px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4] overflow-x-auto whitespace-nowrap">
        <Link to="/" className="flex items-center gap-1 hover:underline text-[#003399] shrink-0 font-normal">
          <Home className="w-3.5 h-3.5 text-[#222222]" />
          <span>Home</span>
        </Link>
        <span className="text-[#333333]">&gt;</span>
        <span className="hover:underline cursor-pointer shrink-0 font-normal">VisaView</span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#222222] font-bold shrink-0">Login</span>
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
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4 font-normal">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Register Organisation</span>
            </li>
            <li className="flex items-start gap-1.5 font-bold cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Verify Visa Record</span>
            </li>
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4 font-normal">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>My Visa Verification Service Account</span>
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

        {/* Right Main Content Form Area */}
        <main className="flex-1 pt-6 px-4 sm:pl-9 sm:pr-12 max-w-[950px] pb-16 overflow-x-hidden">
          
          {/* Top Status Subhead */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13px] mb-6 border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="font-normal text-[#333333]">Acting for:</span>{" "}
              <span className="font-bold text-[#222222]">Visa Verification Service</span>
            </div>
            <div className="text-[12px] text-[#666]">
              <span>Official Government Identity Portal</span>
            </div>
          </div>

          {/* Page Heading and Official Context */}
          <div className="space-y-2 mb-6">
            <h1 className="text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-3">
              Sign in to VisaView
            </h1>
            <p className="text-[13px] font-normal text-[#222222]">
              Please enter your registered account credentials to access online visa verification services.
            </p>
          </div>

          {/* Error Notice Box */}
          {error && (
            <div role="alert" className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs max-w-[600px]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="underline font-bold cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* Official 2-Column Form Layout */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-[600px]" noValidate>
            
            {/* Email Field */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="email" className="text-[13px] font-bold text-[#222222]">
                Email address *
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  required
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="password" className="text-[13px] font-bold text-[#222222]">
                Password *
              </label>
              <div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>
            </div>

            {/* Action Buttons & Links */}
            <div className="pt-4 sm:pl-[180px] space-y-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors shadow-xs cursor-pointer inline-block"
              >
                Log In
              </button>

              <div className="pt-2 text-[12px] text-[#003399] space-y-1">
                <div>
                  <a href="#forgot-password" className="hover:underline">
                    Forgotten your password or account details?
                  </a>
                </div>
                <div>
                  <Link to="/create-account" className="hover:underline font-bold">
                    Need a Visa Verification Service account? Register here.
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {/* Security & Authenticity Banner */}
          <div className="mt-12 max-w-[600px] border border-[#cad8e6] bg-[#eef4f9] p-4 rounded-[2px] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#003399] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#222222] space-y-1">
              <span className="font-bold text-[#003399]">Official Government Security Notice</span>
              <p className="text-[11px] text-[#444] leading-relaxed">
                By logging in, you agree that you are authorized to access this official service and that all queries conducted comply with the Privacy Act 2020.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
