import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from './api';
import { PageProvider } from './inertia';

function resolveEndpoint(endpoint, params) {
  if (typeof endpoint === 'function') {
    return endpoint(params);
  }
  return String(endpoint).replace(/:([A-Za-z_]+)/g, (_, key) => {
    return params[key] ?? '';
  });
}

export default function ApiPage({ endpoint, component: Component, staticProps = {} }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [props, setProps] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const path = resolveEndpoint(endpoint, { ...params, search: location.search });
      const url = (path === '/' ? '' : path) + (location.search || '');
      const { data } = await api.get(url);

      if (data?.redirect) {
        navigate(data.redirect);
        return;
      }

      setProps({ ...staticProps, ...data });
    } catch (err) {
      const status = err.response?.status;
      const redirect = err.response?.data?.redirect;
      if (redirect) {
        navigate(redirect);
        return;
      }
      setError({ status: status || 500, message: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  }, [endpoint, params, location.search, navigate, staticProps]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.__inertiaNavigate = (path) => navigate(path);
    window.__inertiaRefresh = () => load();
    return () => {
      delete window.__inertiaNavigate;
      delete window.__inertiaRefresh;
    };
  }, [navigate, load]);

  if (loading && !props) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (error && !props) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6">
        <h1 className="text-2xl font-bold">{error.status}</h1>
        <p className="text-slate-500">{error.message || 'Something went wrong.'}</p>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm"
          onClick={() => load()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageProvider value={props} refresh={load}>
      <Component {...props} />
    </PageProvider>
  );
}
