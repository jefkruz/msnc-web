import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

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
                <div className="dash-kpi-grid">
                    <div className="dash-kpi">
                        <p className="dash-kpi__label">Applicants</p>
                        <p className="dash-kpi__value">{applicants}</p>
                    </div>
                    <div className="dash-kpi">
                        <p className="dash-kpi__label">Interviews</p>
                        <p className="dash-kpi__value">{interviews}</p>
                    </div>
                    <div className="dash-kpi">
                        <p className="dash-kpi__label">Directors</p>
                        <p className="dash-kpi__value">{directors}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Quick links</h3>
                    </div>
                    <div className="card-body">
                        <Link href="/viewsdirector" className="btn btn-outline-primary btn-sm">
                            <span className="material-symbols-outlined">folder_open</span>
                            View director documents
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
