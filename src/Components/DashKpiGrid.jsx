import { Link } from '@inertiajs/react';

function formatValue(value) {
    if (value === '—' || value === '-') return value;
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
}

export function DashKpi({ href, icon, label, value, hint }) {
    const body = (
        <>
            <span className="dash-kpi__icon" aria-hidden="true">
                <span className="material-symbols-outlined">{icon}</span>
            </span>
            <div className="dash-kpi__content">
                <p className="dash-kpi__label">{label}</p>
                <p className="dash-kpi__value">{formatValue(value)}</p>
                {hint ? <p className="dash-kpi__hint">{hint}</p> : null}
            </div>
        </>
    );

    if (href) {
        return (
            <Link href={href} className="dash-kpi">
                {body}
            </Link>
        );
    }

    return <div className="dash-kpi">{body}</div>;
}

export default function DashKpiGrid({ items = [], columns = 3 }) {
    const colClass = columns === 3 ? 'dash-kpi-grid--3' : columns === 5 ? 'dash-kpi-grid--5' : '';

    return (
        <div className={`dash-kpi-grid ${colClass}`.trim()}>
            {items.map((item) => (
                <DashKpi key={item.id || item.label} {...item} />
            ))}
        </div>
    );
}
