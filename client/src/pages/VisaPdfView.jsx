import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Asset Logos
import topRightLogo from "../assets/top-righ-corner-logo.png";
import topRightLogo2 from "../assets/top-righ-corner-logo-up.png";
import bottomRightLogo from "../assets/bottom_right__newzealand_logo.png";
import bottomLeftLogo from "../assets/bottom_left__ministry_logo.svg";

export default function VisaPdfView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = sessionStorage.getItem("demoToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate]);

  function formatDate(dateStr, includeMonthName = false) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    if (includeMonthName) {
      const day = String(date.getDate()).padStart(2, "0");
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
    }
    return date.toISOString().split("T")[0];
  }

  function getTodayFormatted() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading document...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-600">Failed to load user information.</div>;
  }

  const currentDateStr = getTodayFormatted();

  return (
    <div className="bg-slate-200 min-h-screen py-8 print:py-0 print:bg-white flex flex-col items-center">
      {/* Top Action Bar */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-md transition"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* 4-PAGE DOCUMENT CONTAINER */}
      <div className="space-y-8 print:space-y-0 text-slate-900 font-sans text-[11px] leading-snug">
        
        {/* ==================== PAGE 1 (FORMERLY PAGE 3) ==================== */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-12 print:p-10 shadow-lg print:shadow-none flex flex-col justify-between print:break-after-page">
          <div>
            {/* Header Logo */}
{/* Header Logo */}
<div className="flex justify-center mb-4">
  <img 
    src={topRightLogo} 
    alt="New Zealand Immigration" 
    className="w-[220px] h-[75px] object-fill" 
  />
</div>



            <div className="text-center font-normal text-xs uppercase tracking-wide mb-3 text-slate-900">
              VISA VERIFICATION SERVICE ENQUIRY RECORD
            </div>

            <p className="text-center text-xs text-slate-900 mb-5 font-normal">
              This document shows the results of an enquiry to Immigration New Zealand's Visa Verification Service
            </p>

            {/* Date Headers */}
            <div className="flex justify-center gap-10 text-xs text-slate-900 mb-5">
  <span>
    <strong>Date of enquiry:</strong> {currentDateStr}
  </span>
  <span>
    <strong>Visa information valid at:</strong> {currentDateStr}
  </span>
</div>

            {/* Table Grid */}
            <table className="w-full border-collapse border border-black text-[11px] mb-2">
              <tbody>
                <tr>
                  <td className="border border-black p-1.5 w-1/3">
                    <span className="font-bold">Family, First Name: </span>{user.familyName}
                  </td>
                  <td className="border border-black p-1.5 w-1/3">
                    <span className="font-bold">Passport Nationality: </span>{user.nationality}
                  </td>
                  <td className="border border-black p-1.5 w-1/3">
                    <span className="font-bold">Passport Number: </span>{user.passportNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Date of Birth: </span>{formatDate(user.dateOfBirth)}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Gender: </span>{user.gender ? user.gender.charAt(0).toUpperCase() : ""}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">INZ Client Number: </span>{user.tnzClientNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Visa Type: </span>{user.visaCategory}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Visa Expiry Date: </span>{formatDate(user.visaExpiryDate)}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Visa Start Date: </span>{formatDate(user.visaStartDate)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">First Entry Before: </span>{formatDate(user.travelExpiryDate)}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Number of Entries: </span>{user.numberOfEntries}
                  </td>
                  <td className="border border-black p-1.5">
                    <span className="font-bold">Expiry Date Travel: </span>{formatDate(user.travelExpiryDate)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="border border-black p-2 min-h-[100px] align-top">
                    <div className="font-bold mb-1">Visa Conditions:</div>
                    <div className="whitespace-pre-line text-[10px] leading-relaxed text-slate-800">
                      {user.visaConditions || "Financial support evidence not required. May not be placed in a triangular employment arrangement with a controlling third part. Must be paid at or above $28.50 per hour."}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Service Explanations */}
            <div className="space-y-3.5 text-[10.5px] leading-tight text-slate-800">
              <div>
                <h3 className="font-bold text-[11px] mb-0.5 text-slate-900 text-center mb-3">About Visa Verification Service enquiries</h3>
                <p>A Visa Verification Service Enquiry Record shows details of the visa record held by Immigration New Zealand (INZ) for a particular visa holder. All non-New Zealand citizens must hold a visa to be in New Zealand. All visas are held in INZ's electronic records. Some visa holders receive a visa label in their passport, and some visa holders have eVisas (label-less visas). The Visa Verification Service allows service providers in New Zealand to verify a person's visa status where the person does not have a visa label in their passport.</p>
              </div>

              <div>
                <h3 className="font-bold text-[11px] mb-2 text-slate-900">Identity assurance</h3>
                <p>A Visa Verification Service Enquiry Record confirms that the details of the visa you have been presented with match the details of a visa in INZ's electronic records. You should also sight a passport or other appropriate identity document to ensure that the biographic details in the identity document match the biographic details in the visa, and that the photograph in the identity document matches the person presenting this information.</p>
              </div>

              <div>
                <h3 className="font-bold text-[11px] mb-2 text-slate-900">Validity</h3>
                <p>Visa Verification Service Enquiry Records are current on the date conducted, and the information provided is valid at the date stated on the Enquiry Record. Visa information may change. Where a person is not yet in New Zealand, their visa may be subject to the grant of entry permission at the New Zealand border.</p>
              </div>

              <div>
                <h3 className="font-bold text-[11px] mb-2 text-slate-900">Privacy</h3>
                <p>A Visa Verification Service enquiry must only be performed with the consent of the visa holder. Please treat this document and the personal information it contains in accordance with the Privacy Act 2020. You must only use the information for a lawful purpose; only retain the information as long as required for that lawful purpose; only share the information if authorised by the visa holder or otherwise permitted by law; and if storing, sharing or destroying any electronic or hard copy version of this information, do so in a secure manner. Any complaints can be made using the Ministry of Business, Innovation and Employment's complaints process which is available at www.mbie.govt.nz.</p>
              </div>

              <div>
                <h3 className="font-bold text-[11px] mb-2 text-slate-900">For more assistance</h3>
                <p>The INZ website includes a Visa Verification Service User Guide, which explains the details on a visa record. You may also contact the Immigration Contact Centre on (09) 969-1458 from within the Auckland toll free calling area, (04) 910-9916 from Wellington or 0508 967 569 from the rest of New Zealand.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== PAGE 2 (FORMERLY PAGE 1) ==================== */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-12 print:p-10 shadow-lg print:shadow-none flex flex-col justify-between print:break-after-page">
          <div>
            {/* Header: Logo Right */}
            <div className="flex justify-between items-start mb-0">
              <div className="max-w-[65%] text-[11px] text-slate-800 leading-normal">
                If this application has been made through a Licensed immigration Adviser, lawyer or other representative who is exempt from licensing, they must give this entire document to the applicant.
              </div>
              <img src={topRightLogo2} alt="New Zealand Immigration" className="h-26 object-contain" />
            </div>

            {/* Application Headers */}
            <div className="mb-6 space-y-1">
              <div><span className="font-bold">Application number:</span> {user.applicationNumber || "VV00211932"}</div>
              <div><span className="font-bold">Client number:</span> {user.tnzClientNumber || "77892071"}</div>
              <div>{formatDate(user.createdAt, true) || "09-September-2026"}</div>
            </div>

            <div className="mb-6 text-xs font-normal">
              Kia ora {user.familyName}
            </div>

            {/* Application Approval Banner */}
            <div className="mb-6">
              <div className="font-semibold text-xs">Visitor visa application approved</div>
              <div>We have approved your application for a New Zealand Visitor Visa - Business events (participation).</div>
            </div>

            <div className="text-center font-semibold text-xs mb-6">
              Visitor Visa details
            </div>

            {/* Applicant Details */}
            <div className="mb-6">
              <div className="font-bold mb-3">Applicant details</div>
              <div className="grid grid-cols-2 gap-y-2 max-w-4xl">
                <div><span className="font-normal">Name:</span> <span className="font-normal">{user.familyName}</span></div>
                <div><span className="font-normal">Date of birth:</span> <span className="font-normal">{formatDate(user.dateOfBirth, true)}</span></div>
                <div><span className="font-normal">Gender:</span> <span className="font-normal">{user.gender}</span></div>
                <div><span className="font-normal">Passport number:</span> <span className="font-normal">{user.passportNumber}</span></div>
                <div><span className="font-normal">Nationality:</span> <span className="font-normal">{user.nationality}</span></div>
                <div><span className="font-normal">Client number:</span> <span className="font-normal">{user.tnzClientNumber}</span></div>
              </div>
            </div>

            {/* Visa Conditions List */}
            <div className="space-y-2 mb-8 text-slate-800">
              <div className="font-bold text-slate-900 mb-3">Visa conditions</div>
              {user.visaConditions ? (
                <div className="whitespace-pre-line leading-relaxed">{user.visaConditions}</div>
              ) : (
                <>
                  <div>The start date of your visa is: {formatDate(user.visaStartDate, true)}</div>
                  <div>This visa allows {user.numberOfEntries || "Multiple"} entry, you can enter New Zealand for multiple times.</div>
                  <div>Each entry should not be more than 3 months of stay in New Zealand.</div>
                  <div>The last date you may travel and enter/re-enter New Zealand is: {formatDate(user.travelExpiryDate, true)}</div>
                  <div>This visa expires 3 month(s) after the date of each arrival in New Zealand.</div>
                  <div>Stay subject to grant of entry permission.</div>
                  <div>You must leave before visa expiry or face deportation.</div>
                  <div>The holder shall not study for more than 3 months in every 12 month period in NZ.</div>
                  <div>The holder of this visa must comply with any order made under section 70 of the Health Act 1956 and listed in schedule 2 of the COVID-19 Public Health Response Act 2020.</div>
                  <div>The holder of this visa must comply with any order made under section 11 of the COVID-19 Public Health Response Act 2020.</div>
                  <div>The holder of this visa must comply with any instruction from a Medical Officer of Health which relates to a notifiable or quarantinable disease.</div>
                </>
              )}
            </div>

            <div className="font-semibold text-xxs mt-8">
              If you do not comply with these conditions you may become liable for deportation.
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="flex justify-between items-end pt-4">
            <img src={bottomLeftLogo} alt="Ministry Logo" className="h-7 object-contain" />
            <img src={bottomRightLogo} alt="New Zealand Government" className="h-5 object-contain" />
          </div>
        </div>

        {/* ==================== PAGE 3 (FORMERLY PAGE 2) ==================== */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-12 print:p-10 shadow-lg print:shadow-none flex flex-col justify-between print:break-after-page">
          <div className="space-y-5 text-slate-800 text-[11px] leading-normal pt-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">You do not require a visa label in your passport</h3>
              <p>The details above reflect the electronic record of your visa held by Immigration New Zealand (INZ).</p>
              <p>Do not alter this letter. For information about eVisas go to <span className="text-blue-600 underline">immigration.govt.nz/evisas</span>.</p>
              <p>Please check that your visa details match your passport before you travel and contact us immediately if there are any errors.</p>
            </div>

            <div>
              <p>If you get a new passport while this visa is still valid, you must request INZ to update your visa details so that they match your new passport. INZ's website has information on how to do this: <span className="text-blue-600 underline">immigration.govt.nz/transfervisa</span></p>
            </div>

            <div>
              <p>You can verify the details of your visa online using the Visa Verification Service:</p>
              <p className="text-blue-600 underline">www.immigration.govt.nz/about-us/our-online-systems/visa-verification-service</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">Your passport scans</h3>
              <p>When you made your application, you may have been asked to submit your passport to your nearest Visa Application Centre (VAC) for scanning.</p>
              <p className="mt-2">Following assessment of your application we waived the passport requirement. We apologise if you have already submitted your passport to the VAC. Your passport will be returned to you as soon as possible. If you have not yet submitted your passport, please do not send it.</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">New Zealand's COVID-19 requirements</h3>
              <p>If you plan to travel to or from New Zealand, please check the current COVID-19 requirements. These requirements can change so we recommend referring to these often when planning travel <span className="text-blue-600 underline">covid19.govt.nz/international-travel</span></p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">Automated systems</h3>
              <p>Some aspects of your application have been processed using automated systems in accordance with section 28 of the Immigration Act 2009. For more information about INZ's use of automated systems go to <span className="text-blue-600 underline">www.immigration.govt.nz/about-us/site-information/terms-of-use</span></p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">You must not remain in New Zealand after your visa expires</h3>
              <p>You must hold a valid visa at all times while you are in New Zealand. If you do not hold a valid visa, you will be in New Zealand unlawfully and you will be liable for deportation. If you do not leave voluntarily before you are served with a deportation order you will face a prohibition period preventing your return to New Zealand in the future.</p>
            </div>

            <div>
              <p>If you have any questions, you can:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>call our Immigration Contact Centre on 0508 55 88 55 or 09 914 4100, or for those outside of New Zealand +64 9 914 4100, or</li>
                <li>find answers to frequently asked questions at: <span className="text-blue-600 underline">www.immigration.govt.nz/knowledgebase/kb-question</span></li>
              </ul>
            </div>

            <div className="pt-4">
              <p>Ngā mihi</p>
              <p className="mt-2 font-medium">Immigration New Zealand</p>
            </div>
          </div>

          {/* Page 3 Footer */}
          <div>
            <div className="text-center font-bold text-xs uppercase mb-6 tracking-wide text-slate-900">
              PRINT THIS DOCUMENT AND CARRY IT WITH YOUR PASSPORT WHEN TRAVELLING
            </div>
            <div className="flex justify-between items-end">
              <img src={bottomLeftLogo} alt="Ministry Logo" className="h-7 object-contain" />
              <img src={bottomRightLogo} alt="New Zealand Government" className="h-5 object-contain" />
            </div>
          </div>
        </div>

        {/* ==================== PAGE 4 ==================== */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-12 print:p-10 shadow-lg print:shadow-none flex flex-col justify-end">
          <div>
            <div className="text-center font-bold text-xs uppercase mb-6 tracking-wide text-slate-900">
              PRINT THIS DOCUMENT AND CARRY IT WITH YOUR PASSPORT WHEN TRAVELLING
            </div>
            <div className="flex justify-between items-end">
              <img src={bottomLeftLogo} alt="Ministry Logo" className="h-7 object-contain" />
              <img src={bottomRightLogo} alt="New Zealand Government" className="h-5 object-contain" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
