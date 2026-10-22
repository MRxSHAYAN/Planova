import { useState } from "react";
import { Pencil, Check, X, Lock, Bell } from "lucide-react";
import { CURRENT_USER } from "../data/mockData";

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
          onFocus={(e) => e.target.style.borderColor = "#3478F6"}
          onBlur={(e) => e.target.style.borderColor = "#DCEAFF"}
        />
      ) : (
        <p className="text-[13.5px] font-medium" style={{ color: value ? "#09152E" : "#B0BCC8" }}>
          {value || "Not set"}
        </p>
      )}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3.5 cursor-pointer" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <div>
        <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>{label}</p>
        {description && <p className="text-[12px] mt-0.5" style={{ color: "#94A3B8" }}>{description}</p>}
      </div>
      <div className="relative shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div
          className="w-10 rounded-full transition-colors"
          style={{
            height: "22px",
            background: checked ? "#3478F6" : "#DDE3ED",
          }}
        />
        <div
          className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all"
          style={{
            width: "16px",
            height: "16px",
            left: checked ? "21px" : "3px",
          }}
        />
      </div>
    </label>
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
  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact,  setEditContact]  = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const [personal, setPersonal] = useState({
    name:    CURRENT_USER.name,
    role:    CURRENT_USER.role,
    company: CURRENT_USER.company,
    city:    CURRENT_USER.city,
  });
  const [contact, setContact] = useState({
    email: CURRENT_USER.email,
    phone: CURRENT_USER.phone,
  });

  const showToast = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2200); };

  const savePersonal = () => { setEditPersonal(false); showToast(); };
  const saveContact  = () => { setEditContact(false);  showToast(); };

  const EditButtons = ({ onSave, onCancel }) => (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
        style={{ background: "#3478F6" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
      >
        <Check size={12} /> Save
      </button>
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}
      >
        <X size={12} /> Cancel
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Toast */}
      {saved && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{ background: "#E6F9F1", color: "#12875A", border: "1px solid #A7F3D0" }}
        >
          <Check size={15} /> Changes saved
        </div>
      )}

      {/* Profile header */}
      <div
        className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: "#09152E" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black shrink-0"
          style={{ background: "#1A2D4D", color: "#3478F6" }}
        >
          {CURRENT_USER.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{personal.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {personal.role} · {personal.company}
          </p>
        </div>
        <span
          className="text-[10.5px] font-bold px-3 py-1 rounded-full shrink-0"
          style={{ background: "#E6F9F1", color: "#12875A" }}
        >
          Attendee
        </span>
      </div>

      {/* Personal details */}
      <Section
        title="Personal Details"
        action={
          !editPersonal
            ? (
              <button
                className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
                style={{ color: "#3478F6" }}
                onClick={() => setEditPersonal(true)}
              >
                <Pencil size={12} /> Edit
              </button>
            )
            : <EditButtons onSave={savePersonal} onCancel={() => setEditPersonal(false)} />
        }
      >
        <Field label="Full Name"    name="name"    value={personal.name}    editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Role / Title" name="role"    value={personal.role}    editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Company"      name="company" value={personal.company} editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"         name="city"    value={personal.city}    editing={editPersonal} onChange={(e) => setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Contact info */}
      <Section
        title="Contact Info"
        action={
          !editContact
            ? (
              <button
                className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
                style={{ color: "#3478F6" }}
                onClick={() => setEditContact(true)}
              >
                <Pencil size={12} /> Edit
              </button>
            )
            : <EditButtons onSave={saveContact} onCancel={() => setEditContact(false)} />
        }
      >
        <Field label="Email"        name="email" value={contact.email} type="email" editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone Number" name="phone" value={contact.phone} type="tel"   editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Password */}
      <Section title="Password & Security">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F0F3FA" }}>
              <Lock size={14} style={{ color: "#94A3B8" }} />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Password</p>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>Last changed 3 months ago</p>
            </div>
          </div>
          <button
            className="text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}
          >
            Change
          </button>
        </div>
      </Section>
    </div>
  );
}
