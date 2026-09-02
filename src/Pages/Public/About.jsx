import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

const pillars = [
    {
        title: 'Recruit',
        body: 'We find people with the right skills and the right character for the work of ministry.',
        icon: 'person_search',
    },
    {
        title: 'Train',
        body: 'Personnel are prepared to serve well in the roles the Mission Station requires.',
        icon: 'school',
    },
    {
        title: 'Post',
        body: 'Trained personnel are matched and posted to support the Mission Station\'s vision.',
        icon: 'swap_horiz',
    },
    {
        title: 'Manage',
        body: 'We manage personnel so the Mission Station stays focused on its calling.',
        icon: 'workspaces',
    },
];

const focusAreas = [
    { label: 'Administration & Secretarial', icon: 'badge' },
    { label: 'Office Management', icon: 'business_center' },
    { label: 'ICT', icon: 'computer' },
    { label: 'Human Resources', icon: 'group' },
    { label: 'Marketing & PR', icon: 'campaign' },
    { label: 'Broadcasting', icon: 'radio' },
    { label: 'New Media & Multimedia', icon: 'smart_display' },
    { label: 'Production & Quality', icon: 'fact_check' },
    { label: 'Accounts & Finance', icon: 'account_balance_wallet' },
    { label: 'Security', icon: 'security' },
    { label: 'Church Organisation', icon: 'church' },
];

export default function About({ branding = {}, home = {} }) {
    const paragraphs = home.about_paragraphs?.length
        ? home.about_paragraphs
        : home.about_body
          ? [home.about_body]
          : [];
    const heroImage = home.hero_image_url || '/images/orientation.jpg';
    const lead = paragraphs[0] || '';
    const rest = paragraphs.slice(1);

    return (
        <PublicLayout branding={branding} active="about">
            <section className="page-hero">
                <div className="page-hero__bg" aria-hidden="true">
                    <span className="hero__orb hero__orb--1" />
                    <span className="hero__grid" />
                </div>
                <div className="public-container page-hero__inner" data-stagger>
                    {home.about_eyebrow && (
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            {home.about_eyebrow}
                        </span>
                    )}
                    <h1 data-split data-reveal>
                        {home.about_title || 'About Us'}
                    </h1>
                    {home.about_body && (
                        <p className="page-hero__subtitle" data-reveal>
                            {excerpt(home.about_body, 220)}
                        </p>
                    )}
                </div>
            </section>

            <section className="public-section">
                <div className="public-container">
                    <div className="about-intro">
                        <div className="about-intro__copy" data-stagger>
                            {lead && (
                                <p className="page-content__lead" data-reveal>
                                    {lead}
                                </p>
                            )}
                            {rest.map((paragraph, i) => (
                                <p key={i} data-reveal>
                                    {paragraph}
                                </p>
                            ))}
                            <div className="page-content__actions" data-reveal>
                                <Link
                                    href="/opportunity-to-work-in-ministry"
                                    className="btn-mca btn-mca-blue btn-mca-arrow lift"
                                >
                                    Opportunity to work in ministry
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                                <Link href="/" className="btn-mca btn-mca-outline lift">
                                    Back to home
                                </Link>
                            </div>
                        </div>
                        <div className="about-intro__media" data-reveal="right">
                            <div className="about-media">
                                <img src={heroImage} alt="MSNC ministry work" decoding="async" />
                                <span className="about-media__chip">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        verified
                                    </span>
                                    Registered charity organization
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="split-band split-band--navy">
                <span className="split-band__orb" aria-hidden="true" />
                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="eyebrow eyebrow--on-dark">How we serve</span>
                        <h2>Our four-fold calling</h2>
                        <p>
                            Everything we do moves missionaries and ministry support personnel from call to
                            commissioning.
                        </p>
                    </div>
                    <div className="pillar-grid" data-stagger>
                        {pillars.map((pillar, i) => (
                            <article key={pillar.title} className="pillar-card lift" data-reveal>
                                <span className="pillar-card__icon material-symbols-outlined" aria-hidden="true">
                                    {pillar.icon}
                                </span>
                                <span className="pillar-card__num" aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-section">
                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="eyebrow">Where personnel serve</span>
                        <h2>Roles we recruit and train for</h2>
                        <p>
                            The personnel we recruit and manage are trained to provide support across the
                            Mission Station's work.
                        </p>
                    </div>
                    <div className="focus-grid" data-stagger>
                        {focusAreas.map((area) => (
                            <span key={area.label} className="focus-chip lift" data-reveal>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    {area.icon}
                                </span>
                                {area.label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-band">
                <div className="public-container">
                    <div className="cta-band__inner" data-stagger>
                        <span className="cta-band__mark" aria-hidden="true">
                            <span className="material-symbols-outlined">handshake</span>
                        </span>
                        <h2 data-reveal>Ready to serve in ministry?</h2>
                        <p data-reveal>Begin your application today and take the first step toward the work.</p>
                        <div className="cta-band__actions" data-reveal>
                            <Link
                                href="/opportunity-to-work-in-ministry#register"
                                className="btn-mca btn-mca-white btn-mca-lg btn-mca-arrow lift"
                            >
                                Register
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                            <Link
                                href="/login/applicant"
                                className="btn-mca btn-mca-outline-on-dark btn-mca-lg lift"
                            >
                                Applicant Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function excerpt(text = '', max = 220) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}
