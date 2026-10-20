import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const FAQS = [
  {
    q: "How do I register for an expo?",
    a: "Go to Explore Expos, click on the event you want to attend, then hit 'Register to Attend'. You'll need a free Planova account — create one in under a minute.",
  },
  {
    q: "How does an exhibitor apply to participate?",
    a: "Create an account and choose the Exhibitor role. From your dashboard, browse open expos and click 'Apply'. Fill in your company details, select your preferred booth size, and submit. The organizer reviews and approves applications.",
  },
  {
    q: "Can I change my booth after it's been assigned?",
    a: "Yes, as long as the expo is more than 7 days away and the organizer allows reassignments. Go to your Exhibitor Dashboard → My Booths → Request Change.",
  },
  {
    q: "How do I cancel my registration?",
    a: "From your Attendee Dashboard, go to My Events, find the expo, and click Cancel Registration. Refund policies are set by the individual organizer.",
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: "On the login page, click 'Forgot password'. Enter your email and we'll send you a reset link within a few minutes.",
  },
  {
    q: "Does Planova work on mobile?",
    a: "Yes. The web platform is fully responsive and works on any phone or tablet. A dedicated mobile app is in development.",
  },
  {
    q: "How do organizers get paid?",
    a: "Planova collects registration fees on behalf of organizers and transfers them via bank transfer after the expo concludes. Payment schedules are set in the organizer agreement.",
  },
  {
    q: "Is my data safe on Planova?",
    a: "All data is encrypted in transit and at rest. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
];

const GUIDES = [
  {
    title: "Getting started as an Attendee",
    desc: "Create your account, find an expo, register, and access your schedule.",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Applying as an Exhibitor",
    desc: "Set up your company profile, apply to expos, and choose your booth.",
    icon: (
      <>
        <rect x="2" y="7" width="6" height="10" rx="1" />
        <rect x="9" y="3" width="6" height="14" rx="1" />
        <rect x="16" y="9" width="6" height="8" rx="1" />
      </>
    ),
  },
  {
    title: "Running an expo as an Organizer",
    desc: "Publish your event, manage applications, assign booths, and track analytics.",
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </>
    ),
  },
  {
    title: "Managing your account",
    desc: "Update your profile, change your password, and manage notifications.",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-surface hover:bg-ice transition-colors text-left"
      >
        <span className="text-dark font-semibold text-[13.5px]">{item.q}</span>
        <svg
          className={`w-4 h-4 text-body shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-surface border-t border-border">
          <p className="text-body text-[13px] leading-relaxed pt-3">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* header */}
      <div className="bg-navy pt-90px pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Help centre</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-black text-white leading-[1.1] mb-4">
            How can we help?
          </h1>
          <p className="text-white/50 text-[14px] max-w-md">
            Find answers to common questions or reach out to our team.
          </p>

          {/* search */}
          <div className="mt-6 max-w-500px">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* guides */}
      <section className="bg-surface py-14 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[1.4rem] font-black text-dark mb-2">Getting started guides</h2>
          <p className="text-body text-[13.5px] mb-8">Step-by-step walkthroughs for every role on Planova.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIDES.map((g) => (
              <div key={g.title} className="bg-page rounded-xl border border-border p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-ice flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {g.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-dark font-black text-[14px] mb-1">{g.title}</h3>
                  <p className="text-body text-[12.5px] leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-page py-14 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[1.4rem] font-black text-dark mb-2">Frequently asked questions</h2>
          <p className="text-body text-[13.5px] mb-8">
            {filtered.length} question{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((f) => (
                <FAQItem key={f.q} item={f} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-body text-[14px]">No results for "{search}".</p>
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-[13px] font-semibold text-accent hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* still need help */}
      <section className="bg-navy px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-[1.5rem] font-black text-white mb-2">Still need help?</h2>
            <p className="text-white/40 text-[13.5px]">Our support team replies within 24 hours.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors min-h-44px flex items-center shrink-0"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
