import { useState, useEffect, useRef } from "react";
import { Check, X, Camera, Lock, Mail, Pencil, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../hooks/useProfile";
import { useAuth } from "../../context/AuthContext";

function Field({ label, value, type = "text", onChange }) {
  return (
    <div className="space-y-1">
      <label className="block text-[12px] font-semibold text-slate-600">{label}</label>
      <input type={type} value={value} onChange={onChange}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-bold text-[13.5px] text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
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
          className="w-10 h-11 text-center text-[16px] font-black rounded-lg outline-none border border-slate-200 focus:border-cyan-400 transition-all" />
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
  const fileRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");

  const [emailStep, setEmailStep] = useState("idle");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [pwStep, setPwStep] = useState("idle");
  const [newPw, setNewPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwOtp, setPwOtp] = useState("");

  useEffect(() => {
    if (profile) setName(profile.name || "");
  }, [profile]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2800);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast("err", "Image too large — max 2MB");

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

  async function saveName() {
    try {
      setSaving(true);
      await updateProfile({ name });
      updateUser({ name });
      refresh();
      setEditName(false);
      showToast("ok", "Name updated");
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
      if (!res.ok) return showToast("err", data.message);
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
      if (!res.ok) return showToast("err", data.message);
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
      if (!res.ok) return showToast("err", data.message);
      setPwStep("otp");
      showToast("ok", "OTP sent to your email");
    } catch { showToast("err", "Something went wrong"); }
  }

  async function confirmPwOTP() {
    if (pwOtp.length < 6) return showToast("err", "Enter the full code");
    try {
      const res = await fetch("/api/auth/confirm-password-change", {
        method: "POST", headers: authHeader(), body: JSON.stringify({ otp: pwOtp }),
      });
      const data = await res.json();
      if (!res.ok) return showToast("err", data.message);
      updateUser({ token: data.token });
      localStorage.setItem("planova_token", data.token);
      setPwStep("idle"); setNewPw(""); setPwConfirm(""); setPwOtp("");
      showToast("ok", "Password updated");
    } catch { showToast("err", "Something went wrong"); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin text-cyan-500" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl">
      <p className="text-[13.5px] font-semibold text-red-600 mb-2">Could not load profile.</p>
      <button onClick={refresh} className="text-[13px] font-bold text-cyan-500">Try again</button>
    </div>
  );

  return (
    <div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold ${
          toast.type === "ok" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "ok" ? <Check size={14} /> : <X size={14} />} {toast.msg}
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Settings</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Manage your admin account.</p>
      </div>

      <div className="space-y-5 max-w-2xl">

        {/* Profile picture */}
        <Section title="Profile Picture">
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-[20px] font-black">
                  {initials(profile.name)}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                {uploadingAvatar ? <Loader2 size={16} className="animate-spin text-white" /> : <Camera size={16} className="text-white" />}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-slate-700">{profile.name}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">{profile.email}</p>
              <p className="text-[11.5px] text-slate-400 mt-2">Click the photo to change it. JPG or PNG, max 2MB.</p>
            </div>
          </div>
        </Section>

        {/* Name */}
        <Section title="Display Name">
          {!editName ? (
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] text-slate-700">{profile.name}</p>
              <button onClick={() => setEditName(true)}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-cyan-500 hover:text-cyan-600">
                <Pencil size={12} /> Edit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={saveName} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 disabled:opacity-60">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
                </button>
                <button onClick={() => { setEditName(false); setName(profile.name); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold hover:border-slate-300">
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* Email — OTP required */}
        <Section title="Email Address">
          {emailStep === "idle" && (
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] text-slate-700">{profile.email}</p>
              <button onClick={() => setEmailStep("enter")}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-cyan-500 hover:text-cyan-600">
                <Mail size={12} /> Change
              </button>
            </div>
          )}
          {emailStep === "enter" && (
            <div className="space-y-3">
              <Field label="New Email Address" value={newEmail} type="email" onChange={(e) => setNewEmail(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={sendEmailOTP}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600">
                  Send OTP
                </button>
                <button onClick={() => setEmailStep("idle")}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
          {emailStep === "otp" && (
            <div className="space-y-3">
              <p className="text-[13px] text-slate-500">
                Enter the 6-digit code sent to <strong className="text-slate-700">{newEmail}</strong>
              </p>
              <OTPInput value={emailOtp} onChange={setEmailOtp} />
              <div className="flex gap-2 pt-1">
                <button onClick={confirmEmailOTP} disabled={emailOtp.length < 6}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 disabled:opacity-60">
                  <Check size={13} /> Confirm
                </button>
                <button onClick={() => setEmailStep("idle")}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* Password — OTP required */}
        <Section title="Password">
          {pwStep === "idle" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Lock size={14} className="text-slate-400" />
                </div>
                <p className="text-[13.5px] text-slate-700">Change your password</p>
              </div>
              <button onClick={() => setPwStep("enter")}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold hover:border-cyan-400 hover:text-cyan-500 transition-colors">
                Change
              </button>
            </div>
          )}
          {pwStep === "enter" && (
            <div className="space-y-3">
              <Field label="New Password" value={newPw} type="password" onChange={(e) => setNewPw(e.target.value)} />
              <Field label="Confirm Password" value={pwConfirm} type="password" onChange={(e) => setPwConfirm(e.target.value)} />
              <p className="text-[12px] text-slate-400">An OTP will be sent to {profile.email} to confirm.</p>
              <div className="flex gap-2">
                <button onClick={sendPwOTP}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600">
                  Send OTP
                </button>
                <button onClick={() => setPwStep("idle")}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
          {pwStep === "otp" && (
            <div className="space-y-3">
              <p className="text-[13px] text-slate-500">
                Enter the code sent to <strong className="text-slate-700">{profile.email}</strong>
              </p>
              <OTPInput value={pwOtp} onChange={setPwOtp} />
              <div className="flex gap-2 pt-1">
                <button onClick={confirmPwOTP} disabled={pwOtp.length < 6}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 disabled:opacity-60">
                  <Check size={13} /> Confirm & Update
                </button>
                <button onClick={() => setPwStep("idle")}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[13px] font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
