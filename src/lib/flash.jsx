import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Alert from '../Components/Alert';

const FlashContext = createContext({
  flash: {},
  setFlash: () => {},
});

export function FlashProvider({ children }) {
  const [flash, setFlash] = useState({});

  const applyFlash = useCallback((next = {}) => {
    const message = next.message || null;
    const error = next.error || null;
    if (!message && !error) return;
    setFlash({ message, error, at: Date.now() });
  }, []);

  useEffect(() => {
    window.__inertiaApplyFlash = applyFlash;
    return () => {
      delete window.__inertiaApplyFlash;
    };
  }, [applyFlash]);

  const value = useMemo(() => ({ flash, setFlash, applyFlash }), [flash, applyFlash]);

  return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
}

export function useFlash() {
  return useContext(FlashContext);
}

export function FlashAlerts({ className = 'mb-4' }) {
  const { flash, setFlash } = useFlash();
  const pageFlash = usePage().props?.flash;

  useEffect(() => {
    if (pageFlash?.message || pageFlash?.error) {
      setFlash({
        message: pageFlash.message || null,
        error: pageFlash.error || null,
        at: Date.now(),
      });
    }
  }, [pageFlash?.message, pageFlash?.error, setFlash]);

  useEffect(() => {
    if (!flash?.message && !flash?.error) return undefined;
    const t = setTimeout(() => setFlash({}), 5000);
    return () => clearTimeout(t);
  }, [flash?.at, flash?.message, flash?.error, setFlash]);

  if (!flash?.message && !flash?.error) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {flash.message ? (
        <Alert type="success" message={flash.message} onDismiss={() => setFlash((f) => ({ ...f, message: null }))} />
      ) : null}
      {flash.error ? (
        <Alert type="error" message={flash.error} onDismiss={() => setFlash((f) => ({ ...f, error: null }))} />
      ) : null}
    </div>
  );
}
