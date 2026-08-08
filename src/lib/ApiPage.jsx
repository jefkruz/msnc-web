import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { readGetCache, writeGetCache, toSpaHref } from './api';
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
  const pathOnly = useMemo(() => {
    const parsed = paramKey ? JSON.parse(paramKey) : {};
    return resolveEndpoint(endpoint, parsed);
  }, [endpoint, paramKey]);
  const url = (pathOnly === '/' ? '' : pathOnly) + (location.search || '');

  const cached = readGetCache(url);
  const [props, setProps] = useState(() => (cached ? { ...staticProps, ...cached } : null));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!cached);
  const fetchedFor = useRef(null);

  let pageProps = props;
  let pageError = error;
  let pageLoading = loading;

  // React Router reuses this component across routes. Drop the previous page's
  // props immediately so e.g. dashboard `interviews: 7` cannot crash the list page.
  const pageIdRef = useRef({ pathOnly, Component });
  if (pageIdRef.current.pathOnly !== pathOnly || pageIdRef.current.Component !== Component) {
    pageIdRef.current = { pathOnly, Component };
    const hit = readGetCache(url);
    pageProps = hit ? { ...staticProps, ...hit } : null;
    pageError = null;
    pageLoading = !hit;
    setProps(pageProps);
    setError(null);
    setLoading(pageLoading);
    fetchedFor.current = null;
  }

  const load = useCallback(
    async (signal) => {
      if (!readGetCache(url) && fetchedFor.current !== url) {
        setLoading(true);
      }
      setError(null);
      try {
        const { data } = await api.get(url, { signal });

        if (data?.redirect && !samePath(data.redirect, location.pathname) && !samePath(data.redirect, url)) {
          navigate(toSpaHref(data.redirect));
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
        const message = err.response?.data?.message || err.message;
        if (redirect && !samePath(redirect, location.pathname)) {
          navigate(toSpaHref(redirect), { state: message ? { message } : undefined });
          return;
        }
        if (status === 403 || status === 404 || status === 500) {
          navigate(`/${status}`, { state: message ? { message } : undefined });
          return;
        }
        setError({ status: status || 500, message });
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
      return load();
    };
    return () => {
      delete window.__inertiaNavigate;
      delete window.__inertiaRefresh;
    };
  }, [navigate, load]);

  if (pageLoading && !pageProps) {
    return <PageLoader />;
  }

  if (pageError && !pageProps) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6">
        <h1 className="text-2xl font-bold">{pageError.status}</h1>
        <p className="text-slate-500">{pageError.message || 'Something went wrong.'}</p>
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
    <PageProvider value={pageProps} refresh={() => { fetchedFor.current = null; return load(); }}>
      <Component {...pageProps} />
    </PageProvider>
  );
}
