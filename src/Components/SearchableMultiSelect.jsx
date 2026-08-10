import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { titleCaseLabel } from '../lib/titleCase';

const baseInputClass = 'form-control';

/**
 * Select2-style searchable multi-select. value/onChange: array of selected values.
 */
export default function SearchableMultiSelect({
    value = [],
    onChange,
    options = [],
    placeholder = 'Select...',
    disabled = false,
    required = false,
    className = '',
    getOptionValue = (opt) => opt?.id ?? opt?.value,
    getOptionLabel = titleCaseLabel,
    error,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [pos, setPos] = useState(null);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const normalizedOptions = options.map((opt) => ({
        value: getOptionValue(opt),
        label: getOptionLabel(opt),
    }));

    const valueSet = new Set((value || []).map((v) => String(v)));
    const selectedOptions = normalizedOptions.filter((o) => valueSet.has(String(o.value)));

    const filteredOptions = search.trim()
        ? normalizedOptions.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
        )
        : normalizedOptions;

    useEffect(() => {
        if (!open) {
            setPos(null);
            return undefined;
        }
        const update = () => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 280 && rect.top > spaceBelow;
            setPos({
                top: openUp ? undefined : rect.bottom + 4,
                bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
                left: rect.left,
                width: Math.max(rect.width, 180),
            });
        };
        update();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open, selectedOptions.length]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current?.contains(e.target)) return;
            if (dropdownRef.current?.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (optValue) => {
        const next = valueSet.has(String(optValue))
            ? (value || []).filter((v) => String(v) !== String(optValue))
            : [...(value || []), optValue];
        onChange(next);
    };

    const removeOne = (e, optValue) => {
        e.stopPropagation();
        onChange((value || []).filter((v) => String(v) !== String(optValue)));
    };

    const dropdown = open && pos && typeof document !== 'undefined'
        ? createPortal(
            <div
                ref={dropdownRef}
                className="select2-dropdown rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-xl overflow-hidden"
                style={{
                    position: 'fixed',
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    width: pos.width,
                    zIndex: 1200,
                }}
                role="listbox"
            >
                <div className="p-2 border-b border-slate-200 dark:border-border-dark">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full rounded-md border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                    {filteredOptions.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-slate-500 dark:text-text-muted">No results</li>
                    ) : (
                        filteredOptions.map((opt) => {
                            const isSelected = valueSet.has(String(opt.value));
                            return (
                                <li
                                    key={String(opt.value)}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => toggle(opt.value)}
                                    className={`
                                        px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2
                                        ${isSelected
                                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                                            : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white'}
                                    `}
                                >
                                    <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    {opt.label}
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>,
            document.body,
        )
        : null;

    return (
        <div ref={containerRef} className="relative">
            <div
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-required={required || undefined}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={`
                    ${baseInputClass}
                    flex flex-wrap items-center gap-2 cursor-pointer min-h-[42px]
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${error ? 'border-red-500' : ''}
                    ${className}
                `}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((opt) => (
                        <span
                            key={String(opt.value)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 dark:bg-primary/25 text-primary text-sm"
                        >
                            {opt.label}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => removeOne(e, opt.value)}
                                    className="p-0.5 rounded hover:bg-primary/30"
                                    aria-label={`Remove ${opt.label}`}
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}
                        </span>
                    ))
                ) : (
                    <span className="text-slate-400 dark:text-text-muted">{placeholder}</span>
                )}
                <span className="flex items-center gap-1 flex-shrink-0 ml-auto">
                    <span className={`material-symbols-outlined text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </span>
            </div>

            {dropdown}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
