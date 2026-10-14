import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, Users, Store, CalendarDays,
  MapPin, X, TrendingUp, ShieldCheck, Building2, Ticket, Star,
} from 'lucide-react';
import heroImg from '../../../assets/hero.jpg';

/* ------------------------------------------------------------------
   Base styles — one clean animation set, nothing excessive
------------------------------------------------------------------ */
const BASE_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Scroll-reveal */
  .sr { opacity: 0; }
  .sr.show { animation: fadeUp 0.5s ease forwards; }

  /* Card hover */
  .expo-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
  .expo-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.10); transform: translateY(-4px); }
  .expo-card:hover .card-thumb { transform: scale(1.04); }
  .card-thumb { transition: transform 0.4s ease; }

  /* Pill filter button */
  .pill-btn { transition: all 0.15s ease; }
  .pill-btn:hover { background: #101B2D; color: #fff; border-color: #101B2D; }

  /* CTA button */
  .btn-primary { transition: opacity 0.15s, transform 0.15s; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-ghost { transition: background 0.15s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.10); }
`;

/* ------------------------------------------------------------------
   Scroll-reveal hook — attaches IntersectionObserver once
------------------------------------------------------------------ */
function useScrollReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.sr');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------
   Data
------------------------------------------------------------------ */
const EXPOS = [
  {
    id: 1,
    title: 'Karachi Technology Expo 2026',
    category: 'Technology',
    date: 'Nov 15–17, 2026',
    location: 'Expo Centre Karachi',
    status: 'Open',
    statusColor: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    description: "Pakistan's largest annual technology showcase featuring AI, cloud computing, robotics, and consumer electronics from 200+ companies.",
    footfall: '18,000+', vendors: 214, sessions: 42,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    tags: ['AI', 'Robotics', 'Cloud'],
  },
  {
    id: 2,
    title: 'Pakistan Trade & Business Summit',
    category: 'Business & Trade',
    date: 'Dec 5–7, 2026',
    location: 'PNCA Islamabad',
    status: 'Open',
    statusColor: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    description: 'A premier B2B trade platform connecting exporters, importers, and investors across South Asia with structured matchmaking sessions.',
    footfall: '12,000+', vendors: 160, sessions: 28,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
    tags: ['Trade', 'B2B', 'Investment'],
  },
  {
    id: 3,
    title: 'GameFest Lahore 2026',
    category: 'Gaming',
    date: 'Nov 28–30, 2026',
    location: 'Alhamra Arts Council Lahore',
    status: 'Filling Fast',
    statusColor: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    description: "South Asia's biggest gaming convention: esports tournaments, developer studios, indie showcases, and cosplay competitions.",
    footfall: '22,000+', vendors: 95, sessions: 60,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
    tags: ['Esports', 'Indie', 'Cosplay'],
  },
  {
    id: 4,
    title: 'HealthTech Innovations Expo',
    category: 'Technology',
    date: 'Jan 10–11, 2027',
    location: 'Lahore Garrison Exhibition',
    status: 'Coming Soon',
    statusColor: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
    description: 'Digital health, medical devices, telemedicine, and biotech startups present next-generation healthcare solutions.',
    footfall: '9,000+', vendors: 80, sessions: 24,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    tags: ['HealthTech', 'MedDevices', 'AI'],
  },
  {
    id: 5,
    title: 'Karachi Trade Fair 2027',
    category: 'Business & Trade',
    date: 'Feb 20–23, 2027',
    location: 'Expo Centre Karachi',
    status: 'Coming Soon',
    statusColor: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
    description: "Pakistan's iconic annual trade fair spanning consumer goods, agriculture, textiles, and manufacturing sectors.",
    footfall: '30,000+', vendors: 400, sessions: 15,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tags: ['Trade', 'Manufacturing', 'Agri'],
  },
  {
    id: 6,
    title: 'EduTech & Learning Expo',
    category: 'Technology',
    date: 'Mar 5–6, 2027',
    location: 'LUMS Lahore',
    status: 'Coming Soon',
    statusColor: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
    description: "Edtech platforms, universities, learning tools, and classroom innovation meet at Pakistan's top education innovation expo.",
    footfall: '7,500+', vendors: 70, sessions: 30,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    tags: ['EdTech', 'Universities', 'Tools'],
  },
];

const CATEGORIES = ['All', 'Technology', 'Business & Trade', 'Gaming'];

const STATS = [
  { icon: CalendarDays, value: '120+',   label: 'Expos Hosted'          },
  { icon: Users,        value: '85K+',   label: 'Registered Attendees'  },
  { icon: Store,        value: '3,200+', label: 'Exhibitor Companies'   },
  { icon: Star,         value: '4.9',    label: 'Avg. Organizer Rating' },
];

const ROLES = [
  {
    icon: Building2,
    title: 'Organizers',
    desc: 'Create your expo, set up the booth layout, review exhibitor applications, and monitor attendance — all from one dashboard.',
    cta: 'Start organizing',
    to: '/register',
  },
  {
    icon: Store,
    title: 'Exhibitors',
    desc: 'Build a company profile, apply to upcoming expos, choose your booth, and showcase your products to thousands of visitors.',
    cta: 'Apply as exhibitor',
    to: '/register',
  },
  {
    icon: Ticket,
    title: 'Attendees',
    desc: 'Browse expos, register for free, bookmark the sessions you care about, and find any exhibitor on the interactive floor plan.',
    cta: 'Explore expos',
    to: '/expos',
  },
];

/* ------------------------------------------------------------------
   Hero
------------------------------------------------------------------ */
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center' }}>

      {/* Background photo */}
      <img
        src={heroImg}
        alt="Exhibition hall"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
        }}
      />

      {/* Dark overlay — heavier on left, lighter on right so photo is visible */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(10,18,40,0.93) 0%, rgba(10,20,50,0.85) 45%, rgba(8,16,40,0.55) 75%, rgba(5,12,30,0.30) 100%)',
      }} />

      {/* Soft bottom fade into the white stats bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '1280px',
        margin: '0 auto', padding: '100px 32px 80px',
      }}>

        {/* Small label */}
        <p style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#55E0C0',
          margin: '0 0 20px',
          animation: 'heroIn 0.6s 0.1s ease both',
        }}>
          Expo Management Platform
        </p>

        {/* Headline — big, simple, no gradient */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          fontWeight: 800, lineHeight: 1.1,
          color: '#ffffff', margin: '0 0 20px',
          maxWidth: '640px',
          animation: 'heroIn 0.6s 0.2s ease both',
        }}>
          The platform for<br />
          world-class expos.
        </h1>

        {/* One-line description */}
        <p style={{
          fontSize: '1rem', lineHeight: 1.7,
          color: 'rgba(220,230,245,0.70)',
          maxWidth: '480px', margin: '0 0 36px',
          animation: 'heroIn 0.6s 0.35s ease both',
        }}>
          EventSphere connects organizers, exhibitors, and attendees in one
          place — from booth setup to attendee registration.
        </p>

        {/* Search */}
        <div style={{
          display: 'flex', gap: '8px', maxWidth: '480px',
          flexWrap: 'wrap',
          animation: 'heroIn 0.6s 0.45s ease both',
        }}>
          <label style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: '10px', padding: '0 14px',
            minWidth: '200px', cursor: 'text',
          }}>
            <Search size={14} style={{ color: 'rgba(255,255,255,0.40)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search expos or locations…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '0.875rem', padding: '13px 0',
              }}
            />
          </label>
          <Link to="/expos" className="btn-primary" style={{
            background: '#55E0C0', color: '#101B2D',
            fontWeight: 700, fontSize: '0.875rem',
            padding: '13px 22px', borderRadius: '10px',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Search
          </Link>
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap',
          animation: 'heroIn 0.6s 0.55s ease both',
        }}>
          <Link to="/register" className="btn-primary" style={{
            background: '#101B2D', color: '#fff',
            fontWeight: 600, fontSize: '0.875rem',
            padding: '11px 24px', borderRadius: '9px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            Get started free
          </Link>
          <Link to="/expos" className="btn-ghost" style={{
            color: 'rgba(220,235,255,0.75)', fontWeight: 600, fontSize: '0.875rem',
            padding: '11px 24px', borderRadius: '9px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'transparent',
          }}>
            Browse expos
          </Link>
        </div>

        {/* Trust numbers — plain, no icons */}
        <div style={{
          display: 'flex', gap: '32px', marginTop: '44px', flexWrap: 'wrap',
          animation: 'heroIn 0.6s 0.65s ease both',
        }}>
          {[['85K+', 'Attendees'], ['3,200+', 'Exhibitors'], ['120+', 'Expos']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(200,215,240,0.50)', marginTop: '3px', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Stats bar
------------------------------------------------------------------ */
function StatsBar() {
  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #edf0f4' }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 32px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
      }}>
        {STATS.map(({ icon: Icon, value, label }, i) => (
          <div key={label} className="sr" style={{
            animationDelay: `${i * 0.08}s`,
            padding: '32px 0', textAlign: 'center',
            borderRight: i < STATS.length - 1 ? '1px solid #edf0f4' : 'none',
          }}>
            <Icon size={18} style={{ color: '#55E0C0', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#101B2D', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Expo Card
------------------------------------------------------------------ */
function ExpoCard({ expo, onOpen, delay }) {
  const sc = expo.statusColor;
  return (
    <article
      className="expo-card sr"
      style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        border: '1px solid #edf0f4', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        animationDelay: delay,
      }}
      onClick={() => onOpen(expo)}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(expo)}
    >
      {/* Image */}
      <div style={{ height: '186px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={expo.image} alt={expo.title}
          className="card-thumb"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        <span style={{
          position: 'absolute', top: '12px', left: '12px',
          fontSize: '11px', fontWeight: 600,
          padding: '3px 9px', borderRadius: '6px',
          background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
        }}>
          {expo.status}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '7px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#55E0C0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {expo.category}
        </span>

        <h3 style={{
          fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4,
          color: '#101B2D', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {expo.title}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarDays size={11} /> {expo.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} /> {expo.location}
          </span>
        </div>

        <p style={{
          fontSize: '0.825rem', color: '#64748b', lineHeight: 1.6, flex: 1, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {expo.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', paddingTop: '2px' }}>
          {expo.tags.map((t) => (
            <span key={t} style={{
              fontSize: '11px', background: '#f1f5f9', color: '#64748b',
              padding: '3px 8px', borderRadius: '5px',
            }}>{t}</span>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onOpen(expo); }}
          style={{
            marginTop: '8px', width: '100%', background: '#101B2D',
            color: '#fff', fontWeight: 600, fontSize: '0.825rem',
            padding: '9px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2d47')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#101B2D')}
        >
          View details
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
   Expo Modal
------------------------------------------------------------------ */
function ExpoModal({ expo, onClose }) {
  useEffect(() => {
    if (!expo) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [expo]);

  if (!expo) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(10,18,40,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', animation: 'heroIn 0.2s ease',
      }}
      role="dialog" aria-modal="true"
    >
      <div style={{
        background: '#fff', borderRadius: '18px',
        width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
        animation: 'modalIn 0.25s ease',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
      }}>
        {/* Image */}
        <div style={{ position: 'relative', height: '210px' }}>
          <img src={expo.image} alt={expo.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px 18px 0 0', display: 'block' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,18,40,0.72) 0%, transparent 55%)',
            borderRadius: '18px 18px 0 0',
          }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.18)', border: 'none',
            color: '#fff', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.32)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          aria-label="Close">
            <X size={15} />
          </button>
          <div style={{ position: 'absolute', bottom: '14px', left: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '6px',
              background: expo.statusColor.bg, color: expo.statusColor.text, border: `1px solid ${expo.statusColor.border}`,
            }}>{expo.status}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#55E0C0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {expo.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '26px 26px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101B2D', margin: 0, lineHeight: 1.25 }}>
            {expo.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.85rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CalendarDays size={13} style={{ color: '#55E0C0' }} /> {expo.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: '#55E0C0' }} /> {expo.location}
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            {expo.description}
          </p>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {[
              { icon: Users,       v: expo.footfall, l: 'Expected Footfall' },
              { icon: ShieldCheck, v: expo.vendors,  l: 'Verified Vendors'  },
              { icon: TrendingUp,  v: expo.sessions, l: 'Live Sessions'     },
            ].map(({ icon: Icon, v, l }) => (
              <div key={l} style={{
                background: '#f8fafc', border: '1px solid #edf0f4', borderRadius: '10px',
                padding: '14px 10px', textAlign: 'center',
              }}>
                <Icon size={14} style={{ color: '#55E0C0', marginBottom: '6px' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#101B2D' }}>{v}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {expo.tags.map((t) => (
              <span key={t} style={{
                fontSize: '12px', background: '#f1f5f9', color: '#64748b',
                padding: '4px 10px', borderRadius: '6px',
              }}>{t}</span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              flex: 1, minWidth: '130px', textAlign: 'center',
              background: '#55E0C0', color: '#101B2D',
              fontWeight: 700, fontSize: '0.875rem',
              padding: '12px 16px', borderRadius: '9px', textDecoration: 'none',
            }}>
              Register as Attendee
            </Link>
            <Link to="/register" style={{
              flex: 1, minWidth: '130px', textAlign: 'center',
              background: '#101B2D', color: '#fff',
              fontWeight: 700, fontSize: '0.875rem',
              padding: '12px 16px', borderRadius: '9px', textDecoration: 'none',
            }}>
              Apply as Exhibitor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Featured Expos
------------------------------------------------------------------ */
function FeaturedExpos() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = active === 'All' ? EXPOS : EXPOS.filter((e) => e.category === active);

  return (
    <section style={{ padding: '72px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header row */}
        <div className="sr" style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'flex-end', justifyContent: 'space-between',
          gap: '12px', marginBottom: '28px',
        }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#55E0C0', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Upcoming Events
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#101B2D', margin: 0 }}>
              Featured Expos
            </h2>
          </div>
          <Link to="/expos" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.85rem', fontWeight: 600, color: '#101B2D', textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#55E0C0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#101B2D')}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter pills */}
        <div className="sr" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)} className="pill-btn" style={{
              padding: '7px 16px', borderRadius: '7px', fontSize: '0.825rem', fontWeight: 500,
              cursor: 'pointer', border: '1px solid',
              borderColor: active === cat ? '#101B2D' : '#dde3ec',
              background: active === cat ? '#101B2D' : '#fff',
              color: active === cat ? '#fff' : '#475569',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))',
          gap: '20px',
        }}>
          {filtered.map((expo, i) => (
            <ExpoCard
              key={expo.id} expo={expo}
              onOpen={setSelected}
              delay={`${i * 0.07}s`}
            />
          ))}
        </div>
      </div>

      {selected && <ExpoModal expo={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ------------------------------------------------------------------
   Roles section
------------------------------------------------------------------ */
function RolesSection() {
  return (
    <section style={{ padding: '72px 0', background: '#fff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        <div className="sr" style={{ maxWidth: '520px', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#55E0C0', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Who is it for?
          </p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#101B2D', margin: '0 0 12px' }}>
            Built for every person involved in an expo.
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Whether you run events, participate as a company, or just want to explore —
            there is a dedicated experience for you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '16px' }}>
          {ROLES.map(({ icon: Icon, title, desc, cta, to }, i) => (
            <div key={title} className="sr" style={{
              border: '1px solid #edf0f4', borderRadius: '14px', padding: '26px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              animationDelay: `${i * 0.1}s`,
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#f0fdfb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} style={{ color: '#55E0C0' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#101B2D', margin: 0 }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.65, flex: 1, margin: 0 }}>{desc}</p>
              <Link to={to} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '0.85rem', fontWeight: 600, color: '#101B2D',
                textDecoration: 'none',
                transition: 'gap 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#55E0C0'; e.currentTarget.style.gap = '8px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#101B2D'; e.currentTarget.style.gap = '5px'; }}
              >
                {cta} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   CTA banner
------------------------------------------------------------------ */
function CtaBanner() {
  return (
    <section style={{ background: '#101B2D', padding: '72px 0' }}>
      <div className="sr" style={{
        maxWidth: '600px', margin: '0 auto', padding: '0 32px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
          Ready to join EventSphere?
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(200,215,240,0.60)', lineHeight: 1.7, margin: '0 0 32px' }}>
          Create a free account and start exploring Pakistan's most exciting
          expos, or list your event and reach thousands of attendees.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{
            background: '#55E0C0', color: '#101B2D',
            fontWeight: 700, fontSize: '0.875rem',
            padding: '12px 28px', borderRadius: '9px', textDecoration: 'none',
          }}>
            Create a free account
          </Link>
          <Link to="/expos" className="btn-ghost" style={{
            color: 'rgba(200,220,255,0.70)', fontWeight: 600, fontSize: '0.875rem',
            padding: '12px 28px', borderRadius: '9px', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.14)', background: 'transparent',
          }}>
            Browse expos
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Page root
------------------------------------------------------------------ */
export default function Home() {
  useScrollReveal();

  return (
    <>
      <style>{BASE_STYLES}</style>
      <Hero />
      <StatsBar />
      <FeaturedExpos />
      <RolesSection />
      <CtaBanner />
    </>
  );
}
