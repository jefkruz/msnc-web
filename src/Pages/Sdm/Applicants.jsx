import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ActionButton from '../../Components/ActionButton';
import { formatStatusLabel } from '../../lib/formatStatus';

function statusBadgeClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('hire') || s.includes('accept')) return 'status-badge-hired';
    if (s.includes('interview')) return 'status-badge-interview';
    if (s.includes('review') || s.includes('pending')) return 'status-badge-review';
    return 'status-badge-applied';
}

export default function SdmApplicants({ applicants = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Applicants">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicants</h2>
                    <Link
                        href="/authorised/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Create Applicant
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    {applicants.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-text-muted">
                            No applicants in your department yet.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Job Family</th>
                                    <th className="px-6 py-4">Document upload</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {applicants.map((a, i) => (
                                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/authorised/view/${a.id}`} className="text-slate-900 dark:text-white font-medium hover:text-primary">
                                                {a.first_name} {a.last_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{a.username ?? '—'}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{a.department?.name ?? '—'}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{a.family?.name ?? a.category?.name ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusBadgeClass(a.status ?? 'Applied')}`}>
                                                {formatStatusLabel(a.status || 'Applied')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionButton action="view" href={`/authorised/view/${a.id}`} />
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
