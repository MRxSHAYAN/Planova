import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const EXHIBITORS = [
  {
    id: 1,
    company: "Netsol Technologies",
    category: "Technology",
    expos: ["Karachi Technology Expo 2026"],
    booth: "A-04",
    description: "Pakistan's leading IT solutions provider specializing in leasing and finance software.",
    website: "#",
    employees: "1000+",
  },
  {
    id: 2,
    company: "Shaukat Khanum Labs",
    category: "Healthcare",
    expos: ["Pakistan Health & Pharma Summit"],
    booth: "B-11",
    description: "Diagnostic and pathology services arm of the Shaukat Khanum Cancer Hospital network.",
    website: "#",
    employees: "500+",
  },
  {
    id: 3,
    company: "K-Electric",
    category: "Energy",
    expos: ["Green Energy & Sustainability Expo"],
    booth: "C-02",
    description: "Karachi's primary electric utility, showcasing renewable energy transition programs.",
    website: "#",
    employees: "10,000+",
  },
  {
    id: 4,
    company: "Engro Fertilizers",
    category: "Agriculture",
    expos: ["Agri-Tech Pakistan 2026"],
    booth: "D-07",
    description: "Largest fertilizer producer in Pakistan, advancing precision farming solutions.",
    website: "#",
    employees: "2000+",
  },
  {
    id: 5,
    company: "Gul Ahmed Textile",
    category: "Fashion",
    expos: ["Textile & Fashion Expo Pakistan"],
    booth: "E-15",
    description: "One of Pakistan's largest textile manufacturers with global export operations.",
    website: "#",
    employees: "5000+",
  },
  {
    id: 6,
    company: "Shan Foods",
    category: "Food",
    expos: ["Pakistan Food & Beverage Expo"],
    booth: "F-03",
    description: "Pakistan's number one spice and recipe mix brand, exported to over 65 countries.",
    website: "#",
    employees: "1200+",
  },
  {
    id: 7,
    company: "Systems Limited",
    category: "Technology",
    expos: ["Karachi Technology Expo 2026"],
    booth: "A-09",
    description: "Enterprise technology and business process outsourcing company listed on PSX.",
    website: "#",
    employees: "8000+",
  },
  {
    id: 8,
    company: "Agahe Pakistan",
    category: "Healthcare",
    expos: ["Pakistan Health & Pharma Summit"],
    booth: "B-06",
    description: "NGO focused on community health, nutrition, and public awareness campaigns.",
    website: "#",
    employees: "200+",
  },
];

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];

const categoryBadge = {
  Technology:  "bg-[#D6E4FF] text-[#1A4A9E]",
  Healthcare:  "bg-[#D4EDE2] text-[#1A6E45]",
  Energy:      "bg-[#FEF3C7] text-[#92620A]",
  Agriculture: "bg-[#D4EDE2] text-[#1A6E45]",
  Fashion:     "bg-[#FCE7F3] text-[#9D174D]",
  Food:        "bg-[#FEF3C7] text-[#92620A]",
};

function ExhibitorCard({ ex }) {
  return (
    <article className="bg-white rounded-xl border border-[#CBD5E8] p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-lg bg-[#E8F0FE] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="6" height="10" rx="1"/>
            <rect x="9" y="3" width="6" height="14" rx="1"/>
            <rect x="16" y="9" width="6" height="8" rx="1"/>
          </svg>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge[ex.category]}`}>
          {ex.category}
        </span>
      </div>

      <div>
        <h3 className="text-[#0A1628] font-black text-[15px] mb-1">{ex.company}</h3>
        <p className="text-[#64748B] text-[12.5px] leading-relaxed">{ex.description}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-[12px] text-[#64748B]">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Booth {ex.booth}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {ex.employees} employees
        </span>
      </div>

      <div className="pt-2 border-t border-[#E2E8F4]">
        <p className="text-[11.5px] text-[#64748B]">
          Exhibiting at:{" "}
          <span className="text-[#0A1628] font-semibold">{ex.expos[0]}</span>
        </p>
      </div>

      <div className="mt-auto flex gap-2">
        <Link to={`/exhibitor/${ex.id}`}
          className="flex-1 text-center text-[12.5px] font-bold py-2.5 rounded-lg bg-[#6B9FFF] text-[#0A1628] hover:bg-[#4A82F5] hover:text-white transition-colors">
          View Profile
        </Link>
        <a href={ex.website}
          className="px-4 py-2.5 rounded-lg border border-[#CBD5E8] text-[12.5px] text-[#64748B] hover:border-[#6B9FFF] hover:text-[#6B9FFF] transition-colors">
          Website
        </a>
      </div>
    </article>
  );
}

export default function Exhibitors() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const filtered = EXHIBITORS.filter((ex) => {
    const matchSearch   = ex.company.toLowerCase().includes(search.toLowerCase()) ||
                          ex.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || ex.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <Layout>
      <div className="bg-[#0A1628] pt-[90px] pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-[#6B9FFF]" />
            <span className="text-[#6B9FFF] text-[10.5px] font-semibold tracking-[0.2em] uppercase">Planova</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Exhibitor Directory</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Companies participating across all upcoming expos on Planova.
          </p>

          <div className="mt-6 max-w-[480px]">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F4F7FF] min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                  category === c
                    ? "bg-[#0A1628] text-white border-[#0A1628]"
                    : "bg-white text-[#64748B] border-[#CBD5E8] hover:border-[#6B9FFF] hover:text-[#6B9FFF]"
                }`}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-[12.5px] text-[#64748B] mb-6">
            {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((ex) => <ExhibitorCard key={ex.id} ex={ex} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-[14px]">No exhibitors match your search.</p>
              <button onClick={() => { setCategory("All"); setSearch(""); }}
                className="mt-4 text-[13px] font-semibold text-[#6B9FFF] hover:underline">
                Clear filters
              </button>
            </div>
          )}

          <div className="mt-14 bg-[#0A1628] rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-[1.1rem] mb-1">Want to exhibit?</h3>
              <p className="text-white/40 text-[13px]">Apply to showcase your company at the next expo.</p>
            </div>
            <Link to="/register?role=exhibitor"
              className="shrink-0 px-6 py-3 rounded-lg bg-[#6B9FFF] text-[#0A1628] font-bold text-[13px] hover:bg-[#4A82F5] hover:text-white transition-colors">
              Apply as Exhibitor →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
