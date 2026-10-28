import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ApplySuccess() {
  return (
    <div className="apply-success">
      <div className="apply-success-card">
        <div className="apply-success-icon"><CheckCircle size={48} /></div>
        <h2>Application Successfully Submitted!</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--gray-700)', marginTop: 12 }}>
          Thank you for submitting your grant application. Your dossier has been logged into our
          evaluation system and assigned for verification.
        </p>
        <div style={{
          margin: '24px 0', padding: '18px 20px', background: 'var(--off-white)',
          borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', textAlign: 'left'
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
            Status: <span style={{ color: 'var(--green)', fontWeight: 700 }}>Under Review</span>
          </p>
          <div style={{
            fontSize: 13.5, color: 'var(--navy-mid)', lineHeight: 1.6,
            background: 'rgba(201, 168, 76, 0.12)', padding: '12px 14px',
            borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--gold)'
          }}>
            🔔 <strong>Important Notice:</strong> You will be notified if your grant is accepted
            through your email, WhatsApp, or phone number provided in your application.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 12 }}>
          <Link to="/" className="btn btn-navy" style={{ flex: 1, justifyContent: 'center' }}>
            Return to Home
          </Link>
          <Link to="/grants" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
            Browse More Grants
          </Link>
        </div>
      </div>
    </div>
  );
}
