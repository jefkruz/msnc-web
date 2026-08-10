import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

export default function RegistrationSuccess({
    branding = {},
    message = 'Registration submitted successfully. An administrator will review your application shortly.',
}) {
    return (
        <PublicLayout branding={branding} active="opportunity-to-work-in-ministry">
            <section className="page-hero page-hero--short">
                <div className="page-hero__bg" aria-hidden="true">
                    <span className="hero__orb hero__orb--1" />
                    <span className="hero__grid" />
                </div>
                <div className="public-container page-hero__inner" data-stagger>
                    <span className="eyebrow" data-reveal>
                        <span className="eyebrow__dot" aria-hidden="true" />
                        Registration
                    </span>
                    <h1 data-split data-reveal>
                        Registration successful
                    </h1>
                </div>
            </section>

            <section className="public-section">
                <div className="public-container">
                    <div className="register-success" data-reveal="zoom">
                        <span className="success-mark" aria-hidden="true">
                            <svg viewBox="0 0 100 100" width="96" height="96" fill="none">
                                <circle
                                    className="success-mark__halo"
                                    cx="50"
                                    cy="50"
                                    r="46"
                                    fill="var(--p-brand-soft)"
                                />
                                <circle
                                    className="success-mark__circle"
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    stroke="var(--p-brand)"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                />
                                <path
                                    className="success-mark__check"
                                    d="M34 51 l11 12 l24 -26"
                                    stroke="var(--p-brand)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <h2>Thank you for registering</h2>
                        <p className="register-success__message">{message}</p>
                        <p className="register-success__sub">
                            Once approved, you can sign in to complete your application, upload the required
                            documents, and track your progress.
                        </p>
                        <div className="register-success__actions">
                            <Link href="/login/applicant" className="btn-mca btn-mca-blue btn-mca-arrow lift">
                                Applicant Login
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                            <Link href="/" className="btn-mca btn-mca-outline lift">
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
