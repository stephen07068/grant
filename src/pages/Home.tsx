import { Link } from 'react-router-dom';
import {
  Search, ArrowRight, Shield, Users, DollarSign, Zap, Heart, CheckCircle
} from 'lucide-react';
import { getFeaturedGrants } from '../data/grants';
import GrantCard from '../components/GrantCard';
import ReviewsSection from '../components/ReviewsSection';
import './Home.css';

export default function Home() {
  const featuredGrants = getFeaturedGrants();

  const howItWorks = [
    {
      step: '01',
      title: 'Explore Opportunities',
      desc: 'Browse hundreds of verified grants for personal assistance, education, housing, and healthcare.',
      icon: <Search size={24} />,
    },
    {
      step: '02',
      title: 'Verify Eligibility',
      desc: 'Review clear criteria, funding limits, and required documents before applying.',
      icon: <CheckCircle size={24} />,
    },
    {
      step: '03',
      title: 'Apply Seamlessly',
      desc: 'Submit your application dossier directly through our secure platform in minutes.',
      icon: <Zap size={24} />,
    },
    {
      step: '04',
      title: 'Receive Support',
      desc: 'Connect with grant administrators and receive your funding notification directly.',
      icon: <Heart size={24} />,
    },
  ];

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow script-eyebrow">Real Opportunities. Lasting Impact.</p>
            <h1 className="hero-title">
              Your Future<br />
              Deserves{' '}
              <span className="hero-title-script">Support</span>
            </h1>
            <p className="hero-subtitle">
              EastAidGrant connects individuals, students, families and organizations
              with verified grant opportunities. Get the support you need
              to <strong>achieve your goals.</strong>
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
              <Link to="/grants" className="btn btn-primary btn-lg">
                Explore Grants <ArrowRight size={18} />
              </Link>
              <Link to="/apply" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                Apply Now
              </Link>
            </div>
          </div>

          {/* Right Cursive Accent Block */}
          <div className="hero-script-block">
            <span className="script-word">More</span>
            <span className="script-word script-word-mid">Opportunities</span>
            <span className="script-word script-word-btm">Brighter</span>
            <span className="script-word script-word-last">Futures</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED GRANTS ── */}
      <section className="section-pad featured-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2>Featured <span className="script-accent">Grants</span></h2>
              <p>Hand-picked opportunities for <span className="script-sub">individuals & families</span> with trusted providers</p>
            </div>
            <Link to="/grants" className="btn btn-outline">
              View All Grants <ArrowRight size={16} />
            </Link>
          </div>
          <div className="featured-grants-grid">
            {featuredGrants.map(grant => (
              <GrantCard key={grant.id} grant={grant} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad how-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>How EastAidGrant <span className="script-accent">Works</span></h2>
            <p>Simple, transparent, and effective — from <span className="script-sub">discovery</span> to funding</p>
          </div>
          <div className="how-grid">
            {howItWorks.map((step, i) => (
              <div key={i} className="how-step">
                <div className="how-step-number">{step.step}</div>
                <div className="how-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS & SUCCESS STORIES ── */}
      <ReviewsSection />

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-overlay" />
        <div className="container cta-content">
          <div>
            <h2>Ready to Take the <span className="script-accent" style={{ color: 'var(--gold-light)' }}>Next Step?</span></h2>
            <p>Join thousands of individuals and families already finding grant opportunities on EastAidGrant.</p>
          </div>
          <div className="cta-features">
            <div className="cta-feature"><Shield size={20} /><div><strong>Verified Opportunities</strong><span>Real and trusted sources</span></div></div>
            <div className="cta-feature"><Zap size={20} /><div><strong>Easy Application</strong><span>Simple and secure process</span></div></div>
            <div className="cta-feature"><Users size={20} /><div><strong>Expert Support</strong><span>We're here to help</span></div></div>
            <div className="cta-feature"><DollarSign size={20} /><div><strong>100% Free</strong><span>No hidden fees</span></div></div>
          </div>
          <Link to="/grants" className="btn btn-primary btn-lg">
            Explore Grants <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}