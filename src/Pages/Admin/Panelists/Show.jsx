import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import { useCan } from '../../../lib/can';

export default function PanelistsShow({ panelist }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={panelist?.name ?? 'Panelist'}>
            <div className="max-w-xl mx-auto space-y-6">
                <Link href="/administrator/panelists" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Panelists
                </Link>
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{panelist?.name ?? '—'}</h2>
                    <dl className="space-y-2 text-sm">
                        <div><dt className="text-slate-500 dark:text-text-muted">Username</dt><dd className="text-slate-900 dark:text-white font-medium">{panelist?.username ?? '—'}</dd></div>
                        <div><dt className="text-slate-500 dark:text-text-muted">Department</dt><dd className="text-slate-900 dark:text-white font-medium">{panelist?.department?.name ?? '—'}</dd></div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={`/administrator/panelists/${panelist?.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit Panelist
                        </Link>
                        {can('panelists.delete') && panelist?.id && (
                            <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Delete</button>
                        )}
                    </div>
                </div>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/panelists/${panelist.id}`)}
                    title="Delete Panelist"
                    message={`Are you sure you want to delete ${panelist?.name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
