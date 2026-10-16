import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, BarChart2 } from "lucide-react";
import SignImg from "../../assets/Sign_Booth.jpg";
import AuthNavbar from "../../components/AuthNavbar";

const ROLES = [
  { id: "attendee",  label: "Attendee",  Icon: User,      desc: "Browse expos, register for sessions, and navigate venues." },
  { id: "exhibitor", label: "Exhibitor", Icon: BarChart2,  desc: "Apply to expos, pick a booth, and manage your profile." },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm]         = useState({ name: "", email: "", password: "", role: searchParams.get("role") || "attendee" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    navigate("/");
  };

  const activeRole = ROLES.find((r) => r.id === form.role);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">

      {/* Left — image */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative flex-col">
        <img src={SignImg} alt="Expo booth" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0A1628]/60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,0.9) 0%, transparent 55%)" }} />

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <div></div>

          <div>
            <p className="text-[#6B9FFF] text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">Join Planova</p>
            <h2 className="text-white text-[1.5rem] font-black leading-tight max-w-[280px]">
              One account for every role in Pakistan's expo industry.
            </h2>
            <p className="text-white/50 text-[13px] mt-2 max-w-[260px] leading-relaxed">
              Exhibit or attend — you're covered.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {ROLES.map(({ id, label, Icon }) => (
                <div key={id} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#6B9FFF]/20 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-[#6B9FFF]" />
                  </div>
                  <span className="text-white font-semibold text-[12.5px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col bg-white">
        <AuthNavbar />

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-[400px]">

            <h1 className="text-[1.6rem] font-black text-[#0A1628] mb-1">Create your account</h1>
            <p className="text-[#64748B] text-[14px] mb-5">Join Pakistan's expo management platform.</p>

            {/* Role picker */}
            <div className="mb-5">
              <p className="text-[11.5px] font-bold text-[#334155] uppercase tracking-wider mb-2">I am joining as…</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ id, label, Icon }) => (
                  <button
                    key={id} type="button"
                    onClick={() => { setForm((p) => ({ ...p, role: id })); setError(""); }}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      form.role === id ? "border-[#6B9FFF] bg-[#6B9FFF]/[0.05]" : "border-[#E2E8F4] bg-[#F8FAFC] hover:border-[#CBD5E8]"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${form.role === id ? "bg-[#6B9FFF]" : "bg-[#E8F0FE]"}`}>
                      <Icon size={15} className={form.role === id ? "text-white" : "text-[#6B9FFF]"} />
                    </div>
                    <span className={`text-[11.5px] font-bold ${form.role === id ? "text-[#6B9FFF]" : "text-[#334155]"}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
              {activeRole && <p className="mt-1.5 text-[11.5px] text-[#94A3B8]">{activeRole.desc}</p>}
            </div>

            {error && (
              <div className="mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#334155] mb-1.5">Full name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F4] text-[#0A1628] text-[14px] placeholder-[#94A3B8] outline-none focus:border-[#6B9FFF] focus:ring-2 focus:ring-[#6B9FFF]/10 transition-all" />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#334155] mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F4] text-[#0A1628] text-[14px] placeholder-[#94A3B8] outline-none focus:border-[#6B9FFF] focus:ring-2 focus:ring-[#6B9FFF]/10 transition-all" />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#334155] mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F4] text-[#0A1628] text-[14px] placeholder-[#94A3B8] outline-none focus:border-[#6B9FFF] focus:ring-2 focus:ring-[#6B9FFF]/10 transition-all" />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                    {showPass
                      ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-[#6B9FFF] text-white font-bold text-[14px] hover:bg-[#4A82F5] transition-colors mt-1">
                Create account
              </button>
            </form>

            <p className="mt-4 text-center text-[13px] text-[#64748B]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#6B9FFF] hover:text-[#4A82F5] font-semibold transition-colors">Log in</Link>
            </p>

          </div>
        </div>

        <p className="text-center text-[11px] text-[#CBD5E8] py-4">© 2026 Planova</p>
      </div>
    </div>
  );
}
