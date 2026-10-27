import { useParams, Link } from 'react-router-dom';
import {
  MapPin, ExternalLink,
  CheckCircle, FileText, Users, Clock
} from 'lucide-react';
import { getGrantById, grants } from '../data/grants';
import GrantCard from '../components/GrantCard';
import './GrantDetail.css';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

const statusClass: Record<string, string> = {
  Open: 'badge-open',
  Upcoming: 'badge-upcoming',
  Closed: 'badge-closed',
};

export default function GrantDetail() {
  const { id } = useParams<{ id: string }>();
  const grant = getGrantById(id ?? '');

  if (!grant) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: 8 }}>Grant not found</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
          This grant may have been removed or the URL is incorrect.
        </p>
        <Link to="/grants" className="btn btn-navy">Browse All Grants</Link>
      </div>
    );
  }

  const related = grants
    .filter((g) => g.category === grant.category && g.id !== grant.id)
    .slice(0, 3);

  return (
    <div className="grant-detail-page">
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/grants">Grants</Link>
            <span>/</span>
            <span>{grant.title}</span>
          </div>
          <div className="grant-detail-badges">
            <span className="badge badge-category">{grant.category}</span>
            <span className={`badge ${statusClass[grant.status]}`}>{grant.status}</span>
          </div>
          <h1>{grant.title}</h1>
          <p>{grant.provider}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container grant-detail-layout">
        {/* ── Main column ── */}
        <div className="grant-detail-main">
          <div className="grant-detail-img">
            <img src={grant.imageUrl} alt={grant.title} />
          </div>

          <section className="grant-detail-section">
            <h2>About This Grant</h2>
            <p>{grant.description}</p>
          </section>

          <section className="grant-detail-section">
            <h2><CheckCircle size={20} /> Eligibility Requirements</h2>
            <ul className="grant-checklist">
              {grant.eligibility.map((item, i) => (
                <li key={i}>
                  <CheckCircle size={15} className="check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grant-detail-section">
            <h2><FileText size={20} /> Required Documents</h2>
            <ul className="grant-checklist">
              {grant.requiredDocuments.map((doc, i) => (
                <li key={i}>
                  <FileText size={15} className="file-icon" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grant-detail-section">
            <h2><Users size={20} /> Who Can Apply</h2>
            <div className="applicant-types">
              {grant.applicantTypes.map((t) => (
                <span key={t} className="badge badge-category applicant-badge">{t}</span>
              ))}
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="grant-detail-sidebar">
          <div className="grant-sidebar-card">
            <div className="grant-amount-display">
              <span className="grant-amount-label">Award Amount</span>
              <span className="grant-amount-value">
                ${grant.minAmount.toLocaleString()} – ${grant.maxAmount.toLocaleString()}
              </span>
            </div>

            <div className="grant-sidebar-meta">
              <div className="sidebar-meta-item">
                <Clock size={16} />
                <div>
                  <span className="sidebar-meta-label">Deadline</span>
                  <span className="sidebar-meta-value">{fmtDate(grant.deadline)}</span>
                </div>
              </div>
              <div className="sidebar-meta-item">
                <MapPin size={16} />
                <div>
                  <span className="sidebar-meta-label">Location</span>
                  <span className="sidebar-meta-value">{grant.location}</span>
                </div>
              </div>
              <div className="sidebar-meta-item">
                <Users size={16} />
                <div>
                  <span className="sidebar-meta-label">Provider</span>
                  <span className="sidebar-meta-value">{grant.provider}</span>
                </div>
              </div>
              <div className="sidebar-meta-item">
                <CheckCircle size={16} />
                <div>
                  <span className="sidebar-meta-label">Status</span>
                  <span className={`badge ${statusClass[grant.status]}`}>{grant.status}</span>
                </div>
              </div>
            </div>

            <div className="grant-sidebar-actions">
              <Link
                to={`/apply?grant=${grant.id}`}
                className="btn btn-primary"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                Apply Now
              </Link>
              <a
                href={grant.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                Official Source <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="grant-sidebar-note">
            <span>ℹ️</span>
            <span>
              Always verify grant details directly with the official provider before applying.
            </span>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="grant-detail-related">
          <div className="container">
            <div className="section-header">
              <h2>Related Grants in {grant.category}</h2>
            </div>
            <div className="related-grants-grid">
              {related.map((g) => (
                <GrantCard key={g.id} grant={g} variant="default" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
