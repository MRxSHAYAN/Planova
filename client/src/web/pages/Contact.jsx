import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const OFFICES = [
  { city: "Karachi",    address: "Plot 14, Block 7, Clifton, Karachi 75600",          phone: "+92 21 3456 7890", email: "karachi@planova.pk" },
  { city: "Lahore",     address: "Office 3B, Packages Mall Road, Lahore 54000",       phone: "+92 42 3567 8901", email: "lahore@planova.pk" },
  { city: "Islamabad",  address: "Blue Area, F-7 Markaz, Islamabad 44000",            phone: "+92 51 2345 6789", email: "islamabad@planova.pk" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="bg-navy pt-[90px] pb-14 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Get in touch</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] font-black text-white leading-[1.1] mb-4">
            We'd love to hear from you.
          </h1>
          <p className="text-white/45 text-[14.5px] leading-relaxed max-w-[460px]">
            Question about an expo, issue with your account, or want to partner — reach out and we'll get back within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Form + sidebar ── */}
      <section className="bg-page py-14 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-14">

          {/* Form */}
          <div>
            {sent ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-status-open-bg border border-status-open/20 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-6 h-6 text-status-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-dark font-black text-[1.1rem] mb-2">Message sent.</h3>
                <p className="text-body text-[13.5px] mb-6">We'll reply within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-[13px] font-semibold text-accent hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[1.35rem] font-black text-dark mb-7">Send us a message</h2>
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Full name</label>
                      <input name="name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-[13.5px] text-dark placeholder-muted outline-none focus:border-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Email</label>
                      <input name="email" type="email" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-[13.5px] text-dark placeholder-muted outline-none focus:border-accent transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Subject</label>
                    <input name="subject" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })} required
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-[13.5px] text-dark placeholder-muted outline-none focus:border-accent transition-colors" />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-dark mb-1.5">Message</label>
                    <textarea name="message" value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })} required rows={6}
                      placeholder="Tell us more…"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-[13.5px] text-dark placeholder-muted outline-none focus:border-accent transition-colors resize-none" />
                  </div>

                  <div>
                    <button type="submit"
                      className="px-8 py-3 rounded-xl bg-accent text-white font-bold text-[13.5px] hover:bg-accent-hover transition-colors">
                      Send message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <h2 className="text-[1.35rem] font-black text-dark mb-7">Our offices</h2>

            {OFFICES.map(o => (
              <div key={o.city} className="bg-surface rounded-2xl border border-border-card p-5">
                <h3 className="text-dark font-black text-[14.5px] mb-3">{o.city}</h3>
                <div className="space-y-2 text-[13px] text-body">
                  <p>{o.address}</p>
                  <p>{o.phone}</p>
                  <a href={`mailto:${o.email}`} className="text-accent hover:underline block">{o.email}</a>
                </div>
              </div>
            ))}

            <div className="bg-navy rounded-2xl p-5">
              <p className="text-white font-black text-[14.5px] mb-1">General enquiries</p>
              <p className="text-white/35 text-[12.5px] mb-3">For anything not covered above.</p>
              <a href="mailto:hello@planova.pk" className="text-accent font-semibold text-[13px] hover:underline">
                hello@planova.pk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-navy px-5 sm:px-8 py-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7">
          <div>
            <h2 className="text-[1.4rem] font-black text-white mb-1">Looking for help with your account?</h2>
            <p className="text-white/35 text-[13.5px]">Step-by-step guides for every feature in the support centre.</p>
          </div>
          <Link to="/support"
            className="px-6 py-3 rounded-xl bg-accent text-white font-bold text-[13px] hover:bg-accent-hover transition-colors shrink-0">
            Go to Support →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
