import { useState } from "react";
import { Link } from "react-router-dom";
import AuthNavbar from "../../components/AuthNavbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your email address.");
    // When backend is ready: POST /api/auth/forgot-password with { email }
    setSent(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface">
      <AuthNavbar />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[380px]">

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 mx-auto">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <h1 className="text-[1.4rem] font-black text-dark mb-2">Check your email</h1>
              <p className="text-body text-[14px] mb-2">
                If <span className="font-semibold text-dark">{email}</span> is registered,
                we've sent a password reset link.
              </p>
              <p className="text-muted text-[13px] mb-7">
                Didn't get it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full py-2.5 rounded-lg border border-border-card text-body text-[14px] font-semibold hover:border-accent hover:text-accent transition-colors mb-3"
              >
                Try a different email
              </button>
              <Link to="/login" className="block text-center text-[13px] text-accent hover:text-accent-hover font-semibold transition-colors">
                Back to login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <h1 className="text-[1.4rem] font-black text-dark text-center mb-1">Forgot your password?</h1>
              <p className="text-body text-[14px] text-center mb-7">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-card text-dark text-[14px] placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-[14px] hover:bg-accent-hover transition-colors"
                >
                  Send reset link
                </button>
              </form>

              <p className="mt-5 text-center text-[13px] text-body">
                Remembered it?{" "}
                <Link to="/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-border py-4">© 2026 Planova</p>
    </div>
  );
}
