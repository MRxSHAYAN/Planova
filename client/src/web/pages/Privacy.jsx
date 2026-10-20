import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const POINTS = [
  {
    icon: (
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    ),
    title: "We only collect what we need",
    desc: "Your name, email, and role when you sign up. Billing details if you pay for something — handled by our payment provider, never stored by us.",
  },
  {
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </>
    ),
    title: "We never sell your data",
    desc: "Your information is only shared with the organizer of an expo you've registered for. No third-party marketing, ever.",
  },
  {
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    title: "We use cookies to keep you logged in",
    desc: "That's it. No tracking pixels, no advertising cookies. Clear your cookies anytime — you'll just need to log in again.",
  },
  {
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    title: "Your data is encrypted",
    desc: "Everything is encrypted in transit (HTTPS) and at rest on our servers. We follow standard security practices and review them regularly.",
  },
  {
    icon: (
      <>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
    title: "You can delete your account anytime",
    desc: "Email us at privacy@planova.pk and we'll wipe your data within 30 days. No questions asked.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </>
    ),
    title: "We'll tell you if anything changes",
    desc: "If we update this policy in a meaningful way, we'll email you at least 14 days before it takes effect.",
  },
];

export default function Privacy() {
  return (
    <Layout>
      {/* header */}
      <div className="bg-navy pt-[90px] pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Legal</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-black text-white leading-[1.1] mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-[14px] max-w-460px">
            No legal walls. Just six things you should know about how we handle your data.
          </p>
          <p className="text-white/30 text-[12px] mt-2">Last updated October 2026</p>
        </div>
      </div>

      {/* six points */}
      <section className="bg-page py-14 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {POINTS.map((p) => (
              <div key={p.title} className="bg-surface rounded-xl border border-border p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-ice flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {p.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-dark font-black text-[14.5px] mb-1.5">{p.title}</h3>
                  <p className="text-body text-[13px] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* contact block */}
          <div className="mt-10 bg-navy rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-black text-[15px] mb-1">Questions or data requests?</h3>
              <p className="text-white/40 text-[12.5px]">We reply within 14 days.</p>
            </div>
            <a
              href="mailto:privacy@planova.pk"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors"
            >
              privacy@planova.pk
            </a>
          </div>
        </div>
      </section>

      {/* bottom nav */}
      <section className="bg-surface py-10 px-5 sm:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <p className="text-body text-[13px]">Need help with something else?</p>
          <div className="flex gap-3">
            <Link to="/support" className="px-5 py-2.5 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors">
              Support Centre
            </Link>
            <Link to="/contact" className="px-5 py-2.5 rounded-lg border border-border text-body font-semibold text-[13px] hover:border-accent hover:text-accent transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
