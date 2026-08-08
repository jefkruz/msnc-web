import { Link } from '@inertiajs/react';
import PublicLayout from '../Components/PublicLayout';

const featureCards = [
    {
        id: 'about',
        href: '/about',
        icon: 'info',
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

function excerpt(text = '', max = 130) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export default function Welcome({ branding = {}, home = {} }) {
    const siteName = branding.site_name || 'Mission Support Network Center';
    const heroImage = home.hero_image_url || '/images/hero.jpg';

    return (
        <PublicLayout branding={branding} active="home">
            <section className="hero">
                <div className="public-container hero__layout">
                    <div className="hero__caption">
                        <h1>{home.hero_title || siteName}</h1>
                        {home.hero_lead && <p className="hero__lead">{home.hero_lead}</p>}
                        {home.hero_tagline && <h2 className="hero__tagline">{home.hero_tagline}</h2>}
                        <div className="hero__ctas">
                            <Link
                                href="/login/applicant"
                                className="btn-mca btn-mca-blue"
                                title="Sign in to update your applicant profile"
                            >
                                {home.applicant_cta_label || 'Applicant Login'}
                            </Link>
                        </div>
                    </div>
                    <div className="hero__visual">
                        <img src={heroImage} alt="" decoding="async" />
                    </div>
                </div>
            </section>

            <section className="public-section public-section--path" id="paths">
                <div className="public-container">
                    <div className="path-grid">
                        <article className="path-panel path-panel--accent" id="missionary-apply">
                            <span className="path-panel__icon material-symbols-outlined" aria-hidden="true">
                                work
                            </span>
                            <h3>{home.staff_title || 'Opportunity to work in ministry'}</h3>
                            <p>
                                {home.staff_body ||
                                    'Want to serve in ministry? Sign in to begin your application for a missionary posting.'}
                            </p>
                            <Link href="/opportunity-to-work-in-ministry#register" className="btn-mca btn-mca-blue">
                                {home.staff_button || home.admin_cta_label || 'Register'}
                            </Link>
                        </article>
                    </div>
                </div>
            </section>

            <section className="spotlight-band" aria-label="MSNC orientation">
                <img
                    src="/images/orientation.jpg"
                    alt="MSNC Orientation Program"
                    className="spotlight-band__img"
                    decoding="async"
                />
            </section>

            <section className="feature-band feature-band--accent" aria-label="Learn more">
                <div className="public-container feature-band__grid">
                    {featureCards.map((card) => (
                        <article key={card.id} className="feature-tile">
                            <span className="feature-tile__icon material-symbols-outlined" aria-hidden="true">
                                {card.icon}
                            </span>
                            <h3>{home[card.titleKey] || card.titleFallback}</h3>
                            <p>{excerpt(home[card.bodyKey] || card.bodyFallback)}</p>
                            <Link href={card.href} className="btn-mca btn-mca-blue btn-mca-sm feature-tile__btn">
                                {card.cta}
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
