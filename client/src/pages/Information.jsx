import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Home, AlertCircle, Loader2, LogOut } from "lucide-react";

import logo from "../assets/immegration.png";
import api from "../api/axios";
import countries from "i18n-iso-countries";

import en from "i18n-iso-countries/langs/en.json";
export default function Information() {
  const navigate = useNavigate();
  countries.registerLocale(en);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchInformation() {
      try {
        const token = sessionStorage.getItem("demoToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your information. The backend endpoint may not be implemented yet.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchInformation();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("demoToken");
    navigate("/login", { replace: true });
  }

  function handleDownloadVisa() {
    window.open("/visa-record", "_blank");
  }

  // Formatting date values as dd/mm/yy to match exact NZ VisaView style
  function formatDateNZ(value) {
    if (!value) return "Not applicable";
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
  }

  function formatValue(key, value) {
    if (value === null || value === undefined || value === "") {
      return "Not applicable";
    }

    const isDateField = [
      "dateOfBirth",
      "visaStartDate",
      "visaExpiryDate",
      "travelExpiryDate",
      "createdAt",
      "updatedAt",
      "expiryDate",
      "validAsAt",
      "firstEntryBefore",
    ].includes(key);

    if (isDateField) {
      return formatDateNZ(value);
    }

    return String(value);
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
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <img
            src={logo}
            alt="Immigration New Zealand"
            className="h-10 sm:h-[52px] object-contain brightness-0 invert"
          />
        </div>

        {/* Header Logged In User Info & Logout Button */}
        <div className="text-white text-[12px] flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-normal">Logged in:</span>
            <span className="font-bold uppercase tracking-wide">
              {user ? user.familyName : "---"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 bg-[#004a87] hover:bg-[#003866] text-white px-2.5 py-1 rounded-[2px] transition-colors font-medium border border-white/20 cursor-pointer"
            title="Log out of your session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-4 sm:px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4] overflow-x-auto whitespace-nowrap">
        <Link
          to="/"
          className="flex items-center gap-1 hover:underline text-[#003399] shrink-0 font-normal"
        >
          <Home className="w-3.5 h-3.5 text-[#222222]" />
          <span>Home</span>
        </Link>
        <span className="text-[#333333]">&gt;</span>
        <span className="hover:underline cursor-pointer shrink-0 font-normal">
          VisaView
        </span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#222222] font-bold shrink-0">
          Visa Verification Enquiry
        </span>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 relative">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-[215px] bg-[#eef4f9] border-r border-[#cad8e6] pt-6 pr-4 pl-0 shrink-0 transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <h2 className="text-[17px] font-bold text-[#003399] mb-3 pl-4">
            VisaView
          </h2>
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

        {/* Right Main Content */}
        <main className="flex-1 pt-6 px-4 sm:pl-9 sm:pr-12 max-w-[1050px] pb-16 overflow-x-hidden">
          {/* Top Info Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13px] mb-6 border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="font-normal text-[#333333]">Acting for:</span>{" "}
              <span className="font-bold text-[#222222]">
                Visa Verification Service
              </span>
            </div>
            <div className="text-[13px] flex items-center gap-2">
              <span className="font-normal text-[#333333]">Logged in:</span>{" "}
              <span className="font-bold text-[#222222] uppercase">
                {user ? user.familyName : "---"}
              </span>
            </div>
          </div>

          {/* Title and Instructions */}
          <div className="space-y-0 mb-6">
            <h1 className="text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-3">
              Visa Verification Enquiry
            </h1>
            <p className="text-[13px] font-normal text-[#222222]">
              Enter the details of the visa to be verified.
            </p>
            <p className="text-[13px] font-normal text-[#222222]">
              Please enter these details exactly as they appear in the visa
              holder's passport.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex items-center justify-center gap-3 text-[#003399]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">
                Retrieving Visa Record...
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && !loading && (
            <div
              role="alert"
              className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Visa Record Details Content */}
          {user && !loading && (
            <div className="space-y-6 max-w-[850px]">
              {/* 2-Column Exact Data Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[13px]">
                {/* Left Column */}
                <div className="space-y-2">
                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Family Name *
                    </span>
                    <span className="font-normal text-[#222222] uppercase">
                      {user.familyName}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline pt-2">
                    <span className="font-bold text-[#222222]">
                      Date of Birth
                    </span>
                    <span className="font-normal text-[#222222]">
                      {formatValue("dateOfBirth", user.dateOfBirth)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">Gender</span>
                    <span className="font-normal text-[#222222]">
                      {user.gender ? user.gender.charAt(0).toUpperCase() : "M"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Passport Nationality
                    </span>

                    <span className="font-normal text-[#222222]">
                      {countries.getName(user.nationality, "en", {
                        select: "official",
                      }) || user.nationality}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Passport Number
                    </span>
                    <span className="font-normal text-[#222222] uppercase">
                      {user.passportNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      TNZ Client Number
                    </span>
                    <span className="font-normal text-[#222222]">
                      {user.tnzClientNumber || "89904285"}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">Visa Type</span>
                    <span className="font-normal text-[#222222]">
                      {user.visaCategory || "Visitor"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline pt-2">
                    <span className="font-bold text-[#222222]">
                      Visa Start Date
                    </span>
                    <span className="font-normal text-[#222222]">
                      {formatValue("visaStartDate", user.visaStartDate)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      First Entry Before
                    </span>
                    <span className="font-normal text-[#222222]">
                      {formatValue("firstEntryBefore", user.firstEntryBefore)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Number of Entries
                    </span>
                    <span className="font-normal text-[#222222]">
                      {user.numberOfEntries || "Single"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Expiry Date Travel
                    </span>
                    <span className="font-normal text-[#222222]">
                      {formatValue(
                        "travelExpiryDate",
                        user.travelExpiryDate || user.visaExpiryDate,
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-baseline">
                    <span className="font-bold text-[#222222]">
                      Visa Expiry
                    </span>
                    <span className="font-normal text-[#222222]">
                      {formatValue("visaExpiryDate", user.visaExpiryDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visa Conditions Section */}
              <div className="pt-4 space-y-2">
                <h3 className="font-bold text-[#222222] text-[13px]">
                  Visa Conditions
                </h3>
                <p className="text-[13px] font-normal text-[#222222] leading-snug max-w-[760px]">
                  {user.visaConditions ||
                    "Stay subject to grant of entry permission. The holder may work remotely for overseas or clients. The holder shall not study for more than 3 months. In order to return to New Zealand, the holder must, at their own expense, hold an onward ticket to another country. The holder must not work in NZ. This visa allows multiple entry travel to New Zealand. Contact your local immigration office if you need further information. The holder must leave before visa expiry or face deportation."}
                </p>
              </div>

              {/* Expiry Date / Valid as at block */}
              <div className="space-y-1 pt-2 text-[13px]">
                <div className="grid grid-cols-[160px_1fr] items-baseline">
                  <span className="font-bold text-[#222222]">Expiry Date</span>
                  <span className="font-normal text-[#222222]">
                    {formatValue(
                      "expiryDate",
                      user.visaExpiryDate || "----",
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-baseline">
                  <span className="font-bold text-[#222222]">Valid as at</span>
                  <span className="font-normal text-[#222222]">
                    {formatValue(
                      "expiryDate",
                      user.visaExpiryDate || "----",
                    )}
                  </span>
                </div>
              </div>

              {/* Legal Warning Notice */}
              <div className="pt-3">
                <p className="text-[13px] font-normal text-[#222222] leading-snug">
                  <span className="font-bold">Warning:</span> If you download
                  this visa information, you must ensure that you have
                  understood and comply with the Privacy Act 2020, including
                  with respect to the use, storage and disclosure of information
                  contained in this document.
                </p>
              </div>

              {/* Action Button Section */}
              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleDownloadVisa}
                  className="px-4 py-2 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors shadow-xs cursor-pointer inline-block"
                >
                  Download Record
                </button>

                <div>
                  <a
                    href="#unsolicited-advice"
                    className="text-[#003399] underline hover:text-[#002266] text-[13px] font-normal inline-block"
                  >
                    Unsolicited advice? Why not tell us?
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
