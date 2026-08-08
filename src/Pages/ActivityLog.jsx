import { Link, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';
import EmptyState from '../Components/EmptyState';

const icons = {
    interview: 'event_available',
    personnel: 'schedule',
    applicant: 'person_add',
};

export default function ActivityLog({ items = [], subtitle = null }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const list = Array.isArray(items) ? items : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Activity Log">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Activity Log</h2>
                    <p>{subtitle || 'Recent applications, interviews, and personnel updates.'}</p>
                </div>

                <div className="dash-panel">
                    <div className="dash-panel__head">
                        <h3>Latest activity</h3>
                    </div>
                    <div className="dash-panel__body">
                        {list.length === 0 ? (
                            <EmptyState
                                icon="history"
                                title="No activity yet"
                                description="New applications, scheduled interviews, and personnel in waiting will appear here."
                                className="m-4"
                            />
                        ) : (
                            list.map((item) => (
                                <Link key={`${item.type}-${item.id}`} href={item.href || '#'} className="dash-feed-item">
                                    <span className="dash-feed-icon">
                                        <span className="material-symbols-outlined">{icons[item.type] || 'circle'}</span>
                                    </span>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--mca-on-surface-variant)' }}>{item.description}</div>
                                        {item.time_ago && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--mca-on-surface-variant)', marginTop: 4 }}>
                                                {item.time_ago}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
