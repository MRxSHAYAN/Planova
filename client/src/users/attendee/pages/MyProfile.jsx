import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X, Lock, Mail, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";

// Single editable field row
function Field({ label, name, value, type = "text", editing, onChange }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>{label}</p>
      {editing ? (
        <input type={type} name={name} value={value} onChange={onChange}
          className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")} />
      ) : (
        <p className="text-[13.5px] font-medium" style={{ color: value ? "#09152E" : "#B0BCC8" }}>
          {value || "Not set"}
        </p>
      )}
    </div>
  );
}

// Card section wrapper
function Section({ title, children, action }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F3FA" }}>
        <p className="text-[13.5px] font-black" style={{ color: "#09152E" }}>{title}</p>
        {action}
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

// 6-box OTP input
function OTPInput({ value, onChange }) {
  const inputs = useRef([]);

  function handleChange(e, i) {
    const char = e.target.value.replace(/\D/, "").slice(-1);
    const arr  = value.split("");
    arr[i]     = char;
    onChange(arr.join("").slice(0, 6));
    if (char && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKey(e, i) {
    if (e.key === "Backspace" && !e.target.value && i > 0)
      inputs.current[i - 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  }

  return (
    <div className="flex gap-2">
      {[0,1,2,3,4,5].map((i) => (
        <input key={i} ref={(el) => (inputs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-10 h-11 text-center text-[16px] font-black rounded-lg outline-none"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e)  => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e)   => (e.target.style.borderColor = "#DCEAFF")} />
      ))}
    </div>
  );
}

export default function MyProfile() {
  const { profile, loading, error, refresh } = useProfile();
  const { updateUser } = useAuth();

  const [editPersonal, setEditPersonal] = useState(false);
  const [showPwForm,   setShowPwForm]   = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);

  const [personal, setPersonal] = useState({ name: "", company: "", city: "", phone: "" });
  const [pwForm,   setPwForm]   = useState({ newPassword: "", confirm: "" });

  // Email change — 3 sub-states: "idle" | "enter" | "otp"
  const [emailStep,  setEmailStep]  = useState("idle");
  const [newEmail,   setNewEmail]   = useState("");
  const [emailOtp,   setEmailOtp]   = useState("");
  const [emailSaving, setEmailSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setPersonal({
      name:    profile.name    || "",
      company: profile.company || "",
      city:    profile.city    || "",
      phone:   profile.phone   || "",
    });
  }, [profile]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2800);
  }

  async function savePersonal() {
    try {
      setSaving(true);
      await updateProfile({ name: personal.name, company: personal.company, city: personal.city, phone: personal.phone });
      updateUser({ name: personal.name, company: personal.company, city: personal.city });
      refresh();
      setEditPersonal(false);
      showToast("ok", "Changes saved");
    } catch (e) { showToast("err", e.message); }
    finally { setSaving(false); }
  }

  async function savePassword() {
    if (!pwForm.newPassword)                          return showToast("err", "Enter a new password");
    if (pwForm.newPassword !== pwForm.confirm)        return showToast("err", "Passwords do not match");
    if (pwForm.newPassword.length < 6)               return showToast("err", "Password must be at least 6 characters");
    try {
      setSaving(true);
      await updateProfile({ password: pwForm.newPassword });
      setShowPwForm(false);
      setPwForm({ newPassword: "", confirm: "" });
      showToast("ok", "Password updated");
    } catch (e) { showToast("err", e.message); }
    finally { setSaving(false); }
  }

  // Step 1: send OTP to new email
  async function sendEmailOTP() {
    if (!newEmail) return showToast("err", "Enter a new email address");
    try {
      setEmailSaving(true);
      const token = localStorage.getItem("planova_token");
      const res   = await fetch("/api/auth/request-email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Failed to send OTP");
      setEmailStep("otp");
      showToast("ok", "OTP sent to " + newEmail);
    } catch { showToast("err", "Something went wrong"); }
    finally { setEmailSaving(false); }
  }

  // Step 2: confirm OTP → email changes
  async function confirmEmailOTP() {
    if (emailOtp.length < 6) return showToast("err", "Enter the full 6-digit code");
    try {
      setEmailSaving(true);
      const token = localStorage.getItem("planova_token");
      const res   = await fetch("/api/auth/confirm-email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp: emailOtp }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Invalid OTP");
      // Update stored user with new email
      updateUser({ email: data.email, token: data.token });
      localStorage.setItem("planova_token", data.token);
      refresh();
      setEmailStep("idle");
      setNewEmail("");
      setEmailOtp("");
      showToast("ok", "Email updated successfully");
    } catch { showToast("err", "Something went wrong"); }
    finally { setEmailSaving(false); }
  }

  function EditButtons({ onSave, onCancel }) {
    return (
      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white"
          style={{ background: "#3478F6" }}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
          <X size={12} /> Cancel
        </button>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  if (error) return (
    <div className="rounded-xl px-5 py-8 text-center" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
      <p className="text-[13.5px] font-semibold mb-3" style={{ color: "#B91C1C" }}>
        Could not load profile. Make sure you are logged in and the server is running.
      </p>
      <button onClick={refresh} className="text-[12.5px] font-bold" style={{ color: "#3478F6" }}>Try again</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{
            background: toast.type === "ok" ? "#E6F9F1" : "#FEF2F2",
            color:      toast.type === "ok" ? "#12875A" : "#B91C1C",
            border:     `1px solid ${toast.type === "ok" ? "#A7F3D0" : "#FECACA"}`,
          }}>
          {toast.type === "ok" ? <Check size={15} /> : <X size={15} />} {toast.msg}
        </div>
      )}

      {/* Profile header */}
      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#09152E" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black shrink-0"
          style={{ background: "#1A2D4D", color: "#3478F6" }}>
          {initials(profile.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{profile.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {profile.company || "No company"} · {profile.city || "No city"}
          </p>
        </div>
        <span className="text-[10.5px] font-bold px-3 py-1 rounded-full shrink-0 capitalize"
          style={{ background: "#E6F9F1", color: "#12875A" }}>
          {profile.role}
        </span>
      </div>

      {/* Personal details */}
      <Section title="Personal Details"
        action={!editPersonal
          ? <button onClick={() => setEditPersonal(true)} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
              <Pencil size={12} /> Edit
            </button>
          : <EditButtons onSave={savePersonal} onCancel={() => setEditPersonal(false)} />
        }>
        <Field label="Full Name" name="name"    value={personal.name}    editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Company"   name="company" value={personal.company} editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"      name="city"    value={personal.city}    editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone"     name="phone"   value={personal.phone}   editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} type="tel" />
      </Section>

      {/* Email — separate section with OTP flow */}
      <Section title="Email Address">
        {emailStep === "idle" && (
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Current Email</p>
              <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{profile.email}</p>
            </div>
            <button onClick={() => { setEmailStep("enter"); setNewEmail(""); }}
              className="flex items-center gap-1.5 text-[12px] font-semibold shrink-0"
              style={{ color: "#3478F6" }}>
              <Mail size={12} /> Change
            </button>
          </div>
        )}

        {emailStep === "enter" && (
          <div className="py-3.5 space-y-3">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>New Email Address</p>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
                onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
                onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")} />
            </div>
            <div className="flex gap-2">
              <button onClick={sendEmailOTP} disabled={emailSaving}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ background: "#3478F6" }}>
                {emailSaving ? <Loader2 size={12} className="animate-spin" /> : null}
                {emailSaving ? "Sending…" : "Send OTP"}
              </button>
              <button onClick={() => setEmailStep("idle")}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {emailStep === "otp" && (
          <div className="py-3.5 space-y-3">
            <p className="text-[13px]" style={{ color: "#64748B" }}>
              Enter the 6-digit code sent to <strong style={{ color: "#09152E" }}>{newEmail}</strong>
            </p>
            <OTPInput value={emailOtp} onChange={(v) => setEmailOtp(v)} />
            <div className="flex gap-2 pt-1">
              <button onClick={confirmEmailOTP} disabled={emailSaving || emailOtp.length < 6}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ background: "#3478F6" }}>
                {emailSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Confirm
              </button>
              <button onClick={() => { setEmailStep("idle"); setEmailOtp(""); }}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Section>

      {/* Password */}
      <Section title="Password">
        {!showPwForm ? (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F0F3FA" }}>
                <Lock size={14} style={{ color: "#94A3B8" }} />
              </div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Change your password</p>
            </div>
            <button onClick={() => setShowPwForm(true)}
              className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}>
              Change
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <Field label="New Password"     name="newPassword" value={pwForm.newPassword} type="password" editing={true} onChange={(e) => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }))} />
            <Field label="Confirm Password" name="confirm"     value={pwForm.confirm}     type="password" editing={true} onChange={(e) => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }))} />
            <EditButtons onSave={savePassword} onCancel={() => { setShowPwForm(false); setPwForm({ newPassword: "", confirm: "" }); }} />
          </div>
        )}
      </Section>

    </div>
  );
}
