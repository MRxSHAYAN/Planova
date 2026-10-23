import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X, Camera, Loader2 } from "lucide-react";
import { useProfile, updateProfile, initials } from "../../../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";

// Single editable field
function Field({ label, name, value, type = "text", editing, onChange, multiline }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>
        {label}
      </p>
      {editing ? (
        multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none resize-none"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
            onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
            onBlur={(e)  => (e.target.style.borderColor = "#DCEAFF")}
          />
        )
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

export default function CompanyProfile() {
  const { profile, loading, error, refresh } = useProfile();
  const { updateUser } = useAuth();

  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [editCompany, setEditCompany] = useState(false);
  const [editContact, setEditContact] = useState(false);

  const fileRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Company-level fields (stored on User model)
  const [company, setCompany] = useState({
    company:     "",
    city:        "",
    description: "",
    website:     "",
    category:    "",
  });

  // Contact / account fields
  const [contact, setContact] = useState({
    name:  "",
    email: "",
    phone: "",
  });

  // Fill forms when profile loads
  useEffect(() => {
    if (!profile) return;
    setCompany({
      company:     profile.company     || "",
      city:        profile.city        || "",
      description: profile.description || "",
      website:     profile.website     || "",
      category:    profile.category    || "",
    });
    setContact({
      name:  profile.name  || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
  }, [profile]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
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
        showToast("ok", "Logo updated");
      } catch (err) {
        showToast("err", err.message);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveCompany() {
    try {
      setSaving(true);
      await updateProfile(company);
      updateUser({ company: company.company, city: company.city });
      refresh();
      setEditCompany(false);
      showToast("ok", "Company info saved");
    } catch (e) {
      showToast("err", e.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveContact() {
    try {
      setSaving(true);
      await updateProfile({ name: contact.name, email: contact.email, phone: contact.phone });
      updateUser({ name: contact.name, email: contact.email });
      refresh();
      setEditContact(false);
      showToast("ok", "Contact details saved");
    } catch (e) {
      showToast("err", e.message);
    } finally {
      setSaving(false);
    }
  }

  function EditButtons({ onSave, onCancel }) {
    return (
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg text-white"
          style={{ background: "#3478F6" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}
        >
          <X size={12} /> Cancel
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl px-5 py-8 text-center" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
        <p className="text-[13.5px] font-semibold mb-3" style={{ color: "#B91C1C" }}>
          Could not load profile. Make sure you are logged in and the server is running.
        </p>
        <button onClick={refresh} className="text-[12.5px] font-bold" style={{ color: "#3478F6" }}>
          Try again
        </button>
      </div>
    );
  }

  const abbr = initials(profile.company || profile.name);
  const hasCompany = !!profile.company;

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{
            background: toast.type === "ok" ? "#E6F9F1" : "#FEF2F2",
            color:      toast.type === "ok" ? "#12875A" : "#B91C1C",
            border:     `1px solid ${toast.type === "ok" ? "#A7F3D0" : "#FECACA"}`,
          }}
        >
          {toast.type === "ok" ? <Check size={15} /> : <X size={15} />} {toast.msg}
        </div>
      )}

      {/* Profile header */}
      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#09152E" }}>
        <div className="relative shrink-0 cursor-pointer" onClick={() => fileRef.current?.click()}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.company || profile.name}
              className="w-14 h-14 rounded-xl object-cover" style={{ background: "#3478F6" }} />
          ) : (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[18px] font-black text-white"
              style={{ background: "#3478F6" }}>
              {abbr}
            </div>
          )}
          <div className="absolute inset-0 rounded-xl flex items-center justify-center transition-opacity"
            style={{ background: "rgba(0,0,0,0.4)", opacity: uploadingAvatar ? 1 : 0 }}
            onMouseEnter={(e) => { if (!uploadingAvatar) e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (!uploadingAvatar) e.currentTarget.style.opacity = 0; }}>
            {uploadingAvatar ? <Loader2 size={16} className="animate-spin text-white" /> : <Camera size={16} className="text-white" />}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-black text-white">
            {profile.company || profile.name}
          </p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {profile.category || "No category"} · {profile.city || "No city"}
          </p>
        </div>
      </div>

      {/* Banner for new exhibitors who haven't filled company info yet */}
      {!hasCompany && (
        <div
          className="rounded-xl px-5 py-4 flex items-start gap-3"
          style={{ background: "#FFF8E6", border: "1.5px solid #FDE68A" }}
        >
          <span className="text-[18px]">👋</span>
          <div>
            <p className="text-[13.5px] font-bold" style={{ color: "#92400E" }}>
              Welcome! Set up your company profile.
            </p>
            <p className="text-[12.5px] mt-0.5" style={{ color: "#B45309" }}>
              Fill in your company name, category, and description so organizers can find you.
            </p>
          </div>
        </div>
      )}

      {/* Company information */}
      <Section
        title="Company Information"
        action={
          !editCompany
            ? <button onClick={() => setEditCompany(true)} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
                <Pencil size={12} /> {hasCompany ? "Edit" : "Add"}
              </button>
            : <EditButtons onSave={saveCompany} onCancel={() => setEditCompany(false)} />
        }
      >
        <Field label="Company Name"    name="company"     value={company.company}     editing={editCompany} onChange={(e) => setCompany(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Industry / Category" name="category" value={company.category}   editing={editCompany} onChange={(e) => setCompany(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="City"            name="city"        value={company.city}        editing={editCompany} onChange={(e) => setCompany(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Website"         name="website"     value={company.website}     editing={editCompany} type="url" onChange={(e) => setCompany(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="About / Description" name="description" value={company.description} editing={editCompany} multiline onChange={(e) => setCompany(p => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

      {/* Contact details */}
      <Section
        title="Contact Details"
        action={
          !editContact
            ? <button onClick={() => setEditContact(true)} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
                <Pencil size={12} /> Edit
              </button>
            : <EditButtons onSave={saveContact} onCancel={() => setEditContact(false)} />
        }
      >
        <Field label="Contact Person" name="name"  value={contact.name}  editing={editContact} onChange={(e) => setContact(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Email"          name="email" value={contact.email} editing={editContact} type="email" onChange={(e) => setContact(p => ({ ...p, [e.target.name]: e.target.value }))} />
        <Field label="Phone"          name="phone" value={contact.phone} editing={editContact} type="tel"   onChange={(e) => setContact(p => ({ ...p, [e.target.name]: e.target.value }))} />
      </Section>

    </div>
  );
}
