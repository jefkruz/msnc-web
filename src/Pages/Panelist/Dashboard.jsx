import { usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import DashKpiGrid from '../../Components/DashKpiGrid';

export default function PanelistDashboard({ stats = {} }) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Panelist Dashboard">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Panelist Dashboard</h2>
                    <p>{auth?.name ? `Welcome, ${auth.name}.` : 'Welcome.'} Your interviews and recommendations.</p>
                </div>
                <DashKpiGrid
                    items={[
                        { label: 'My interviews', href: '/panelist/interviews', value: stats.interviews ?? 0, hint: 'Assigned panels', icon: 'event_available' },
                        { label: 'Recommendations', href: '/panelist/recommendations', value: stats.recommendations ?? 0, hint: 'Submitted reviews', icon: 'rate_review' },
                    ]}
                />
            </div>
        </Layout>
    );
}
