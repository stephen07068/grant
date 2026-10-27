interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`brand-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="facet-top" x1="6" y1="3" x2="30" y2="17" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fce7a8" />
            <stop offset="100%" stopColor="#e5be5e" />
          </linearGradient>
          <linearGradient id="facet-left" x1="5" y1="10" x2="18" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#cca13f" />
            <stop offset="100%" stopColor="#9a711b" />
          </linearGradient>
          <linearGradient id="facet-right" x1="18" y1="17" x2="31" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e5be5e" />
            <stop offset="100%" stopColor="#b38424" />
          </linearGradient>
        </defs>

        {/* 3D Isometric Hexagon Jewel / Cube from UI Mockup */}
        <polygon points="18,3 31,10.5 18,18 5,10.5" fill="url(#facet-top)" />
        <polygon points="5,10.5 18,18 18,33 5,25.5" fill="url(#facet-left)" />
        <polygon points="18,18 31,10.5 31,25.5 18,33" fill="url(#facet-right)" />

        {/* Highlight facets */}
        <polyline
          points="18,3 18,18 31,10.5"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.9"
        />
        <polyline
          points="5,10.5 18,18 18,33"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.8"
        />
      </svg>
      {showText && (
        <span className="brand-logo-text" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px', color: '#ffffff' }}>
          <span>East</span>
          <span style={{ color: 'var(--gold)' }}>Aid</span>
          <span>Grant</span>
        </span>
      )}
    </div>
  );
}
