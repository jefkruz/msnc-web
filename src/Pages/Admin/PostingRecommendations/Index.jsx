import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import EmptyState from '../../../Components/EmptyState';
import { useCan } from '../../../lib/can';

export default function PostingRecommendationsIndex({ postingRecommendations = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);

    const list = Array.isArray(postingRecommendations) ? postingRecommendations : [];

    const applicantName = (r) => {
        const a = r.applicant;
        if (!a) return '—';
        return [a.title, a.first_name, a.last_name].filter(Boolean).join(' ') || '—';
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Posting Recommendations">
            <div className="space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Posting Recommendations</h2>
                            <p className="text-sm text-text-muted mt-0.5">
                                Manage posting recommendation memos (based on the template).
                            </p>
                        </div>
                        <Link
                            href="/administrator/posting-recommendations/create"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 w-full sm:w-auto shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        {list.length === 0 ? (
                            <EmptyState
                                icon="recommend"
                                title="No posting recommendations"
                                description="Create a posting recommendation for an applicant."
                                actionLabel="Create"
                                onAction={() => (window.location.href = '/administrator/posting-recommendations/create')}
                                className="m-8"
                            />
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[400px]">
                                <thead>
                                    <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-4 sm:px-6 py-3">#</th>
                                        <th className="px-4 sm:px-6 py-3">Applicant</th>
                                        <th className="px-4 sm:px-6 py-3">Re / Subject</th>
                                        <th className="px-4 sm:px-6 py-3">Memo date</th>
                                        <th className="px-4 sm:px-6 py-3 text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {list.map((r, i) => (
                                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300 tabular-nums">{i + 1}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-900 dark:text-white font-medium">{applicantName(r)}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{r.memo_re || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300">{r.memo_date ? new Date(r.memo_date).toLocaleDateString() : '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-right">
                                                <Link
                                                    href={`/administrator/posting-recommendations/edit/${r.id}`}
                                                    className="p-2 rounded-lg hover:bg-primary/10 text-primary inline-flex mr-1"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </Link>
                                                {can('posting-recommendations.delete') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteId(r.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 inline-flex"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`/administrator/posting-recommendations/delete/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete posting recommendation"
                message="Are you sure you want to delete this posting recommendation?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
