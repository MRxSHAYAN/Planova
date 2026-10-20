import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../../assets/Login_Booth.jpg";
import AuthNavbar from "../../components/AuthNavbar";

// Show password icon
function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

// Hide password icon
function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface">

      {/* Left — image */}
      <div className="hidden lg:block w-[50%] h-full relative">
        <img src={LoginImg} alt="Exhibition" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-navy) 72%, transparent) 0%, color-mix(in srgb, var(--color-navy) 45%, transparent) 100%)" }} />

        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div></div>

          <div>
            <span className="text-accent text-[11px] font-semibold tracking-[0.18em] uppercase">Expo Management Platform</span>
            <h2 className="text-white text-[1.6rem] font-black leading-tight mt-2 max-w-[300px]">
              Pakistan's expos, one platform.
            </h2>
            <p className="text-white/50 text-[13px] mt-2 max-w-[280px] leading-relaxed">
              Organizers, exhibitors, and attendees — all managed in one place.
            </p>
            <div className="flex gap-7 mt-7 pt-5 border-t border-white/10">
              {[["120+","Expos"],["3,400+","Exhibitors"],["85K+","Attendees"]].map(([n,l]) => (
                <div key={l}>
                  <div className="text-white font-black text-[1.1rem]">{n}</div>
                  <div className="text-white/35 text-[10px] uppercase tracking-wide mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 h-full flex flex-col bg-surface">

        <AuthNavbar />

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-[360px]">

            <h1 className="text-[1.65rem] font-black text-dark leading-tight">Welcome back</h1>
            <p className="text-body text-[14px] mt-1 mb-7">Log in to your Planova account.</p>

            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold text-dark">Password</label>
                  <Link to="/forgot-password" className="text-[12px] text-accent hover:text-accent-hover transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover transition-colors mt-1">
                Log in
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-body">
              No account?{" "}
              <Link to="/register" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Sign up free
              </Link>
            </p>

          </div>
        </div>

        <p className="text-center text-[11px] text-border py-4">© 2026 Planova</p>
      </div>
    </div>
  );
}
