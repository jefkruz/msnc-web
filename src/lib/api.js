import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getCache = new Map();
const PUBLIC_CACHE_MS = 90_000;
const PUBLIC_PATH = /\/(welcome|about|statement-of-faith|opportunity-to-work-in-ministry)(\/success)?(\?|$)/;

export function readGetCache(url) {
  const hit = getCache.get(url);
  if (!hit) return null;
  if (Date.now() - hit.at > PUBLIC_CACHE_MS) {
    getCache.delete(url);
    return null;
  }
  return hit.data;
}

export function writeGetCache(url, data) {
  if (!PUBLIC_PATH.test(String(url))) return;
  getCache.set(url, { data, at: Date.now() });
}

export function clearGetCache() {
  getCache.clear();
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
  const key = `${url}?${JSON.stringify(config?.params || {})}`;
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
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const redirect = error.response?.data?.redirect;
    if (status === 401) {
      clearGetCache();
    }
    return Promise.reject(error);
  }
);

export function apiPath(path = '/') {
  if (!path) return '/';
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export function storageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const relative = path.startsWith('/storage/')
    ? path
    : path.startsWith('/')
      ? path
      : `/storage/${path}`;
  return API_URL ? `${API_URL}${relative}` : relative;
}

export default api;
