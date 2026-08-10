import { usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import DashKpiGrid from '../../Components/DashKpiGrid';

export default function TblUsersIndex({ years = [], totalUsers = 0, tableMissing = false }) {
    const { auth, authRole, menu, appName } = usePage().props;

    const cards = (Array.isArray(years) ? years : []).map((y) => {
        const total = Number(y.total) || 0;
        return {
            id: String(y.year),
            label: y.label || String(y.year),
            value: total,
            hint: total === 1 ? 'user' : 'users',
            icon: 'calendar_month',
            href: `/administrator/tbl-users/year/${y.year}`,
        };
    });

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Users">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Users</h2>
                    <p>
                        Browse users by year.{tableMissing ? '' : ` ${Number(totalUsers).toLocaleString()} total.`}
                    </p>
                </div>

                {tableMissing ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-amber-800 dark:text-amber-200 text-sm">
                        <p className="font-semibold mb-2">Table <code>tbl_users</code> is not imported yet.</p>
                        <p>On the server, run:</p>
                        <pre className="mt-2 p-3 rounded-lg bg-white/60 dark:bg-black/30 text-xs overflow-x-auto">php artisan tbl-users:import --force</pre>
                    </div>
                ) : years.length === 0 ? (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-12 text-center text-slate-500 dark:text-text-muted text-sm">
                        No users found.
                    </div>
                ) : (
                    <DashKpiGrid items={cards} />
                )}
            </div>
        </Layout>
    );
}
