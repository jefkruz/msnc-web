import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { readGetCache, writeGetCache } from './api';
import { PageProvider } from './inertia';
import PageLoader from '../Components/PageLoader';

const EMPTY_PROPS = Object.freeze({});

function resolveEndpoint(endpoint, params) {
  if (typeof endpoint === 'function') {
    return endpoint(params);
  }
  return String(endpoint).replace(/:([A-Za-z_]+)/g, (_, key) => {
    return params[key] ?? '';
  });
}

function samePath(a, b) {
  const norm = (p) => String(p || '').split('?')[0].replace(/\/+$/, '') || '/';
  return norm(a) === norm(b);
}

export default function ApiPage({ endpoint, component: Component, staticProps = EMPTY_PROPS }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const staticPropsRef = useRef(staticProps);
  staticPropsRef.current = staticProps;

  const paramKey = JSON.stringify(params);
  const url = useMemo(() => {
    const parsed = paramKey ? JSON.parse(paramKey) : {};
    const path = resolveEndpoint(endpoint, parsed);
    return (path === '/' ? '' : path) + (location.search || '');
  }, [endpoint, paramKey, location.search]);

  const cached = readGetCache(url);
  const [props, setProps] = useState(() => (cached ? { ...staticProps, ...cached } : null));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!cached);
  const fetchedFor = useRef(null);

  const load = useCallback(
    async (signal) => {
      if (!readGetCache(url) && fetchedFor.current !== url) {
        setLoading(true);
      }
      setError(null);
      try {
        const { data } = await api.get(url, { signal });

        if (data?.redirect && !samePath(data.redirect, location.pathname) && !samePath(data.redirect, url)) {
          navigate(data.redirect);
          return;
        }

        const next = { ...staticPropsRef.current, ...data };
        writeGetCache(url, data);
        fetchedFor.current = url;
        setProps(next);
      } catch (err) {
        if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.name === 'AbortError') {
          return;
        }
        const status = err.response?.status;
        const redirect = err.response?.data?.redirect;
        if (redirect && !samePath(redirect, location.pathname)) {
          navigate(redirect);
          return;
        }
        setError({ status: status || 500, message: err.response?.data?.message || err.message });
      } finally {
        setLoading(false);
      }
    },
    [url, navigate, location.pathname]
  );

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [url, load]);

  useEffect(() => {
    window.__inertiaNavigate = (path) => navigate(path);
    window.__inertiaRefresh = () => {
      fetchedFor.current = null;
      load();
    };
    return () => {
      delete window.__inertiaNavigate;
      delete window.__inertiaRefresh;
    };
  }, [navigate, load]);

  if (loading && !props) {
    return <PageLoader />;
  }

  if (error && !props) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6">
        <h1 className="text-2xl font-bold">{error.status}</h1>
        <p className="text-slate-500">{error.message || 'Something went wrong.'}</p>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm"
          onClick={() => {
            fetchedFor.current = null;
            load();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageProvider value={props} refresh={() => { fetchedFor.current = null; return load(); }}>
      <Component {...props} />
    </PageProvider>
  );
}
