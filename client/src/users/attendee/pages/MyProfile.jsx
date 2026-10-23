import { useState, useEffect } from "react";
import { Pencil, Check, X, Lock, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../../hooks/useProfile";

function Field({ label, name, value, type = "text", editing, onChange }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>{label}</p>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")}
        />
      ) : (
        <p className="text-[13.5px] font-medium" style={{ color: value ? "#09152E" : "#B0BCC8" }}>
          {value || "Not set"}
        </p>
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

export default function MyProfile() {
  const { profile, loading, error, refresh } = useProfile();

  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact,  setEditContact]  = useState(false);
  const [showPwForm,   setShowPwForm]   = useState(false);
  const [toast,        setToast]        = useState(null); // { type: "ok"|"err", msg }
  const [saving,       setSaving]       = useState(false);

  const [personal, setPersonal] = useState({ name: "", company: "", city: "" });
  const [contact,  setContact]  = useState({ email: "", phone: "" });
  const [pwForm,   setPwForm]   = useState({ password: "", confirm: "" });

  // Sync local state when profile loads
  useEffect(() => {
    if (!profile) return;
    setPersonal({ name: profile.name || "", company: profile.company || "", city: profile.city || "" });
    setContact({ email: profile.email || "", phone: profile.phone || "" });
  }, [profile]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const savePersonal = async () => {
    try {
      setSaving(true);
      await updateProfile({ name: personal.name, company: personal.company, city: personal.city });
      refresh();
      setEditPersonal(false);
      showToast("ok", "Changes saved");
    } catch (e) {
      showToast("err", e.message);
    } finally { setSaving(false); }
  };

  const saveContact = async () => {
    try {
      setSaving(true);
      await updateProfile({ email: contact.email, phone: contact.phone });
      refresh();
      setEditContact(false);
      showToast("ok", "Changes saved");
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

  const EditButtons = ({ onSave, onCancel }) => (
    <div className="flex gap-2">
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
        style={{ background: "#3478F6", opacity: saving ? 0.7 : 1 }}
        onMouseEnter={(e) => !saving && (e.currentTarget.style.background = "#1D5FE0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
      </button>
      <button onClick={onCancel}
        className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
        <X size={12} /> Cancel
      </button>
    </div>
  );

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

      {/* Profile header */}
      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#09152E" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black shrink-0"
          style={{ background: "#1A2D4D", color: "#3478F6" }}>
          {initials(profile?.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{profile?.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {profile?.company || "No company set"} · {profile?.city || ""}
          </p>
        </div>
        <span className="text-[10.5px] font-bold px-3 py-1 rounded-full shrink-0 capitalize"
          style={{ background: "#E6F9F1", color: "#12875A" }}>
          {profile?.role}
        </span>
      </div>

      {/* Personal details */}
      <Section title="Personal Details"
        action={!editPersonal
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditPersonal(true)}>
              <Pencil size={12} /> Edit
            </button>
          : <EditButtons onSave={savePersonal} onCancel={() => setEditPersonal(false)} />
        }>
        <Field label="Full Name" name="name"    value={personal.name}    editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Company"   name="company" value={personal.company} editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"      name="city"    value={personal.city}    editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Contact info */}
      <Section title="Contact Info"
        action={!editContact
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditContact(true)}>
              <Pencil size={12} /> Edit
            </button>
          : <EditButtons onSave={saveContact} onCancel={() => setEditContact(false)} />
        }>
        <Field label="Email"        name="email" value={contact.email} type="email" editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone Number" name="phone" value={contact.phone} type="tel"   editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Password */}
      <Section title="Password & Security">
        {!showPwForm ? (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F0F3FA" }}>
                <Lock size={14} style={{ color: "#94A3B8" }} />
              </div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Password</p>
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
            <Field label="New Password"     name="password" value={pwForm.password} type="password" editing={true}
              onChange={(e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }))} />
            <Field label="Confirm Password" name="confirm"  value={pwForm.confirm}  type="password" editing={true}
              onChange={(e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }))} />
            <EditButtons onSave={savePassword} onCancel={() => { setShowPwForm(false); setPwForm({ password: "", confirm: "" }); }} />
          </div>
        )}
      </Section>
    </div>
  );
}
