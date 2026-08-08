import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { AreaChart, StatBars } from '../../Components/Charts';

export default function SdmDashboard({
    applicantsCount = 0,
    interviewsCount = 0,
    personnelInWaitingCount = 0,
    greeting = 'Good morning',
    charts = null,
    departmentName = null,
}) {
    const { auth, authRole, menu, appName } = usePage().props;

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
                        <span className="dash-kpi__icon" aria-hidden="true">
                            <span className="material-symbols-outlined">group</span>
                        </span>
                        <div className="dash-kpi__content">
                            <p className="dash-kpi__label">Applicants</p>
                            <p className="dash-kpi__value">{applicantsCount}</p>
                            <p className="dash-kpi__hint">In your department</p>
                        </div>
                    </Link>
                    <Link href="/sdm/interviews" className="dash-kpi">
                        <span className="dash-kpi__icon" aria-hidden="true">
                            <span className="material-symbols-outlined">event_available</span>
                        </span>
                        <div className="dash-kpi__content">
                            <p className="dash-kpi__label">Interviews</p>
                            <p className="dash-kpi__value">{interviewsCount}</p>
                            <p className="dash-kpi__hint">Scheduled & completed</p>
                        </div>
                    </Link>
                    <Link href="/authorised/personnel-in-waiting" className="dash-kpi">
                        <span className="dash-kpi__icon" aria-hidden="true">
                            <span className="material-symbols-outlined">hourglass_top</span>
                        </span>
                        <div className="dash-kpi__content">
                            <p className="dash-kpi__label">Personnel in waiting</p>
                            <p className="dash-kpi__value">{personnelInWaitingCount}</p>
                            <p className="dash-kpi__hint">Active waiting list</p>
                        </div>
                    </Link>
                </div>

                {charts && (
                    <div className="dash-chart-grid dash-chart-grid--2">
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by date</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <AreaChart labels={charts.applicantsByDate?.labels ?? []} values={charts.applicantsByDate?.values ?? []} />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by status</h3>
                            <p className="dash-chart-card__subtitle">Department pipeline</p>
                            <div className="dash-chart-card__body dash-chart-card__body--bars">
                                <StatBars labels={charts.applicantsByStatus?.labels ?? []} values={charts.applicantsByStatus?.values ?? []} />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Interviews scheduled</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <AreaChart labels={charts.interviewsScheduled?.labels ?? []} values={charts.interviewsScheduled?.values ?? []} color="#1f7a4d" />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Personnel in waiting</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <AreaChart labels={charts.personnelInWaitingByDate?.labels ?? []} values={charts.personnelInWaitingByDate?.values ?? []} color="#d97706" />
                            </div>
                        </div>
                    </div>
                )}

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
        </Layout>
    );
}
