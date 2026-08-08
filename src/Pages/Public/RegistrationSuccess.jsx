import { Link } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';

export default function RegistrationSuccess({
    branding = {},
    message = 'Registration submitted successfully. An administrator will review your application shortly.',
}) {
    return (
        <PublicLayout branding={branding} active="opportunity-to-work-in-ministry">
            <section className="page-hero">
                <div className="public-container">
                    <h1>Registration successful</h1>
                </div>
            </section>

            <section className="public-section">
                <div className="public-container">
                    <div className="register-success">
                        <span className="register-success__icon material-symbols-outlined" aria-hidden="true">
                            check_circle
                        </span>
                        <p className="register-success__message">{message}</p>
                        <div className="register-success__actions">
                            <Link href="/login/applicant" className="btn-mca btn-mca-blue">
                                Applicant Login
                            </Link>
                            <Link href="/" className="btn-mca btn-mca-blue-outline">
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
