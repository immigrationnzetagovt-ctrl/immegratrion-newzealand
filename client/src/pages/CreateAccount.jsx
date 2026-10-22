import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, AlertCircle, Home, Menu, X } from "lucide-react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

import logo from "../assets/immegration.png";
import api from "../api/axios";

countries.registerLocale(en);

const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" })
)
  .map(([code, name]) => ({
    value: code,
    label: name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const initialForm = {
  familyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  passportNumber: "",
  documentNumber: "",
  dateOfBirth: "",
  gender: "Male",
  nationality: "",
  visaCategory: "Visitor",
  visaStartDate: "",
  visaExpiryDate: "",
  tnzClientNumber: "",
  numberOfEntries: "Single",
  travelExpiryDate: "",
  applicationNumber: "",
  visaConditions: "",
};

const visaOptions = [
  { value: "Visitor", label: "Visitor" },
  { value: "Student", label: "Student" },
  { value: "Work", label: "Work" },
  { value: "Business", label: "Business" },
  { value: "Transit", label: "Transit" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const entryOptions = [
  { value: "Single", label: "Single entry" },
  { value: "Multiple", label: "Multiple entries" },
];

export default function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Create Account | Immigration Demo Portal";
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "passportNumber" ? value.toUpperCase() : value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.passportNumber.startsWith("VV")) {
      setError('Passport number must start with "VV".');
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/users", form);
      setSuccess(
        response.data.message || "Demo account created successfully."
      );
      setForm(initialForm);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const data = err.response?.data;
      const message = Array.isArray(data?.errors)
        ? data.errors.map((item) => item.message).join(" ")
        : data?.message;
      setError(
        message ||
          "Could not create the account. Check your backend connection."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased select-none">
      {/* Top Header Bar */}
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
        <div className="text-white text-[12px] flex items-center gap-2">
          <span>Already have an account?</span>
          <Link to="/login" className="underline font-semibold hover:text-slate-200">
            Login
          </Link>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-4 sm:px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4] overflow-x-auto whitespace-nowrap">
        <Link to="/" className="flex items-center gap-1 hover:underline text-[#003399] shrink-0">
          <Home className="w-3.5 h-3.5 text-[#222222]" />
          <span>Home</span>
        </Link>
        <span className="text-[#333333]">&gt;</span>
        <span className="hover:underline cursor-pointer shrink-0">VisaView</span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#222222] font-bold shrink-0">Create Demo Account</span>
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
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Register Organisation</span>
            </li>
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Verify Visa Record</span>
            </li>
            <li className="flex items-start gap-1.5 font-bold cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Create Demo Account</span>
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
          {/* Title and Instructions */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl sm:text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-3">
              Create your demo account
            </h1>
            <p className="text-[13px] text-[#222222]">
              Complete the fields below. Your demo information will be submitted together in one request.
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

          {/* Success Banner */}
          {success && (
            <div role="status" className="p-3 mb-4 bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2 rounded-xs">
              <span>{success}</span>
            </div>
          )}

          {/* Form matching official portal layout */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-[700px]" noValidate>
            
            {/* Section 1: Account Details */}
            <div className="space-y-3 border-b border-slate-200 pb-5">
              <h2 className="text-[15px] font-bold text-[#003399]">1. Account details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="familyName" className="text-[13px] text-[#222222]">Family name *</label>
                <input
                  id="familyName"
                  name="familyName"
                  type="text"
                  value={form.familyName}
                  onChange={handleChange}
                  placeholder="Enter family name"
                  autoComplete="family-name"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="email" className="text-[13px] text-[#222222]">Email address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="password" className="text-[13px] text-[#222222]">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 12 characters"
                  autoComplete="new-password"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="confirmPassword" className="text-[13px] text-[#222222]">Confirm password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>
            </div>

            {/* Section 2: Personal & Passport Details */}
            <div className="space-y-3 border-b border-slate-200 pb-5">
              <h2 className="text-[15px] font-bold text-[#003399]">2. Personal & passport details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="passportNumber" className="text-[13px] text-[#222222]">Passport number *</label>
                <input
                  id="passportNumber"
                  name="passportNumber"
                  type="text"
                  value={form.passportNumber}
                  onChange={handleChange}
                  placeholder="VVDEMO12345"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] uppercase focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="documentNumber" className="text-[13px] text-[#222222]">Document number *</label>
                <input
                  id="documentNumber"
                  name="documentNumber"
                  type="text"
                  value={form.documentNumber}
                  onChange={handleChange}
                  placeholder="Enter document number"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="dateOfBirth" className="text-[13px] text-[#222222]">Date of birth *</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="gender" className="text-[13px] text-[#222222]">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  {genderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="nationality" className="text-[13px] text-[#222222]">Passport nationality *</label>
                <select
                  id="nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  <option value="">Select country</option>
                  {countryOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 3: Visa Details */}
            <div className="space-y-3 pb-4">
              <h2 className="text-[15px] font-bold text-[#003399]">3. Visa details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="visaCategory" className="text-[13px] text-[#222222]">Visa category *</label>
                <select
                  id="visaCategory"
                  name="visaCategory"
                  value={form.visaCategory}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  {visaOptions.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="visaStartDate" className="text-[13px] text-[#222222]">Visa start date *</label>
                <input
                  id="visaStartDate"
                  name="visaStartDate"
                  type="date"
                  value={form.visaStartDate}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="visaExpiryDate" className="text-[13px] text-[#222222]">Visa expiry date *</label>
                <input
                  id="visaExpiryDate"
                  name="visaExpiryDate"
                  type="date"
                  value={form.visaExpiryDate}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="tnzClientNumber" className="text-[13px] text-[#222222]">TNZ client number</label>
                <input
                  id="tnzClientNumber"
                  name="tnzClientNumber"
                  type="text"
                  value={form.tnzClientNumber}
                  onChange={handleChange}
                  placeholder="Enter demo client number"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="numberOfEntries" className="text-[13px] text-[#222222]">Number of entries *</label>
                <select
                  id="numberOfEntries"
                  name="numberOfEntries"
                  value={form.numberOfEntries}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  {entryOptions.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="travelExpiryDate" className="text-[13px] text-[#222222]">Travel expiry date *</label>
                <input
                  id="travelExpiryDate"
                  name="travelExpiryDate"
                  type="date"
                  value={form.travelExpiryDate}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-1 sm:gap-4">
                <label htmlFor="applicationNumber" className="text-[13px] text-[#222222]">Application number</label>
                <input
                  id="applicationNumber"
                  name="applicationNumber"
                  type="text"
                  value={form.applicationNumber}
                  onChange={handleChange}
                  placeholder="APP-DEMO-001"
                  className="w-full h-[32px] px-2.5 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-1 sm:gap-4 pt-2">
                <label htmlFor="visaConditions" className="text-[13px] text-[#222222] pt-1">
                  Visa conditions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div>
                  <textarea
                    id="visaConditions"
                    name="visaConditions"
                    value={form.visaConditions}
                    onChange={handleChange}
                    placeholder="Enter all visa conditions here..."
                    rows={5}
                    maxLength={10000}
                    className="w-full p-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>Enter multiple conditions or paragraphs.</span>
                    <span>{form.visaConditions.length}/10000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 sm:pl-[180px] flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {loading && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}
                <span>{loading ? "Creating account..." : "Create account"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setError("");
                  setSuccess("");
                }}
                className="px-4 py-2.5 bg-white border border-[#7f9db9] text-[#222222] text-[13px] font-semibold rounded-[2px] hover:bg-slate-50 transition-colors"
              >
                Reset form
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
