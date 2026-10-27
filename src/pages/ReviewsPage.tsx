import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, ArrowRight, ShieldCheck, Heart, Award, Users } from 'lucide-react';
import { reviews } from '../data/reviews';
import './ReviewsPage.css';

export default function ReviewsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(r => {
        const lowerGrant = r.grantName.toLowerCase();
        const lowerRole = r.role.toLowerCase();
        if (filter === 'medical') {
          return lowerGrant.includes('medical') || lowerGrant.includes('cancer') || lowerGrant.includes('kidney') || lowerGrant.includes('stroke') || lowerGrant.includes('diabetes') || lowerGrant.includes('hospital') || lowerGrant.includes('rare') || lowerGrant.includes('recovery');
        }
        if (filter === 'personal') {
          return lowerGrant.includes('personal') || lowerGrant.includes('emergency') || lowerGrant.includes('single') || lowerGrant.includes('disability');
        }
        if (filter === 'housing') {
          return lowerGrant.includes('housing') || lowerGrant.includes('rent');
        }
        if (filter === 'education') {
          return lowerGrant.includes('education') || lowerGrant.includes('tuition');
        }
        if (filter === 'veterans') {
          return lowerGrant.includes('veteran') || lowerRole.includes('veteran');
        }
        if (filter === 'seniors') {
          return lowerGrant.includes('senior') || lowerGrant.includes('elder') || lowerGrant.includes('alzheimer') || lowerGrant.includes('caregiver');
        }
        return true;
      });

  return (
    <div className="reviews-page">
      {/* ── HEADER ── */}
      <div className="page-header" style={{ background: 'var(--navy)', color: '#fff', padding: '56px 0 44px' }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link to="/" style={{ color: 'var(--gold)' }}>Home</Link><span>/</span><span>Reviews & Success Stories</span>
          </div>
          <p className="script-eyebrow" style={{ color: 'var(--gold-light)' }}>Real Recipients. Real Results.</p>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: '#fff', marginBottom: 14 }}>
            Verified Client <span className="script-accent" style={{ color: 'var(--gold)' }}>Reviews</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 640, lineHeight: 1.6 }}>
            Discover how EastAidGrant has helped over 1,420+ individuals, students, single parents, and veterans secure crucial non-repayable funding nationwide.
          </p>
        </div>
      </div>

      <div className="container section-pad">
        {/* ── STATS BAR ── */}
        <div className="reviews-trust-bar" style={{ marginBottom: 40 }}>
          <div className="trust-item trust-rating">
            <div className="trust-score">4.8</div>
            <div>
              <div className="trust-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <span className="trust-sub">1,420+ Verified Recipient Ratings</span>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight">$48.2M+</div>
            <span className="trust-sub">Total Grant Funding Disbursed</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight">98.4%</div>
            <span className="trust-sub">Positive Satisfaction Score</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={22} color="var(--green)" /> 100% Free
            </div>
            <span className="trust-sub">Zero Application Fees Required</span>
          </div>
        </div>

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="reviews-filter-bar">
          <button
            className={`reviews-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Stories ({reviews.length})
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'medical' ? 'active' : ''}`}
            onClick={() => setFilter('medical')}
          >
            Medical & Healthcare
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'personal' ? 'active' : ''}`}
            onClick={() => setFilter('personal')}
          >
            Personal & Emergency Relief
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'housing' ? 'active' : ''}`}
            onClick={() => setFilter('housing')}
          >
            Housing & Rent Relief
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'education' ? 'active' : ''}`}
            onClick={() => setFilter('education')}
          >
            Higher Education & Tuition
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'seniors' ? 'active' : ''}`}
            onClick={() => setFilter('seniors')}
          >
            Seniors & Caregivers
          </button>
          <button
            className={`reviews-filter-btn ${filter === 'veterans' ? 'active' : ''}`}
            onClick={() => setFilter('veterans')}
          >
            Veterans & Families
          </button>
        </div>

        {/* ── REVIEWS GRID ── */}
        <div className="reviews-grid">
          {filteredReviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-card-top">
                <div className="review-stars">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                {r.verified && (
                  <span className="review-verified-badge">
                    <CheckCircle size={13} /> Verified Recipient
                  </span>
                )}
              </div>

              <h3 className="review-title">"{r.title}"</h3>
              <p className="review-content">{r.content}</p>

              <div className="review-grant-pill">
                <span className="grant-pill-label">Funded:</span>
                <span className="grant-pill-name">{r.grantName}</span>
                <span className="grant-pill-amount">{r.amount}</span>
              </div>

              <div className="review-author">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="review-author-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=0d2137&color=c9a84c&bold=true`;
                  }}
                />
                <div className="review-author-info">
                  <strong className="review-author-name">{r.name}</strong>
                  <span className="review-author-meta">{r.role} • {r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TRUST HIGHLIGHTS ── */}
        <div className="reviews-trust-highlights">
          <div className="highlight-box">
            <Award size={28} color="var(--gold)" />
            <h4>Non-Repayable Grants</h4>
            <p>None of the grants listed on EastAidGrant are loans. Approved recipients never pay back awards.</p>
          </div>
          <div className="highlight-box">
            <Heart size={28} color="var(--gold)" />
            <h4>Dedicated Review Team</h4>
            <p>Every applicant receives verification updates directly via email, WhatsApp, or phone.</p>
          </div>
          <div className="highlight-box">
            <Users size={28} color="var(--gold)" />
            <h4>Individuals & Families First</h4>
            <p>Over 65% of funding allocations are designated specifically for non-business individuals in need.</p>
          </div>
        </div>

        {/* ── CTA BOX ── */}
        <div className="reviews-bottom-cta" style={{ marginTop: 44 }}>
          <div>
            <h3>Ready to Join Our Success Stories?</h3>
            <p>Applications are open today. Find a grant opportunity tailored to your personal or family needs.</p>
          </div>
          <Link to="/apply" className="btn btn-primary btn-lg">
            Start Your Application <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
