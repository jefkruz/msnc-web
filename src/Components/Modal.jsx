import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ show, onClose, onBackdropClick, title, children, size = 'md', footer = null }) {
    useEffect(() => {
        if (!show) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [show, onClose]);

    if (!show || typeof document === 'undefined') return null;

    const sizeClass = {
        sm: 'portal-modal--sm',
        md: '',
        lg: 'portal-modal--lg',
        xl: 'portal-modal--xl',
    }[size] || '';

    return createPortal(
        <div className="portal-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="portal-modal-backdrop__scrim" onClick={onBackdropClick || onClose} aria-hidden="true" />
            <div className={`portal-modal ${sizeClass}`.trim()} onClick={(e) => e.stopPropagation()}>
                <div className="portal-modal__header">
                    <h3 id="modal-title">{title}</h3>
                    <button type="button" className="app-icon-btn" onClick={onClose} aria-label="Close modal">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="portal-modal__body">{children}</div>
                {footer ? <div className="portal-modal__footer">{footer}</div> : null}
            </div>
        </div>,
        document.body,
    );
}
