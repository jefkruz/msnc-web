import { Link } from '@inertiajs/react';

const PRESETS = {
    view: { icon: 'visibility', label: 'View', variant: 'outline-primary' },
    edit: { icon: 'edit', label: 'Edit', variant: 'secondary' },
    delete: { icon: 'delete', label: 'Delete', variant: 'outline-danger' },
    manage: { icon: 'tune', label: 'Manage', variant: 'outline-primary' },
    back: { icon: 'arrow_back', label: 'Back to list', variant: 'secondary' },
};

export default function ActionButton({
    action,
    href,
    onClick,
    label,
    icon,
    variant,
    size = 'sm',
    className = '',
    type = 'button',
    disabled,
    title,
}) {
    const preset = PRESETS[action] || {};
    const text = label ?? preset.label ?? 'Action';
    const iconName = icon ?? preset.icon;
    const tone = variant ?? preset.variant ?? 'secondary';
    const sizeClass = size === 'sm' ? 'btn-sm' : '';
    const classes = ['btn', `btn-${tone}`, sizeClass, 'action-btn', className].filter(Boolean).join(' ');

    const content = (
        <>
            {iconName ? (
                <span className="material-symbols-outlined" aria-hidden="true">
                    {iconName}
                </span>
            ) : null}
            <span>{text}</span>
        </>
    );

    if (href) {
        return (
            <Link href={href} className={classes} title={title || text}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={classes} title={title || text}>
            {content}
        </button>
    );
}

export function ActionGroup({ children, className = '' }) {
    return <div className={`action-btn-group ${className}`.trim()}>{children}</div>;
}
