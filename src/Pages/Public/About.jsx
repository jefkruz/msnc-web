import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

export default function About({ branding = {}, home = {} }) {
    const paragraphs = home.about_paragraphs?.length
        ? home.about_paragraphs
        : home.about_body
          ? [home.about_body]
          : [];

    return (
        <PublicLayout branding={branding} active="about">
            <section className="page-hero">
                <div className="public-container">
                    {home.about_eyebrow && <span className="section-label">{home.about_eyebrow}</span>}
                    <h1>{home.about_title || 'About Us'}</h1>
                </div>
            </section>
            <section className="public-section">
                <div className="public-container page-content">
                    {paragraphs.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                    <div className="page-content__actions">
                        <Link href="/opportunity-to-work-in-ministry" className="btn-mca btn-mca-blue">
                            Opportunity to work in ministry
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
