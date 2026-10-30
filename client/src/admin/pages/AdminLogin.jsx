import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Icon.png";

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
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Login failed");
      login(data);
      navigate("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F7FB" }}>

      <div className="w-full max-w-[400px]">

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl mb-4 overflow-hidden"
            style={{ background: "#09152E", padding: 6 }}>
            <img src={logo} alt="Planova" className="w-8 h-8 object-contain brightness-0 invert" />
          </div>
          <h1 className="text-[1.5rem] font-black" style={{ color: "#09152E" }}>Planova Admin</h1>
          <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>Sign in to the management portal</p>
        </div>

        <div className="rounded-2xl p-7" style={{ background: "#fff", border: "1px solid #E8EEF8", boxShadow: "0 4px 24px rgba(9,21,46,0.06)" }}>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg text-[13px] flex items-center gap-2"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "#3E506D" }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@planova.com"
                className="w-full px-4 py-2.5 rounded-lg text-[14px] outline-none transition-all"
                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#09152E" }}
                onFocus={e => e.currentTarget.style.borderColor = "#3478F6"}
                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "#3E506D" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg text-[14px] outline-none transition-all"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#09152E" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#3478F6"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#94A3B8" }}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg font-bold text-[14px] text-white transition-colors mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: loading ? "#94A3B8" : "#09152E" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1E293B"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#09152E"; }}>
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in
                </>
              ) : "Sign in"}
            </button>
          </form>
        </div>

        <div className="text-center mt-5 flex flex-col gap-1">
          <p className="text-[12px]" style={{ color: "#94A3B8" }}>Admin access only</p>
          <Link to="/login" className="text-[12.5px] font-semibold" style={{ color: "#3478F6" }}>
            Back to main login
          </Link>
        </div>
      </div>
    </div>
  );
}
