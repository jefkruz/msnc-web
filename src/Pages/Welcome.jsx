import { Link } from '@inertiajs/react';
import PublicLayout from '../Components/PublicLayout';

const featureCards = [
    {
        id: 'about',
        href: '/about',
        icon: 'account_balance',
        titleKey: 'about_title',
        titleFallback: 'About Us',
        bodyKey: 'about_body',
        bodyFallback:
            'The Mission Support Network Center is a registered Charity organization responsible for the recruitment, training, posting and managing of missionaries for Christian work.',
        cta: 'Read more',
    },
    {
        id: 'faith',
        href: '/statement-of-faith',
        icon: 'menu_book',
        titleKey: 'faith_title',
        titleFallback: 'Statement of Faith',
        bodyKey: 'faith_intro',
        bodyFallback:
            'This is the statement of Bible doctrine as believed by the Mission Support Network Center. This Statement of Faith has its source in the Bible.',
        cta: 'Read more',
    },
];

const trustItems = [
    { key: 'trust_1', fallback: 'Applicant management', icon: 'person_search', note: 'Track every application from start to finish.' },
    { key: 'trust_2', fallback: 'Interview scheduling', icon: 'event_available', note: 'Plan, schedule and manage interviews with ease.' },
    { key: 'trust_3', fallback: 'Document tracking', icon: 'folder_copy', note: 'Collect and verify credentials securely.' },
    { key: 'trust_4', fallback: 'Personnel in waiting', icon: 'groups', note: 'A ready talent pool for the Mission Station.' },
];

const steps = [
    {
        title: 'Register',
        body: 'Create your profile with the Mission Support Network Center in a few minutes.',
    },
    {
        title: 'Apply & upload',
        body: 'Complete your application and submit the required credentials and documents.',
    },
    {
        title: 'Interview & posting',
        body: 'Move through the recruitment stages toward a missionary posting with the Mission Station.',
    },
];

const points = [
    {
        icon: 'how_to_reg',
        text: 'Register with the recruitment portal',
    },
    {
        icon: 'upload_file',
        text: 'Submit your application and credentials',
    },
    {
        icon: 'track_changes',
        text: 'Track your progress through recruitment',
    },
];

