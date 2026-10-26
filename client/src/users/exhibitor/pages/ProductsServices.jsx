import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Package, Loader2 } from "lucide-react";
import EmptyState from "../components/EmptyState";

const PRODUCT_CATS = ["Enterprise Software", "Business Intelligence", "Cybersecurity", "Cloud", "Fintech", "SaaS", "Other"];

const CAT_COLORS = {
  "Enterprise Software": { bg: "#EDE9FE", text: "#5B21B6" },
  "Business Intelligence": { bg: "#CFFAFE", text: "#155E75" },
  "Cybersecurity": { bg: "#FEE2E2", text: "#991B1B" },
  "Cloud": { bg: "#DBEAFE", text: "#1E40AF" },
  "Fintech": { bg: "#DDF7E7", text: "#16804A" },
  "SaaS": { bg: "#DCE8FF", text: "#09152E" },
  "Other": { bg: "#EEF1F8", text: "#3E506D" },
};

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function ProductCard({ product, onEdit, onDelete }) {
  const cat = CAT_COLORS[product.category] || CAT_COLORS.Other;

  return (
    <div className="rounded-xl overflow-hidden flex flex-col"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="h-[130px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} style={{ color: "#CBD5E1" }} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.text }}>{product.category}</span>
          {product.showcasing && (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "#E6F9F1", color: "#12875A" }}>Showcasing</span>
          )}
        </div>
        <h3 className="text-[13.5px] font-bold leading-snug mb-1.5" style={{ color: "#09152E" }}>{product.name}</h3>
        <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1" style={{ color: "#64748B" }}>{product.description}</p>
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.map(t => (
              <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: "#F0F3FA", color: "#3E506D" }}>#{t}</span>
            ))}
          </div>
        )}
        <div className="mt-3 pt-3 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(product._id)}
            className="w-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: "#F0F3FA", color: "#CBD5E1", border: "1px solid #E8EEF8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F0F3FA"; e.currentTarget.style.color = "#CBD5E1"; e.currentTarget.style.borderColor = "#E8EEF8"; }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial
    ? {
        name:        initial.name        || "",
        category:   initial.category    || "Other",
        description: initial.description || "",
        image:       initial.image       || "",
        tags:        Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags || ""),
        showcasing:  initial.showcasing   !== false,
      }
    : { name: "", category: "Enterprise Software", description: "", image: "", tags: "", showcasing: true }
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });
  }

  return (
    <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-black" style={{ color: "#09152E" }}>
          {initial ? "Edit Product / Service" : "Add Product / Service"}
        </p>
        <button onClick={onCancel}><X size={16} style={{ color: "#94A3B8" }} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Name *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
            style={{ background: "#F5F8FF", border: `1.5px solid ${errors.name ? "#FECACA" : "#DCEAFF"}`, color: "#09152E" }}
            onFocus={e => e.target.style.borderColor = "#3478F6"}
            onBlur={e => e.target.style.borderColor = errors.name ? "#FECACA" : "#DCEAFF"} />
          {errors.name && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}>
            {PRODUCT_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Description *</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none resize-none transition-colors"
            style={{ background: "#F5F8FF", border: `1.5px solid ${errors.description ? "#FECACA" : "#DCEAFF"}`, color: "#09152E" }}
            onFocus={e => e.target.style.borderColor = "#3478F6"}
            onBlur={e => e.target.style.borderColor = errors.description ? "#FECACA" : "#DCEAFF"} />
          {errors.description && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{errors.description}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Image URL (optional)</label>
          <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={e => e.target.style.borderColor = "#3478F6"}
            onBlur={e => e.target.style.borderColor = "#DCEAFF"} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}
            onFocus={e => e.target.style.borderColor = "#3478F6"}
            onBlur={e => e.target.style.borderColor = "#DCEAFF"} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.showcasing} onChange={e => setForm(p => ({ ...p, showcasing: e.target.checked }))}
            className="w-4 h-4 rounded" />
          <span className="text-[13px] font-medium" style={{ color: "#09152E" }}>Showcasing at upcoming expos</span>
        </label>
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors disabled:opacity-60"
            style={{ background: "#3478F6" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {initial ? "Save Changes" : "Add"}
          </button>
          <button type="button" onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
            style={{ background: "#F0F3FA", color: "#64748B" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductsServices() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [toast,     setToast]     = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function fetchProducts() {
    setLoading(true);
    fetch("/api/products/mine", { headers: { Authorization: `Bearer ${localStorage.getItem("planova_token")}` } })
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleSave(item) {
    setSaving(true);
    try {
      const isEdit = !!editItem;
      const url    = isEdit ? `/api/products/${editItem._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(item) });
      const data   = await res.json();
      if (!res.ok) return showToast(data.message || "Save failed", "err");
      showToast(isEdit ? "Product updated" : "Product added");
      setShowForm(false); setEditItem(null);
      fetchProducts();
    } catch { showToast("Something went wrong", "err"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("planova_token")}` } });
    if (!res.ok) return showToast("Delete failed", "err");
    showToast("Product deleted");
    fetchProducts();
  }

  function handleEdit(product) {
    setEditItem(product);
    setShowForm(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg"
          style={{ background: toast.type === "err" ? "#FEF2F2" : "#E6F9F1", color: toast.type === "err" ? "#B91C1C" : "#12875A", border: `1px solid ${toast.type === "err" ? "#FECACA" : "#A7F3D0"}` }}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[13px]" style={{ color: "#64748B" }}>
          {products.length} item{products.length !== 1 ? "s" : ""}
        </p>
        {!showForm && !editItem && (
          <button onClick={() => { setShowForm(true); setEditItem(null); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}>
            <Plus size={14} /> Add Product / Service
          </button>
        )}
      </div>

      {showForm && !editItem && (
        <ProductForm onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} />
      )}
      {editItem && (
        <ProductForm initial={editItem} onSave={handleSave} onCancel={() => setEditItem(null)} saving={saving} />
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Package size={22} />}
          title="No products or services yet"
          message="Add what you plan to showcase at expos so organizers and attendees can see your offerings."
          action={
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg text-white"
              style={{ background: "#3478F6" }}>
              <Plus size={14} /> Add your first item
            </button>
          }
        />
      )}
    </div>
  );
}
