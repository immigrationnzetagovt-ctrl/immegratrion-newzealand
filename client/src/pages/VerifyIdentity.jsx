import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const initialForm = {
  familyName: "",
  passportNumber: "",
  documentNumber: "",
  dateOfBirth: "",
  gender: "",
  visaStartDate: "",
};

export default function VerifyIdentity() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("demoToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await api.post(
        "/auth/verify-identity",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.verified) {
        navigate("/information", { replace: true });
      } else {
        setError(
          response.data.message ||
            "Identity verification failed. Please check your details."
        );
      }
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.removeItem("demoToken");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to verify your details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Identity Verification
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Enter your details to continue to your applicant information.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="familyName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Family name
            </label>

            <input
              id="familyName"
              name="familyName"
              value={form.familyName}
              onChange={handleChange}
              autoComplete="family-name"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="passportNumber"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Passport number
            </label>

            <input
              id="passportNumber"
              name="passportNumber"
              value={form.passportNumber}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Document number
            </label>

            <input
              id="documentNumber"
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Date of birth
            </label>

            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="visaStartDate"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Visa start date
            </label>

            <input
              id="visaStartDate"
              type="date"
              name="visaStartDate"
              value={form.visaStartDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify and Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}