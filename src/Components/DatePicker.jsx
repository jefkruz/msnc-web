import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDate } from '../lib/formatDate';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseIso(value) {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
}

function toIso(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function sameDay(a, b) {
    return a && b
        && a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function DatePicker({
    value = '',
    onChange,
    placeholder = 'Select date',
    min = '1940-01-01',
    max,
    disabled = false,
}) {
    const selected = parseIso(value);
    const minDate = startOfDay(parseIso(min) || new Date(1940, 0, 1));
    const maxDate = startOfDay(parseIso(max) || new Date());
    const fallback = new Date(maxDate.getFullYear() - 30, maxDate.getMonth(), 1);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('days');
    const [view, setView] = useState(() => selected || fallback);
    const [pos, setPos] = useState(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const update = () => {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 360 && rect.top > spaceBelow;
            setPos({
                top: openUp ? undefined : rect.bottom + 6,
                bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
                left: rect.left,
                width: Math.max(rect.width, 280),
            });
        };
        update();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const onPointer = (event) => {
            if (triggerRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) return;
            setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const openPicker = () => {
        if (disabled) return;
        setView(selected || fallback);
        setMode('days');
        setOpen(true);
    };

    const shiftMonth = (delta) => {
        setView((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
    };

    const selectDay = (date) => {
        const day = startOfDay(date);
        if (day < minDate || day > maxDate) return;
        onChange?.(toIso(day));
        setOpen(false);
    };

    const year = view.getFullYear();
    const month = view.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];

    const years = [];
    for (let y = maxDate.getFullYear(); y >= minDate.getFullYear(); y -= 1) years.push(y);

    const panel = open && pos ? (
        <div
            ref={panelRef}
            className="fixed z-[80] rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-xl p-3"
            style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: Math.min(pos.width, 320) }}
        >
            <div className="flex items-center justify-between gap-2 mb-3">
                {mode === 'days' ? (
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                ) : <span className="w-8" />}
                <button type="button" className="text-sm font-semibold text-slate-900 dark:text-white px-2" onClick={() => setMode(mode === 'days' ? 'years' : 'days')}>
                    {mode === 'days' ? `${MONTHS[month]} ${year}` : 'Select year'}
                </button>
                {mode === 'days' ? (
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => shiftMonth(1)} aria-label="Next month">
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                ) : <span className="w-8" />}
            </div>

            {mode === 'years' ? (
                <div className="grid grid-cols-4 gap-1 max-h-56 overflow-y-auto">
                    {years.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => {
                                setView(new Date(item, month, 1));
                                setMode('days');
                            }}
                            className={`rounded-lg px-2 py-2 text-sm ${item === year ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {WEEKDAYS.map((label) => (
                            <div key={label} className="text-center text-[11px] font-semibold text-slate-400">{label}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((date, index) => {
                            if (!date) return <span key={`empty-${index}`} />;
                            const disabledDay = startOfDay(date) < minDate || startOfDay(date) > maxDate;
                            const active = sameDay(date, selected);
                            return (
                                <button
                                    key={toIso(date)}
                                    type="button"
                                    disabled={disabledDay}
                                    onClick={() => selectDay(date)}
                                    className={`h-8 rounded-lg text-sm ${active ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'} disabled:opacity-30 disabled:hover:bg-transparent`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : openPicker())}
                className="form-control flex items-center justify-between gap-2 text-left"
            >
                <span className={selected ? '' : 'text-slate-400 dark:text-text-muted'}>
                    {selected ? formatDate(selected) : placeholder}
                </span>
                <span className="material-symbols-outlined text-lg text-slate-400">calendar_month</span>
            </button>
            {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
        </>
    );
}
