import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_CREDENTIALS } from "../data/adminData";

function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      if (
        form.email.toLowerCase() === ADMIN_CREDENTIALS.email &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        navigate("/admin");
      } else {
        setError("Invalid credentials. Use admin@planova.com / admin123");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 mb-4 shadow-lg shadow-orange-500/30">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Planova Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Operations & Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <h2 className="text-white font-bold text-[1.1rem] mb-1">Sign in to Admin Panel</h2>
          <p className="text-slate-400 text-[13px] mb-6">
            Demo credentials: <span className="text-orange-400 font-mono">admin@planova.com</span> / <span className="text-orange-400 font-mono">admin123</span>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[13px] flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-300 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@planova.com"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-[14px] placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-[14px] placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-orange-500 text-white font-bold text-[14px] hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign in to Admin Panel"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[12px] mt-6">
          © 2026 Planova · Admin Access Only
        </p>
      </div>
    </div>
  );
}
