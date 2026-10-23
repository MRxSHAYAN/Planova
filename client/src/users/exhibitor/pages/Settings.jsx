import { useState, useEffect, useRef } from "react";
import { Check, X, Lock, User, Loader2 } from "lucide-react";
import { useProfile, updateProfile } from "../../../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
        <Icon size={14} style={{ color: "#94A3B8" }} />
        <p className="text-[13.5px] font-black" style={{ color: "#09152E" }}>{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
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
    <div className="flex gap-2">
      {[0,1,2,3,4,5].map((i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1} value={value[i] || ""}
          onChange={(e) => handle(e, i)} onKeyDown={(e) => key(e, i)} onPaste={paste}
          className="w-10 h-11 text-center text-[16px] font-black rounded-lg outline-none"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e) => (e.target.style.borderColor = "#DCEAFF")} />
      ))}
    </div>
  );
}

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

export default function Settings() {
  const { profile, loading, error, refresh } = useProfile();
  const { updateUser } = useAuth();
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");

  const [pwStep, setPwStep] = useState("idle");
  const [newPw, setNewPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwOtp, setPwOtp] = useState("");

  useEffect(() => {
    if (profile) setName(profile.name || "");
  }, [profile]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  }

  async function saveName() {
    try {
      setSaving(true);
      await updateProfile({ name });
      updateUser({ name });
      refresh();
      setEditName(false);
      showToast("ok", "Saved");
    } catch (e) { showToast("err", e.message); }
    finally { setSaving(false); }
  }

  async function sendPwOTP() {
    if (!newPw) return showToast("err", "Enter a new password");
    if (newPw !== pwConfirm) return showToast("err", "Passwords don't match");
    if (newPw.length < 6) return showToast("err", "Password must be 6+ characters");
    try {
      const res = await fetch("/api/auth/request-password-change", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Failed");
      setPwStep("otp");
      showToast("ok", "OTP sent to " + profile.email);
    } catch { showToast("err", "Something went wrong"); }
  }

  async function confirmPwOTP() {
    if (pwOtp.length < 6) return showToast("err", "Enter the full code");
    try {
      const res = await fetch("/api/auth/confirm-password-change", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ otp: pwOtp }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Invalid OTP");
      updateUser({ token: data.token });
      localStorage.setItem("planova_token", data.token);
      setPwStep("idle"); setNewPw(""); setPwConfirm(""); setPwOtp("");
      showToast("ok", "Password updated");
    } catch { showToast("err", "Something went wrong"); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  if (error) return (
    <div className="rounded-xl px-5 py-8 text-center" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
      <p className="text-[13.5px] font-semibold" style={{ color: "#B91C1C" }}>{error}</p>
      <button onClick={refresh} className="mt-3 text-[12.5px] font-bold" style={{ color: "#3478F6" }}>Retry</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{
            background: toast.type === "ok" ? "#E6F9F1" : "#FEF2F2",
            color: toast.type === "ok" ? "#12875A" : "#B91C1C",
            border: `1px solid ${toast.type === "ok" ? "#A7F3D0" : "#FECACA"}`,
          }}>
          {toast.type === "ok" ? <Check size={15} /> : <X size={15} />} {toast.msg}
        </div>
      )}

      <Section icon={User} title="Account Information">
        <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Name</p>
          {editName ? (
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
              style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
          ) : (
            <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{name || "—"}</p>
          )}
        </div>
        <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Email</p>
          <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{profile.email}</p>
        </div>
        <div className="py-3.5 flex gap-2">
          {!editName ? (
            <button onClick={() => setEditName(true)}
              className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}>Edit</button>
          ) : (
            <>
              <button onClick={saveName} disabled={saving}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded-lg text-white"
                style={{ background: "#3478F6" }}>
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
              </button>
              <button onClick={() => setEditName(false)}
                className="flex items-center gap-1 text-[12px] font-semibold px-3 py-2 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
                <X size={12} /> Cancel
              </button>
            </>
          )}
        </div>
      </Section>

      <Section icon={Lock} title="Password">
        {pwStep === "idle" && (
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Password</p>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>OTP will be sent to your email</p>
            </div>
            <button onClick={() => setPwStep("enter")}
              className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}>Change</button>
          </div>
        )}
        {pwStep === "enter" && (
          <div className="py-4 space-y-3">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>New Password</p>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Confirm Password</p>
              <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)}
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
            </div>
            <p className="text-[12px]" style={{ color: "#94A3B8" }}>An OTP will be sent to {profile.email} to confirm.</p>
            <div className="flex gap-2">
              <button onClick={sendPwOTP} className="text-[12px] font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#3478F6" }}>Send OTP</button>
              <button onClick={() => setPwStep("idle")} className="text-[12px] font-semibold px-3 py-2 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>Cancel</button>
            </div>
          </div>
        )}
        {pwStep === "otp" && (
          <div className="py-4 space-y-3">
            <p className="text-[13px]" style={{ color: "#64748B" }}>
              Enter the code sent to <strong style={{ color: "#09152E" }}>{profile.email}</strong>
            </p>
            <OTPInput value={pwOtp} onChange={setPwOtp} />
            <div className="flex gap-2 pt-1">
              <button onClick={confirmPwOTP} disabled={pwOtp.length < 6}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#3478F6" }}>
                <Check size={12} /> Confirm & Update
              </button>
              <button onClick={() => setPwStep("idle")} className="text-[12px] font-semibold px-3 py-2 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>Cancel</button>
            </div>
          </div>
        )}
      </Section>

    </div>
  );
}
