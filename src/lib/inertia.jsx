import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api, { apiPath, ensureCsrf, toSpaHref } from './api';

const PageContext = createContext({
  props: {},
  setProps: () => {},
  refresh: async () => {},
});

export function PageProvider({ value, refresh, children }) {
  const [props, setProps] = useState(value || {});

  useEffect(() => {
    setProps(value || {});
  }, [value]);

  const ctx = useMemo(
    () => ({
      props: props || {},
      setProps,
      refresh: refresh || (async () => {}),
    }),
    [props, refresh]
  );

  return <PageContext.Provider value={ctx}>{children}</PageContext.Provider>;
}

export function usePage() {
  return useContext(PageContext);
}

export const Link = forwardRef(function Link(
  { href = '#', children, className, onClick, ...rest },
  ref
) {
  const to = typeof href === 'string' ? toSpaHref(href) : href;
  const isExternal =
    typeof to === 'string' && /^(https?:|mailto:|tel:)/i.test(to);

  if (isExternal || to === '#') {
    return (
      <a ref={ref} href={to} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink ref={ref} to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </RouterLink>
  );
});

function handleRedirect(data, navigate) {
  if (data?.redirect) {
    navigate(toSpaHref(data.redirect));
    return true;
  }
  return false;
}

async function visit(url, options = {}) {
  const {
    method = 'get',
    data = {},
    onSuccess,
    onError,
    onFinish,
    forceFormData = false,
    _navigate,
  } = options;

  const path = apiPath(toSpaHref(url));

  try {
    let response;
    const m = method.toLowerCase();

    if (m === 'get') {
      response = await api.get(path, { params: data });
    } else if (forceFormData || data instanceof FormData) {
      await ensureCsrf();
      const form =
        data instanceof FormData
          ? data
          : (() => {
              const fd = new FormData();
              Object.entries(data || {}).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                if (Array.isArray(v)) v.forEach((item) => fd.append(`${k}[]`, item));
                else fd.append(k, v);
              });
              return fd;
            })();

      if (m !== 'post') {
        form.append('_method', m);
        response = await api.post(path, form);
      } else {
        response = await api.post(path, form);
      }
    } else {
      response = await api.request({ url: path, method: m, data });
    }

    if (_navigate && handleRedirect(response.data, _navigate)) {
      onSuccess?.(response.data);
      return response.data;
    }

    onSuccess?.(response.data);
    return response.data;
  } catch (error) {
    const errors = error.response?.data?.errors || {};
    onError?.(errors);
    throw error;
  } finally {
    onFinish?.();
  }
}

export const router = {
  visit(url, options = {}) {
    if (!options.method || options.method.toLowerCase() === 'get') {
      if (typeof window !== 'undefined' && window.__inertiaNavigate) {
        window.__inertiaNavigate(apiPath(url));
        return;
      }
    }
    return visit(url, options);
  },
  get(url, data = {}, options = {}) {
    return visit(url, { ...options, method: 'get', data });
  },
  post(url, data = {}, options = {}) {
    return visit(url, {
      ...options,
      method: 'post',
      data,
      _navigate: options._navigate || window.__inertiaNavigate,
    });
  },
  put(url, data = {}, options = {}) {
    return visit(url, {
      ...options,
      method: 'put',
      data,
      _navigate: options._navigate || window.__inertiaNavigate,
    });
  },
  patch(url, data = {}, options = {}) {
    return visit(url, {
      ...options,
      method: 'patch',
      data,
      _navigate: options._navigate || window.__inertiaNavigate,
    });
  },
  delete(url, options = {}) {
    return visit(url, {
      ...options,
      method: 'delete',
      _navigate: options._navigate || window.__inertiaNavigate,
    });
  },
  reload() {
    if (typeof window !== 'undefined') {
      window.__inertiaRefresh?.();
    }
  },
};

export function useForm(initial = {}) {
  const navigate = useNavigate();
  const { refresh } = usePage();
  const initialData = typeof initial === 'function' ? initial() : initial;
  const [data, setDataState] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [progress] = useState(null);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const transformRef = useRef((formData) => formData);

  const setData = useCallback((keyOrObj, maybeValue) => {
    if (typeof keyOrObj === 'string') {
      setDataState((prev) => ({ ...prev, [keyOrObj]: maybeValue }));
    } else if (typeof keyOrObj === 'function') {
      setDataState(keyOrObj);
    } else {
      setDataState((prev) => ({ ...prev, ...keyOrObj }));
    }
  }, []);

  const transform = useCallback((fn) => {
    transformRef.current = typeof fn === 'function' ? fn : (formData) => formData;
  }, []);

  const submit = useCallback(
    (method, url, options = {}) => {
      setProcessing(true);
      setErrors({});
      setRecentlySuccessful(false);

      const { onSuccess, onError, onFinish, forceFormData, preserveScroll } = options;
      const payload = transformRef.current(data);

      const isFormData =
        forceFormData ||
        Object.values(payload).some((v) => v instanceof File || v instanceof Blob);

      return visit(url, {
        method,
        data: payload,
        forceFormData: isFormData,
        preserveScroll,
        _navigate: navigate,
        onSuccess: (resp) => {
          setRecentlySuccessful(true);
          setTimeout(() => setRecentlySuccessful(false), 2000);
          if (!resp?.redirect) {
            refresh?.();
          }
          onSuccess?.(resp);
        },
        onError: (errs) => {
          setErrors(errs);
          onError?.(errs);
        },
        onFinish: () => {
          setProcessing(false);
          onFinish?.();
        },
      });
    },
    [data, navigate, refresh]
  );

  return {
    data,
    setData,
    transform,
    errors,
    processing,
    progress,
    recentlySuccessful,
    setError: (key, message) => setErrors((e) => ({ ...e, [key]: message })),
    clearErrors: (...fields) => {
      if (!fields.length) setErrors({});
      else {
        setErrors((e) => {
          const next = { ...e };
          fields.forEach((f) => delete next[f]);
          return next;
        });
      }
    },
    reset: (...fields) => {
      if (!fields.length) setDataState({ ...initialData });
      else {
        setDataState((prev) => {
          const next = { ...prev };
          fields.forEach((f) => {
            next[f] = initialData[f];
          });
          return next;
        });
      }
    },
    get: (url, opts) => submit('get', url, opts),
    post: (url, opts) => submit('post', url, opts),
    put: (url, opts) => submit('put', url, opts),
    patch: (url, opts) => submit('patch', url, opts),
    delete: (url, opts) => submit('delete', url, opts),
    submit,
  };
}
