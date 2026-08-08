import { useState, useRef, useEffect } from 'react';

const baseInputClass = 'form-control';

/**
 * Select2-style searchable single select. Options: { value, label } or array of objects with id/name.
 */
export default function SearchableSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    disabled = false,
    required = false,
    className = '',
    getOptionValue = (opt) => opt?.id ?? opt?.value,
    getOptionLabel = (opt) => opt?.name ?? opt?.label ?? String(opt),
    error,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    const normalizedOptions = options.map((opt) => ({
        value: getOptionValue(opt),
        label: getOptionLabel(opt),
    }));

    const selected = normalizedOptions.find((o) => String(o.value) === String(value));
    const displayValue = selected ? selected.label : '';

    const filteredOptions = search.trim()
        ? normalizedOptions.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
        )
        : normalizedOptions;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt.value);
        setSearch('');
        setOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <div
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => !disabled && setOpen((o) => !o)}
                className={`
                    ${baseInputClass}
                    flex items-center justify-between gap-2 cursor-pointer
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${error ? 'border-red-500' : ''}
                    ${className}
                `}
            >
                <span className={displayValue ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-text-muted'}>
                    {displayValue || placeholder}
                </span>
                <span className="flex items-center gap-1 flex-shrink-0">
                    {value && !required && !disabled && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                        >
                            <span className="material-symbols-outlined text-slate-500 text-lg">close</span>
                        </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </span>
            </div>

            {open && (
                <div
                    className="absolute z-50 w-full mt-1 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-xl overflow-hidden"
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
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={String(opt.value) === String(value)}
                                    onClick={() => handleSelect(opt)}
                                    className={`
                                        px-4 py-2.5 text-sm cursor-pointer
                                        ${String(opt.value) === String(value)
                                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                                            : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white'}
                                    `}
                                >
                                    {opt.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {typeof error === 'string' && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
