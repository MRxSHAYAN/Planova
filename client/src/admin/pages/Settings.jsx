import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
  const { user, login } = useAuth();
  const [profile, setProfile]   = useState({ name: user?.name || "", email: user?.email || "" });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [toast, setToast]       = useState(null);
  const [error, setError]       = useState(null);

  const token = localStorage.getItem("planova_token");

  function showToast(msg)  { setToast(msg);  setTimeout(() => setToast(null),  2500); }
  function showError(msg)  { setError(msg);  setTimeout(() => setError(null),   3000); }

  async function saveProfile() {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: profile.name, email: profile.email }),
    });
    const data = await res.json();
    if (!res.ok) return showError(data.message);
    login(data);
    showToast("Profile saved.");
  }

  async function savePassword() {
    if (password.next !== password.confirm) return showError("Passwords don't match.");
    if (password.next.length < 8) return showError("Password must be at least 8 characters.");
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: password.next }),
    });
    const data = await res.json();
    if (!res.ok) return showError(data.message);
    login(data);
    setPassword({ current: "", next: "", confirm: "" });
    showToast("Password updated.");
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold">
          ✓ {toast}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-[100] bg-red-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold">
          {error}
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Settings</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Admin account configuration.</p>
      </div>

      <div className="space-y-5 max-w-2xl">

        {/* Profile */}
        <Section title="Admin Profile">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-[18px] font-black">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-bold text-slate-800">{user?.name}</p>
              <p className="text-[12.5px] text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Display Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Email Address</label>
              <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
            </div>
            <button onClick={saveProfile}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors">
              Save Profile
            </button>
          </div>
        </Section>

        {/* Change password */}
        <Section title="Change Password">
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">New Password</label>
              <input type="password" value={password.next} onChange={e => setPassword(p => ({ ...p, next: e.target.value }))}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Confirm New Password</label>
              <input type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat password"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
            </div>
            <button onClick={savePassword}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors">
              Update Password
            </button>
          </div>
        </Section>

        {/* Platform */}
        <Section title="Platform Settings">
          <div className="space-y-4">
            {[["Platform Name","Planova"],["Support Email","support@planova.pk"],["Country","Pakistan"]].map(([label, val]) => (
              <div key={label}>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}</label>
                <input defaultValue={val}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
              </div>
            ))}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12.5px] text-amber-700">
            ⚠ Platform settings will persist once the backend settings route is implemented.
          </div>
        </Section>
      </div>
    </div>
  );
}
