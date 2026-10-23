import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthNavbar from "../../components/AuthNavbar";

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
  const refs = useRef([]);
  function handle(e, i) {
    const c = e.target.value.replace(/\D/, "").slice(-1);
    const arr = value.split("");
    arr[i] = c;
    onChange(arr.join("").slice(0, 6));
    if (c && i < 5) refs.current[i + 1]?.focus();
  }
  function key(e, i) {
    if (e.key === "Backspace" && !e.target.value && i > 0) refs.current[i - 1]?.focus();
  }
  function paste(e) {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p) { onChange(p); refs.current[Math.min(p.length, 5)]?.focus(); }
    e.preventDefault();
  }
  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map((i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1} value={value[i] || ""}
          onChange={(e) => handle(e, i)} onKeyDown={(e) => key(e, i)} onPaste={paste}
          className="w-11 h-12 text-center text-[18px] font-black rounded-lg outline-none transition-all"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")} />
      ))}
    </div>
  );
}

// Password requirement checker
function pwCheck(pw) {
  return {
    length:  pw.length >= 7,
    letter:  /[a-zA-Z]/.test(pw),
    special: /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(pw),
  };
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  // "email" | "otp" | "done"
  const [step,    setStep]    = useState("email");
  const [email,   setEmail]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [newPw,   setNewPw]   = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const checks = pwCheck(newPw);
  const pwValid = checks.length && checks.letter && checks.special;

  async function sendOTP(e) {
    e.preventDefault();
    if (!email) return setError("Enter your email address");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed");
      setStep("otp");
      setError("");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  async function resetPassword(e) {
    e.preventDefault();
    if (otp.length < 6)   return setError("Enter the full 6-digit code");
    if (!pwValid)         return setError("Password doesn't meet the requirements below");
    if (newPw !== confirm) return setError("Passwords don't match");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed");
      setStep("done");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface">
      <AuthNavbar />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">

          {/* Step 1 — enter email */}
          {step === "email" && (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: "#E5EEFF" }}>
                 <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h1 className="text-[1.4rem] font-black text-dark text-center mb-1">Forgot your password?</h1>
              <p className="text-body text-[14px] text-center mb-7">
                Enter your email and we'll send you a reset code.
              </p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">{error}</div>
              )}

              <form onSubmit={sendOTP} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email address</label>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : null}
                  {loading ? "Sending…" : "Send reset code"}
                </button>
              </form>

              <p className="mt-5 text-center text-[13px] text-body">
                Remembered it?{" "}
                <Link to="/login" className="text-accent hover:text-accent-hover font-semibold">Back to login</Link>
              </p>
            </>
          )}

          {/* Step 2 — enter OTP + new password */}
          {step === "otp" && (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: "#E5EEFF" }}>
                  <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <h1 className="text-[1.4rem] font-black text-dark mb-1">Enter the code</h1>
                <p className="text-body text-[14px]">
                  We sent a 6-digit code to <strong className="text-dark">{email}</strong>
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">{error}</div>
              )}

              <form onSubmit={resetPassword} className="flex flex-col gap-4">
                <OTPInput value={otp} onChange={(v) => { setOtp(v); setError(""); }} />

                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={newPw}
                      onChange={(e) => { setNewPw(e.target.value); setError(""); }}
                      placeholder="Min. 7 chars, one special character"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                    <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body">
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* Live requirement hints */}
                  {newPw.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {[
                        [checks.length,  "At least 7 characters"],
                        [checks.letter,  "At least one letter"],
                        [checks.special, "At least one special character (!@#$%^&* etc.)"],
                      ].map(([ok, label]) => (
                        <p key={label} className="text-[11.5px] flex items-center gap-1.5"
                          style={{ color: ok ? "#12875A" : "#94A3B8" }}>
                          <span>{ok ? "✓" : "·"}</span> {label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Confirm Password</label>
                  <input type="password" value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent transition-all" />
                </div>

                <button type="submit" disabled={loading || otp.length < 6 || !pwValid || !confirm}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : null}
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>

              <p className="mt-4 text-center text-[13px] text-body">
                Wrong email?{" "}
                <button onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="text-accent font-semibold hover:text-accent-hover">Go back</button>
              </p>
            </>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h1 className="text-[1.4rem] font-black text-dark mb-2">Password reset</h1>
              <p className="text-body text-[14px] mb-6">Your password has been updated. You can now log in with your new password.</p>
              <button onClick={() => navigate("/login")}
                className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover transition-colors">
                Go to login
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-border py-4">© 2026 Planova</p>
    </div>
  );
}
