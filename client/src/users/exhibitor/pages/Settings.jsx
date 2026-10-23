import { useState, useEffect } from "react";
import { Check, X, Lock, User, Loader2 } from "lucide-react";
import { useProfile, updateProfile } from "../../../hooks/useProfile";

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3.5 cursor-pointer"
      style={{ borderBottom: "1px solid #F5F7FB" }}>
      <div>
        <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>{label}</p>
        {description && <p className="text-[12px] mt-0.5" style={{ color: "#94A3B8" }}>{description}</p>}
      </div>
      <div className="relative shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className="w-10 rounded-full transition-colors" style={{ height: "22px", background: checked ? "#3478F6" : "#DDE3ED" }} />
        <div className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all"
          style={{ width: "16px", height: "16px", left: checked ? "21px" : "3px" }} />
      </div>
    </label>
  );
}

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

export default function Settings() {
  const { profile, loading, error, refresh } = useProfile();
  const [toast,       setToast]       = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [showPwForm,  setShowPwForm]  = useState(false);

  const [account, setAccount] = useState({ name: "", email: "" });
  const [pwForm,  setPwForm]  = useState({ password: "", confirm: "" });

  useEffect(() => {
    if (!profile) return;
    setAccount({ name: profile.name || "", email: profile.email || "" });
  }, [profile]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const saveAccount = async () => {
    try {
      setSaving(true);
      await updateProfile({ name: account.name, email: account.email });
      refresh();
      setEditAccount(false);
      showToast("ok", "Settings saved");
    } catch (e) {
      showToast("err", e.message);
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (pwForm.password !== pwForm.confirm)
      return showToast("err", "Passwords do not match");
    if (pwForm.password.length < 6)
      return showToast("err", "Password must be at least 6 characters");
    try {
      setSaving(true);
      await updateProfile({ password: pwForm.password });
      setShowPwForm(false);
      setPwForm({ password: "", confirm: "" });
      showToast("ok", "Password updated");
    } catch (e) {
      showToast("err", e.message);
    } finally { setSaving(false); }
  };

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

      {/* Toast */}
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

      {/* Account info */}
      <Section icon={User} title="Account Information">
        <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Name</p>
          {editAccount ? (
            <input value={account.name}
              onChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))}
              className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
              style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
          ) : (
            <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{account.name || "—"}</p>
          )}
        </div>
        <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Account Email</p>
          {editAccount ? (
            <input type="email" value={account.email}
              onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))}
              className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
              style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
          ) : (
            <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{account.email || "—"}</p>
          )}
        </div>
        <div className="py-3.5 flex gap-2">
          {!editAccount ? (
            <button onClick={() => setEditAccount(true)}
              className="text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
              Edit
            </button>
          ) : (
            <>
              <button onClick={saveAccount} disabled={saving}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded-lg text-white transition-colors"
                style={{ background: "#3478F6", opacity: saving ? 0.7 : 1 }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.background = "#1D5FE0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
              </button>
              <button onClick={() => setEditAccount(false)}
                className="flex items-center gap-1 text-[12px] font-semibold px-3 py-2 rounded-lg transition-colors"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
                <X size={12} /> Cancel
              </button>
            </>
          )}
        </div>
      </Section>

      {/* Password */}
      <Section icon={Lock} title="Password & Security">
        {!showPwForm ? (
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Password</p>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>Change your account password</p>
            </div>
            <button onClick={() => setShowPwForm(true)}
              className="text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors"
              style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
              Change
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>New Password</p>
              <input type="password" value={pwForm.password}
                onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Confirm Password</p>
              <input type="password" value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={savePassword} disabled={saving}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded-lg text-white transition-colors"
                style={{ background: "#3478F6", opacity: saving ? 0.7 : 1 }}>
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Update Password
              </button>
              <button onClick={() => { setShowPwForm(false); setPwForm({ password: "", confirm: "" }); }}
                className="flex items-center gap-1 text-[12px] font-semibold px-3 py-2 rounded-lg transition-colors"
                style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
