import { Link, usePage } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';

export default function NotFound() {
    const { appName = 'Recruitment Portal' } = usePage().props;
    return (
        <GuestLayout title="Page Not Found" appName={appName}>
            <div className="text-center">
                <h2 className="text-8xl font-black text-primary mb-4">404</h2>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Page Not Found
                </h3>
                <p className="text-slate-500 dark:text-text-muted mb-8">
                    We are sorry but the page you are looking for was not found.
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
