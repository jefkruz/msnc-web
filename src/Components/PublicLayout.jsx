import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { storageUrl } from '../lib/api';
import { brandLogoUrl } from '../lib/siteFavicon';
import { getTheme, toggleTheme } from '../theme';
import { useReveal, useScrolled, useParallax } from '../lib/useReveal';

const navSections = [
    { id: 'opportunity', label: 'Opportunity', icon: 'handshake' },
    { id: 'how', label: 'How it works', icon: 'route' },
    { id: 'services', label: 'Our work', icon: 'work' },
    { id: 'about', label: 'About & Faith', icon: 'menu_book' },
    { id: 'connect', label: 'Contact', icon: 'call' },
];

const marqueeItems = [
    'Recruitment',
    'Training',
    'Posting',
    'Personnel Management',
    'Character & Skill',
    'Mission Station Support',
    'Opportunity to work in ministry',
];

const footerLinks = [
    { href: '/about', label: 'About Us', icon: 'info' },
    { href: '/statement-of-faith', label: 'Statement of Faith', icon: 'menu_book' },
    { href: '/opportunity-to-work-in-ministry', label: 'Opportunity to work in ministry', icon: 'handshake' },
    { href: '/#opportunity', label: 'How it works', icon: 'route' },
    { href: '/#services', label: 'How we serve', icon: 'work' },
    { href: '/#connect', label: 'Contact', icon: 'call' },
];

const signInLinks = [
    { href: '/login/applicant', label: 'Applicant login', icon: 'person' },
    { href: '/login/admin', label: 'Administrator', icon: 'admin_panel_settings' },
    { href: '/login/sdm', label: 'SDM', icon: 'supervised_user_circle' },
    { href: '/login/panelist', label: 'Panelist', icon: 'fact_check' },
    { href: '/login/director', label: 'Director', icon: 'account_balance' },
];

const actively = { about: 'about', faith: 'about', 'opportunity-to-work-in-ministry': 'opportunity' };

function toSectionId(href) {
    const i = typeof href === 'string' ? href.indexOf('#') : -1;
    return i >= 0 ? href.slice(i + 1) : '';
}

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
        const onHome = window.location.pathname === '/';
        document.body.className = `public-body${onHome ? ' public-body--navy' : ''}`;
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

    /* Arrive from a subpage with /#section — scroll after the SPA settles. */
    useEffect(() => {
        const scrollToHash = () => {
            const id = toSectionId(window.location.hash);
            if (!id) return;
            let tries = 0;
            const poll = setInterval(() => {
                const el = document.getElementById(id);
                if (el) {
                    clearInterval(poll);
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (++tries > 40) {
                    clearInterval(poll);
                }
            }, 120);
        };
        window.addEventListener('hashchange', scrollToHash);
        if (window.location.hash) {
            setTimeout(scrollToHash, 350);
        }
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, []);

    const closeMobile = () => setMobileOpen(false);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const goSection = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (window.location.pathname === '/' && el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const nav = window.__inertiaNavigate || ((p) => { window.location.href = p; });
        nav(`/#${id}`);
    };

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
        <div className="public-nav__actions">
            <Link href="/login/applicant" className="btn-mca btn-mca-outline btn-mca-sm">
                Sign In
            </Link>
            <Link
                href="/opportunity-to-work-in-ministry#register"
                className="btn-mca btn-mca-blue btn-mca-sm btn-mca-arrow public-nav__apply"
            >
                Apply now
                <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                </span>
            </Link>
        </div>
    );

    const activeSection = actively[active] || null;

    return (
        <div className="public-shell">
            <div className="scroll-progress" aria-hidden="true" />

            <header className="public-nav">
                <div className="public-nav__inner">
                    <Brand />

                    <nav className="public-nav__links" aria-label="Page sections">
                        {navSections.map((section) => (
                            <a
                                key={section.id}
                                href={`/#${section.id}`}
                                className={activeSection === section.id ? 'active' : ''}
                                onClick={(e) => goSection(e, section.id)}
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    {section.icon}
                                </span>
                                {section.label}
                            </a>
                        ))}
                    </nav>

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
                    {navSections.map((section, i) => (
                        <a
                            key={section.id}
                            href={`/#${section.id}`}
                            onClick={(e) => {
                                goSection(e, section.id);
                                closeMobile();
                            }}
                            style={{ '--i': i }}
                        >
                            {section.label}
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </a>
                    ))}
                    <div className="public-mobile-nav__cta">
                        {auth?.id ? (
                            <Link href="/administrator" className="btn-mca btn-mca-blue btn-mca-block" onClick={closeMobile}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/opportunity-to-work-in-ministry#register"
                                    className="btn-mca btn-mca-blue btn-mca-block btn-mca-arrow"
                                    onClick={closeMobile}
                                >
                                    Apply to work in ministry
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                                <Link
                                    href="/login/applicant"
                                    className="btn-mca btn-mca-outline btn-mca-block"
                                    style={{ marginTop: '0.6rem' }}
                                    onClick={closeMobile}
                                >
                                    Sign in
                                </Link>
                            </>
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
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    location_on
                                </span>
                                Plot 589 Utako, TOS Benson Crescent, Opposite Uturu Plaza, Utako District,
                                Abuja, Nigeria
                            </p>
                            <div className="public-footer__contact">
                                <a href="tel:+2348133026781">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        call
                                    </span>
                                    +234 813 302 6781
                                </a>
                                <a href="tel:+2348025513653">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        call
                                    </span>
                                    +234 802 551 3653
                                </a>
                                <a href="mailto:info@missionsupportnetworkcenter.org">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        mail
                                    </span>
                                    info@missionsupportnetworkcenter.org
                                </a>
                            </div>
                        </div>

                        <div className="public-footer__col">
                            <h4>Explore</h4>
                            {footerLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="public-footer__col">
                            <h4>Sign in</h4>
                            {signInLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
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