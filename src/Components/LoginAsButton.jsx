import { router } from '@inertiajs/react';

export default function LoginAsButton({ href, label = 'Log in as', compact = false, className = '' }) {
    const handleClick = () => {
        router.post(href);
    };

    if (compact) {
        return (
            <button
                type="button"
                onClick={handleClick}
                title={label}
                className={`p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex ${className}`}
            >
                <span className="material-symbols-outlined">switch_account</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500 font-medium text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 ${className}`}
        >
            <span className="material-symbols-outlined text-lg">switch_account</span>
            {label}
        </button>
    );
}
