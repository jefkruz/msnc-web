import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

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
    if (status === 401 && redirect && typeof window !== 'undefined') {
      window.location.href = redirect;
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
