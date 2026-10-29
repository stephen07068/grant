import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    const inquiryRecord = {
      submittedAt: new Date().toISOString(),
      recipientDeskWhatsApp: '+15855149783',
      name: form.name,
      email: form.email,
      phone: form.phone || 'N/A',
      whatsapp: form.whatsapp || 'N/A',
      subject: form.subject || 'General Inquiry',
      message: form.message,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('eastaidgrant_inquiries') || '[]');
      existing.unshift(inquiryRecord);
      localStorage.setItem('eastaidgrant_inquiries', JSON.stringify(existing));
    } catch {
      // fallback
    }

    // Dispatch message to owner's email: erimiposi2005@gmail.com
    try {
      const emailPayload = {
        access_key: 'ec6ba592-b89b-4a66-a6b8-dd9ae2fa2435',
        subject: `💬 New EastAidGrant Contact Inquiry: ${form.subject || 'General'} from ${form.name}`,
        from_name: 'EastAidGrant Support',
        'Sender Name': form.name,
        'Email Address': form.email,
        'Phone Number': form.phone || 'N/A',
        'WhatsApp Number': form.whatsapp || 'N/A',
        'Topic / Subject': form.subject || 'General Inquiry',
        'Message': form.message,
        'Submission Time': new Date().toLocaleString(),
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }).catch(() => {});
    } catch {
      // background silent fallback
    }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
  };

  const info = [
    { icon: <MessageSquare size={20} />, label: 'WhatsApp', value: '+1 (585) 514-9783',       sub: 'Direct chat & support'   },
    { icon: <Mail size={20} />,          label: 'Email',    value: 'support@eastaidgrant.com', sub: 'We reply within 24 hours' },
    { icon: <MapPin size={20} />,        label: 'Location', value: 'United States',            sub: 'Serving all 50 states'   },
  ];

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span><span>Contact</span>
          </div>
          <h1>Contact <span className="script-accent">Us</span></h1>
          <p>Have a question about a personal grant or need help with your application? <span className="script-sub">We're here for you.</span></p>
        </div>
      </div>

      <div className="container section-pad contact-layout">
        {/* Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Our team of grant specialists is ready to help you find the right opportunity and navigate the application process.</p>
          <div className="contact-info-grid">
            {info.map((item, i) => (
              <div key={i} className="contact-info-card">
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <p className="contact-info-label">{item.label}</p>
                  <p className="contact-info-value">{item.value}</p>
                  <p className="contact-info-sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="contact-success-icon"><CheckCircle size={40} /></div>
              <h3>Message Received!</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-700)', marginTop: 8 }}>
                Thank you for reaching out. Your message has been logged into our support queue.
              </p>
              <div style={{ margin: '18px 0', padding: '12px 14px', background: 'rgba(201, 168, 76, 0.12)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--gold)', textAlign: 'left', fontSize: 13.5, color: 'var(--navy-mid)', lineHeight: 1.5 }}>
                🔔 <strong>Notice:</strong> You will be notified regarding your inquiry through your email, WhatsApp, or phone number within 24 hours.
              </div>
              <button
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', whatsapp: '', subject: '', message: '' }); }}
                className="btn btn-navy btn-sm"
                style={{ marginTop: 6 }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send a Message</h2>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="req">*</span></label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address <span className="req">*</span></label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@domain.com" className="form-input" required />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number <span className="req">*</span></label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 123-4567" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number <span className="req">*</span></label>
                  <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+1 (555) 123-4567" className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select value={form.subject} onChange={e => set('subject', e.target.value)} className="form-select">
                  <option value="">Choose a topic...</option>
                  <option>Grant Eligibility Question</option>
                  <option>Application Assistance</option>
                  <option>Technical Support</option>
                  <option>Partnership Inquiry</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message <span className="req">*</span></label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Describe how we can help you..." className="form-textarea" rows={6} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center' }}>
                {status === 'loading'
                  ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</>
                  : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
