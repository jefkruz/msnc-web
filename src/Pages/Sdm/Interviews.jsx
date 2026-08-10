import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ActionButton from '../../Components/ActionButton';
import { formatDisplayDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

function statusClass(s) {
    const v = (s || '').toLowerCase();
    if (v === 'scheduled') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    if (v === 'approved') return 'bg-green-500/10 text-green-500 border border-green-500/20';
    if (v === 'rejected') return 'bg-red-500/10 text-red-500 border border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
}

export default function SdmInterviews({ interviews = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const list = Array.isArray(interviews) ? interviews : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Interviews">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interviews</h2>
                </div>
                <div className="overflow-x-auto">
                    {list.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-text-muted">
                            No interviews in your department yet.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Panelists</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {list.map((inv, i) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            {inv.applicant ? (
                                                <Link href={`/authorised/view/${inv.applicant.id}`} className="block group">
                                                    <span className="text-slate-900 dark:text-white font-medium group-hover:text-primary">{inv.applicant.first_name} {inv.applicant.last_name}</span>
                                                    <span className="block text-slate-500 dark:text-text-muted text-sm mt-0.5 group-hover:text-primary/80">{inv.applicant.username ?? inv.applicant.email ?? '—'}</span>
                                                </Link>
                                            ) : (
                                                <span className="text-slate-500 dark:text-text-muted">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            {inv.applicant?.department?.name ?? '—'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            {Array.isArray(inv.panelist_names) && inv.panelist_names.length > 0 ? inv.panelist_names.join(', ') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            {formatDisplayDate(inv.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusClass(inv.status)}`}>
                                                {formatStatusLabel(inv.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionButton action="manage" href={`/authorised/manage/${inv.id}`} />
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
