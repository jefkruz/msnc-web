import axios from 'axios';
import { clearShare } from './shareShell';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getCache = new Map();
const PUBLIC_CACHE_MS = 90_000;
const AUTH_CACHE_MS = 25_000;
const PUBLIC_PATH = /\/(welcome|about|statement-of-faith|opportunity-to-work-in-ministry)(\/success)?(\?|$)/;
const SKIP_CACHE = /\/(logout|login|sanctum|export)(\/|\?|$)/;

function cacheTtl(url) {
  return PUBLIC_PATH.test(String(url)) ? PUBLIC_CACHE_MS : AUTH_CACHE_MS;
}

function cacheKey(url, params) {
  return `${url}?${JSON.stringify(params || {})}`;
}

function stripFlash(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }
  return {
    ...data,
    flash: { message: null, error: null },
  };
}

export function readGetCache(url, params) {
  const hit = getCache.get(cacheKey(url, params));
  if (!hit) return null;
  if (Date.now() - hit.at > cacheTtl(url)) {
    getCache.delete(cacheKey(url, params));
    return null;
  }
  return hit.data;
}

export function writeGetCache(url, data, params) {
  if (SKIP_CACHE.test(String(url))) return;
  getCache.set(cacheKey(url, params), { data: stripFlash(data), at: Date.now() });
}

export function clearGetCache() {
  getCache.clear();
}

export function prefetchGet(path) {
  if (!path || path === '#' || SKIP_CACHE.test(path) || /^https?:|mailto:|tel:/i.test(path)) {
    return;
  }
  const url = path.startsWith('/') ? path : `/${path}`;
  if (readGetCache(url)) return;
  api.get(url)
    .then(({ data }) => writeGetCache(url, data))
    .catch(() => {});
}

export const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const inflightGets = new Map();
const originalGet = api.get.bind(api);
api.get = function get(url, config) {
  const key = cacheKey(url, config?.params);
  if (inflightGets.has(key)) {
    return inflightGets.get(key);
  }
  const req = originalGet(url, config).finally(() => inflightGets.delete(key));
  inflightGets.set(key, req);
  return req;
};

// Never hit `/api/` — nginx 301s it and strips CORS headers.
if (api.defaults.baseURL) {
  api.defaults.baseURL = api.defaults.baseURL.replace(/\/+$/, '');
}

api.interceptors.request.use((config) => {
  if (typeof config.url === 'string') {
    const [pathname, query] = config.url.split('?');
    const trimmed = pathname.replace(/\/+$/, '');
    config.url = (trimmed || '') + (query ? `?${query}` : '');
  }
  return config;
});

let csrfReady = false;

export async function ensureCsrf() {
  if (csrfReady) return;
  const base = API_URL || '';
  await axios.get(`${base}/sanctum/csrf-cookie`, { withCredentials: true });
  csrfReady = true;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    await ensureCsrf();
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = (response.config?.method || 'get').toLowerCase();
    const url = String(response.config?.url || '');
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      clearGetCache();
    }
    if (url.includes('logout')) {
      clearGetCache();
      clearShare();
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      clearGetCache();
      clearShare();
    }
    return Promise.reject(error);
  }
);

export function apiPath(path = '/') {
  if (!path) return '/';
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

function stripApiPrefix(path = '') {
  if (path === '/api') return '/';
  if (path.startsWith('/api/')) return path.slice(4) || '/';
  return path;
}

/** SPA paths must not include the Laravel `/api` prefix. */
export function toSpaHref(href = '') {
  if (!href || href === '#') return href;
  if (/^(mailto:|tel:)/i.test(href)) return href;

  try {
    if (/^https?:\/\//i.test(href)) {
      const u = new URL(href);
      const next = stripApiPrefix(u.pathname) + u.search + u.hash;
      const apiHost = API_URL ? new URL(API_URL, window.location.origin).host : '';
      if (!apiHost || u.host === window.location.host || u.host === apiHost) {
        return next || '/';
      }
      return href;
    }
  } catch {
    // fall through
  }

  return stripApiPrefix(href);
}

export function storageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const u = new URL(path);
      const apiHost = API_URL ? new URL(API_URL, window.location.origin).host : '';
      if (apiHost && u.host === apiHost) {
        return `${window.location.origin}${u.pathname}${u.search}${u.hash}`;
      }
    } catch {
      return path;
    }
    return path;
  }
  if (path.startsWith('/')) return path;
  return `/storage/${path}`;
}

/** Cookie-aware CSV/file download (SPA + API split). */
export async function downloadApiFile(path, fallbackName = 'export.csv', params = {}) {
  const response = await api.get(path, { params, responseType: 'blob' });
  const type = String(response.headers['content-type'] || '');
  if (type.includes('application/json')) {
    const text = await response.data.text();
    let message = 'Download failed';
    try {
      message = JSON.parse(text).message || message;
    } catch {
      // keep fallback
    }
    throw new Error(message);
  }
  const disp = response.headers['content-disposition'] || '';
  const match = disp.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
  const name = match ? decodeURIComponent(match[1].replace(/["']/g, '').trim()) : fallbackName;
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export default api;
