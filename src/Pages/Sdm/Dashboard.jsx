import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';

function LineChart({ labels = [], values = [], color = '#136dec' }) {
    const padding = { top: 12, right: 8, bottom: 24, left: 28 };
    const w = 320;
    const h = 160;
    const innerW = w - padding.left - padding.right;
    const innerH = h - padding.top - padding.bottom;
    const maxVal = Math.max(1, ...values);
    const points = values.map((v, i) => {
        const x = padding.left + (i / Math.max(1, values.length - 1)) * innerW;
        const y = padding.top + innerH - (v / maxVal) * innerH;
        return `${x},${y}`;
    }).join(' ');
    const areaPoints = `${padding.left},${padding.top + innerH} ${points} ${padding.left + innerW},${padding.top + innerH}`;
    const gradId = `sdm-grad-${color.replace('#', '')}`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#${gradId})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {labels.length > 0 && (
                <text x={padding.left + innerW / 2} y={h - 4} textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.6">
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
                    <span style={{ fontSize: '0.75rem', width: '5.5rem', color: 'var(--mca-on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
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

export default function SdmDashboard({
    applicantsCount = 0,
    interviewsCount = 0,
    personnelInWaitingCount = 0,
    greeting = 'Good morning',
    recentActivity = [],
    charts = null,
    departmentName = null,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const activityList = Array.isArray(recentActivity) ? recentActivity : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={departmentName ? `SDM Dashboard – ${departmentName}` : 'SDM Dashboard'}>
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>SDM Dashboard{departmentName ? ` – ${departmentName}` : ''}</h2>
                    <p>
                        {greeting}, {auth?.name || 'Guest'}. Here&apos;s what&apos;s happening in your department.
                    </p>
                </div>

                <div className="dash-kpi-grid">
                    <Link href="/sdm/applicants" className="dash-kpi">
                        <p className="dash-kpi__label">Applicants</p>
                        <p className="dash-kpi__value">{applicantsCount}</p>
                        <p className="dash-kpi__hint">In your department</p>
                    </Link>
                    <Link href="/sdm/interviews" className="dash-kpi">
                        <p className="dash-kpi__label">Interviews</p>
                        <p className="dash-kpi__value">{interviewsCount}</p>
                        <p className="dash-kpi__hint">Scheduled & completed</p>
                    </Link>
                    <Link href="/authorised/personnel-in-waiting" className="dash-kpi">
                        <p className="dash-kpi__label">Personnel in waiting</p>
                        <p className="dash-kpi__value">{personnelInWaitingCount}</p>
                        <p className="dash-kpi__hint">Active waiting list</p>
                    </Link>
                </div>

                {charts && (
                    <div className="dash-chart-grid dash-chart-grid--2">
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by date</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <LineChart labels={charts.applicantsByDate?.labels ?? []} values={charts.applicantsByDate?.values ?? []} />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by status</h3>
                            <p className="dash-chart-card__subtitle">Department pipeline</p>
                            <div className="dash-chart-card__body">
                                <BarChart labels={charts.applicantsByStatus?.labels ?? []} values={charts.applicantsByStatus?.values ?? []} />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Interviews scheduled</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <LineChart labels={charts.interviewsScheduled?.labels ?? []} values={charts.interviewsScheduled?.values ?? []} color="#1f7a4d" />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Personnel in waiting</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <LineChart labels={charts.personnelInWaitingByDate?.labels ?? []} values={charts.personnelInWaitingByDate?.values ?? []} color="#d97706" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="dash-section-grid--2">
                    <div className="dash-panel">
                        <div className="dash-panel__head">
                            <h3>Recent activity</h3>
                            {activityList.length > 0 && <Link href="/sdm/applicants">View applicants</Link>}
                        </div>
                        <div className="dash-panel__body">
                            {activityList.length === 0 ? (
                                <p className="dash-roles__empty">No recent activity in your department.</p>
                            ) : (
                                activityList.map((item) => (
                                    <Link key={`${item.type}-${item.id}`} href={item.href || '#'} className="dash-feed-item">
                                        <span className="dash-feed-icon">
                                            <span className="material-symbols-outlined">
                                                {item.type === 'interview' ? 'event_available' : item.type === 'personnel' ? 'schedule' : 'person_add'}
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
                                <Link href="/authorised/create" className="quick-action">
                                    <span className="material-symbols-outlined">person_add</span>
                                    Add applicant
                                </Link>
                                <Link href="/authorised/personnel-in-waiting/create" className="quick-action">
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
