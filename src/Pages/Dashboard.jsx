import { usePage, Link } from '@inertiajs/react';
import Layout from '../Components/Layout';
import DashKpiGrid from '../Components/DashKpiGrid';
import { AreaChart, StatBars } from '../Components/Charts';

export default function Dashboard({
    applicants = 0,
    interviews = 0,
    personnelInWaiting = 0,
    users = 0,
    stakeholders = 0,
    postingRecommendations = 0,
    greeting = 'Good morning',
    charts = null,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const isAdmin = authRole === 'Administrator';
    const chartData = charts && isAdmin ? charts : null;
    const org = appName === 'AMDL' ? 'AMDL' : appName?.includes('MSNC') ? 'MSNC' : appName;

    const kpis = [
        { label: 'Applicants', href: '/administrator/applicants', value: applicants, hint: 'All applications', icon: 'group' },
        { label: 'Users', href: '/administrator/tbl-users', value: users, hint: 'Staff records', icon: 'badge' },
        { label: 'Personnel in waiting', href: '/authorised/personnel-in-waiting', value: personnelInWaiting, hint: 'Active waiting list', icon: 'hourglass_top' },
        { label: 'Interviews', href: '/administrator/interviews', value: interviews, hint: 'Scheduled & completed', icon: 'event_available' },
        { label: 'Posting recommendations', href: '/administrator/posting-recommendations', value: postingRecommendations, hint: 'Placement recommendations', icon: 'recommend' },
        { label: 'Administration', href: '/administrator/menu', value: 5, hint: 'Setup & catalogues', icon: 'admin_panel_settings' },
        { label: 'Stakeholders', href: '/administrator/stakeholders', value: stakeholders, hint: 'SDMs, panelists, directors & admins', icon: 'groups' },
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

                <DashKpiGrid items={kpis} />

                {chartData && (
                    <div className="dash-chart-grid dash-chart-grid--2">
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Applicants by date</h3>
                            <p className="dash-chart-card__subtitle">Last 30 days</p>
                            <div className="dash-chart-card__body">
                                <AreaChart
                                    labels={chartData.applicantsByDate?.labels ?? []}
                                    values={chartData.applicantsByDate?.values ?? []}
                                />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Personnel in waiting</h3>
                            <p className="dash-chart-card__subtitle">By status</p>
                            <div className="dash-chart-card__body dash-chart-card__body--bars">
                                <StatBars
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
                                <AreaChart
                                    labels={chartData.interviewsScheduled?.labels ?? []}
                                    values={chartData.interviewsScheduled?.values ?? []}
                                    color="#1f7a4d"
                                />
                            </div>
                        </div>
                        <div className="dash-chart-card">
                            <h3 className="dash-chart-card__title">Users by year</h3>
                            <p className="dash-chart-card__subtitle">Staff inventory</p>
                            <div className="dash-chart-card__body dash-chart-card__body--bars">
                                <StatBars
                                    labels={chartData.usersByYear?.labels ?? []}
                                    values={chartData.usersByYear?.values ?? []}
                                    color="#2748c7"
                                />
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
                            <Link href="/administrator/applicants/create" className="quick-action">
                                <span className="material-symbols-outlined">person_add</span>
                                Add applicant
                            </Link>
                            <Link href="/administrator/interviews/create" className="quick-action">
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
        </Layout>
    );
}
