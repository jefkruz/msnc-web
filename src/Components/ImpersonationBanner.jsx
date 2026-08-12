import { router, usePage } from '@inertiajs/react';

export default function ImpersonationBanner() {
    const { impersonation } = usePage().props || {};
    if (!impersonation?.active) return null;

    const roleLabels = {
        director: 'Director',
        sdm: 'SDM',
        applicant: 'Applicant',
    };
    const roleLabel = roleLabels[impersonation.as] ?? 'User';

    return (
        <div className="impersonation-banner" role="status">
            <span className="impersonation-banner__text">
                Viewing as <strong>{impersonation.as_name}</strong> ({roleLabel}).
                Signed in as admin {impersonation.admin_name}.
            </span>
            <button type="button" className="impersonation-banner__btn" onClick={() => router.post('/impersonation/stop')}>
                Return to admin
            </button>
        </div>
    );
}
