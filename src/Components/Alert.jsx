const TYPE_MAP = {
    success: 'alert-success',
    error: 'alert-danger',
    danger: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
};

const ICONS = {
    success: 'check_circle',
    error: 'error',
    danger: 'error',
    warning: 'warning',
    info: 'info',
};

export default function Alert({ type = 'info', message, onDismiss, className = '' }) {
    if (!message) return null;

    return (
        <div className={`portal-alert ${TYPE_MAP[type] || 'alert-info'} ${className}`} role="alert">
            <div className="portal-alert__body">
                <span className="material-symbols-outlined portal-alert__icon">{ICONS[type] || 'info'}</span>
                <div>
                    <span className="portal-alert__message">{message}</span>
                </div>
                {onDismiss && (
                    <button type="button" className="app-icon-btn" onClick={onDismiss} aria-label="Dismiss" style={{ marginLeft: 'auto' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>
        </div>
    );
}
