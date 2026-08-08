import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getTheme, toggleTheme } from '../theme';

export default function GuestLayout({ title, children, appName = 'Recruitment Portal', variant = 'default' }) {
    const { branding = {} } = usePage().props || {};
    const logoUrl = branding.logo_url || '/logo.png';
    const siteName = branding.site_name || appName;
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');

    useEffect(() => {
        document.body.className = 'public-body';
        return () => {
            document.body.className = '';
        };
    }, []);

    return (
        <div className={`guest-shell${variant === 'signin' ? ' guest-shell--signin' : ''}`}>
            <button
                type="button"
                className="theme-toggle guest-shell__theme"
                onClick={() => setIsDark(toggleTheme())}
                aria-label="Toggle theme"
            >
                <span className="material-symbols-outlined" aria-hidden="true">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            <div className="guest-card">
                <div className="guest-card__head">
                    <Link href="/" className="guest-card__brand">
                        <img src={logoUrl} alt={siteName} />
                    </Link>
                </div>
                <div className="guest-card__body">
                    {title ? <h2>{title}</h2> : null}
                    {children}
                </div>
            </div>
        </div>
    );
}
