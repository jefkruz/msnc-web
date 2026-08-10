import { Link, router, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ActionButton from '../../Components/ActionButton';

export default function TblUsersYear({ year, yearLabel, users = {}, search: initialSearch = '' }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const rows = users?.data ?? [];
    const links = users?.links ?? [];

    const handleSearch = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        router.get(
            `/administrator/tbl-users/year/${year}`,
            q ? { search: q } : {},
            { preserveState: false }
        );
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Users ${yearLabel}`}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Link
                            href="/administrator/tbl-users"
                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-text-muted hover:text-primary mb-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            All years
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Users — {yearLabel}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                            {(users?.total ?? rows.length).toLocaleString()} user{(users?.total ?? rows.length) === 1 ? '' : 's'}
                        </p>
                    </div>
                    <form onSubmit={handleSearch} className="relative min-w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
                        <input
                            type="text"
                            name="search"
                            defaultValue={initialSearch}
                            placeholder="Search name, email, userID, phone..."
                            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white"
                        />
                    </form>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        {rows.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 dark:text-text-muted text-sm">
                                {initialSearch ? 'No users match your search.' : 'No users for this year.'}
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[720px]">
                                <thead>
                                    <tr className="text-slate-500 dark:text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-4 sm:px-6 py-3">#</th>
                                        <th className="px-4 sm:px-6 py-3">Name</th>
                                        <th className="px-4 sm:px-6 py-3">Email</th>
                                        <th className="px-4 sm:px-6 py-3">User ID</th>
                                        <th className="px-4 sm:px-6 py-3">Phone</th>
                                        <th className="px-4 sm:px-6 py-3">Enabled</th>
                                        <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {rows.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="px-4 sm:px-6 py-3 text-sm text-slate-600 dark:text-slate-300">{u.id}</td>
                                            <td className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-900 dark:text-white">{u.full_name || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-sm text-slate-700 dark:text-slate-300">{u.emailAddress || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-sm text-slate-700 dark:text-slate-300">{u.userID || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-sm text-slate-700 dark:text-slate-300">{u.phoneNum || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-sm">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.enabled === '1' || u.enabled === 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                    {u.enabled === '1' || u.enabled === 1 ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 text-right">
                                                <ActionButton action="view" href={`/administrator/tbl-users/${u.id}`} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {links.length > 3 && (
                        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-border-dark flex flex-wrap gap-2">
                            {links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
