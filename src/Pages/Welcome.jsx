import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import PublicLayout from '../Components/PublicLayout';

const trustItems = [
    {
        key: 'trust_1',
        fallback: 'Applicant management',
        icon: 'person_search',
        note: 'Track every application from start to finish.',
    },
    {
        key: 'trust_2',
        fallback: 'Interview scheduling',
        icon: 'event_available',
        note: 'Plan, schedule and manage interviews with ease.',
    },
    {
        key: 'trust_3',
        fallback: 'Document tracking',
        icon: 'folder_copy',
        note: 'Collect and verify credentials securely.',
    },
    {
        key: 'trust_4',
        fallback: 'Personnel in waiting',
        icon: 'groups',
        note: 'A ready talent pool for the Mission Station.',
    },
];

const steps = [
    {
        icon: 'how_to_reg',
        title: 'Register',
        body: 'Create your profile with the Mission Support Network Center in a few minutes.',
    },
    {
        icon: 'upload_file',
        title: 'Apply & upload',
        body: 'Complete your application and submit the required credentials and documents.',
    },
    {
        icon: 'track_changes',
        title: 'Interview & posting',
        body: 'Move through the recruitment stages toward a missionary posting with the Mission Station.',
    },
];

const opportunityPoints = [
    { icon: 'how_to_reg', text: 'Register once, apply at any time' },
    { icon: 'description', text: 'Upload your credentials securely online' },
    { icon: 'track_changes', text: 'Track every stage of your application' },
    { icon: 'event_available', text: 'Be scheduled for interview when you are ready' },
];

