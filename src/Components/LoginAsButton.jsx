import { router } from '@inertiajs/react';

export default function LoginAsButton({ href, label = 'Log in as', compact = false, className = '' }) {
    const handleClick = () => {
        router.post(href);
    };

    const text = compact ? 'Log in as' : label;

    return (
        <button
            type="button"
            onClick={handleClick}
            title={label}
            className={
                compact
                    ? `btn btn-sm action-btn btn-outline-primary ${className}`
                    : `inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500 font-medium text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 ${className}`
            }
        >
            <span className="material-symbols-outlined" aria-hidden="true">switch_account</span>
            <span>{text}</span>
        </button>
    );
}
