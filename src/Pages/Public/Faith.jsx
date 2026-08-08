import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

export default function Faith({ branding = {}, home = {} }) {
    const doctrines = Array.isArray(home.faith_doctrines) ? home.faith_doctrines : [];

    return (
        <PublicLayout branding={branding} active="faith">
            <section className="page-hero">
                <div className="public-container">
                    {home.faith_eyebrow && <span className="section-label">{home.faith_eyebrow}</span>}
                    <h1>{home.faith_title || 'Statement of Faith'}</h1>
                    {(home.faith_subtitle || 'Bible doctrines as believed by the Mission Station') && (
                        <p className="page-hero__subtitle">
                            {home.faith_subtitle || 'Bible doctrines as believed by the Mission Station'}
                        </p>
                    )}
                </div>
            </section>

            <section className="public-section">
                <div className="public-container faith-page">
                    {home.faith_intro && <p className="faith-page__intro">{home.faith_intro}</p>}

                    {doctrines.length > 0 && (
                        <ol className="doctrine-list">
                            {doctrines.map((doctrine, index) => (
                                <li key={index} className="doctrine-list__item">
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

                    <div className="page-content__actions">
                        <Link href="/about" className="btn-mca btn-mca-blue-outline">
                            About Us
                        </Link>
                        <Link href="/" className="btn-mca btn-mca-blue-outline">
                            Back to home
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
