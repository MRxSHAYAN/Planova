import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const OFFICES = [
  {
    city: "Karachi",
    address: "Plot 14, Block 7, Clifton, Karachi 75600",
    phone: "+92 21 3456 7890",
    email: "karachi@planova.pk",
  },
  {
    city: "Lahore",
    address: "Office 3B, Packages Mall Road, Lahore 54000",
    phone: "+92 42 3567 8901",
    email: "lahore@planova.pk",
  },
  {
    city: "Islamabad",
    address: "Blue Area, F-7 Markaz, Islamabad 44000",
    phone: "+92 51 2345 6789",
    email: "islamabad@planova.pk",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <Layout>
      {/* header */}
      <div className="bg-navy pt-[90px] pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Get in touch</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-black text-white leading-[1.1] mb-4">
            We'd love to hear from you.
          </h1>
          <p className="text-white/50 text-[14px] leading-relaxed max-w-480px">
            Whether you have a question about an expo, need help with your account, or want to partner with us — reach out and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* form + offices */}
      <section className="bg-page py-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">

          {/* contact form */}
          <div>
            <h2 className="text-[1.4rem] font-black text-dark mb-6">Send us a message</h2>

            {sent ? (
              <div className="bg-status-open-bg border border-status-open/30 rounded-xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-status-open/15 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-status-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-dark font-black text-[17px] mb-2">Message sent!</h3>
                <p className="text-body text-[13px] mb-5">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-[13px] font-semibold text-accent hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-body mb-1.5">Full name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-[13px] text-dark placeholder-muted outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-body mb-1.5">Email address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-[13px] text-dark placeholder-muted outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-body mb-1.5">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-[13px] text-dark placeholder-muted outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-body mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more…"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-[13px] text-dark placeholder-muted outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="self-start px-7 py-3 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors min-h-44px"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* offices */}
          <div>
            <h2 className="text-[1.4rem] font-black text-dark mb-6">Our offices</h2>
            <div className="flex flex-col gap-4">
              {OFFICES.map((o) => (
                <div key={o.city} className="bg-surface rounded-xl border border-border p-5">
                  <h3 className="text-dark font-black text-[15px] mb-3">{o.city}</h3>
                  <div className="flex flex-col gap-2 text-[13px] text-body">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {o.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6.06 6.06l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.19.92Z" />
                      </svg>
                      {o.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      {o.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-navy rounded-xl p-6">
              <h3 className="text-white font-black text-[15px] mb-1">General enquiries</h3>
              <p className="text-white/40 text-[12.5px] mb-3">For anything else, email us directly.</p>
              <a href="mailto:hello@planova.pk" className="text-accent font-semibold text-[13px] hover:underline">
                hello@planova.pk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* bottom cta */}
      <section className="bg-navy px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-[1.5rem] font-black text-white mb-2">Looking for help with your account?</h2>
            <p className="text-white/40 text-[13.5px]">Visit our support centre for step-by-step guides.</p>
          </div>
          <Link
            to="/support"
            className="px-6 py-3 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors min-h-44px flex items-center shrink-0"
          >
            Go to Support →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
