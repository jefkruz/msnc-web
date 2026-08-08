import { Link, usePage } from '@inertiajs/react';
import { useLocation, useNavigate } from 'react-router-dom';
import GuestLayout from '../../Components/GuestLayout';

const DEFAULTS = {
    403: {
        title: 'Access denied',
        message: 'You do not have permission to view this page.',
        icon: 'lock',
    },
    404: {
        title: 'Page not found',
        message: 'That address is not a page in this portal.',
        icon: 'search_off',
    },
    500: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again in a moment.',
        icon: 'error',
    },
    auth: {
        title: 'Sign-in unsuccessful',
        message: 'Your KingsChat account is not registered for this portal role. Contact an administrator if you need access.',
        icon: 'person_off',
    },
};

export default function ErrorScreen({ code = '404', title, message, icon, homeHref = '/', homeLabel = 'Go home', showBack = true, showRetry = false }) {
    const { appName = 'MSNC Recruitment' } = usePage().props || {};
    const location = useLocation();
    const navigate = useNavigate();
    const preset = DEFAULTS[code] || DEFAULTS[404];
    const heading = title || preset.title;
    const body = location.state?.message || message || preset.message;
    const glyph = icon || preset.icon;
    const numeric = String(code).match(/^\d+$/);

    return (
        <GuestLayout title={heading} appName={appName} variant="signin">
            <div className="error-screen">
                <div className={`error-screen__mark error-screen__mark--${numeric ? code : 'auth'}`} aria-hidden="true">
                    <span className="material-symbols-outlined">{glyph}</span>
                </div>
                {numeric ? <p className="error-screen__code">{code}</p> : null}
                <p className="error-screen__copy">{body}</p>
                <div className="error-screen__actions">
                    <Link href={homeHref} className="btn-mca btn-mca-primary">
                        <span className="material-symbols-outlined" aria-hidden="true">home</span>
                        {homeLabel}
                    </Link>
                    {showRetry ? (
                        <button type="button" className="btn-mca btn-mca-secondary" onClick={() => window.location.reload()}>
                            <span className="material-symbols-outlined" aria-hidden="true">refresh</span>
                            Try again
                        </button>
                    ) : null}
                    {showBack ? (
                        <button type="button" className="btn-mca btn-mca-secondary" onClick={() => navigate(-1)}>
                            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                            Go back
                        </button>
                    ) : null}
                </div>
            </div>
        </GuestLayout>
    );
}
