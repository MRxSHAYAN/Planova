import { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal, MapPin, CalendarDays, Users, Star, Loader2, Check } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];
const CITIES     = ["All Cities", "Karachi", "Lahore", "Islamabad"];

const CATEGORY_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all"
      style={active
        ? { background: "#09152E", color: "#fff", borderColor: "#09152E" }
        : { background: "#fff", color: "#3E506D", borderColor: "#E8EEF8" }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}}>
      {label}
    </button>
  );
}

function ApplyModal({ expo, user, onClose, onSubmitted }) {
  const [form, setForm]       = useState({
    company:         user?.company     || "",
    contact:         user?.name        || "",
    phone:            user?.phone       || "",
    email:            user?.email       || "",
    category:         user?.category    || "Technology",
    city:             user?.city        || "",
    description:      user?.description || "",
    boothPreference:  "",
  });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [booths,  setBooths]  = useState([]);
  const [loadingBooths, setLoadingBooths] = useState(true);

  useEffect(() => {
    fetch(`/api/booths/expo/${expo._id}`)
      .then(r => r.json())
      .then(data => setBooths(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingBooths(false));
  }, [expo._id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company || !form.contact || !form.description)
      return setError("Company name, contact person, and description are required");

    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          event:           expo._id,
          company:         form.company,
          contact:         form.contact,
          phone:           form.phone,
          email:           form.email,
          category:        form.category,
          city:            form.city,
          description:     form.description,
          boothPreference: form.boothPreference,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to submit");
      onSubmitted();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function field(label, name, type = "text", required = false) {
    return (
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>
          {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
        </label>
        <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
          style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
          onFocus={e => e.target.style.borderColor = "#3478F6"}
          onBlur={e => e.target.style.borderColor = "#DCEAFF"} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: "#fff" }}
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#3478F6" }}>Apply to Exhibit</p>
            <h2 className="text-[15px] font-black mt-0.5" style={{ color: "#09152E" }}>{expo.title}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "#F0F3FA", color: "#64748B" }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="px-3 py-2.5 rounded-lg text-[12.5px]" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}
          {field("Company Name", "company", "text", true)}
          {field("Contact Person", "contact", "text", true)}
          <div className="grid grid-cols-2 gap-3">
            {field("Phone", "phone")}
            {field("Email", "email", "email")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full text-[13px] px-3 py-2 rounded-lg outline-none"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}>
                {["Technology","Healthcare","Energy","Agriculture","Fashion","Food","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {field("City", "city")}
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>
              Description<span style={{ color: "#DC2626" }}> *</span>
            </label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full text-[13px] px-3 py-2 rounded-lg outline-none resize-none transition-colors"
              style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
              onFocus={e => e.target.style.borderColor = "#3478F6"}
              onBlur={e => e.target.style.borderColor = "#DCEAFF"} />
          </div>
          {/* Booth selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>
              Select Available Booth
            </label>
            {loadingBooths ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={13} className="animate-spin" style={{ color: "#94A3B8" }} />
                <span className="text-[12px]" style={{ color: "#94A3B8" }}>Loading booths...</span>
              </div>
            ) : booths.length > 0 ? (
              <select value={form.boothPreference} onChange={e => setForm(p => ({ ...p, boothPreference: e.target.value }))}
                className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
                style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}>
                <option value="">No preference</option>
                {booths.map(b => (
                  <option key={b._id} value={b.boothId}>
                    {b.boothId} - {b.type} ({b.size})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[12px] py-1.5" style={{ color: "#94A3B8" }}>
                No booths available for this expo yet. Admin will assign one after approval.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
              style={{ background: "#F0F3FA", color: "#64748B" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "#3478F6" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpoCard({ expo, appliedIds, onApply }) {
  const cat = CATEGORY_COLORS[expo.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const alreadyApplied = appliedIds.has(expo._id);
  const dateStr = expo.dateStart ? new Date(expo.dateStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  return (
    <article className="rounded-xl overflow-hidden flex flex-col group transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="relative h-[145px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        {expo.image && <img src={expo.image} alt={expo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,21,46,0.3) 0%, transparent 55%)" }} />
        <span className="absolute top-3 left-3 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: cat.bg, color: cat.text }}>{expo.category}</span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-[13.5px] font-bold leading-snug mb-2 line-clamp-2" style={{ color: "#09152E" }}>{expo.title}</h3>
        <div className="space-y-1.5 mb-3">
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <CalendarDays size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{dateStr}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <MapPin size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{expo.city}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
            <Users size={11} style={{ flexShrink: 0 }} />{expo.totalBooths || 0} booths
          </p>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          {alreadyApplied ? (
            <span className="text-[11.5px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#E6F9F1", color: "#12875A" }}>
              Applied
            </span>
          ) : (
            <button onClick={() => onApply(expo)}
              className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "#3478F6" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1D5FE0"}
              onMouseLeave={e => e.currentTarget.style.background = "#3478F6"}>
              Apply
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ExploreExpos() {
  const { user } = useAuth();
  const [expos,       setExpos]       = useState([]);
  const [appliedIds,  setAppliedIds] = useState(new Set());
  const [query,       setQuery]       = useState("");
  const [cat,         setCat]         = useState("All");
  const [city,         setCity]        = useState("All Cities");
  const [showF,       setShowF]       = useState(false);
  const [applyExpo,   setApplyExpo]   = useState(null);
  const [toast,       setToast]       = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/expos")
      .then(r => r.json())
      .then(data => setExpos(Array.isArray(data) ? data : []))
      .catch(() => {});

    // Fetch existing applications so we can mark which expos already applied
    const token = localStorage.getItem("planova_token");
    fetch("/api/applications/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAppliedIds(new Set(data.map(a => a.event?._id || a.event)));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = expos;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q));
    }
    if (cat  !== "All")        list = list.filter(e => e.category === cat);
    if (city !== "All Cities") list = list.filter(e => e.city === city);
    return list;
  }, [expos, query, cat, city]);

  const hasFilters = cat !== "All" || city !== "All Cities";
  const FEATURED = expos[0] || null;

  function handleApplied(expoId) {
    setAppliedIds(p => new Set([...p, expoId]));
    setApplyExpo(null);
    showToast("Application submitted! Check My Applications for status.");
  }

  return (
    <div className="space-y-5">

      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{ background: toast.type === "err" ? "#FEF2F2" : "#E6F9F1", color: toast.type === "err" ? "#B91C1C" : "#12875A", border: `1px solid ${toast.type === "err" ? "#FECACA" : "#A7F3D0"}` }}>
          {toast.msg}
        </div>
      )}

      {FEATURED && (
        <div className="relative rounded-xl overflow-hidden" style={{ height: 200 }}>
          <img src={FEATURED.image || ""} alt={FEATURED.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(9,21,46,0.88) 0%, rgba(9,21,46,0.5) 55%, transparent 80%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(52,120,246,0.3)", color: "#7BADFF" }}>
                <Star size={9} fill="currentColor" /> Featured
              </span>
            </div>
            <h2 className="text-white font-black text-[17px] leading-snug mb-1 max-w-sm">{FEATURED.title}</h2>
            <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              {FEATURED.city}  {FEATURED.totalBooths || 0} booths
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search expos by title, city, or category..."
            className="flex-1 text-[13px] outline-none bg-transparent" style={{ color: "#09152E" }} />
          {query && <button onClick={() => setQuery("")}><X size={13} style={{ color: "#94A3B8" }} /></button>}
        </div>
        <button onClick={() => setShowF(!showF)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
          style={showF || hasFilters
            ? { background: "#09152E", color: "#fff", border: "1px solid #09152E" }
            : { background: "#fff", color: "#3E506D", border: "1px solid #E8EEF8" }}>
          <SlidersHorizontal size={13} /> Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ background: "#3478F6", color: "#fff" }}>
              {(cat !== "All" ? 1 : 0) + (city !== "All Cities" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {showF && (
        <div className="rounded-xl p-4 space-y-4" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => <Pill key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>City</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(c => <Pill key={c} label={c} active={city === c} onClick={() => setCity(c)} />)}
            </div>
          </div>
          {hasFilters && (
            <button className="text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => { setCat("All"); setCity("All Cities"); }}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {!showF && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => <Pill key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
        </div>
      )}

      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} expo{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(expo => <ExpoCard key={expo._id} expo={expo} appliedIds={appliedIds} onApply={setApplyExpo} />)}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>No expos found</p>
          <p className="text-[13px]" style={{ color: "#94A3B8" }}>Try different filters or search terms.</p>
        </div>
      )}

      {applyExpo && (
        <ApplyModal expo={applyExpo} user={user} onClose={() => setApplyExpo(null)} onSubmitted={() => handleApplied(applyExpo._id)} />
      )}
    </div>
  );
}
