import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import EmptyState from '../../Components/EmptyState';

export default function PanelistInterviewsIndex({ interviews = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const list = Array.isArray(interviews) ? interviews : [];
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="My Interviews">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interview Panel</h2>
                </div>
                <div className="overflow-x-auto">
                    {list.length === 0 ? (
                        <EmptyState icon="event_busy" title="No interviews" description="You have no interviews assigned." className="m-8" />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {list.map((inv, i) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{inv.applicant?.first_name} {inv.applicant?.last_name}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{inv.date ? new Date(inv.date).toLocaleString() : '—'}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{inv.status ?? '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/panelist/interview/${inv.id}/manage`} className="p-2 rounded-lg hover:bg-primary/10 text-primary inline-flex"><span className="material-symbols-outlined">visibility</span></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}
