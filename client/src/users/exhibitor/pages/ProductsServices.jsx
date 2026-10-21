import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Package } from "lucide-react";
import { PRODUCTS, CATEGORY_COLORS } from "../data/mockData";
import EmptyState from "../components/EmptyState";

const PRODUCT_CATS = ["Enterprise Software", "Business Intelligence", "Cybersecurity", "Cloud", "Fintech", "SaaS", "Other"];

const BLANK = { name: "", category: "Enterprise Software", description: "", image: "", tags: "", showcasing: true };

function ProductCard({ product, onEdit, onDelete }) {
  const cat = CATEGORY_COLORS[product.category] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <div className="rounded-xl overflow-hidden flex flex-col"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      {/* Image */}
      <div className="h-[130px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} style={{ color: "#CBD5E1" }} />
          </div>
        )}
      </div>

      {/* Body */}
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
            {product.tags.map((t) => (
              <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: "#F0F3FA", color: "#3E506D" }}>#{t}</span>
            ))}
          </div>
        )}
        <div className="mt-3 pt-3 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}>
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(product.id)}
            className="w-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: "#F0F3FA", color: "#CBD5E1", border: "1px solid #E8EEF8" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F0F3FA"; e.currentTarget.style.color = "#CBD5E1"; e.currentTarget.style.borderColor = "#E8EEF8"; }}
            aria-label="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ ...form, id: form.id || `prd_${Date.now()}`, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [] });
  };

  const F = ({ label, name, value, type = "text", onChange, error, multiline }) => (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>{label}</label>
      {multiline ? (
        <textarea name={name} value={value} onChange={onChange} rows={3}
          className="w-full text-[13px] px-3 py-2 rounded-lg outline-none resize-none transition-colors"
          style={{ background: "#F5F8FF", border: `1.5px solid ${error ? "#FECACA" : "#DCEAFF"}`, color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#FECACA" : "#DCEAFF")} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          className="w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-colors"
          style={{ background: "#F5F8FF", border: `1.5px solid ${error ? "#FECACA" : "#DCEAFF"}`, color: "#09152E" }}
          onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#FECACA" : "#DCEAFF")} />
      )}
      {error && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{error}</p>}
    </div>
  );

  return (
    <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-black" style={{ color: "#09152E" }}>
          {initial?.id ? "Edit Product / Service" : "Add Product / Service"}
        </p>
        <button onClick={onCancel}><X size={16} style={{ color: "#94A3B8" }} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <F label="Name *"        name="name"        value={form.name}        error={errors.name}
           onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Category</label>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="w-full text-[13px] px-3 py-2 rounded-lg outline-none"
            style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}>
            {PRODUCT_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <F label="Description *" name="description" value={form.description} error={errors.description} multiline
           onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <F label="Image URL (optional)" name="image" value={form.image}
           onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
        <F label="Tags (comma separated)" name="tags"
           value={typeof form.tags === "string" ? form.tags : form.tags?.join(", ") || ""}
           onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.showcasing} onChange={(e) => setForm((p) => ({ ...p, showcasing: e.target.checked }))}
            className="w-4 h-4 rounded" />
          <span className="text-[13px] font-medium" style={{ color: "#09152E" }}>Mark as showcasing at upcoming expos</span>
        </label>
        <div className="flex gap-2 pt-1">
          <button type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            <Check size={14} /> {initial?.id ? "Save Changes" : "Add"}
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
  const [products,  setProducts]  = useState(PRODUCTS);
  const [showForm,  setShowForm]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);

  const handleSave = (item) => {
    if (item.id && products.find((p) => p.id === item.id)) {
      setProducts((prev) => prev.map((p) => p.id === item.id ? item : p));
    } else {
      setProducts((prev) => [...prev, item]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleEdit = (product) => {
    setEditItem({ ...product, tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px]" style={{ color: "#64748B" }}>
          {products.length} item{products.length !== 1 ? "s" : ""}
        </p>
        {!showForm && !editItem && (
          <button onClick={() => { setShowForm(true); setEditItem(null); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            <Plus size={14} /> Add Product / Service
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && !editItem && (
        <ProductForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
      {editItem && (
        <ProductForm initial={editItem} onSave={handleSave} onCancel={() => setEditItem(null)} />
      )}

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={handleEdit} onDelete={handleDelete} />
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
