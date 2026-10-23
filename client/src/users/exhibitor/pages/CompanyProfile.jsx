import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";

function Field({ label, name, value, type = "text", editing, onChange, multiline }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>{label}</p>
      {editing ? (
        multiline ? (
          <textarea name={name} value={value} onChange={onChange} rows={3}
            className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors resize-none"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
            onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")} />
        ) : (
          <input type={type} name={name} value={value} onChange={onChange}
            className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
            onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")} />
        )
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

export default function CompanyProfile() {
  const { profile, loading, error, refresh } = useProfile();
  const { updateUser } = useAuth();
  const [toast,       setToast]       = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [editInfo,    setEditInfo]    = useState(false);
  const [editContact, setEditContact] = useState(false);

  // Fields editable on the User model
  const [info, setInfo] = useState({ company: "", city: "" });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!profile) return;
    setInfo({ company: profile.company || "", city: profile.city || "" });
    setContact({ name: profile.name || "", email: profile.email || "", phone: profile.phone || "" });
  }, [profile]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const saveInfo = async () => {
    try {
      setSaving(true);
      await updateProfile({ company: info.company, city: info.city });
      updateUser({ company: info.company, city: info.city });
      refresh();
      setEditInfo(false);
      showToast("ok", "Company info saved");
    } catch (e) { showToast("err", e.message); }
    finally { setSaving(false); }
  };

  const saveContact = async () => {
    try {
      setSaving(true);
      await updateProfile({ name: contact.name, email: contact.email, phone: contact.phone });
      updateUser({ name: contact.name, email: contact.email, phone: contact.phone });
      refresh();
      setEditContact(false);
      showToast("ok", "Contact details saved");
    } catch (e) { showToast("err", e.message); }
    finally { setSaving(false); }
  };

  const EditActions = ({ onSave, onCancel }) => (
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

  const abbr = initials(profile?.company || profile?.name);

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

      {/* Company header */}
      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#09152E" }}>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[18px] font-black shrink-0 text-white"
          style={{ background: "#3478F6" }}>
          {abbr}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{profile?.company || profile?.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {profile?.city || "—"} · Exhibitor
          </p>
        </div>
      </div>

      {/* Company Info */}
      <Section title="Company Information"
        action={!editInfo
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditInfo(true)}><Pencil size={12} /> Edit</button>
          : <EditActions onSave={saveInfo} onCancel={() => setEditInfo(false)} />}>
        <Field label="Company Name" name="company" value={info.company} editing={editInfo}
          onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"         name="city"    value={info.city}    editing={editInfo}
          onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Contact */}
      <Section title="Contact Details"
        action={!editContact
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditContact(true)}><Pencil size={12} /> Edit</button>
          : <EditActions onSave={saveContact} onCancel={() => setEditContact(false)} />}>
        <Field label="Contact Person" name="name"  value={contact.name}  editing={editContact}
          onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Business Email" name="email" value={contact.email} editing={editContact} type="email"
          onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone"          name="phone" value={contact.phone} editing={editContact} type="tel"
          onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>
    </div>
  );
}
