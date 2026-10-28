import { useState, useRef } from 'react';
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

  const formRef = useRef<HTMLFormElement>(null);
  const frontFileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);

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
  const [idBack, setIdBack] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId] = useState(() => Date.now().toString(36).toUpperCase());

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

  // Quick client-side compression to ensure uploads are under 1MB and never cause 500 errors
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.size < 500 * 1024) return file;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1400;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.82
        );
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
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

    setIsSubmitting(true);

    // Step 1: Compress images so they don't cause 500 errors on FormSubmit
    const [compFront, compBack] = await Promise.all([
      idFront ? compressImage(idFront) : Promise.resolve(null),
      idBack  ? compressImage(idBack)  : Promise.resolve(null),
    ]);

    // Step 2: Re-inject compressed files back into the actual <input type="file"> elements
    // DataTransfer is the only browser API that lets us programmatically set file input values
    if (compFront && frontFileRef.current) {
      const dt = new DataTransfer();
      const renamed = new File([compFront], `Front_ID_${compFront.name}`, { type: compFront.type });
      dt.items.add(renamed);
      frontFileRef.current.files = dt.files;
    }
    if (compBack && backFileRef.current) {
      const dt = new DataTransfer();
      const renamed = new File([compBack], `Back_ID_${compBack.name}`, { type: compBack.type });
      dt.items.add(renamed);
      backFileRef.current.files = dt.files;
    }

    // Step 3: Save to localStorage for admin panel
    const ref = referenceId;
    const grantTitle = selectedGrant?.title || 'General Grant Application';
    const awardText  = selectedGrant
      ? `$${selectedGrant.minAmount.toLocaleString()} – $${selectedGrant.maxAmount.toLocaleString()}`
      : 'Standard';
    try {
      const existing = JSON.parse(localStorage.getItem('eastaidgrant_applications') || '[]');
      existing.unshift({
        referenceId: `EAG-${ref}`, submittedAt: new Date().toISOString(),
        grantTitle, awardRange: awardText,
        applicantName: form.organizationName, applicantType: form.organizationType,
        address: `${form.organizationAddress}, ${form.city}, ${form.state}`,
        taxIdOrSsn: form.ein || 'N/A', contactPerson: form.fullName,
        email: form.email, phone: form.phone, whatsapp: form.whatsapp,
        projectTitle: form.projectTitle, projectDescription: form.projectDescription,
        idFrontName: idFront?.name || 'Not provided',
        idBackName:  idBack?.name  || 'Not provided',
      });
      localStorage.setItem('eastaidgrant_applications', JSON.stringify(existing));
    } catch { /* ignore */ }

    // Step 4: Native browser multipart POST — the ONLY way FormSubmit delivers file attachments
    // (AJAX/fetch strips attachments; only a real browser form submit carries them)
    if (formRef.current) {
      formRef.current.submit();
    }
  };


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
        <form
          ref={formRef}
          action="https://formsubmit.co/erimiposi2005@gmail.com"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="apply-form"
          noValidate
        >
          {/* FormSubmit config — static */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value={`${window.location.origin}/apply-success`} />
          <input type="hidden" name="_subject" value={`New Grant Application: ${selectedGrant?.title || 'General Grant'} — EAG-${referenceId}`} />
          {/* Data fields — kept in sync with React state */}
          <input type="hidden" name="Reference ID" value={`EAG-${referenceId}`} />
          <input type="hidden" name="Grant Applied For" value={selectedGrant?.title || 'General Grant Application'} />
          <input type="hidden" name="Award Range" value={selectedGrant ? `$${selectedGrant.minAmount.toLocaleString()} – $${selectedGrant.maxAmount.toLocaleString()}` : 'Standard'} />
          <input type="hidden" name="Applicant / Entity" value={form.organizationName} />
          <input type="hidden" name="Applicant Type" value={form.organizationType} />
          <input type="hidden" name="Contact Person" value={form.fullName} />
          <input type="hidden" name="Email Address" value={form.email} />
          <input type="hidden" name="Phone Number" value={form.phone} />
          <input type="hidden" name="WhatsApp Number" value={form.whatsapp} />
          <input type="hidden" name="Mailing / Physical Address" value={`${form.organizationAddress}, ${form.city}, ${form.state}`} />
          <input type="hidden" name="EIN or Tax ID" value={form.ein || 'N/A'} />
          <input type="hidden" name="Project Title" value={form.projectTitle} />
          <input type="hidden" name="Project Proposal Summary" value={form.projectDescription || 'N/A'} />
          <input type="hidden" name="Submission Time" value={new Date().toLocaleString()} />

          {/* Applicant Info */}
          <div className="apply-section">
            <h2>Applicant Information</h2>
            <div className="apply-grid-2">
              <div className="form-group">
                <label className="form-label">Applicant / Organization Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="Applicant / Organization Name"
                  value={form.organizationName}
                  onChange={e => setField('organizationName', e.target.value)}
                  placeholder="Full legal name or organization name"
                  className={`form-input ${errors.organizationName ? 'error' : ''}`}
                />
                {errors.organizationName && <span className="form-error">{errors.organizationName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Applicant Type <span className="req">*</span></label>
                <select
                  name="Applicant Type"
                  value={form.organizationType}
                  onChange={e => setField('organizationType', e.target.value as ApplicantType)}
                  className={`form-select ${errors.organizationType ? 'error' : ''}`}
                >
                  <option value="">Select applicant type</option>
                  {APPLICANT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.organizationType && <span className="form-error">{errors.organizationType}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">EIN / SSN (Last 4) / Tax ID (Optional)</label>
              <input
                type="text"
                name="EIN or Tax ID"
                value={form.ein}
                onChange={e => setField('ein', e.target.value)}
                placeholder="e.g. 12-3456789 or last 4 digits of SSN"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Physical / Mailing Address <span className="req">*</span></label>
              <input
                type="text"
                name="Physical / Mailing Address"
                value={form.organizationAddress}
                onChange={e => setField('organizationAddress', e.target.value)}
                placeholder="Street address or P.O. Box"
                className={`form-input ${errors.organizationAddress ? 'error' : ''}`}
              />
              {errors.organizationAddress && <span className="form-error">{errors.organizationAddress}</span>}
            </div>
            <div className="apply-grid-2">
              <div className="form-group">
                <label className="form-label">City <span className="req">*</span></label>
                <input
                  type="text"
                  name="City"
                  value={form.city}
                  onChange={e => setField('city', e.target.value)}
                  placeholder="Enter city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                />
                {errors.city && <span className="form-error">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">State <span className="req">*</span></label>
                <select
                  name="State"
                  value={form.state}
                  onChange={e => setField('state', e.target.value)}
                  className={`form-select ${errors.state ? 'error' : ''}`}
                >
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
                <input
                  type="text"
                  name="Full Name (Contact Person)"
                  value={form.fullName}
                  onChange={e => setField('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  name="Email Address"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="you@domain.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className="req">*</span></label>
                <input
                  type="tel"
                  name="Phone Number"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number <span className="req">*</span></label>
                <input
                  type="tel"
                  name="WhatsApp Number"
                  value={form.whatsapp}
                  onChange={e => setField('whatsapp', e.target.value)}
                  placeholder="+1 (555) 123-4567 (with country code)"
                  className={`form-input ${errors.whatsapp ? 'error' : ''}`}
                />
                {errors.whatsapp && <span className="form-error">{errors.whatsapp}</span>}
              </div>
            </div>
          </div>

          {/* Grant selection */}
          <div className="apply-section">
            <h2>Grant Selection</h2>
            <div className="form-group">
              <label className="form-label">Select Grant <span className="req">*</span></label>
              <select
                value={form.grantId}
                onChange={e => setField('grantId', e.target.value)}
                className={`form-select ${errors.grantId ? 'error' : ''}`}
              >
                <option value="">Choose a grant...</option>
                {grants.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title} — ${g.minAmount.toLocaleString()}–${g.maxAmount.toLocaleString()}
                  </option>
                ))}
              </select>
              {errors.grantId && <span className="form-error">{errors.grantId}</span>}
            </div>
            {selectedGrant && (
              <div className="apply-grant-preview">
                <img src={selectedGrant.imageUrl} alt={selectedGrant.title} />
                <div>
                  <p className="apply-grant-title">{selectedGrant.title}</p>
                  <p className="apply-grant-provider">{selectedGrant.provider}</p>
                  <span className={`badge ${selectedGrant.status === 'Open' ? 'badge-open' : 'badge-upcoming'}`}>
                    {selectedGrant.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Project */}
          <div className="apply-section">
            <h2>Project Information</h2>
            <div className="form-group">
              <label className="form-label">Project Title <span className="req">*</span></label>
              <input
                type="text"
                name="Project Title"
                value={form.projectTitle}
                onChange={e => setField('projectTitle', e.target.value)}
                placeholder="Enter project title"
                className={`form-input ${errors.projectTitle ? 'error' : ''}`}
              />
              {errors.projectTitle && <span className="form-error">{errors.projectTitle}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Project Description <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></label>
              <textarea
                name="Project Description / Proposal"
                value={form.projectDescription}
                onChange={e => setField('projectDescription', e.target.value)}
                placeholder="Describe your project, personal situation, or how the grant funds will be used..."
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>

          {/* ID Cards Upload */}
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
                  onClick={() => frontFileRef.current?.click()}
                >
                  {idFront ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={28} color="var(--green)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{idFront.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({(idFront.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setIdFront(null);
                          if (frontFileRef.current) frontFileRef.current.value = '';
                        }}
                        style={{ fontSize: 12, color: 'var(--red, #c0392b)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} />
                      <p><strong>Click to upload front</strong></p>
                      <p className="file-drop-hint">JPG, PNG, PDF — max 10 MB</p>
                    </>
                  )}
                  <input
                    ref={frontFileRef}
                    id="id-front-input"
                    type="file"
                    name="attachment[]"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f && f.size < 10 * 1024 * 1024) setIdFront(f);
                    }}
                  />
                </div>
              </div>

              {/* Back */}
              <div className="form-group">
                <label className="form-label">Back of ID Card <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span></label>
                <div
                  className="file-drop-zone"
                  style={{ cursor: 'pointer', minHeight: 130 }}
                  onClick={() => backFileRef.current?.click()}
                >
                  {idBack ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={28} color="var(--green)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{idBack.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({(idBack.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setIdBack(null);
                          if (backFileRef.current) backFileRef.current.value = '';
                        }}
                        style={{ fontSize: 12, color: 'var(--red, #c0392b)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} />
                      <p><strong>Click to upload back</strong></p>
                      <p className="file-drop-hint">JPG, PNG, PDF — max 10 MB</p>
                    </>
                  )}
                  <input
                    ref={backFileRef}
                    id="id-back-input"
                    type="file"
                    name="attachment[]"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f && f.size < 10 * 1024 * 1024) setIdBack(f);
                    }}
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
                <input
                  type="checkbox"
                  name="Eligibility Confirmed"
                  value="Yes"
                  checked={form.meetsEligibility}
                  onChange={e => setField('meetsEligibility', e.target.checked)}
                />
                <div><strong>I confirm my organization meets all eligibility requirements</strong> for the selected grant and all information provided is accurate.</div>
              </label>
              {errors.meetsEligibility && <span className="form-error">{errors.meetsEligibility}</span>}

              <label className={`eligibility-check ${errors.notPreviouslyFunded ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  name="Funding Disclaimer Acknowledged"
                  value="Yes"
                  checked={form.notPreviouslyFunded}
                  onChange={e => setField('notPreviouslyFunded', e.target.checked)}
                />
                <div><strong>I acknowledge that submitting this application does not guarantee funding</strong> and that all decisions are made solely by the grant provider at their discretion.</div>
              </label>
              {errors.notPreviouslyFunded && <span className="form-error">{errors.notPreviouslyFunded}</span>}
            </div>
          </div>

          {/* Submit */}
          <div className="apply-submit-row">
            <Link to={selectedGrant ? `/grants/${selectedGrant.id}` : '/grants'} className="btn btn-outline">← Back</Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting
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
                <span className={`badge ${selectedGrant.status === 'Open' ? 'badge-open' : 'badge-upcoming'}`}>
                  {selectedGrant.status}
                </span>
                <h3>{selectedGrant.title}</h3>
                <p>{selectedGrant.provider}</p>
                <div className="apply-sidebar-amount">
                  ${selectedGrant.minAmount.toLocaleString()} – ${selectedGrant.maxAmount.toLocaleString()}
                </div>
                <div className="apply-sidebar-deadline">
                  Deadline: {new Date(selectedGrant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
