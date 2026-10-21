import { useState } from "react";
import { Pencil, Check, X, Globe, Phone, Mail, MapPin, Linkedin, Twitter, Building2 } from "lucide-react";
import { CURRENT_COMPANY } from "../data/mockData";

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
            onBlur={(e) => (e.target.style.borderColor = "#DCEAFF")} />
        ) : (
          <input type={type} name={name} value={value} onChange={onChange}
            className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
            onBlur={(e) => (e.target.style.borderColor = "#DCEAFF")} />
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
  const [editInfo,    setEditInfo]    = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editSocial,  setEditSocial]  = useState(false);
  const [savedToast,  setSavedToast]  = useState(false);

  const [info, setInfo] = useState({
    name:        CURRENT_COMPANY.name,
    category:    CURRENT_COMPANY.category,
    description: CURRENT_COMPANY.description,
    address:     CURRENT_COMPANY.address,
    city:        CURRENT_COMPANY.city,
  });
  const [contact, setContact] = useState({
    contactPerson: CURRENT_COMPANY.contactPerson,
    email:         CURRENT_COMPANY.email,
    phone:         CURRENT_COMPANY.phone,
    website:       CURRENT_COMPANY.website,
  });
  const [social, setSocial] = useState({
    linkedin: CURRENT_COMPANY.linkedin,
    twitter:  CURRENT_COMPANY.twitter,
  });

  const showToast = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2300); };

  const EditActions = ({ onSave, onCancel }) => (
    <div className="flex gap-2">
      <button onClick={() => { onSave(); showToast(); }}
        className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
        style={{ background: "#3478F6" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
        <Check size={12} /> Save
      </button>
      <button onClick={onCancel}
        className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}>
        <X size={12} /> Cancel
      </button>
    </div>
  );

  const pct = CURRENT_COMPANY.profileComplete;

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{ background: "#E6F9F1", color: "#12875A", border: "1px solid #A7F3D0" }}>
          <Check size={15} /> Changes saved · Demo only
        </div>
      )}

      {/* Company header card */}
      <div className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: "#09152E" }}>
        {/* Logo placeholder */}
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[18px] font-black shrink-0 text-white"
          style={{ background: CURRENT_COMPANY.logoColor }}>
          {CURRENT_COMPANY.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">{info.name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {info.category} · Member since {CURRENT_COMPANY.memberSince}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[22px] font-black" style={{ color: "#3478F6" }}>{pct}%</p>
          <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Profile complete</p>
        </div>
      </div>

      {/* Profile completion bar */}
      {pct < 100 && (
        <div className="rounded-xl px-5 py-4" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold" style={{ color: "#09152E" }}>Profile completion</p>
            <p className="text-[12px]" style={{ color: "#64748B" }}>{pct}%</p>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E8EEF8" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#3478F6" }} />
          </div>
          <p className="text-[11.5px] mt-2" style={{ color: "#94A3B8" }}>
            Add your company logo and website to reach 100%.
          </p>
        </div>
      )}

      {/* Logo upload (UI prototype) */}
      <Section title="Company Logo">
        <div className="py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-[20px] shrink-0"
              style={{ background: CURRENT_COMPANY.logoColor }}>
              {CURRENT_COMPANY.initials}
            </div>
            <div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "#09152E" }}>Upload company logo</p>
              <p className="text-[12px] mb-2" style={{ color: "#94A3B8" }}>PNG or JPG, recommended 200×200px · UI prototype only</p>
              <button className="text-[12px] font-bold px-4 py-2 rounded-lg transition-colors"
                style={{ background: "#F0F3FA", border: "1px solid #E8EEF8", color: "#3E506D" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
                Choose file
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Company info */}
      <Section title="Company Information"
        action={!editInfo
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditInfo(true)}><Pencil size={12} /> Edit</button>
          : <EditActions onSave={() => setEditInfo(false)} onCancel={() => setEditInfo(false)} />}>
        <Field label="Company Name"     name="name"        value={info.name}        editing={editInfo} onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Industry / Category" name="category" value={info.category}    editing={editInfo} onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Business Description" name="description" value={info.description} editing={editInfo} onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} multiline />
        <Field label="Business Address" name="address"     value={info.address}     editing={editInfo} onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"             name="city"        value={info.city}        editing={editInfo} onChange={(e) => setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Contact */}
      <Section title="Contact Details"
        action={!editContact
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditContact(true)}><Pencil size={12} /> Edit</button>
          : <EditActions onSave={() => setEditContact(false)} onCancel={() => setEditContact(false)} />}>
        <Field label="Contact Person"  name="contactPerson" value={contact.contactPerson} editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Business Email"  name="email"         value={contact.email}         editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} type="email" />
        <Field label="Phone"           name="phone"         value={contact.phone}         editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} type="tel" />
        <Field label="Website"         name="website"       value={contact.website}       editing={editContact} onChange={(e) => setContact((p) => ({ ...p, [e.target.name]: e.target.value }))} type="url" />
      </Section>

      {/* Social */}
      <Section title="Social Links"
        action={!editSocial
          ? <button className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setEditSocial(true)}><Pencil size={12} /> Edit</button>
          : <EditActions onSave={() => setEditSocial(false)} onCancel={() => setEditSocial(false)} />}>
        <Field label="LinkedIn URL" name="linkedin" value={social.linkedin} editing={editSocial} onChange={(e) => setSocial((p) => ({ ...p, [e.target.name]: e.target.value }))} type="url" />
        <Field label="Twitter / X"  name="twitter"  value={social.twitter}  editing={editSocial} onChange={(e) => setSocial((p) => ({ ...p, [e.target.name]: e.target.value }))} type="url" />
      </Section>

      <p className="text-center text-[11.5px] pb-4" style={{ color: "#B0BCC8" }}>
        Changes will be saved once backend is connected.
      </p>
    </div>
  );
}
