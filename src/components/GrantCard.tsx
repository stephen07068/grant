import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, MapPin } from 'lucide-react';
import type { Grant } from '../types';
import './GrantCard.css';

interface GrantCardProps {
  grant: Grant;
  variant?: 'default' | 'featured' | 'list';
}

const statusClass: Record<string, string> = {
  Open: 'badge-open',
  Upcoming: 'badge-upcoming',
  Closed: 'badge-closed',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

function formatAmount(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function GrantCard({ grant, variant = 'default' }: GrantCardProps) {
  const [imgSrc, setImgSrc] = useState(grant.imageUrl);

  const handleImgError = () => {
    if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG);
    }
  };
  const meta = (
    <div className="grant-card-meta">
      <span><DollarSign size={13} />{formatAmount(grant.minAmount, grant.maxAmount)}</span>
      <span><Calendar size={13} />{formatDate(grant.deadline)}</span>
      <span><MapPin size={13} />{grant.location}</span>
    </div>
  );

  if (variant === 'list') {
    return (
      <div className="grant-list-item card">
        <div className="grant-list-img">
          <img src={imgSrc} alt="" loading="lazy" onError={handleImgError} />
        </div>
        <div className="grant-list-content">
          <div className="grant-list-badges">
            <span className="badge badge-category">{grant.category}</span>
            <span className={`badge ${statusClass[grant.status]}`}>{grant.status}</span>
          </div>
          <h3 className="grant-list-title">{grant.title}</h3>
          <p className="grant-list-provider">{grant.provider}</p>
          <div className="grant-list-meta">
            <span className="grant-meta-item"><DollarSign size={13} />{formatAmount(grant.minAmount, grant.maxAmount)}</span>
            <span className="grant-meta-item"><Calendar size={13} />{formatDate(grant.deadline)}</span>
            <span className="grant-meta-item"><MapPin size={13} />{grant.location}</span>
          </div>
        </div>
        <div className="grant-list-actions">
          <Link to={`/grants/${grant.id}`} className="btn btn-outline btn-sm">View Details</Link>
          <Link to={`/apply?grant=${grant.id}`} className="btn btn-primary btn-sm">Apply Now</Link>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="grant-featured-card card">
        <div className="grant-featured-img">
          <img src={imgSrc} alt="" loading="lazy" onError={handleImgError} />
          <span className="badge badge-category grant-featured-badge">{grant.category}</span>
        </div>
        <div className="grant-featured-content">
          <h3 className="grant-featured-title">{grant.title}</h3>
          <p className="grant-featured-provider">{grant.provider}</p>
          <div className="grant-featured-meta">
            <span><DollarSign size={13} />{formatAmount(grant.minAmount, grant.maxAmount)}</span>
            <span><Calendar size={13} />{formatDate(grant.deadline)}</span>
            <span><MapPin size={13} />{grant.location}</span>
          </div>
          <div className="grant-featured-actions">
            <Link to={`/grants/${grant.id}`} className="btn btn-outline btn-sm">View Details</Link>
            <Link to={`/apply?grant=${grant.id}`} className="btn btn-primary btn-sm">Apply Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grant-card card">
      <div className="grant-card-img">
        <img src={imgSrc} alt="" loading="lazy" onError={handleImgError} />
        <span className={`badge ${statusClass[grant.status]} grant-card-status`}>{grant.status}</span>
      </div>
      <div className="grant-card-body">
        <span className="badge badge-category">{grant.category}</span>
        <h3 className="grant-card-title">{grant.title}</h3>
        <p className="grant-card-provider">{grant.provider}</p>
        {meta}
        <div className="grant-card-actions">
          <Link to={`/grants/${grant.id}`} className="btn btn-outline btn-sm">View Details</Link>
          <Link to={`/apply?grant=${grant.id}`} className="btn btn-primary btn-sm">Apply Now</Link>
        </div>
      </div>
    </div>
  );
}
