import { useState } from "react";
import { Check, X, Lock, Bell, User } from "lucide-react";
import { CURRENT_COMPANY } from "../data/mockData";

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
  const [prefs, setPrefs] = useState({ ...CURRENT_COMPANY.notificationPrefs });
  const [saved, setSaved] = useState(false);
  const [account, setAccount] = useState({
    contactPerson: CURRENT_COMPANY.contactPerson,
    email:         CURRENT_COMPANY.email,
  });
  const [editAccount, setEditAccount] = useState(false);

  const showToast = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {saved && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{ background: "#E6F9F1", color: "#12875A", border: "1px solid #A7F3D0" }}>
          <Check size={15} /> Settings saved · Demo only
        </div>
      )}

      {/* Account info */}
      <Section icon={User} title="Account Information">
        <div className="py-3.5" style={{ borderBottom: "1px solid #F5F7FB" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B0BCC8" }}>Contact Person</p>
          {editAccount ? (
            <input value={account.contactPerson}
              onChange={(e) => setAccount((p) => ({ ...p, contactPerson: e.target.value }))}
              className="w-full text-[13.5px] px-3 py-2 rounded-lg outline-none transition-colors"
              style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }} />
          ) : (
            <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{account.contactPerson}</p>
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
            <p className="text-[13.5px] font-medium" style={{ color: "#09152E" }}>{account.email}</p>
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
              <button onClick={() => { setEditAccount(false); showToast(); }}
                className="flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded-lg text-white transition-colors"
                style={{ background: "#3478F6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
                <Check size={12} /> Save
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
        <div className="py-4 flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-semibold" style={{ color: "#09152E" }}>Password</p>
            <p className="text-[12px]" style={{ color: "#94A3B8" }}>Last changed 2 months ago</p>
          </div>
          <button className="text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
            Change
          </button>
        </div>
      </Section>

      {/* Notification prefs */}
      <Section icon={Bell} title="Notification Preferences">
        <Toggle label="Application Updates"
          description="Approval, rejection, or status changes on your applications."
          checked={prefs.applicationUpdates}
          onChange={() => setPrefs((p) => ({ ...p, applicationUpdates: !p.applicationUpdates }))} />
        <Toggle label="Booth Assignments"
          description="Notify when an organizer assigns or updates your booth."
          checked={prefs.boothAssignments}
          onChange={() => setPrefs((p) => ({ ...p, boothAssignments: !p.boothAssignments }))} />
        <Toggle label="Deadline Reminders"
          description="Reminders before application and setup deadlines."
          checked={prefs.deadlineReminders}
          onChange={() => setPrefs((p) => ({ ...p, deadlineReminders: !p.deadlineReminders }))} />
        <Toggle label="Organizer Messages"
          description="Notify when an organizer sends you a message."
          checked={prefs.organiserMessages}
          onChange={() => setPrefs((p) => ({ ...p, organiserMessages: !p.organiserMessages }))} />
        <Toggle label="Platform Announcements"
          description="General updates from the Planova team."
          checked={prefs.platformAnnouncements}
          onChange={() => setPrefs((p) => ({ ...p, platformAnnouncements: !p.platformAnnouncements }))} />
        <div className="py-4">
          <button onClick={showToast}
            className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            Save Preferences
          </button>
        </div>
      </Section>

      <p className="text-center text-[11.5px] pb-4" style={{ color: "#B0BCC8" }}>
        Demo data — connect to backend to persist changes.
      </p>
    </div>
  );
}
