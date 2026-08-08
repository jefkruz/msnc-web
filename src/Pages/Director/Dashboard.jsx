import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import DashKpiGrid from '../../Components/DashKpiGrid';

export default function DirectorDashboard({
    applicants = 0,
    interviews = 0,
    directors = 0,
}) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Director Dashboard">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Director Dashboard</h2>
                    <p>{auth?.name ? `Welcome, ${auth.name}.` : 'Welcome.'} Overview of recruitment metrics.</p>
                </div>
                <DashKpiGrid
                    items={[
                        { label: 'Applicants', value: applicants, icon: 'group', hint: 'All applications' },
                        { label: 'Interviews', value: interviews, icon: 'event_available', hint: 'Scheduled & completed' },
                        { label: 'Directors', value: directors, icon: 'supervisor_account', hint: 'Directorate accounts' },
                    ]}
                />
                <div className="dash-panel">
                    <div className="dash-panel__head">
                        <h3>Quick links</h3>
                    </div>
                    <div className="dash-panel__body" style={{ padding: '1rem 1.25rem 1.25rem' }}>
                        <div className="quick-actions">
                            <Link href="/viewsdirector" className="quick-action">
                                <span className="material-symbols-outlined">folder_open</span>
                                View director documents
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
