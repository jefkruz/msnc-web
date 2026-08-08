import GuestLayout from '../../Components/GuestLayout';
import { usePage } from '@inertiajs/react';

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

    return (
        <GuestLayout title={title} appName={appName} variant="signin">
            {flash?.error && (
                <div className="portal-alert alert-danger" style={{ marginBottom: '1rem' }}>
                    <div className="portal-alert__body">
                        <span className="portal-alert__message">{flash.error}</span>
                    </div>
                </div>
            )}
            <p>{helperText}</p>
            <a href={kcLoginUrl} className="btn-mca btn-mca-outline btn-mca-block btn-mca-kc">
                <img
                    src="https://kingsch.at/h/css/images/favicon.ico"
                    alt=""
                    className="btn-mca__icon-img"
                />
                Login with KingsChat
            </a>
        </GuestLayout>
    );
}