function excerpt(text = '', max = 150) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export default function Welcome({ branding = {}, home = {} }) {
    const siteName = branding.site_name || 'Mission Support Network Center';
    const heroImage = home.hero_image_url || '/images/hero.jpg';
    const applicantCta = home.applicant_cta_label || 'Applicant Login';

    return (
        <PublicLayout branding={branding} active="home">
            <section className="hero">
                <div className="hero__bg" aria-hidden="true">
                    <span className="hero__orb hero__orb--1" />
                    <span className="hero__orb hero__orb--2" />
                    <span className="hero__orb hero__orb--3" />
                    <span className="hero__grid" />
                    <span className="hero__sparkle hero__sparkle--1">✦</span>
                    <span className="hero__sparkle hero__sparkle--2">✦</span>
                    <span className="hero__sparkle hero__sparkle--3">✛</span>
                </div>

                <div className="public-container hero__layout">
                    <div className="hero__caption" data-stagger>
                        <span className="eyebrow" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            Recruitment &middot; Training &middot; Posting
                        </span>
                        <h1 data-split data-reveal>
                            {home.hero_title || siteName}
                        </h1>
                        {home.hero_lead && (
                            <p className="hero__lead" data-reveal>
                                {home.hero_lead}
                            </p>
                        )}
                        {home.hero_tagline && (
                            <p className="hero__tagline" data-reveal>
                                {home.hero_tagline}
                            </p>
                        )}
                        <div className="hero__ctas" data-reveal>
                            <Link
                                href="/login/applicant"
                                className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift"
                                title="Sign in to update your applicant profile"
                            >
                                {applicantCta}
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                            <Link
                                href="/opportunity-to-work-in-ministry"
                                className="btn-mca btn-mca-outline btn-mca-lg lift"
                            >
                                Opportunity to work in ministry
                            </Link>
                        </div>
                        <ul className="hero__chips" data-reveal>
                            <li>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    verified
                                </span>
                                Registered charity
                            </li>
                            <li>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    location_on
                                </span>
                                Abuja, Nigeria
                            </li>
                            <li>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    phone_in_talk
                                </span>
                                +234 813 302 6781
                            </li>
                        </ul>
                    </div>

                    <div className="hero__visual" data-reveal="zoom">
                        <div className="hero-frame">
                            <span className="hero-frame__glow" aria-hidden="true" />
                            <img
                                src={heroImage}
                                alt=""
                                decoding="async"
                                fetchPriority="high"
                                width="720"
                                height="540"
                            />
                            <div className="hero-frame__badge">
                                <span
                                    className="hero-frame__badge-icon material-symbols-outlined"
                                    aria-hidden="true"
                                >
                                    handshake
                                </span>
                                <span>
                                    <strong>Serving the Mission Station</strong>
                                    <small>Recruiting people of the right skill and character</small>
                                </span>
                            </div>
                            <div className="hero-frame__stat hero-frame__stat--1">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    track_changes
                                </span>
                                <span>
                                    <strong>Every stage</strong>
                                    <small>tracked end-to-end</small>
                                </span>
                            </div>
                            <div className="hero-frame__stat hero-frame__stat--2">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    groups
                                </span>
                                <span>
                                    <strong>Right fit</strong>
                                    <small>skill and character</small>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <a
                    href="#stats"
                    className="hero__scroll"
                    aria-label="Scroll to content"
                    onClick={(e) => {
                        e.preventDefault();
                        document.querySelector('#stats')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <span className="hero__scroll-mouse" aria-hidden="true">
                        <span />
                    </span>
                    Scroll
                </a>
            </section>

            <section className="stats-band" id="stats" aria-label="What we do">
                <div className="public-container">
                    <div className="stats-head" data-reveal>
                        <span className="section-label">How we serve</span>
                        <h2>Four core services, one mission</h2>
                        <p>
                            From the first application to a missionary posting, the Mission Support Network
                            Center walks with every candidate at every stage.
                        </p>
                    </div>
                    <ul className="stats-grid" data-stagger>
                        {trustItems.map((item, i) => (
                            <li key={item.key} className="stats-item lift" data-reveal>
                                <span className="stats-item__num" aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="stats-item__icon material-symbols-outlined" aria-hidden="true">
                                    {item.icon}
                                </span>
                                <strong>{home[item.key] || item.fallback}</strong>
                                <small>{item.note}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="split-band split-band--navy" id="paths">
                <span className="split-band__orb" aria-hidden="true" />
                <div className="public-container split-band__grid">
                    <div className="split-band__copy" data-stagger>
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            {home.staff_eyebrow || 'New applicants'}
                        </span>
                        <h2 data-reveal>{home.staff_title || 'Opportunity to work in ministry'}</h2>
                        <p data-reveal>
                            {home.staff_body ||
                                'Want to serve in ministry? Sign in to begin your application for a missionary posting and take the first step toward working with the Mission Station.'}
                        </p>
                        <ul className="point-list" data-reveal>
                            {points.map((point) => (
                                <li key={point.text}>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        {point.icon}
                                    </span>
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/opportunity-to-work-in-ministry#register"
                            className="btn-mca btn-mca-white btn-mca-lg btn-mca-arrow lift"
                            data-reveal
                        >
                            {home.staff_button || 'Register'}
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                    <div className="split-band__aside" data-reveal="right">
                        <div className="aside-frame">
                            <img
                                src="/images/orientation.jpg"
                                alt="MSNC Orientation Program"
                                decoding="async"
                                width="640"
                                height="480"
                            />
                            <span className="aside-frame__chip">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    school
                                </span>
                                Preparation for the field
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="split-band" aria-label="Existing applicants">
                <div className="public-container split-band__grid">
                    <div className="split-band__copy" data-stagger>
                        <span className="eyebrow" data-reveal>
                            {home.applicant_eyebrow || 'Existing applicants'}
                        </span>
                        <h2 data-reveal>{home.applicant_title || 'Already applied?'}</h2>
                        <p data-reveal>
                            {home.applicant_body ||
                                'Sign in to update your profile, upload documents, and track your application progress through each stage of the hiring process.'}
                        </p>
                        <Link href="/login/applicant" className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift" data-reveal>
                            {home.applicant_button || 'Applicant Login'}
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                    <div className="split-band__aside">
                        <div className="step-row" data-stagger>
                            {steps.map((step, i) => (
                                <div key={step.title} className="step-card" data-reveal>
                                    <span className="step-card__num" aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3>{step.title}</h3>
                                        <p>{step.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="photo-band" aria-label="MSNC orientation">
                <img
                    src="/images/photo28@2x.jpg"
                    alt="Mission Support Network Center programme"
                    className="photo-band__img"
                    decoding="async"
                    data-parallax="0.16"
                />
                <div className="photo-band__scrim" aria-hidden="true" />
                <div className="photo-band__copy">
                    <div className="photo-band__inner">
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            Trained for the work
                        </span>
                        <h2 data-reveal>Prepared for the work of ministry</h2>
                        <p data-reveal>
                            The personnel we recruit are trained for Administration, ICT, Human Resources,
                            Broadcasting, New Media, Accounts, Security and more.
                        </p>
                    </div>
                </div>
            </section>

            <section className="feature-section public-section" aria-label="Learn more">
                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="eyebrow">Learn more</span>
                        <h2>Who we are, and what we believe</h2>
                        <p>
                            The Mission Support Network Center recruits, trains, posts and manages missionaries
                            for Christian work.
                        </p>
                    </div>
                    <div className="feature-grid" data-stagger>
                        {featureCards.map((card) => (
                            <article key={card.id} className="feature-tile lift" data-reveal>
                                <span className="feature-tile__icon material-symbols-outlined" aria-hidden="true">
                                    {card.icon}
                                </span>
                                <span className="feature-tile__kicker">
                                    {card.id === 'about' ? 'Our story' : 'Our conviction'}
                                </span>
                                <h3>{home[card.titleKey] || card.titleFallback}</h3>
                                <p>{excerpt(home[card.bodyKey] || card.bodyFallback)}</p>
                                <Link href={card.href} className="feature-tile__link">
                                    {card.cta}
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-band">
                <div className="public-container">
                    <div className="cta-band__inner" data-stagger>
                        <span className="cta-band__mark" aria-hidden="true">
                            <span className="material-symbols-outlined">church</span>
                        </span>
                        <h2 data-reveal>Ready to take the next step in ministry?</h2>
                        <p data-reveal>Register to begin your application, or sign in to continue where you left off.</p>
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
