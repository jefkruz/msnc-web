import { Link, usePage } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';

export default function AuthError() {
    const { appName = 'Recruitment Portal' } = usePage().props;
    return (
        <GuestLayout title="Authentication Error" appName={appName}>
            <div className="text-center">
                <div className="size-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-red-500">lock</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Access not authorized
                </h3>
                <p className="text-slate-500 dark:text-text-muted mb-8">
                    Your account was not found or you are not authorized to access this portal.
                    Please contact your administrator.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}
