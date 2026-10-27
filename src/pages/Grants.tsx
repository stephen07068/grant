import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { grants, categories } from '../data/grants';
import type { GrantCategory, GrantStatus } from '../types';
import GrantCard from '../components/GrantCard';
import './Grants.css';

const ITEMS_PER_PAGE = 8;

export default function Grants() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<GrantCategory | ''>((searchParams.get('category') as GrantCategory) || '');
  const [minAmount, setMinAmount] = useState(20000);
  const [maxAmount, setMaxAmount] = useState(0);
  const [applicantType, setApplicantType] = useState('');
  const [status, setStatus] = useState<GrantStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Amount High' | 'Amount Low'>('Newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory((searchParams.get('category') as GrantCategory) || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = grants.filter((g) => {
      const q = query.toLowerCase();
      const matchQ = !query || g.title.toLowerCase().includes(q) || g.provider.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
      const matchCat = !category || g.category === category;
      const matchMin = !minAmount || g.maxAmount >= minAmount;
      const matchMax = !maxAmount || g.minAmount <= maxAmount;
      const matchApplicant = !applicantType || g.applicantTypes.some(t => t.toLowerCase().includes(applicantType.toLowerCase()));
      const matchStatus = status === 'All' || g.status === status;
      return matchQ && matchCat && matchMin && matchMax && matchApplicant && matchStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'Amount High') return b.maxAmount - a.maxAmount;
      if (sortBy === 'Amount Low') return a.minAmount - b.minAmount;
      if (sortBy === 'Oldest') return a.deadline.localeCompare(b.deadline);
      return b.deadline.localeCompare(a.deadline);
    });
    return result;
  }, [query, category, minAmount, maxAmount, applicantType, status, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (category) p.set('category', category);
    setSearchParams(p);
  };

  const statusTabs: (GrantStatus | 'All')[] = ['All', 'Open', 'Upcoming', 'Closed'];

  return (
    <div className="grants-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span><span>Grants</span>
          </div>
          <h1>Discover <span className="script-accent">Grants</span></h1>
          <p>Explore verified opportunities for <span className="script-sub">individuals & organizations</span> from trusted partners.</p>
        </div>
      </div>

      <div className="container grants-layout">
        {/* Search */}
        <form onSubmit={handleSearch} className="grants-search-bar">
          <Search size={16} className="grants-search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search grants, keywords, or organization..."
            className="grants-search-input"
          />
          <button type="submit" className="grants-search-btn"><Search size={16} /></button>
        </form>

        {/* Filters */}
        <div className="grants-filter-row">
          <select value={category} onChange={e => { setCategory(e.target.value as GrantCategory | ''); setPage(1); }} className="form-select grants-filter">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={minAmount} onChange={e => { setMinAmount(Number(e.target.value)); setPage(1); }} className="form-select grants-filter">
            <option value="20000">Min: $20,000</option>
            <option value="50000">Min: $50,000</option>
            <option value="100000">Min: $100,000</option>
            <option value="250000">Min: $250,000</option>
          </select>
          <select value={maxAmount} onChange={e => { setMaxAmount(Number(e.target.value)); setPage(1); }} className="form-select grants-filter">
            <option value="0">No Limit</option>
            <option value="100000">Max: $100K</option>
            <option value="250000">Max: $250K</option>
            <option value="500000">Max: $500K</option>
            <option value="1000000">Max: $1M</option>
          </select>
          <select value={applicantType} onChange={e => { setApplicantType(e.target.value); setPage(1); }} className="form-select grants-filter">
            <option value="">All Applicant Types</option>
            <option>Individual</option>
            <option>Small Business</option>
            <option>Nonprofit</option>
            <option>Healthcare Organization</option>
            <option>Educational Institution</option>
            <option>Government</option>
            <option>Research Institution</option>
            <option>Veterans &amp; Military Families</option>
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value as GrantStatus | 'All'); setPage(1); }} className="form-select grants-filter">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Status tabs + Sort */}
        <div className="grants-status-bar">
          <div className="grants-status-tabs">
            {statusTabs.map(s => (
              <button key={s} className={`status-tab ${status === s ? 'active' : ''}`} onClick={() => { setStatus(s); setPage(1); }}>{s}</button>
            ))}
          </div>
          <div className="grants-sort">
            <span>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="form-select" style={{ width: 'auto', padding: '6px 32px 6px 10px' }}>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Amount High</option>
              <option>Amount Low</option>
            </select>
          </div>
        </div>

        <p className="grants-count">Showing {filtered.length} grant{filtered.length !== 1 ? 's' : ''}</p>

        {/* Results */}
        {paginated.length > 0 ? (
          <div className="grants-list">
            {paginated.map(g => <GrantCard key={g.id} grant={g} variant="list" />)}
          </div>
        ) : (
          <div className="grants-empty">
            <Search size={48} />
            <h3>No grants found</h3>
            <p>Try adjusting your search terms or filters.</p>
            <button className="btn btn-navy" onClick={() => { setQuery(''); setCategory(''); setMinAmount(20000); setMaxAmount(0); setApplicantType(''); setStatus('All'); setPage(1); }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
