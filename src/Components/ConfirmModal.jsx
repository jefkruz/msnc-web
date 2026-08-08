export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title = 'Confirm',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}) {
    if (!show) return null;

    const confirmClass = variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary';

    return (
        <div className="portal-modal-backdrop" role="dialog" aria-modal="true">
            <div className="portal-modal-backdrop__scrim" onClick={onClose} aria-hidden="true" />
            <div className="portal-modal" onClick={(e) => e.stopPropagation()}>
                <div className="portal-modal__header">
                    <h3>{title}</h3>
                    <button type="button" className="app-icon-btn" onClick={onClose} aria-label="Close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="portal-modal__body">
                    <p className="mb-0" style={{ color: 'var(--mca-on-surface-variant)' }}>{message}</p>
                </div>
                <div className="portal-modal__footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={confirmClass}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
