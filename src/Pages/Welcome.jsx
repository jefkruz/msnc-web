import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
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
        titleFallback: 'About Us',
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
        titleFallback: 'Statement of Faith',
        href: '/statement-of-faith',
        cta: 'Read the statement',
        bodyKey: 'faith_intro',
        bodyFallback:
            'This is the statement of Bible doctrine as believed by the Mission Support Network Center. This Statement of Faith has its source in the Bible and is the foundation for every person we recruit, train and post.',
    },
];

const faqItems = [
    {
        id: 'vision',
        icon: 'visibility',
        title: 'The Vision',
        body: 'To provide a unique platform for every citizen of Loveworld Nation across the globe, including experts and professionals, to bring their God-given skills into active service for the Kingdom. Thereby building the Kingdom economy by empowering citizens financially and directing their professional capacity toward the work of the ministry.',
        list: [
            'Strengthen the Nation economy — a structured path for skills, services and enterprise capacity to flow within the Nation.',
            'Create job opportunities — empower citizens financially through income opportunities, assignments, contracts and ministry roles.',
            'Connect capacity to Kingdom work — turn everyday expertise into active Kingdom service on terms that fit each person.',
        ],
    },
    {
        id: 'who',
        icon: 'groups',
        title: 'Who can participate?',
        list: [
            'Partner — must be a partner of the ministry.',
            'Active Member — must have been an active member of the ministry for not less than 3 years.',
            'Foundation School — must be a graduate of Foundation School.',
            'Spiritual Readiness — must be baptized by immersion and full of the Holy Ghost.',
            'Professional Capability — must be qualified in a professional, technical, creative or operational field.',
        ],
    },
    {
        id: 'engagement',
        icon: 'work',
        title: 'Engagement types',
        list: [
            'Full Time — permanent ministry roles.',
            'Contract — fixed-term specialized projects.',
            'Project — task-based assignments.',
            'Part Time — support and backup roles.',
            'Voluntary — service-based contributions.',
        ],
    },
    {
        id: 'fields',
        icon: 'category',
        title: 'Fields of contribution',
        list: [
            'Creative & Media — media, editing, script writing, branding, lighting, sound and public relations.',
            'Technical & Operations — programming, administration, facility management, operations management, power maintenance and project management.',
            'Professional Services — accounting, marketing, sales, legal, medical, social and humanitarian services, human capital development, and consultancy.',
        ],
    },
    {
        id: 'benefits',
        icon: 'emoji_events',
        title: 'Benefits',
        list: [
            'For the Nation — global professional expertise, a stronger Kingdom economy, specialised skill capacity, and enhanced service delivery.',
            'For Citizens — global visibility for professional skills, financial empowerment, spiritual fulfilment, professional growth and meaningful opportunities.',
        ],
    },
    {
        id: 'how',
        icon: 'route',
        title: 'How to participate',
        body: 'The first action is simple: register on the MSNC website and submit your profile for matching to opportunities.',
        list: [
            'Register — visit the MSNC website and complete the registration process.',
            'Submit Skill Profile — share your field, qualifications, experience and preferred engagement type.',
            'Be Matched — connect with relevant ministry needs, projects, teams or employment opportunities.',
        ],
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
    const lgVideoRef = useRef(null);
    const [lgMuted, setLgMuted] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (reduceMotion?.matches) {
            if (heroVideoRef.current) heroVideoRef.current.pause();
            if (lgVideoRef.current) lgVideoRef.current.pause();
        }
    }, []);

    const toggleLgVideoMute = () => {
        if (lgVideoRef.current) {
            lgVideoRef.current.muted = !lgMuted;
            setLgMuted(!lgMuted);
        }
    };

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
                            Mission Support Network Center
                        </span>
                        <h1 data-split data-reveal>
                            {home.hero_title || 'Mission Support Network Center'}
                        </h1>
                        {home.hero_lead && (
                            <p className="hero__lead" data-reveal>
                                {home.hero_lead}
                            </p>
                        )}
                        {!home.hero_lead && (
                            <p className="hero__lead" data-reveal>
                                We are committed to providing support for Missionary work engaged in
                                taking the gospel of our Lord Jesus Christ to the ends of the earth. We
                                recruit and manage the best people ensuring that they have not only the
                                right skills but also the right character fit and a passion to be part
                                of the great initiative championed by the Mission Station.
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

            <section className="lg-band" id="opportunity" aria-label="Loveworld Global Workforce Engagement Initiative">
                <span className="opp-band__deco" aria-hidden="true" />
                <span className="opp-band__deco opp-band__deco--2" aria-hidden="true" />

                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="eyebrow">
                            <span className="eyebrow__dot" aria-hidden="true" />
                            A Kingdom Workforce Platform
                        </span>
                        <h2>Loveworld Global Workforce Engagement Initiative</h2>
                        <p>
                            A deliberate structure through which talent already resident in the Nation
                            is directed toward building the Kingdom. It connects the skills and
                            expertise of Loveworld citizens to practical ministry needs, transforming
                            professional capacity into measurable service and impact.
                        </p>
                    </div>

                    <div className="lg-grid" data-stagger>
                        <div className="lg-video-frame" data-reveal="right">
                            <video
                                ref={lgVideoRef}
                                className="lg-video-frame__video"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                disablePictureInPicture
                                poster={heroImage}
                            >
                                <source
                                    src="https://s3.eu-west-2.amazonaws.com/lodams-videoshare/videos/LGWFEIVd_539587ca73312e4421140000.mp4"
                                    type="video/mp4"
                                />
                            </video>
                            <button
                                type="button"
                                className="lg-video-frame__toggle"
                                onClick={toggleLgVideoMute}
                                aria-label={lgMuted ? 'Unmute video' : 'Mute video'}
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    {lgMuted ? 'volume_off' : 'volume_up'}
                                </span>
                                {lgMuted ? 'Unmute' : 'Mute'}
                            </button>
                        </div>

                        <div className="lg-copy" data-reveal="left">
                            <h3>Opportunity to work in ministry</h3>
                            <p>
                                Want to serve in ministry? Sign in to begin your application for a
                                missionary posting and take the first step toward working with the
                                Mission Station.
                            </p>
                            <ul className="opp-points" data-reveal>
                                <li>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        how_to_reg
                                    </span>
                                    Register once, apply at any time
                                </li>
                                <li>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        description
                                    </span>
                                    Upload your credentials securely online
                                </li>
                                <li>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        track_changes
                                    </span>
                                    Track every stage of your application
                                </li>
                                <li>
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        event_available
                                    </span>
                                    Be scheduled for interview when you are ready
                                </li>
                            </ul>
                            <div className="opp-actions" data-reveal>
                                <Link
                                    href="/opportunity-to-work-in-ministry#register"
                                    className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift"
                                >
                                    Register now
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg-faq public-container" data-stagger>
                    {faqItems.map((item) => {
                        const open = openFaq === item.id;
                        return (
                            <div key={item.id} className="faq-row">
                                <button
                                    type="button"
                                    className="faq-row__head"
                                    onClick={() => setOpenFaq(open ? null : item.id)}
                                    aria-expanded={open}
                                >
                                    <span className="faq-row__icon material-symbols-outlined" aria-hidden="true">
                                        {item.icon}
                                    </span>
                                    <span className="faq-row__title">{item.title}</span>
                                    <span className="faq-row__chev material-symbols-outlined" aria-hidden="true">
                                        {open ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                                <div className="faq-row__panel" style={{ maxHeight: open ? '900px' : '0px' }}>
                                    <div className="faq-row__body">
                                        {item.body && <p>{item.body}</p>}
                                        {item.list && (
                                            <ul className="faq-row__list">
                                                {item.list.map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                    src="/images/orientation.jpg"
                    alt="MSNC Orientation Program"
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

            <section className="feature-section" id="about" aria-label="Who we are">
                <div className="public-container">
                    <div className="feature-header" data-reveal>
                        <span className="section-label">Who we are</span>
                        <h2>
                            The Mission Support Network Center recruits, trains, posts and manages
                            missionaries for Christian work.
                        </h2>
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