import GuestLayout from '../../Components/GuestLayout';
import { Link, usePage } from '@inertiajs/react';

const roleLinks = [
    { role: 'applicant', label: 'Applicant' },
    { role: 'admin', label: 'Administrator' },
    { role: 'sdm', label: 'SDM' },
    { role: 'panelist', label: 'Panelist' },
    { role: 'director', label: 'Director' },
];

export default function Login({ role = 'admin', authLoginUrl = '#' }) {
    const { flash, appName = 'Recruitment Portal' } = usePage().props;
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
    const title = role === 'applicant' ? 'Applicant Login' : `Sign in as ${roleLabel}`;
    const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || window.location.origin;
    const callbackUrl = `${apiBase}/api/auth/callback/${role}`;
    const kcLoginUrl =
        authLoginUrl && authLoginUrl !== '#'
            ? authLoginUrl
            : `https://accounts.kingsch.at/?client_id=com.kingschat&scopes=["conference_calls"]&post_redirect=true&redirect_uri=${encodeURIComponent(callbackUrl)}`;

    const helperText =
        role === 'applicant'
            ? 'Sign in with KingsChat to update your profile, upload documents, and track your application.'
            : 'Welcome back. Use KingsChat to sign in and access your dashboard.';

    const isApplicant = role === 'applicant';

    return (
        <GuestLayout title={title} eyebrow="Secure sign-in" appName={appName} variant="signin">
            {flash?.error && (
                <div className="portal-alert alert-danger" style={{ marginBottom: '1rem' }}>
                    <div className="portal-alert__body">
                        <span className="portal-alert__message">{flash.error}</span>
                    </div>
                </div>
            )}
            <div className="guest-card__login">
                <p className="guest-card__helper">{helperText}</p>
                <a href={kcLoginUrl} className="btn-mca btn-mca-kc btn-mca-block btn-mca-lg lift">
                    <img
                        src="https://kingsch.at/h/css/images/favicon.ico"
                        alt=""
                        className="btn-mca__icon-img"
                    />
                    Login with KingsChat
                    <span className="material-symbols-outlined" aria-hidden="true">
                        arrow_forward
                    </span>
                </a>
                <p className="register-signin">
                    {isApplicant ? (
                        <>
                            New to the portal?{' '}
                            <Link href="/opportunity-to-work-in-ministry#register">
                                Register to apply
                            </Link>
                        </>
                    ) : (
                        <>
                            Looking for the applicant portal?{' '}
                            <Link href="/login/applicant">Applicant Login</Link>
                        </>
                    )}
                </p>
            </div>
            {roleLinks.length > 1 && (
                <div className="role-switch">
                    {roleLinks.map(({ role: r, label }) =>
                        r === role ? null : (
                            <Link key={r} href={`/login/${r}`}>
                                {label}
                            </Link>
                        )
                    )}
                </div>
            )}
            <div className="guest-card__foot">
                <span>Prefer the public site?</span>
                <Link href="/">Back to home</Link>
            </div>
        </GuestLayout>
    );
}
