import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { storageUrl } from '../lib/api';
import { brandLogoUrl } from '../lib/siteFavicon';
import { getTheme, toggleTheme } from '../theme';
import { useReveal, useScrolled, useParallax } from '../lib/useReveal';

const navLinks = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/statement-of-faith', label: 'Statement of Faith', key: 'faith' },
    { href: '/opportunity-to-work-in-ministry', label: 'Opportunity', key: 'opportunity-to-work-in-ministry' },
];

const marqueeItems = [
    'Recruitment',
    'Training',
    'Posting',
    'Personnel Management',
    'Character & Skill',
    'Mission Station Support',
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

    useReveal();
    useScrolled();
    useParallax();

    useEffect(() => {
        document.body.className = 'public-body';
        return () => {
            document.body.className = '';
        };
    }, []);

    useEffect(() => {
        const bar = document.querySelector('.scroll-progress');
        if (!bar) return undefined;
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const closeMobile = () => setMobileOpen(false);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const Brand = () => (
        <Link href="/" className="public-brand" onClick={closeMobile} aria-label={`${siteName} — home`}>
            <span className="public-brand__mark">
                <img src={faviconUrl} alt="" />
            </span>
            <span className="public-brand__text">
                <span className="public-brand__name">{siteName}</span>
                {tagline ? <span className="public-brand__tag">{tagline}</span> : null}
            </span>
        </Link>
    );

    const authAction = auth?.id ? (
        <Link href="/administrator" className="btn-mca btn-mca-ghost btn-mca-sm public-nav__auth">
            <span className="material-symbols-outlined" aria-hidden="true">
                dashboard
            </span>
            Dashboard
        </Link>
    ) : (
        <Link href="/login/applicant" className="btn-mca btn-mca-blue btn-mca-sm public-nav__auth">
            Sign In
            <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
            </span>
        </Link>
    );

    return (
        <div className="public-shell">
            <div className="scroll-progress" aria-hidden="true" />

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
                        {authAction}
                        <button
                            type="button"
                            className={`public-nav__menu-btn${mobileOpen ? ' is-open' : ''}`}
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className="public-nav__burger" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </span>
                        </button>
                    </div>
                </div>

                <nav className={`public-mobile-nav${mobileOpen ? ' open' : ''}`} aria-label="Mobile">
                    {navLinks.map((link, i) => (
                        <Link key={link.key} href={link.href} onClick={closeMobile} style={{ '--i': i }}>
                            {link.label}
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    ))}
                    <div className="public-mobile-nav__cta">
                        {auth?.id ? (
                            <Link href="/administrator" className="btn-mca btn-mca-blue btn-mca-block" onClick={closeMobile}>
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login/applicant" className="btn-mca btn-mca-blue btn-mca-block" onClick={closeMobile}>
                                Sign In to apply
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="public-main">{children}</main>

            <section className="marquee" aria-hidden="true">
                <div className="marquee__track">
                    {[0, 1].map((group) => (
                        <div className="marquee__group" key={group}>
                            {marqueeItems.map((item) => (
                                <span className="marquee__item" key={item}>
                                    <span className="marquee__star">✦</span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <footer className="public-footer">
                <div className="public-container">
                    <div className="public-footer__grid">
                        <div className="public-footer__brand-col">
                            <Link href="/" className="public-footer__brand">
                                <img src={logoUrl} alt={siteName} />
                                <span>{siteName}</span>
                            </Link>
                            <p className="public-footer__about">
                                A registered charity supporting missionary recruitment, training, posting,
                                and personnel management across the Mission Station's work.
                            </p>
                            <div className="public-footer__social">
                                <a href="mailto:info@missionsupportnetworkcenter.org" aria-label="Email us">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        mail
                                    </span>
                                </a>
                                <a href="tel:+2348133026781" aria-label="Call us">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        call
                                    </span>
                                </a>
                                <a href="/" aria-label="Home">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        public
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="public-footer__col">
                            <h4>Contact</h4>
                            <p className="public-footer__meta">
                                Plot 589 Utako, TOS Benson Crescent, Opposite Uturu Plaza, Utako District,
                                Abuja, Nigeria
                            </p>
                            <div className="public-footer__contact">
                                <a href="tel:+2348133026781">+234 813 302 6781</a>
                                <a href="tel:+2348025513653">+234 802 551 3653</a>
                                <a href="mailto:info@missionsupportnetworkcenter.org">
                                    info@missionsupportnetworkcenter.org
                                </a>
                            </div>
                        </div>

                        <div className="public-footer__col">
                            <h4>Explore</h4>
                            <Link href="/about">About Us</Link>
                            <Link href="/statement-of-faith">Statement of Faith</Link>
                            <Link href="/opportunity-to-work-in-ministry">Opportunity to work in ministry</Link>
                            <Link href="/opportunity-to-work-in-ministry#register">Register</Link>
                        </div>

                        <div className="public-footer__col">
                            <h4>Sign in</h4>
                            <Link href="/login/applicant">Applicant login</Link>
                            <Link href="/login/admin">Administrator</Link>
                            <Link href="/login/sdm">SDM</Link>
                            <Link href="/login/panelist">Panelist</Link>
                            <Link href="/login/director">Director</Link>
                        </div>
                    </div>

                    <div className="public-footer__bottom">
                        <span>
                            &copy; {new Date().getFullYear()} {footerCredit}. All rights reserved.
                        </span>
                        <span className="public-footer__tagline">
                            Recruitment &middot; Training &middot; Posting &middot; Personnel Management
                        </span>
                        <button type="button" className="back-to-top" onClick={scrollTop}>
                            Back to top
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_upward
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
