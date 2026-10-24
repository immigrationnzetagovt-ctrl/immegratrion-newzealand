import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, Loader2, Home, Menu, X } from "lucide-react";
import logo from "../assets/immegration.png";
import api from "../api/axios";

const initialForm = {
  familyName: "",
  passportNumber: "",
  documentNumber: "",
  dateOfBirth: "",
  gender: "",
  visaStartDate: "",
  consented: true,
};

export default function VerifyIdentity() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
  event.preventDefault();

  navigate("/information", { replace: true });
};

  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased select-none">
      {/* Top Header Bar matching VisaView */}
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
        <div className="text-white text-[12px] flex items-center gap-1.5">
          <span className="font-normal">Logged in:</span>
          <span className="font-semibold">Visa Verification Service</span>
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
        <span className="text-[#222222] font-bold shrink-0">Visa Verification Enquiry</span>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-[215px] bg-[#eef4f9] border-r border-[#cad8e6] pt-6 pr-4 pl-0 shrink-0 transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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

        {/* Right Content Form Area */}
        <main className="flex-1 pt-6 px-4 sm:pl-9 sm:pr-12 max-w-[950px] pb-16 overflow-x-hidden">
          {/* Top Info Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13px] mb-6 border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="font-normal text-[#333333]">Acting for:</span>{' '}
              <span className="font-bold text-[#222222]">Visa Verification Service</span>
            </div>
            <div className="text-[13px]">
              <span className="font-normal text-[#333333]">Logged in:</span>
            </div>
          </div>

          {/* Title and Instructions */}
          <div className="space-y-2 mb-6">
            <h1 className="text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-3">
              Visa Verification Enquiry
            </h1>
            <p className="text-[13px] font-normal text-[#222222]">
              Enter the details of the visa to be verified.
            </p>
            <p className="text-[13px] font-normal text-[#222222]">
              Please enter these details exactly as they appear in the visa holder's passport.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div role="alert" className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="underline font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* Form matching exact VisaView layout & font weights */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-[650px]">
            
            {/* Family Name */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="familyName" className="text-[13px] font-bold text-[#222222]">
                Family Name *
              </label>
              <div>
                <input
                  id="familyName"
                  name="familyName"
                  type="text"
                  value={form.familyName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  placeholder=""
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>
            </div>

            {/* Passport Number */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="passportNumber" className="text-[13px] font-bold text-[#222222]">
                Passport Number *
              </label>
              <div>
                <div className="relative">
                  <input
                    id="passportNumber"
                    name="passportNumber"
                    type="text"
                    value={form.passportNumber}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    placeholder=""
                    className="w-full h-[32px] px-2.5 pr-8 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] uppercase focus:border-[#003399]"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#222222] text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Document Number */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="documentNumber" className="text-[13px] font-bold text-[#222222]">
                Document Number *
              </label>
              <div>
                <input
                  id="documentNumber"
                  name="documentNumber"
                  type="text"
                  value={form.documentNumber}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  placeholder=""
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="dateOfBirth" className="text-[13px] font-bold text-[#222222]">
                Date of Birth *
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-[220px] h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
                <div className="h-[32px] px-2.5 bg-[#f0f0f0] border border-[#7f9db9] rounded-[2px] flex items-center justify-center cursor-pointer text-[#444] hover:bg-[#e4e4e4]">
                  📅
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="gender" className="text-[13px] font-bold text-[#222222]">
                Gender *
              </label>
              <div>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px]"
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Visa Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start sm:items-center gap-1 sm:gap-4">
              <label htmlFor="visaStartDate" className="text-[13px] font-bold text-[#222222] leading-tight">
                Visa Start Date <br />
                <span className="font-normal text-[12px]">(dd/mm/yyyy)</span> *
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="visaStartDate"
                  name="visaStartDate"
                  type="date"
                  value={form.visaStartDate}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-[220px] h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] font-normal text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
                <div className="h-[32px] px-2.5 bg-[#f0f0f0] border border-[#7f9db9] rounded-[2px] flex items-center justify-center cursor-pointer text-[#444] hover:bg-[#e4e4e4]">
                  📅
                </div>
              </div>
            </div>

            {/* Checkbox Consent */}
            <div className="pt-2 sm:pl-[180px]">
              <label className="flex items-start gap-2.5 cursor-pointer text-[13px] font-normal text-[#222222]">
                <input
                  type="checkbox"
                  name="consented"
                  checked={form.consented}
                  onChange={handleChange}
                  className="mt-0.5 rounded-[2px] border-[#7f9db9] text-[#005ba9] focus:ring-0 w-4 h-4 shrink-0"
                />
                <span>The visa holder has consented to this check.</span>
              </label>
            </div>

            {/* Submit Button matching reference style */}
            <div className="pt-4 sm:pl-[180px]">
              <button
                type="submit"
                disabled={loading}
                id="check-visa-btn"
                className="px-5 py-2.5 sm:py-2 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Record...</span>
                  </>
                ) : (
                  <span>Check Visa</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
  