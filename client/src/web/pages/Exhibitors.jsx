import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Loader2, Package, X } from "lucide-react";

const categoryColor = {
  Technology:  { bg: "bg-accent-light",    text: "text-navy" },
  Healthcare:  { bg: "bg-status-open-bg",  text: "text-status-open" },
  Energy:      { bg: "bg-[#FEF3C7]",       text: "text-[#92620A]" },
  Agriculture: { bg: "bg-status-open-bg",  text: "text-status-open" },
  Fashion:     { bg: "bg-[#FCE7F3]",       text: "text-[#9D174D]" },
  Food:        { bg: "bg-[#FEF3C7]",       text: "text-[#92620A]" },
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function ExhibitorModal({ ex, onClose }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!ex?.user?._id) { setLoadingProducts(false); return; }
    fetch(`/api/products/user/${ex.user._id}`)
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, [ex]);

  if (!ex) return null;
  const c = categoryColor[ex.category] || categoryColor.Technology;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-navy px-6 py-5 flex items-start justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-black text-[13px] bg-white/10 text-white">
                {getInitials(ex.company)}
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                {ex.category}
              </span>
            </div>
            <h2 className="text-white font-black text-[20px] leading-tight">{ex.company}</h2>
            <p className="text-white/45 text-[12.5px] mt-0.5">{ex.city}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shrink-0 mt-1">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2 text-muted">About</p>
            <p className="text-body text-[13px] leading-relaxed">{ex.description}</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
            {[
              ["Contact", ex.contact],
              ["Email", ex.email],
              ["Phone", ex.phone],
              ["Booth", ex.booth || "Not assigned"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
                <p className="text-dark font-medium mt-0.5">{val || "—"}</p>
              </div>
            ))}
          </div>

          {ex.event?.title && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-ice border border-border">
              <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-[12.5px] text-body">Exhibiting at: <strong className="text-dark">{ex.event.title}</strong></span>
            </div>
          )}

          {/* Products & Services */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3 text-muted">Products & Services</p>
            {loadingProducts ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="animate-spin text-accent" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map(p => (
                  <div key={p._id} className="rounded-xl border border-border-card p-3 flex gap-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-ice flex items-center justify-center shrink-0">
                        <Package size={18} className="text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-dark truncate">{p.name}</p>
                      <p className="text-[11px] text-body line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12.5px] text-muted italic">No products or services listed.</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/register"
              className="flex-1 text-center py-3 rounded-xl bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors">
              Register to Attend
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExhibitorCard({ ex, onView }) {
  const c = categoryColor[ex.category] || categoryColor.Technology;

  return (
    <article className="group bg-surface rounded-2xl border border-border-card p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" onClick={() => onView(ex)}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-[13px] bg-navy text-white">
          {getInitials(ex.company)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-dark font-bold text-[14.5px] leading-tight truncate group-hover:text-accent transition-colors">{ex.company}</h3>
          <p className="text-[11.5px] text-muted mt-0.5">{ex.city}</p>
        </div>
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${c.bg} ${c.text}`}>
          {ex.category}
        </span>
      </div>
      <p className="text-body text-[12.5px] leading-relaxed line-clamp-2">{ex.description}</p>
      <div className="pt-3 border-t border-border-card">
        <p className="text-[11.5px] text-muted">
          Exhibiting at <span className="text-dark font-semibold">{ex.event?.title || "Upcoming expo"}</span>
        </p>
        {ex.booth && (
          <p className="text-[11.5px] mt-0.5 font-mono font-semibold text-dark">Booth {ex.booth}</p>
        )}
      </div>
    </article>
  );
}

export default function Exhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    fetch("/api/applications/approved")
      .then(r => r.json())
      .then(data => setExhibitors(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(exhibitors.map(e => e.category).filter(Boolean))];

  const filtered = exhibitors.filter(ex => {
    const matchSearch = ex.company?.toLowerCase().includes(search.toLowerCase())
      || ex.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || ex.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <Layout>
      <div className="bg-navy pt-[90px] pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Planova</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Exhibitor Directory</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Companies participating across all upcoming expos on Planova.
          </p>
          <div className="mt-6">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 max-w-md">
              <svg className="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-page min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                    category === c ? "bg-navy text-white border-navy" : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-accent" />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <p className="text-[12.5px] text-body mb-6">
                {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(ex => <ExhibitorCard key={ex._id} ex={ex} onView={setSelected} />)}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-[14px]">
                {exhibitors.length === 0 ? "No exhibitors approved yet." : "No exhibitors match your search."}
              </p>
              {exhibitors.length > 0 && (
                <button onClick={() => { setCategory("All"); setSearch(""); }}
                  className="mt-4 text-[13px] font-semibold text-accent hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          )}

          <div className="mt-14 bg-navy rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-[1.1rem] mb-1">Want to exhibit?</h3>
              <p className="text-white/40 text-[13px]">Apply to showcase your company at the next expo.</p>
            </div>
            <Link to="/register"
              className="shrink-0 px-6 py-3 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors">
              Apply as Exhibitor
            </Link>
          </div>
        </div>
      </div>

      {selected && <ExhibitorModal ex={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}
