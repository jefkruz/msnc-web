import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { storageUrl } from '../lib/api';
import { brandLogoUrl } from '../lib/siteFavicon';
import { getTheme, toggleTheme } from '../theme';

const navLinks = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/statement-of-faith', label: 'Statement of Faith', key: 'faith' },
    { href: '/opportunity-to-work-in-ministry', label: 'Opportunity', key: 'opportunity-to-work-in-ministry' },
];

export default function PublicLayout({ children, active = 'home', branding: brandingProp = {} }) {
    const { appName = 'Recruitment Portal', branding: brandingShared = {}, auth } = usePage().props || {};
    const branding = { ...brandingShared, ...brandingProp };
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');

    const siteName = branding.site_name || appName;
    const tagline = branding.site_tagline || '';
    const footerCredit = branding.footer_credit || siteName;
    const logoUrl = brandLogoUrl(branding.logo_url);
    const faviconUrl = storageUrl(branding.favicon_url) || '/favicon.svg';

    useEffect(() => {
        document.body.className = 'public-body';
        return () => {
            document.body.className = '';
        };
    }, []);

    const closeMobile = () => setMobileOpen(false);

    const Brand = () => (
        <Link href="/" className="public-brand" onClick={closeMobile}>
            <img src={faviconUrl} alt={siteName} />
            <span className="public-brand__text">
                <span className="public-brand__name">{siteName}</span>
                {tagline ? <span className="public-brand__tag">{tagline}</span> : null}
            </span>
        </Link>
    );

    return (
        <div className="public-shell">
            <header className="public-nav">
                <div className="public-nav__inner">
                    <Brand />

                    <ul className="public-nav__links">
                        {navLinks.map((link) => (
                            <li key={link.key}>
                                <Link href={link.href} className={active === link.key ? 'active' : ''}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="public-nav__actions">
                        <button
                            type="button"
                            className="theme-toggle"
                            onClick={() => setIsDark(toggleTheme())}
                            aria-label="Toggle theme"
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        {auth?.id ? (
                            <Link href="/administrator" className="btn-mca btn-mca-primary btn-mca-sm public-nav__auth">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login/applicant" className="btn-mca btn-mca-secondary btn-mca-sm public-nav__auth">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    login
                                </span>
                                Sign In
                            </Link>
                        )}
                        <button
                            type="button"
                            className="public-nav__menu-btn"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label="Open menu"
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">
                                {mobileOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className={`public-mobile-nav${mobileOpen ? ' open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link key={link.key} href={link.href} onClick={closeMobile}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="public-mobile-nav__cta">
                        {auth?.id ? (
                            <Link href="/administrator" className="btn-mca btn-mca-primary btn-mca-sm" onClick={closeMobile}>
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login/applicant" className="btn-mca btn-mca-secondary btn-mca-outline btn-mca-sm" onClick={closeMobile}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="public-main">{children}</main>

            <footer className="public-footer">
                <div className="public-container">
                    <div className="public-footer__grid">
                        <div>
                            <div className="public-footer__brand">
                                <img src={logoUrl} alt={siteName} />
                                <p className="public-footer__about">
                                    A registered charity supporting missionary recruitment, training, posting,
                                    and personnel management.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4>Contact</h4>
                            <p className="public-footer__meta">
                                Plot 589 Utako, TOS Benson Crescent, Opposite Uturu Plaza, Utako District, Abuja,
                                Nigeria
                            </p>
                            <a href="tel:+2348133026781">+234 813 302 6781</a>
                            <a href="tel:+2348025513653">+234 802 551 3653</a>
                            <a href="mailto:info@missionsupportnetworkcenter.org">
                                info@missionsupportnetworkcenter.org
                            </a>
                        </div>
                        <div>
                            <h4>Explore</h4>
                            <Link href="/about">About Us</Link>
                            <Link href="/statement-of-faith">Statement of Faith</Link>
                            <Link href="/opportunity-to-work-in-ministry">Opportunity to work in ministry</Link>
                            <Link href="/opportunity-to-work-in-ministry#register">Register</Link>
                        </div>
                        <div>
                            <h4>Sign in</h4>
                            <Link href="/login/applicant">Applicant login</Link>
                            <Link href="/login/admin">Administrator</Link>
                            <Link href="/login/sdm">SDM</Link>
                            <Link href="/login/panelist">Panelist</Link>
                            <Link href="/login/director">Director</Link>
                        </div>
                    </div>
                    <div className="public-footer__copy">
                        &copy; {new Date().getFullYear()} {footerCredit}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
