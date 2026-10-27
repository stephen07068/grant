import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { categories } from '../data/grants';
import './Categories.css';

const categoryIcons: Record<string, string> = {
  'Cancer & Critical Illness': '🎗️',
  'Chronic Disease & Rare Conditions': '💊',
  'Individual Medical Bills': '🏦',
  'Senior & Elder Care': '👴',
  'Military & Veterans': '🎖️',
  'Hospital & Healthcare': '🏥',
  'Emergency Medical': '🚑',
  'Small Business & Entrepreneurship': '💼',
  'Education & College': '🎓',
  'Housing & Homelessness': '🏠',
  'Agriculture & Farming': '🌾',
  'Technology & Innovation': '💡',
  'Women-Owned Business': '👩‍💼',
  'Minority-Owned Business': '🤝',
  'Nonprofit & Charity': '❤️',
  'Disability Support': '♿',
  'Youth & Family': '👨‍👩‍👧',
  'Mental Health': '🧠',
  'Environmental & Clean Energy': '🌿',
  'Disaster Recovery': '⚠️',
  'Arts & Culture': '🎨',
  'Scientific Research': '🔬',
};

export default function Categories() {
  const [filter, setFilter] = useState('');

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Categories</span>
          </div>
          <h1>Grant <span className="script-accent">Categories</span></h1>
          <p>
            Explore all {categories.length} grant categories and find opportunities for <span className="script-sub">personal, family, & community</span> needs.
          </p>
        </div>
      </div>

      <div className="container section-pad">
        {/* Filter */}
        <div className="categories-filter-bar">
          <div className="categories-search">
            <Search size={16} />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter categories..."
              className="categories-search-input"
            />
          </div>
          <span className="categories-count">{filtered.length} categories</span>
        </div>

        {/* Grid */}
        <div className="categories-grid">
          {filtered.map((cat) => (
            <Link
              key={cat.name}
              to={`/grants?category=${encodeURIComponent(cat.name)}`}
              className="category-detail-card"
            >
              <div className="category-detail-icon">
                {categoryIcons[cat.name] || cat.icon || '📋'}
              </div>
              <div className="category-detail-body">
                <h3 className="category-detail-name">{cat.name}</h3>
                <p className="category-detail-desc">{cat.description}</p>
                <div className="category-detail-footer">
                  <span className="category-detail-count">{cat.count} grants available</span>
                  <span className="category-detail-link">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="grants-empty">
            <Search size={48} />
            <h3>No categories found</h3>
            <p>Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
