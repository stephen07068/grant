import { Link } from 'react-router-dom';
import { Shield, Users, Target, Award, ArrowRight } from 'lucide-react';
import './About.css';

export default function About() {
  const values = [
    { icon: <Shield size={24} />, title: 'Verified Opportunities', desc: 'Every grant listing is cross-referenced with official government and institutional sources.' },
    { icon: <Users size={24} />, title: 'Community First', desc: 'We serve individuals, small businesses, nonprofits, and institutions across every sector.' },
    { icon: <Target size={24} />, title: 'Precision Matching', desc: 'Smart filters and search help applicants find the exact grants they qualify for.' },
    { icon: <Award size={24} />, title: 'Trusted Platform', desc: 'Thousands of users trust EastAidGrant to guide them to real funding opportunities.' },
  ];

  const team = [
    { name: 'Alexandra Monroe', role: 'Founder & CEO',          img: 'https://picsum.photos/id/1027/300/300' },
    { name: 'Marcus Chen',      role: 'Head of Grant Research', img: 'https://picsum.photos/id/1005/300/300' },
    { name: 'Priya Nair',       role: 'Product Director',       img: 'https://picsum.photos/id/1011/300/300' },
    { name: 'James Okafor',     role: 'Community Lead',         img: 'https://picsum.photos/id/1012/300/300' },
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span><span>About</span>
          </div>
          <h1>About <span className="script-accent">EastAidGrant</span></h1>
          <p>Connecting people, individuals and organizations with the funding they need to create <span className="script-sub">lasting impact</span>.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="section-pad">
        <div className="container about-mission">
          <div className="about-mission-text">
            <p className="about-eyebrow script-eyebrow">Our Mission</p>
            <h2>Real Opportunities. <span className="script-accent">Lasting Impact.</span></h2>
            <p>
              EastAidGrant was founded on a simple belief: everyone deserves access to
              funding opportunities that can change their lives. Whether you're a veteran
              seeking housing support, a small business owner looking to scale, a nonprofit
              serving your community, or a researcher pushing the boundaries of science —
              the right grant exists for you.
            </p>
            <p>
              We aggregate, verify, and organize grant opportunities from federal agencies,
              state programs, foundations, and private institutions — making the search
              fast, transparent, and accessible for all.
            </p>
            <Link to="/grants" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
              Explore Grants <ArrowRight size={16} />
            </Link>
          </div>
          <div className="about-mission-img">
            <img src="https://picsum.photos/id/3/800/600" alt="Team working" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="container about-stats-grid">
          {[
            { value: '1,000+', label: 'Verified Grants Listed' },
            { value: '18', label: 'Grant Categories' },
            { value: '100K+', label: 'People Helped' },
            { value: '50+', label: 'Trusted Partners' },
          ].map((s, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>What We Stand For</h2>
            <p>Our core values guide every decision we make</p>
          </div>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>Leadership Team</h2>
            <p>Dedicated professionals with deep expertise in grants, policy, and technology</p>
          </div>
          <div className="about-team-grid">
            {team.map((m, i) => (
              <div key={i} className="about-team-card">
                <img src={m.img} alt={m.name} className="about-team-img" />
                <div className="about-team-body">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Find Your Grant?</h2>
          <p>Browse over 1,000 verified opportunities across 18 categories.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 28 }}>
            <Link to="/grants" className="btn btn-primary btn-lg">Browse Grants</Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
