import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function PanelistDashboard({ stats = {} }) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Panelist Dashboard">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Panelist Dashboard</h2>
                    <p>{auth?.name ? `Welcome, ${auth.name}.` : 'Welcome.'} Your interviews and recommendations.</p>
                </div>
                <div className="dash-kpi-grid">
                    <Link href="/panelist/interviews" className="dash-kpi">
                        <span className="dash-kpi__icon" aria-hidden="true">
                            <span className="material-symbols-outlined">event_available</span>
                        </span>
                        <div className="dash-kpi__content">
                            <p className="dash-kpi__label">My interviews</p>
                            <p className="dash-kpi__value">{stats.interviews ?? 0}</p>
                            <p className="dash-kpi__hint">Assigned panels</p>
                        </div>
                    </Link>
                    <Link href="/panelist/recommendations" className="dash-kpi">
                        <span className="dash-kpi__icon" aria-hidden="true">
                            <span className="material-symbols-outlined">rate_review</span>
                        </span>
                        <div className="dash-kpi__content">
                            <p className="dash-kpi__label">Recommendations</p>
                            <p className="dash-kpi__value">{stats.recommendations ?? 0}</p>
                            <p className="dash-kpi__hint">Submitted reviews</p>
                        </div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
