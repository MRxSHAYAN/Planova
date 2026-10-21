import { useState } from "react";
import { ADMIN_USER } from "../data/adminData";

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

export default function Settings() {
  const [profile, setProfile] = useState({ name: ADMIN_USER.name, email: ADMIN_USER.email });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold">
          ✓ {toast}
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Settings</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Admin account and platform configuration.</p>
      </div>

      <div className="space-y-5 max-w-2xl">

        {/* Profile */}
        <Section title="Admin Profile">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[18px] font-black shadow-md shadow-orange-500/20">
              {ADMIN_USER.initials}
            </div>
            <div>
              <p className="font-bold text-slate-800">{ADMIN_USER.name}</p>
              <p className="text-[12.5px] text-slate-400">{ADMIN_USER.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Display Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Email Address</label>
              <input value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
            </div>
            <button onClick={() => showToast("Profile saved successfully.")}
              className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-[13px] font-bold hover:bg-orange-600 transition-colors">
              Save Profile
            </button>
          </div>
        </Section>

        {/* Change password */}
        <Section title="Change Password">
          <div className="space-y-4">
            {["Current Password","New Password","Confirm New Password"].map(label => (
              <div key={label}>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              </div>
            ))}
            <button onClick={() => showToast("Password updated successfully.")}
              className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-[13px] font-bold hover:bg-orange-600 transition-colors">
              Update Password
            </button>
          </div>
        </Section>

        {/* Platform */}
        <Section title="Platform Settings">
          <div className="space-y-4">
            {[
              { label: "Platform Name",   val: "Planova",               note: "" },
              { label: "Support Email",   val: "support@planova.pk",    note: "" },
              { label: "Country",         val: "Pakistan",              note: "" },
            ].map(({ label, val }) => (
              <div key={label}>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}</label>
                <input defaultValue={val}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              </div>
            ))}
            <button onClick={() => showToast("Settings saved successfully.")}
              className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-[13px] font-bold hover:bg-orange-600 transition-colors">
              Save Settings
            </button>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12.5px] text-amber-700">
            ⚠ Settings require backend integration to save permanently.
          </div>
        </Section>
      </div>
    </div>
  );
}
