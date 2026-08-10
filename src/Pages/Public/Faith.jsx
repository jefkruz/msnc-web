import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

const sidePoints = [
    { icon: 'menu_book', text: 'The Bible as our foundation' },
    { icon: 'volunteer_activism', text: 'Christian service with integrity' },
    { icon: 'church', text: 'Rooted in the doctrines of Christ' },
];

export default function Faith({ branding = {}, home = {} }) {
    const doctrines = Array.isArray(home.faith_doctrines) ? home.faith_doctrines : [];

    return (
        <PublicLayout branding={branding} active="faith">
            <section className="page-hero">
                <div className="page-hero__bg" aria-hidden="true">
                    <span className="hero__orb hero__orb--2" />
                    <span className="hero__grid" />
                </div>
                <div className="public-container page-hero__inner" data-stagger>
                    {home.faith_eyebrow && (
                        <span className="eyebrow" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            {home.faith_eyebrow}
                        </span>
                    )}
                    <h1 data-split data-reveal>
                        {home.faith_title || 'Statement of Faith'}
                    </h1>
                    {home.faith_subtitle && (
                        <p className="page-hero__subtitle" data-reveal>
                            {home.faith_subtitle}
                        </p>
                    )}
                </div>
            </section>

            <section className="public-section">
                <div className="public-container faith-page">
                    <div className="faith-page__layout">
                        <div className="faith-page__main">
                            {home.faith_intro && (
                                <p className="faith-page__intro" data-reveal>
                                    {home.faith_intro}
                                </p>
                            )}

                            {doctrines.length > 0 && (
                                <ol className="doctrine-list" data-stagger>
                                    {doctrines.map((doctrine, index) => (
                                        <li key={index} className="doctrine-list__item" data-reveal>
                                            <div className="doctrine-list__number" aria-hidden="true">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="doctrine-list__body">
                                                <p>{doctrine.text}</p>
                                                {Array.isArray(doctrine.children) && doctrine.children.length > 0 && (
                                                    <ul className="doctrine-list__children">
                                                        {doctrine.children.map((child) => (
                                                            <li key={child}>{child}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}

                            <div className="page-content__actions" data-reveal>
                                <Link href="/about" className="btn-mca btn-mca-blue-outline lift">
                                    About Us
                                </Link>
                                <Link href="/" className="btn-mca btn-mca-outline lift">
                                    Back to home
                                </Link>
                            </div>
                        </div>

                        <aside className="faith-page__aside" data-reveal="right">
                            <div className="faith-side">
                                <span className="faith-side__mark" aria-hidden="true">
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                </span>
                                <p className="faith-side__verse">
                                    “The grass withereth, the flower fadeth: but the word of our God shall
                                    stand for ever.”
                                </p>
                                <span className="faith-side__ref">— Isaiah 40:8</span>
                                <ul className="faith-side__list">
                                    {sidePoints.map((point) => (
                                        <li key={point.text}>
                                            <span className="material-symbols-outlined" aria-hidden="true">
                                                {point.icon}
                                            </span>
                                            {point.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="faith-side__img">
                                <img src="/images/profile_bg.jpg" alt="Ministry in action" decoding="async" />
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
