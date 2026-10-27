import { Link } from 'react-router-dom';
import { Star, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { reviews } from '../data/reviews';
import './ReviewsSection.css';

export default function ReviewsSection() {
  return (
    <section className="section-pad reviews-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <p className="script-eyebrow">Real People. Real Results.</p>
          <h2>Verified <span className="script-accent">Reviews & Stories</span></h2>
          <p style={{ fontSize: 16, color: 'var(--gray-600)', marginTop: 8 }}>
            Over 1,400+ individuals, students, veterans, and organizations have found life-changing funding through EastAidGrant.
          </p>
        </div>

        {/* Trust Summary Bar */}
        <div className="reviews-trust-bar">
          <div className="trust-item trust-rating">
            <div className="trust-score">4.8</div>
            <div>
              <div className="trust-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <span className="trust-sub">1,420+ Verified Reviews</span>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight">$48.2M+</div>
            <span className="trust-sub">Grant Funding Disbursed</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight">98.4%</div>
            <span className="trust-sub">Applicant Satisfaction Rate</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-highlight" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={22} color="var(--green)" /> 100% Free
            </div>
            <span className="trust-sub">Zero Hidden Fees or Charges</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviews.map((r) => (
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
                    // Fallback to placeholder if image fails
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

        {/* Bottom Callout */}
        <div className="reviews-bottom-cta">
          <div>
            <h3>Start Your Free Application Today</h3>
            <p>Explore all 24+ open grants for personal emergency, housing, education, and family support.</p>
          </div>
          <Link to="/grants" className="btn btn-primary btn-lg">
            Find Your Grant <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
