import { useEffect } from 'react';

export default function Modal({ show, onClose, title, children, size = 'md', footer = null }) {
    useEffect(() => {
        if (show) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (!show) return null;

    const sizeClass = { sm: '', md: '', lg: 'portal-modal--lg', xl: 'portal-modal--xl' }[size] || '';

    return (
        <div className="portal-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="portal-modal-backdrop__scrim" onClick={onClose} aria-hidden="true" />
            <div className={`portal-modal ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
                <div className="portal-modal__header">
                    <h3 id="modal-title">{title}</h3>
                    <button type="button" className="app-icon-btn" onClick={onClose} aria-label="Close modal">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="portal-modal__body">{children}</div>
                {footer && <div className="portal-modal__footer">{footer}</div>}
            </div>
        </div>
    );
}
