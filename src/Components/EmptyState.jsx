export default function EmptyState({
    icon = 'inbox',
    title = 'No data yet',
    description = 'Get started by creating your first item.',
    actionLabel,
    onAction,
    className = '',
}) {
    return (
        <div className={`portal-empty ${className}`}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--mca-on-surface-variant)' }}>
                {icon}
            </span>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {actionLabel && onAction && (
                <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
