import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function LoginAsButton({
    href,
    label = 'Log in as',
    compact = false,
    block = false,
    className = '',
}) {
    const [processing, setProcessing] = useState(false);
    const text = compact ? 'Log in as' : label;

    const handleClick = () => {
        if (processing) return;
        setProcessing(true);
        router.post(href, {}, {
            onFinish: () => setProcessing(false),
            onError: () => setProcessing(false),
        });
    };

    const classes = [
        'login-as-btn',
        compact ? 'login-as-btn--compact action-btn' : '',
        block ? 'login-as-btn--block' : '',
        processing ? 'login-as-btn--processing' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={processing}
            title={label}
            aria-busy={processing}
            className={classes}
        >
            <span className="material-symbols-outlined" aria-hidden="true">
                {processing ? 'hourglass_top' : 'switch_account'}
            </span>
            <span>{processing ? 'Switching…' : text}</span>
        </button>
    );
}
