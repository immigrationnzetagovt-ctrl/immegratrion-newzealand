import { useEffect, useState } from "react";
import { LogOut, UserRound, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

export default function Information() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
              "Unable to load your information. The backend endpoint may not be implemented yet."
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

  function logout() {
    sessionStorage.removeItem("demoToken");
    navigate("/login");
  }

  function handleDownloadVisa() {
    window.open("/visa-record", "_blank");
  }

  function formatValue(key, value) {
    if (!value) return "Not provided";

    const isDateField = [
      "dateOfBirth",
      "visaStartDate",
      "visaExpiryDate",
      "travelExpiryDate",
      "createdAt",
      "updatedAt",
    ].includes(key);

    if (isDateField) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }

    return String(value);
  }

  const fields = [
    ["Family name", "familyName"],
    ["Email", "email"],
    ["Passport number", "passportNumber"],
    ["Document number", "documentNumber"],
    ["Date of birth", "dateOfBirth"],
    ["Gender", "gender"],
    ["Nationality", "nationality"],
    ["Visa category", "visaCategory"],
    ["Visa start date", "visaStartDate"],
    ["Visa expiry date", "visaExpiryDate"],
    ["TNZ client number", "tnzClientNumber"],
    ["Number of entries", "numberOfEntries"],
    ["Travel expiry date", "travelExpiryDate"],
    ["Application number", "applicationNumber"],
    ["Account ID", "_id"],
    ["Created at", "createdAt"],
    ["Updated at", "updatedAt"],
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
              Account Overview
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              My information
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Your saved demo account information.
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {loading && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading information...
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            {error}
          </div>
        )}

        {user && !loading && (
          <>
            {/* Header Banner */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-blue-950 p-6 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <UserRound size={24} />
              </div>

              <div>
                <p className="text-xl font-semibold">{user.familyName}</p>
                <p className="mt-1 text-sm text-blue-200">{user.email}</p>
              </div>
            </div>

            {/* Main Information Grid */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">
                Personal and application details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map(([label, key]) => (
                  <div key={key} className="border-b border-slate-100 pb-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {label}
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                      {formatValue(key, user[key])}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visa Conditions Section */}
              {user.visaConditions && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-slate-900">
                    <FileText size={18} className="text-blue-900" />
                    <h3 className="text-md font-semibold">Visa conditions</h3>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                    {user.visaConditions}
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM BUTTON SECTION */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Official Visa Document
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Open and print your official 4-page Visa Verification Enquiry Record PDF.
                </p>
              </div>

              <button
                onClick={handleDownloadVisa}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 transition"
              >
                Download Visa
                <ExternalLink size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
