import { usePage, Link } from '@inertiajs/react';
import Layout from '../Components/Layout';

function VerticalBarChart({ labels = [], values = [], color = '#136dec' }) {
    const padding = { top: 12, right: 8, bottom: 32, left: 28 };
    const w = 260;
    const h = 160;
    const innerW = w - padding.left - padding.right;
    const innerH = h - padding.top - padding.bottom;
    const maxVal = Math.max(1, ...values);
    const barCount = values.length || 1;
    const barGap = 2;
    const barWidth = Math.max(2, (innerW - barGap * (barCount - 1)) / barCount - barGap);
    const yTicks = maxVal <= 5 ? Array.from({ length: maxVal + 1 }, (_, i) => i) : [0, Math.ceil(maxVal / 2), maxVal];

    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            {yTicks.map((tick) => {
                const y = padding.top + innerH - (maxVal > 0 ? (tick / maxVal) * innerH : 0);
                return (
                    <text key={tick} x={6} y={y + 3} textAnchor="start" fill="currentColor" fontSize="10" opacity="0.6">
                        {tick}
                    </text>
                );
            })}
            {values.map((v, i) => {
                const barHeight = maxVal > 0 ? (v / maxVal) * innerH : 0;
                const x = padding.left + i * (barWidth + barGap);
                const y = padding.top + innerH - barHeight;
                return <rect key={`bar-${i}`} x={x} y={y} width={barWidth} height={barHeight} fill={color} rx={2} />;
            })}
            {labels.length > 0 && (
                <text x={padding.left + innerW / 2} y={h - 8} textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.6">
                    {labels[0]} — {labels[labels.length - 1]}
                </text>
            )}
        </svg>
    );
}

function BarChart({ labels = [], values = [], color = '#136dec' }) {
    const maxVal = Math.max(1, ...values);
    return (
        <div>
            {labels.map((label, i) => (
                <div key={label + i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.75rem', width: '5.5rem', color: 'var(--mca-on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>
                        {label}
                    </span>
                    <div style={{ flex: 1, height: '0.7rem', background: 'var(--mca-soft-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(values[i] / maxVal) * 100}%`, minWidth: values[i] > 0 ? 4 : 0, background: color, borderRadius: '999px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '1.5rem', textAlign: 'right' }}>{values[i]}</span>
                </div>
            ))}
            {labels.length === 0 && <p className="dash-chart-empty">No data</p>}
        </div>
    );
}

export default function Dashboard({
    applicants = 0,
    interviews = 0,
    personnelInWaiting = 0,
    users = 0,
    greeting = 'Good morning',
    recentActivity = [],
    charts = null,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const activityList = Array.isArray(recentActivity) ? recentActivity : [];
    const isAdmin = authRole === 'Administrator';
    const chartData = charts && isAdmin ? charts : null;
    const org = appName === 'AMDL' ? 'AMDL' : appName?.includes('MSNC') ? 'MSNC' : appName;

    const kpis = [
        { label: 'Applicants', href: '/administrator/applicants', value: applicants, hint: 'All applications' },
        { label: 'Users', href: '/administrator/tbl-users', value: users, hint: 'Staff records' },
        { label: 'Personnel in waiting', href: '/authorised/personnel-in-waiting', value: personnelInWaiting, hint: 'Active waiting list' },
        { label: 'Interviews', href: '/administrator/interviews', value: interviews, hint: 'Scheduled & completed' },
        { label: 'Administration', href: '/administrator/menu', value: 7, hint: 'Setup & stakeholders' },
    ];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Dashboard Overview">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Dashboard Overview</h2>
                    <p>
                        {greeting}, {auth?.name || 'Guest'}. Welcome to the {org} recruitment portal.
                    </p>
                </div>

                <div className="dash-kpi-grid dash-kpi-grid--5">
                    {kpis.map((kpi) => (
                        <Link key={kpi.label} href={kpi.href} className="dash-kpi">
                            <p className="dash-kpi__label">{kpi.label}</p>
                            <p className="dash-kpi__value">{kpi.value ?? 0}</p>
                            <p className="dash-kpi__hint">{kpi.hint}</p>
                        </Link>
                    ))}
                </div>

                {chartData && (
                    <div className="dash-chart-grid dash-chart-grid--2">
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by date</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <VerticalBarChart
                                    labels={chartData.applicantsByDate?.labels ?? []}
                                    values={chartData.applicantsByDate?.values ?? []}
                                />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Personnel in waiting</h3>
                            <p className="dash-chart-card__subtitle">By status</p>
                            <div className="dash-chart-card__body">
                                <BarChart
                                    labels={chartData.personnelInWaitingByStatus?.labels ?? []}
                                    values={chartData.personnelInWaitingByStatus?.values ?? []}
                                    color="#d97706"
                                />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Interviews scheduled</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <VerticalBarChart
                                    labels={chartData.interviewsScheduled?.labels ?? []}
                                    values={chartData.interviewsScheduled?.values ?? []}
                                    color="#1f7a4d"
                                />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Users by year</h3>
                            <p className="dash-chart-card__subtitle">Staff inventory</p>
                            <div className="dash-chart-card__body">
                                <BarChart
                                    labels={chartData.usersByYear?.labels ?? []}
                                    values={chartData.usersByYear?.values ?? []}
                                    color="#2748c7"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="dash-section-grid--2">
                    <div className="dash-panel">
                        <div className="dash-panel__head">
                            <h3>Recent activity</h3>
                            {activityList.length > 0 && <Link href="/administrator/applicants">View applicants</Link>}
                        </div>
                        <div className="dash-panel__body">
                            {activityList.length === 0 ? (
                                <p className="dash-roles__empty">No recent activity. New applications and scheduled interviews will appear here.</p>
                            ) : (
                                activityList.map((item) => (
                                    <Link key={`${item.type}-${item.id}`} href={item.href || '#'} className="dash-feed-item">
                                        <span className="dash-feed-icon">
                                            <span className="material-symbols-outlined">
                                                {item.type === 'interview' ? 'event_available' : 'person_add'}
                                            </span>
                                        </span>
                                        <div>
                                            <strong>{item.title}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--mca-on-surface-variant)' }}>{item.description}</div>
                                            {item.time_ago && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--mca-on-surface-variant)', marginTop: 4 }}>{item.time_ago}</div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="dash-panel">
                        <div className="dash-panel__head">
                            <h3>Quick actions</h3>
                        </div>
                        <div className="dash-panel__body" style={{ padding: '1rem 1.25rem 1.25rem' }}>
                            <div className="quick-actions">
                                <Link href="/administrator/applicants/create" className="quick-action">
                                    <span className="material-symbols-outlined">person_add</span>
                                    Add applicant
                                </Link>
                                <Link href="/administrator/interviews" className="quick-action">
                                    <span className="material-symbols-outlined">event_note</span>
                                    Schedule interview
                                </Link>
                                <Link href="/administrator/questions" className="quick-action">
                                    <span className="material-symbols-outlined">help</span>
                                    Add questions
                                </Link>
                                <Link href="/authorised/personnel-in-waiting" className="quick-action">
                                    <span className="material-symbols-outlined">schedule</span>
                                    Personnel in waiting
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
