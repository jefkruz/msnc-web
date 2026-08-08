import { useEffect, useRef } from 'react';
import Modal from './Modal';

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
    const openedAt = useRef(0);
    const confirmClass = variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary';
    const icon = variant === 'danger' ? 'warning' : 'help';

    useEffect(() => {
        if (show) openedAt.current = Date.now();
    }, [show]);

    const closeFromBackdrop = () => {
        if (Date.now() - openedAt.current < 300) return;
        onClose?.();
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onBackdropClick={closeFromBackdrop}
            title={title}
            size="sm"
            footer={(
                <>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={confirmClass}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfirm?.();
                            onClose?.();
                        }}
                    >
                        {confirmLabel}
                    </button>
                </>
            )}
        >
            <div className={`portal-confirm portal-confirm--${variant}`}>
                <span className={`portal-confirm__icon portal-confirm__icon--${variant}`} aria-hidden="true">
                    <span className="material-symbols-outlined">{icon}</span>
                </span>
                <p className="portal-confirm__message">{message}</p>
            </div>
        </Modal>
    );
}
