import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function TblUsersIndex({ years = [], totalUsers = 0, tableMissing = false }) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Users">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Users</h2>
                    <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                        Browse users by year. {tableMissing ? '' : `${totalUsers.toLocaleString()} total.`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {years.map((y) => {
                            const label = y.label || String(y.year);
                            return (
                                <Link
                                    key={y.year}
                                    href={`/administrator/tbl-users/year/${y.year}`}
                                    className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                            <span className="material-symbols-outlined">calendar_month</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                                            arrow_forward
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-text-muted text-sm font-medium">{label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                        {Number(y.total).toLocaleString()}
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-text-muted mt-1">
                                        {Number(y.total) === 1 ? 'user' : 'users'}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
