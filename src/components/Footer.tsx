import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <Logo size={26} />
              </Link>
              <p className="footer-tagline">Real Opportunities. Lasting Impact.</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Twitter">t</a>
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="YouTube">yt</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/grants">Grants</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/reviews">Reviews & Stories</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/contact">FAQ</Link></li>
                <li><Link to="/contact">Eligibility Guide</Link></li>
                <li><Link to="/apply">Application Guide</Link></li>
                <li><Link to="/contact">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="footer-contact-list">
                <li>
                  <Mail size={13} />
                  <a href="mailto:support@eastaidgrant.com">support@eastaidgrant.com</a>
                </li>
                <li>
                  <Phone size={13} />
                  <a href="https://wa.me/15855149783" target="_blank" rel="noopener noreferrer">+1 (585) 514-9783 (WhatsApp)</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2025 EastAidGrant. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