const roles = [
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

const counts = [
    { value: 4, prefix: '0', suffix: '', label: 'Core services' },
    { value: 11, prefix: '', suffix: '+', label: 'Roles trained' },
    { value: 3, prefix: '0', suffix: '', label: 'Pathway steps' },
    { value: 1, prefix: '0', suffix: '', label: 'Shared mission' },
];

const featureCards = [
    {
        id: 'about',
        icon: 'account_balance',
        kicker: 'Our story',
        titleKey: 'about_title',
        titleFallback: 'Who we are',
        href: '/about',
        cta: 'Read our story',
        bodyKey: 'about_body',
        bodyFallback:
            'The Mission Support Network Center is a registered Charity organization responsible for the recruitment, training, posting and managing of missionaries for Christian work — people of the right skill and the right character.',
    },
    {
        id: 'faith',
        icon: 'menu_book',
        kicker: 'Our conviction',
        titleKey: 'faith_title',
        titleFallback: 'What we believe',
        href: '/statement-of-faith',
        cta: 'Read the statement',
        bodyKey: 'faith_intro',
        bodyFallback:
            'Our Statement of Faith has its source in the Bible. These are the Bible doctrines we believe and the foundation for every person we recruit, train and post.',
    },
];

function scrollTo(id) {
    return (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
}

function excerpt(text = '', max = 150) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export default function Welcome({ branding = {}, home = {} }) {
    const siteName = branding.site_name || 'Mission Support Network Center';
    const heroImage = home.hero_image_url || '/images/hero.jpg';
    const heroVideoRef = useRef(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (reduceMotion?.matches && heroVideoRef.current) {
            heroVideoRef.current.pause();
        }
    }, []);

    return (
        <PublicLayout branding={branding} active="home">
            <section className="hero">
                <div className="hero__bg" aria-hidden="true">
                    <video
                        ref={heroVideoRef}
                        className="hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        poster={heroImage}
                        tabIndex="-1"
                    >
                        <source
                            src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/hero-video-lg.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <span className="hero__video-overlay" />
                    <span className="hero__dotgrid" />
                    <span className="hero__ray" />
                    <span className="hero__orb hero__orb--1" />
                    <span className="hero__orb hero__orb--2" />
                    <span className="hero__orb hero__orb--3" />
                    <span className="hero__sparkle hero__sparkle--1">✦</span>
                    <span className="hero__sparkle hero__sparkle--2">✦</span>
                    <span className="hero__sparkle hero__sparkle--3">✛</span>
                    <span className="hero__sparkle hero__sparkle--4">✦</span>
                </div>

                <div className="public-container hero__layout">
                    <div className="hero__caption" data-stagger>
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            Recruitment &middot; Training &middot; Posting
                        </span>
                        <h1 data-split data-reveal>
                            {home.hero_title || 'Opportunity to work in ministry'}
                        </h1>
                        {home.hero_lead && (
                            <p className="hero__lead" data-reveal>
                                {home.hero_lead}
                            </p>
                        )}
                        {!home.hero_lead && (
                            <p className="hero__lead" data-reveal>
                                The <strong>{siteName}</strong> recruits, trains and posts missionaries —
                                people of the right skill and the right character — for the work of the
                                Mission Station.
                            </p>
                        )}
                        {home.hero_tagline && (
                            <p className="hero__tagline" data-reveal>
                                {home.hero_tagline}
                            </p>
                        )}
                        {!home.hero_tagline && (
                            <p className="hero__tagline" data-reveal>
                                Now recruiting across Administration, ICT, Media, Finance, HR and more.
                            </p>
                        )}
                        <div className="hero__ctas" data-reveal>
                            <Link
                                href="/opportunity-to-work-in-ministry#register"
                                className="btn-mca btn-mca-white btn-mca-lg btn-mca-arrow lift"
                                title="Begin your application today"
                            >
                                Begin your application
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                            <a
                                href="#how"
                                className="btn-mca btn-mca-outline-on-dark btn-mca-lg lift"
                                onClick={scrollTo('how')}
                            >
                                See how it works
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    keyboard_arrow_down
                                </span>
                            </a>
                        </div>
                        <p className="hero__subnote" data-reveal>
                            Already registered?
                            <Link href="/login/applicant">
                                Sign in to continue your application
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                        </p>
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
                    href="#opportunity"
                    className="hero__scroll"
                    aria-label="Scroll to opportunity"
                    onClick={scrollTo('opportunity')}
                >
                    <span className="hero__scroll-mouse" aria-hidden="true">
                        <span />
                    </span>
                    Scroll
                </a>
            </section>

            <div className="hero-ticker" aria-label="Applications open">
                <div className="public-container">
                    <div className="hero-ticker__inner" data-reveal="up">
                        <span className="hero-ticker__mark" aria-hidden="true">
                            <span className="material-symbols-outlined">volunteer_activism</span>
                        </span>
                        <span>
                            <strong>Applications to work in ministry are now open</strong>
                            <small>
                                We are currently recruiting across more than eleven roles for the Mission
                                Station.
                            </small>
                        </span>
                        <a
                            href="#roles"
                            className="btn-mca btn-mca-sm lift"
                            onClick={scrollTo('roles')}
                        >
                            See the roles
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <section className="opp-band" id="opportunity" aria-label="Opportunity to work in ministry">
                <span className="opp-band__deco" aria-hidden="true" />
                <span className="opp-band__deco opp-band__deco--2" aria-hidden="true" />
                <div className="public-container opp-grid">
                    <div className="opp-grid__copy" data-stagger>
                        <span className="eyebrow" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            {home.staff_eyebrow || 'Opportunity to work in ministry'}
                        </span>
                        <h2 data-reveal>{home.staff_title || 'Answer the call to serve this season'}</h2>
                        <p data-reveal>
                            {home.staff_body ||
                                'Want to serve in ministry? We are recruiting trained personnel of the right skill and character for the Mission Station. Begin your application and take the first step toward a missionary posting.'}
                        </p>
                        <ul className="opp-points" data-reveal>
                            {opportunityPoints.map((point) => (
                                <li key={point.text}>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        {point.icon}
                                    </span>
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                        <div className="opp-actions" data-reveal>
                            <Link
                                href="/opportunity-to-work-in-ministry#register"
                                className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift"
                            >
                                {home.staff_button || 'Register to apply'}
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                            <Link
                                href="/opportunity-to-work-in-ministry"
                                className="btn-mca btn-mca-outline btn-mca-lg lift"
                            >
                                Read the full description
                            </Link>
                        </div>
                    </div>
                    <div className="opp-media" data-reveal="right">
                        <img
                            src="/images/orientation.jpg"
                            alt="MSNC Orientation Program"
                            decoding="async"
                            width="640"
                            height="480"
                        />
                        <span className="opp-chip">
                            <span className="opp-chip__ring">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    school
                                </span>
                            </span>
                            Preparation for the field
                        </span>
                    </div>
                </div>
            </section>

            <section className="steps-band" id="how" aria-label="How it works">
                <div className="public-container">
                    <div className="steps-head" data-reveal>
                        <span className="section-label">A simple pathway</span>
                        <h2>From first step to missionary posting</h2>
                        <p>
                            Three clear stages take you from registration all the way to serving with the
                            Mission Station.
                        </p>
                    </div>
                    <div className="steps-row" data-stagger>
                        {steps.map((step, i) => (
                            <div key={step.title} className="step-card" data-reveal="up">
                                <span className="step-card__icon material-symbols-outlined" aria-hidden="true">
                                    {step.icon}
                                </span>
                                <span className="step-card__num" aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="steps-cta" data-reveal>
                        <Link
                            href="/opportunity-to-work-in-ministry#register"
                            className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift"
                        >
                            Start your application
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="roles-band" id="roles" aria-label="Roles we recruit and train for">
                <div className="public-container">
                    <div className="steps-head" data-reveal>
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            Where our people serve
                        </span>
                        <h2>Roles we recruit and train for</h2>
                        <p>
                            Personnel we place are trained to provide dependable support across the whole
                            of the Mission Station's work.
                        </p>
                    </div>
                    <div className="roles-grid" data-stagger>
                        {roles.map((role) => (
                            <span key={role.label} className="role-chip lift" data-reveal="zoom">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    {role.icon}
                                </span>
                                {role.label}
                            </span>
                        ))}
                    </div>
                    <p className="roles-foot" data-reveal>
                        Think your role belongs here?{' '}
                        <Link href="/opportunity-to-work-in-ministry#register">
                            Apply today
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </p>
                </div>
            </section>

            <section className="stats-band" id="services" aria-label="How we serve">
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
                            <li key={item.key} className="stats-item lift" data-reveal="up">
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

                    <div className="count-band" data-reveal="zoom">
                        {counts.map((count) => (
                            <div key={count.label} className="count-item">
                                <span
                                    className="count-item__num"
                                    data-countup={count.value}
                                    data-prefix={count.prefix}
                                    data-suffix={count.suffix}
                                />
                                <span className="count-item__label">{count.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="photo-band" aria-label="Prepared for ministry">
                <img
                    src="/images/photo28@2x.jpg"
                    alt="Mission Support Network Center programme"
                    className="photo-band__img"
                    decoding="async"
                    data-parallax="0.14"
                />
                <div className="photo-band__scrim" aria-hidden="true" />
                <div className="photo-band__copy">
                    <div className="photo-band__inner">
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            Trained for the work
                        </span>
                        <h2 data-reveal>
                            Prepared for the <span className="text-accent">work of ministry</span>
                        </h2>
                        <p data-reveal>
                            The personnel we recruit are trained for Administration, ICT, Human Resources,
                            Broadcasting, New Media, Accounts, Security and more — equipped in skill, formed
                            in character.
                        </p>
                        <Link
                            href="/opportunity-to-work-in-ministry#register"
                            className="btn-mca btn-mca-white btn-mca-lg btn-mca-arrow lift"
                            data-reveal
                        >
                            Begin your application
                            <span className="material-symbols-outlined" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="feature-section" id="about" aria-label="About us and statement of faith">
                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="section-label">Who we are</span>
                        <h2>Our story, and what we believe</h2>
                        <p>
                            The Mission Support Network Center recruits, trains, posts and manages
                            missionaries for Christian work.
                        </p>
                    </div>
                    <div className="feature-grid" data-stagger>
                        {featureCards.map((card) => (
                            <article key={card.id} className="feature-tile lift" data-reveal="up">
                                <div className="feature-tile__top">
                                    <span className="feature-tile__icon material-symbols-outlined" aria-hidden="true">
                                        {card.icon}
                                    </span>
                                    <span className="feature-tile__kicker">{card.kicker}</span>
                                </div>
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

            <section className="cta-band" id="connect" aria-label="Get started">
                <div className="public-container">
                    <div className="cta-band__inner" data-stagger>
                        <span className="cta-band__mark" aria-hidden="true">
                            <span className="material-symbols-outlined">church</span>
                        </span>
                        <h2 data-reveal>Ready to take the next step in ministry?</h2>
                        <p data-reveal>
                            Register to begin your application — or sign in to continue where you left off.
                        </p>
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
                        <div className="cta-contact" data-reveal>
                            <a href="tel:+2348133026781">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    call
                                </span>
                                +234 813 302 6781
                            </a>
                            <a href="mailto:info@missionsupportnetworkcenter.org">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    mail
                                </span>
                                info@missionsupportnetworkcenter.org
                            </a>
                            <a
                                href="#services"
                                onClick={scrollTo('services')}
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    work
                                </span>
                                How we serve
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}