import { storageUrl } from './api';

export const FAVICON_STORAGE_KEY = 'msnc_favicon';
export const LOGO_STORAGE_KEY = 'msnc_logo';

export function brandLogoUrl(url) {
  let href = url ? storageUrl(url) : null;
  if (href) {
    try {
      localStorage.setItem(LOGO_STORAGE_KEY, href);
    } catch {
      // ignore quota / private mode
    }
    return href;
  }
  try {
    href = localStorage.getItem(LOGO_STORAGE_KEY);
  } catch {
    href = null;
  }
  return href || '/logo.png';
}

export function applySiteBranding(branding = {}) {
  applySiteFavicon(branding?.favicon_url);
  if (branding?.logo_url) {
    brandLogoUrl(branding.logo_url);
  }
}

export function applySiteFavicon(url) {
  if (typeof document === 'undefined') return;

  let href = url ? storageUrl(url) : null;
  if (!href) {
    try {
      href = localStorage.getItem(FAVICON_STORAGE_KEY);
    } catch {
      href = null;
    }
  }
  href = href || '/favicon.svg';

  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  const path = href.split('?')[0].toLowerCase();
  if (path.endsWith('.svg')) link.type = 'image/svg+xml';
  else if (path.endsWith('.ico')) link.type = 'image/x-icon';
  else if (path.endsWith('.webp')) link.type = 'image/webp';
  else if (path.endsWith('.gif')) link.type = 'image/gif';
  else link.type = 'image/png';

  if (link.getAttribute('href') !== href) {
    link.href = href;
  }

  if (url) {
    try {
      localStorage.setItem(FAVICON_STORAGE_KEY, href);
    } catch {
      // ignore quota / private mode
    }
  }
}
