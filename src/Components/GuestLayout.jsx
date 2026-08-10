import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { brandLogoUrl } from '../lib/siteFavicon';
import { getTheme, toggleTheme } from '../theme';
import { useReveal } from '../lib/useReveal';

export default function GuestLayout({ title, eyebrow, children, appName = 'Recruitment Portal', variant = 'default' }) {
    const { branding = {} } = usePage().props || {};
    const logoUrl = brandLogoUrl(branding.logo_url);
    const siteName = branding.site_name || appName;
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');

    useReveal();

    useEffect(() => {
        document.body.className = 'public-body';
        return () => {
            document.body.className = '';
        };
    }, []);

    const isSignin = variant === 'signin';

    return (
        <div className={`guest-shell${isSignin ? ' guest-shell--signin' : ''}`}>
            <div className="guest-shell__bg" aria-hidden="true">
                <span className="hero__orb hero__orb--1" />
                <span className="hero__orb hero__orb--2" />
            </div>

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

            {isSignin && (
                <aside className="guest-visual" data-reveal="left" aria-hidden="true">
                    <img
                        src="/images/hero.jpg"
                        alt=""
                        className="guest-visual__img"
                        decoding="async"
                    />
                    <div className="guest-visual__scrim" />
                    <div className="guest-visual__grid" />
                    <div className="guest-visual__content" data-stagger>
                        <span className="guest-visual__brand" data-reveal="fade">
                            <img src={logoUrl} alt={siteName} />
                        </span>
                        <div className="guest-visual__quote" data-reveal="fade">
                            <span className="eyebrow eyebrow--on-dark">
                                <span className="eyebrow__dot" />
                                The Mission Support Network Center
                            </span>
                            <p>
                                “We recruit and manage the best people — those with the right skills and the
                                right character — for the work of ministry.”
                            </p>
                            <ul>
                                <li data-reveal="fade">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        how_to_reg
                                    </span>
                                    Recruitment &amp; personnel management
                                </li>
                                <li data-reveal="fade">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        event_available
                                    </span>
                                    Interview scheduling &amp; tracking
                                </li>
                                <li data-reveal="fade">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        folder_copy
                                    </span>
                                    Secure document submission
                                </li>
                            </ul>
                        </div>
                        <div className="guest-visual__foot">
                            <span>Plot 589 Utako, TOS Benson Crescent, Abuja, Nigeria</span>
                            <span className="guest-visual__foot-dot" aria-hidden="true">
                                •
                            </span>
                            <span>{siteName}</span>
                        </div>
                    </div>
                </aside>
            )}

            <main className="guest-main">
                <div className="guest-card" data-reveal="rise">
                    <div className="guest-card__head">
                        <Link href="/" className="guest-card__brand">
                            <img src={logoUrl} alt={siteName} />
                        </Link>
                        <Link href="/" className="guest-card__home" aria-label="Back to home">
                            <span className="material-symbols-outlined" aria-hidden="true">
                                home
                            </span>
                        </Link>
                    </div>
                    <div className="guest-card__body">
                        <div className="guest-card__title">
                            {eyebrow ? (
                                <span className="guest-card__eyebrow">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        lock
                                    </span>
                                    {eyebrow}
                                </span>
                            ) : null}
                            {title ? <h2>{title}</h2> : null}
                        </div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
