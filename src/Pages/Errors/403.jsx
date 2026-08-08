import { Link, usePage } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';

export default function Forbidden() {
    const { appName = 'Recruitment Portal' } = usePage().props;
    return (
        <GuestLayout title="Access Denied" appName={appName}>
            <div className="text-center">
                <h2 className="text-8xl font-black text-red-500 mb-4">403</h2>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Access Denied
                </h3>
                <p className="text-slate-500 dark:text-text-muted mb-8">
                    You do not have permission to access this page.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined">home</span>
                    Go Home
                </Link>
            </div>
        </GuestLayout>
    );
}
