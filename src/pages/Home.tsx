import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Shield, Users, Award, DollarSign, Zap, Heart, CheckCircle
} from 'lucide-react';
import { categories, getFeaturedGrants } from '../data/grants';
import GrantCard from '../components/GrantCard';
import ReviewsSection from '../components/ReviewsSection';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minAmount, setMinAmount] = useState('20000');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState('');

  const featuredGrants = getFeaturedGrants();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (minAmount && minAmount !== '20000') params.set('min', minAmount);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedApplicant) params.set('applicant', selectedApplicant);
    navigate(`/grants?${params.toString()}`);
  };

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

            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="hero-search-bar">
                <Search size={18} className="hero-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search grants, e.g. personal, education, emergency, housing..."
                  className="hero-search-input"
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
              <div className="hero-filters">
                <select value={minAmount} onChange={e => setMinAmount(e.target.value)} className="hero-filter-select">
                  <option value="20000">Minimum Amount: $20,000</option>
                  <option value="50000">Minimum Amount: $50,000</option>
                  <option value="100000">Minimum Amount: $100,000</option>
                  <option value="250000">Minimum Amount: $250,000</option>
                </select>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="hero-filter-select">
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="hero-filter-select">
                  <option value="">All Locations</option>
                  <option>United States</option>
                  <option>Northeast</option>
                  <option>Southeast</option>
                  <option>Midwest</option>
                  <option>Southwest</option>
                  <option>West</option>
                </select>
                <select value={selectedApplicant} onChange={e => setSelectedApplicant(e.target.value)} className="hero-filter-select">
                  <option value="">All Applicant Types</option>
                  <option>Individual</option>
                  <option>Small Business</option>
                  <option>Nonprofit</option>
                  <option>Veterans & Military Families</option>
                  <option>Healthcare Organization</option>
                </select>
              </div>
            </form>
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

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon"><Award size={22} /></div>
              <div>
                <strong className="stat-num">1,000+</strong>
                <span className="stat-label">Verified Grants</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Shield size={22} /></div>
              <div>
                <strong className="stat-num">50+</strong>
                <span className="stat-label">Trusted Partners</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Users size={22} /></div>
              <div>
                <strong className="stat-num">100K+</strong>
                <span className="stat-label">People Helped</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Heart size={22} /></div>
              <div>
                <strong className="stat-num">4.8/5</strong>
                <span className="stat-label">User Satisfaction</span>
              </div>
            </div>
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