import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, BarChart2 } from "lucide-react";
import SignImg from "../../assets/Sign_Booth.jpg";
import AuthNavbar from "../../components/AuthNavbar";
import { useAuth } from "../../../context/AuthContext";

const ROLES = [
  { id: "attendee",  label: "Attendee",  Icon: User,      desc: "Browse expos, register for sessions, and navigate venues." },
  { id: "exhibitor", label: "Exhibitor", Icon: BarChart2,  desc: "Apply to expos, pick a booth, and manage your profile." },
];

// eye toggle icons
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

function OTPInput({ value, onChange }) {
  const inputs = useRef([]);

  function handleKey(e, i) {
    if (e.key === "Backspace" && !e.target.value && i > 0) {
      inputs.current[i - 1].focus();
    }
  }

  function handleChange(e, i) {
    const char = e.target.value.replace(/\D/, "").slice(-1);
    const arr  = value.split("");
    arr[i]     = char;
    const next = arr.join("").padEnd(6, " ").slice(0, 6);
    onChange(next.trimEnd());
    if (char && i < 5) inputs.current[i + 1].focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 5)].focus();
    }
    e.preventDefault();
  }

  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-[18px] font-black rounded-lg outline-none transition-all"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e)  => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e)   => (e.target.style.borderColor = "#DCEAFF")}
        />
      ))}
    </div>
  );
}

function pwCheck(pw) {
  return {
    length: pw.length >= 7,
    number: /\d/.test(pw),
    special: /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(pw),
  };
}

//  Main component 
export default function Register() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  // step: "form" | "otp"
  const [step,     setStep]     = useState("form");
  const [form,     setForm]     = useState({ name: "", email: "", password: "", role: "attendee" });
  const [otp,      setOtp]      = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const checks = pwCheck(form.password);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  // Submit form  call /register  server sends OTP
  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
    if (!checks.length || !checks.number || !checks.special)
      return setError("Password must be 7+ characters with at least one number and one special character");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Registration failed");

      // OTP sent  move to OTP step
      setStep("otp");
      setError("");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Submit OTP  call /verify-otp  get token  login
  async function handleOTPSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) return setError("Enter the full 6-digit code.");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid OTP");

      login(data);
      if (data.role === "exhibitor") navigate("/users/dashboard/exhibitor");
      else navigate("/users/dashboard/attendee");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function resendOTP() {
    setError("");
    setOtp("");
    try {
      const res  = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Could not resend OTP");
    } catch {
      setError("Something went wrong.");
    }
  }

  const activeRole = ROLES.find(r => r.id === form.role);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface">

      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative flex-col">
        <img src={SignImg} alt="Expo booth" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-navy) 90%, transparent) 0%, transparent 55%)" }} />
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <div />
          <div>
            <p className="text-accent text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">Join Planova</p>
            <h2 className="text-white text-[1.5rem] font-black leading-tight max-w-[280px]">
              One account for every role in Pakistan's expo industry.
            </h2>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-surface">
        <AuthNavbar />

        <div className="flex-1 flex items-center justify-center px-8">

          {/*  STEP 1: Registration form  */}
          {step === "form" && (
            <div className="w-full max-w-[400px]">
              <h1 className="text-[1.6rem] font-black text-dark mb-1">Create your account</h1>
              <p className="text-body text-[14px] mb-5">Join Pakistan's expo management platform.</p>

              {/* Role picker */}
              <div className="mb-5">
                <p className="text-[11.5px] font-bold text-dark uppercase tracking-wider mb-2">I am joining as</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(({ id, label, Icon }) => (
                    <button key={id} type="button"
                      onClick={() => { setForm(p => ({ ...p, role: id })); setError(""); }}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        form.role === id ? "border-accent bg-accent/5" : "border-border-card bg-page hover:border-border"
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${form.role === id ? "bg-accent" : "bg-ice"}`}>
                        <Icon size={15} className={form.role === id ? "text-white" : "text-accent"} />
                      </div>
                      <span className={`text-[11.5px] font-bold ${form.role === id ? "text-accent" : "text-dark"}`}>{label}</span>
                    </button>
                  ))}
                </div>
                {activeRole && <p className="mt-1.5 text-[11.5px] text-muted">{activeRole.desc}</p>}
              </div>

              {error && (
                <div className="mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Full name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 7 chars, one special character"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors">
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {[
                        [checks.length,  "At least 7 characters"],
                        [checks.number,  "At least one number"],
                        [checks.special, "At least one special character (!@#$%^&* etc.)"],
                      ].map(([ok, label]) => (
                        <p key={label} className="text-[11.5px] flex items-center gap-1.5"
                          style={{ color: ok ? "#12875A" : "#94A3B8" }}>
                          <span>{ok ? "" : ""}</span> {label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover disabled:opacity-60 transition-colors mt-1 flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : null}
                  {loading ? "Sending code" : "Continue"}
                </button>
              </form>

              <p className="mt-4 text-center text-[13px] text-body">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:text-accent-hover font-semibold">Log in</Link>
              </p>
            </div>
          )}

          {/*  STEP 2: OTP verification  */}
          {step === "otp" && (
            <div className="w-full max-w-[380px] text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#E5EEFF" }}>
                <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h1 className="text-[1.5rem] font-black text-dark mb-2">Check your email</h1>
              <p className="text-body text-[14px] mb-1">
                We sent a 6-digit code to
              </p>
              <p className="font-bold text-dark text-[14px] mb-6">{form.email}</p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-5">
                <OTPInput value={otp} onChange={(v) => { setOtp(v); setError(""); }} />

                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : null}
                  {loading ? "Verifying" : "Verify & Create Account"}
                </button>
              </form>

              <p className="mt-5 text-[13px] text-body">
                Didn't get it?{" "}
                <button onClick={resendOTP} className="text-accent font-semibold hover:text-accent-hover">
                  Resend code
                </button>
              </p>
              <button onClick={() => { setStep("form"); setError(""); setOtp(""); }}
                className="mt-2 text-[12.5px] text-muted hover:text-body">
                Back to form
              </button>
            </div>
          )}

        </div>

        <p className="text-center text-[11px] text-border py-4">(c) 2026 Planova</p>
      </div>
    </div>
  );
}
