import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({ value, onChange, label = "Image", size = "md" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef();

  const preview = value?.startsWith("/uploads/") || value?.startsWith("http") || value?.startsWith("data:") ? value : null;

  async function handleFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Max file size is 5 MB"); return; }

    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);

    try {
      const token = localStorage.getItem("planova_token");
      const res   = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || "Upload failed"); return; }
      onChange(json.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const h = size === "sm" ? "h-[80px]" : "h-[120px]";

  return (
    <div>
      {label && <p className="text-[12.5px] font-semibold mb-1.5" style={{ color: "#3E506D" }}>{label}</p>}

      <div className={`relative rounded-xl border-2 border-dashed transition-colors ${h} flex items-center justify-center overflow-hidden cursor-pointer`}
        style={{ borderColor: preview ? "#3478F6" : "#E2E8F0", background: preview ? "transparent" : "#F8FAFC" }}
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}>

        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button type="button"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              onClick={e => { e.stopPropagation(); onChange(""); }}>
              <X size={11} />
            </button>
          </>
        ) : uploading ? (
          <Loader2 size={18} className="animate-spin" style={{ color: "#94A3B8" }} />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Upload size={18} style={{ color: "#94A3B8" }} />
            <p className="text-[11.5px]" style={{ color: "#94A3B8" }}>Click or drag to upload</p>
            <p className="text-[10.5px]" style={{ color: "#CBD5E1" }}>JPG, PNG, WebP · max 5 MB</p>
          </div>
        )}
      </div>

      {/* also allow URL input */}
      <input type="text" placeholder="Or paste an image URL"
        value={preview ? "" : (value || "")}
        onChange={e => { onChange(e.target.value); setError(""); }}
        className="w-full mt-2 px-3 py-2 rounded-lg text-[12.5px] outline-none transition-all"
        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#09152E" }}
        onFocus={e => e.currentTarget.style.borderColor = "#3478F6"}
        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />

      {error && <p className="text-[11.5px] mt-1" style={{ color: "#DC2626" }}>{error}</p>}

      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}
