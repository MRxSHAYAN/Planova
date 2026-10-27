import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X, Lock, Mail, Camera, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";

function Field({ label, name, value, type = "text", editing, onChange }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>{label}</p>
      {editing ? (
        <input type={type} name={name} value={value} onChange={onChange}
          className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e) => (e.target.style.borderColor = "#DCEAFF")} />
      ) : (
        <p className="text-[13.5px] font-medium" style={{ color: value ? "#09152E" : "#B0BCC8" }}>{value || "Not set"}</p>
      )}
    </div>
  );
}

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

export default function MyProfile() {
  const { profile, loading, error, refresh } = useProfile();
  const { updateUser } = useAuth();

  const [editPersonal, setEditPersonal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [personal, setPersonal] = useState({ name: "", company: "", city: "", phone: "" });

  const [emailStep, setEmailStep] = useState("idle");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [pwStep, setPwStep] = useState("idle");
  const [newPw, setNewPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwOtp, setPwOtp] = useState("");

  const fileRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setPersonal({ name: profile.name || "", company: profile.company || "", city: profile.city || "", phone: profile.phone || "" });
  }, [profile]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2800);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast("err", "Image too large (max 2MB)");

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateProfile({ avatar: reader.result });
        updateUser({ avatar: reader.result });
        refresh();
        showToast("ok", "Profile picture updated");
      } catch (err) {
        showToast("err", err.message);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
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

  async function sendEmailOTP() {
    if (!newEmail) return showToast("err", "Enter a new email");
    try {
      const res = await fetch("/api/auth/request-email-change", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Failed");
      setEmailStep("otp");
      showToast("ok", "OTP sent to " + newEmail);
    } catch { showToast("err", "Something went wrong"); }
  }

  async function confirmEmailOTP() {
    if (emailOtp.length < 6) return showToast("err", "Enter the full code");
    try {
      const res = await fetch("/api/auth/confirm-email-change", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ otp: emailOtp }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message || "Invalid OTP");
      updateUser({ email: data.email, token: data.token });
      localStorage.setItem("planova_token", data.token);
      refresh();
      setEmailStep("idle"); setNewEmail(""); setEmailOtp("");
      showToast("ok", "Email updated");
    } catch { showToast("err", "Something went wrong"); }
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
        Could not load profile. Make sure the server is running.
      </p>
      <button onClick={refresh} className="text-[12.5px] font-bold" style={{ color: "#3478F6" }}>Try again</button>
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

      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#09152E" }}>
        <div className="relative shrink-0 cursor-pointer" onClick={() => fileRef.current?.click()}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name}
              className="w-14 h-14 rounded-full object-cover" style={{ background: "#1A2D4D" }} />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black"
              style={{ background: "#1A2D4D", color: "#3478F6" }}>
              {initials(profile.name)}
            </div>
          )}
          <div className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity"
            style={{ background: "rgba(0,0,0,0.4)", opacity: uploadingAvatar ? 1 : 0 }}
            onMouseEnter={(e) => { if (!uploadingAvatar) e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (!uploadingAvatar) e.currentTarget.style.opacity = 0; }}>
            {uploadingAvatar ? <Loader2 size={16} className="animate-spin text-white" /> : <Camera size={16} className="text-white" />}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{profile.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {profile.company || "No company"}  {profile.city || "No city"}
          </p>
        </div>
        <span className="text-[10.5px] font-bold px-3 py-1 rounded-full shrink-0 capitalize"
          style={{ background: "#E6F9F1", color: "#12875A" }}>{profile.role}</span>
      </div>

      <Section title="Personal Details"
        action={!editPersonal
          ? <button onClick={() => setEditPersonal(true)} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
              <Pencil size={12} /> Edit
            </button>
          : <EditButtons onSave={savePersonal} onCancel={() => setEditPersonal(false)} />}>
        <Field label="Full Name" name="name" value={personal.name} editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Company" name="company" value={personal.company} editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City" name="city" value={personal.city} editing={editPersonal} onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone" name="phone" value={personal.phone} editing={editPersonal} type="tel" onChange={(e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      <Section title="Email Address">
        {emailStep === "idle" && (
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Current Email</p>
              <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{profile.email}</p>
            </div>
            <button onClick={() => setEmailStep("enter")} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
              <Mail size={12} /> Change
            </button>
          </div>
        )}
        {emailStep === "enter" && (
          <div className="py-3.5 space-y-3">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>New Email</p>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com"
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
                onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
                onBlur={(e) => (e.target.style.borderColor = "#DCEAFF")} />
            </div>
            <div className="flex gap-2">
              <button onClick={sendEmailOTP} className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#3478F6" }}>Send OTP</button>
              <button onClick={() => setEmailStep("idle")} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>Cancel</button>
            </div>
          </div>
        )}
        {emailStep === "otp" && (
          <div className="py-3.5 space-y-3">
            <p className="text-[13px]" style={{ color: "#64748B" }}>
              Enter the code sent to <strong style={{ color: "#09152E" }}>{newEmail}</strong>
            </p>
            <OTPInput value={emailOtp} onChange={setEmailOtp} />
            <div className="flex gap-2 pt-1">
              <button onClick={confirmEmailOTP} disabled={emailOtp.length < 6}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#3478F6" }}>
                <Check size={12} /> Confirm
              </button>
              <button onClick={() => setEmailStep("idle")} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>Cancel</button>
            </div>
          </div>
        )}
      </Section>

      <Section title="Password">
        {pwStep === "idle" && (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F0F3FA" }}>
                <Lock size={14} style={{ color: "#94A3B8" }} />
              </div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Change password</p>
            </div>
            <button onClick={() => setPwStep("enter")} className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}>Change</button>
          </div>
        )}
        {pwStep === "enter" && (
          <div className="py-4 space-y-3">
            <Field label="New Password" name="newPw" value={newPw} type="password" editing={true} onChange={(e) => setNewPw(e.target.value)} />
            <Field label="Confirm Password" name="pwConfirm" value={pwConfirm} type="password" editing={true} onChange={(e) => setPwConfirm(e.target.value)} />
            <p className="text-[12px]" style={{ color: "#94A3B8" }}>An OTP will be sent to your email to confirm this change.</p>
            <div className="flex gap-2">
              <button onClick={sendPwOTP} className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#3478F6" }}>Send OTP</button>
              <button onClick={() => setPwStep("idle")} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
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
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#3478F6" }}>
                <Check size={12} /> Confirm & Update
              </button>
              <button onClick={() => setPwStep("idle")} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>Cancel</button>
            </div>
          </div>
        )}
      </Section>

    </div>
  );
}
