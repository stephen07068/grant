import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { to: '/',           label: 'Home'       },
  { to: '/grants',     label: 'Grants'     },
  { to: '/categories', label: 'Categories' },
  { to: '/reviews',    label: 'Reviews'    },
  { to: '/about',      label: 'About'      },
  { to: '/contact',    label: 'Contact'    },
];

import Logo from './Logo';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/grants?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <Logo size={30} />
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-nav">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="navbar-actions">
          <button
            className="navbar-search-btn"
            onClick={() => setSearchOpen(v => !v)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <Link to="/apply" className="btn btn-primary btn-sm">Apply Now</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="navbar-search-bar">
          <div className="container">
            <form onSubmit={handleSearch} className="navbar-search-form">
              <Search size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search grants, e.g. veterans, education, healthcare..."
                autoFocus
                className="navbar-search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setSearchOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <div className="container">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `navbar-mobile-link${isActive ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="navbar-mobile-actions">
              <Link to="/apply" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
