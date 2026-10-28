import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, BarChart2 } from "lucide-react";
import LoginImg from "../../assets/Login_Booth.jpg";
import AuthNavbar from "../../components/AuthNavbar";
import { useAuth } from "../../../context/AuthContext";

const ROLES = [
  { id: "attendee",  label: "Attendee",  Icon: User,      desc: "Browse expos, register for sessions." },
  { id: "exhibitor", label: "Exhibitor", Icon: BarChart2, desc: "Apply to expos, manage your booth." },
];

function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,     setForm]     = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [role,     setRole]     = useState("attendee");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          navigate("/register?verify=" + encodeURIComponent(data.email));
          return;
        }
        return setError(data.message || "Login failed");
      }

      login(data);

      if (data.role === "attendee")       navigate("/users/dashboard/attendee", { replace: true });
      else if (data.role === "exhibitor") navigate("/users/dashboard/exhibitor", { replace: true });
      else if (data.role === "admin")     navigate("/admin", { replace: true });

    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface">

      <div className="hidden lg:block w-[50%] h-full relative">
        <img src={LoginImg} alt="Exhibition" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-navy) 72%, transparent) 0%, color-mix(in srgb, var(--color-navy) 45%, transparent) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div />
          <div>
            <span className="text-accent text-[11px] font-semibold tracking-[0.18em] uppercase">Expo Management Platform</span>
            <h2 className="text-white text-[1.6rem] font-black leading-tight mt-2 max-w-[300px]">
              Pakistan's expos, one platform.
            </h2>
            <p className="text-white/50 text-[13px] mt-2 max-w-[280px] leading-relaxed">
              Organizers, exhibitors, and attendees - all managed in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full flex flex-col bg-surface">
        <AuthNavbar />

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-[380px]">
            <h1 className="text-[1.65rem] font-black text-dark leading-tight">Welcome back</h1>
            <p className="text-body text-[14px] mt-1 mb-5">Log in to your Planova account.</p>

            {/* Role picker - same style as Register */}
            <div className="mb-5">
              <p className="text-[11.5px] font-bold text-dark uppercase tracking-wider mb-2">I am logging in as</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ id, label, Icon, desc }) => (
                  <button key={id} type="button"
                    onClick={() => { setRole(id); setError(""); }}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      role === id ? "border-accent bg-accent/5" : "border-border-card bg-page hover:border-border"
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${role === id ? "bg-accent" : "bg-ice"}`}>
                      <Icon size={15} className={role === id ? "text-white" : "text-accent"} />
                    </div>
                    <span className={`text-[11.5px] font-bold ${role === id ? "text-accent" : "text-dark"}`}>{label}</span>
                  </button>
                ))}
              </div>
              {ROLES.find(r => r.id === role)?.desc && (
                <p className="mt-1.5 text-[11.5px] text-muted">{ROLES.find(r => r.id === role).desc}</p>
              )}
            </div>

            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold text-dark">Password</label>
                  <Link to="/forgot-password" className="text-[12px] text-accent hover:text-accent-hover transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : "Log in"}
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-body">
              No account?{" "}
              <Link to="/register" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
            <p className="mt-2 text-center">
              <Link to="/" className="text-[12px] text-muted hover:text-body transition-colors">
                Back to website
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-border py-4">(c) 2026 Planova</p>
      </div>
    </div>
  );
}
