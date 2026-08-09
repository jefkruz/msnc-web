import { useEffect, useState } from 'react';

export const inputClass = 'form-control';
export const textareaClass = `${inputClass} min-h-[110px]`;

function useObjectUrl(file) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        if (!file) {
            setUrl(null);
            return undefined;
        }
        const next = URL.createObjectURL(file);
        setUrl(next);
        return () => URL.revokeObjectURL(next);
    }, [file]);
    return url;
}

export function Section({ id, title, icon, hint, children }) {
    return (
        <section id={id} className="settings-section scroll-mt-24">
            <div className="settings-section__head">
                <span className="settings-section__icon material-symbols-outlined" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                    <h3>{title}</h3>
                    {hint ? <p>{hint}</p> : null}
                </div>
            </div>
            <div className="settings-section__body">{children}</div>
        </section>
    );
}

export function HeaderPreview({ name, tagline, faviconUrl }) {
    return (
        <div className="settings-field settings-field--full">
            <p className="settings-field__label">Public header preview</p>
            <div className="settings-brand-preview">
                <div className="public-brand">
                    <img src={faviconUrl || '/favicon.svg'} alt="" />
                    <span className="public-brand__text">
                        <span className="public-brand__name">{name || 'Site name'}</span>
                        {tagline ? <span className="public-brand__tag">{tagline}</span> : null}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function Field({ label, hint, className = '', children }) {
    return (
        <div className={`settings-field ${className}`.trim()}>
            {label ? <label className="settings-field__label">{label}</label> : null}
            {children}
            {hint ? <p className="settings-field__hint">{hint}</p> : null}
        </div>
    );
}

export function FileField({ label, hint, existingUrl, file, previewAlt, previewClassName = '', accept, error, onChange }) {
    const objectUrl = useObjectUrl(file);
    const previewUrl = objectUrl || existingUrl || null;

    return (
        <Field label={label} hint={hint} className="settings-field--full">
            <div className="settings-file">
                {previewUrl ? (
                    <img src={previewUrl} alt={previewAlt || ''} className={`settings-file__preview ${previewClassName}`.trim()} />
                ) : (
                    <span className="settings-file__placeholder material-symbols-outlined">image</span>
                )}
                <div className="settings-file__meta">
                    <label className="btn btn-secondary btn-sm settings-file__pick">
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Choose file
                        <input type="file" accept={accept} className="sr-only" onChange={onChange} />
                    </label>
                    <p className="settings-file__name">{file?.name || 'No new file selected'}</p>
                    {error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null}
                </div>
            </div>
        </Field>
    );
}

export function ToggleField({ label, checked, onChange, description }) {
    return (
        <label className="settings-toggle">
            <input type="checkbox" checked={!!checked} onChange={onChange} />
            <span className="settings-toggle__ui" aria-hidden="true" />
            <span className="min-w-0">
                <span className="settings-toggle__label">{label}</span>
                {description ? <span className="settings-toggle__hint">{description}</span> : null}
            </span>
        </label>
    );
}

export function SaveBar({ formId, processing, label = 'Save changes' }) {
    return (
        <div className="settings-savebar">
            <button type="submit" form={formId} disabled={processing} className="btn btn-primary">
                <span className="material-symbols-outlined text-lg">save</span>
                {processing ? 'Saving…' : label}
            </button>
        </div>
    );
}
