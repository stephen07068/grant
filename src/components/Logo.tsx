import logoImg from '../assets/logo.jpg';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 36, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`brand-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <img
        src={logoImg}
        alt="EastAidGrant logo"
        width={size}
        height={size}
        style={{
          flexShrink: 0,
          borderRadius: 6,
          objectFit: 'contain',
          display: 'block',
        }}
      />
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
