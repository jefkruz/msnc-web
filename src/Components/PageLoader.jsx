import { brandLogoUrl } from '../lib/siteFavicon';

export default function PageLoader({ label = 'Loading', compact = false }) {
  const logoUrl = brandLogoUrl();
  return (
    <div
      className={`page-loader${compact ? ' page-loader--inline' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader__mark">
        <span className="page-loader__ring" aria-hidden="true" />
        <img src={logoUrl} alt="" className="page-loader__logo" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
