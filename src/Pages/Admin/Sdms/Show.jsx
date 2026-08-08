import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import LoginAsButton from '../../../Components/LoginAsButton';
import ActionButton from '../../../Components/ActionButton';
import { useCan } from '../../../lib/can';

export default function SdmsShow({ sdm }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={sdm?.name ?? 'SDM'}>
            <div className="max-w-xl mx-auto space-y-6">
                <Link href="/administrator/sdms" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to SDMs
                </Link>
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{sdm?.name ?? '—'}</h2>
                    <dl className="space-y-2 text-sm">
                        <div><dt className="text-slate-500 dark:text-text-muted">Username</dt><dd className="text-slate-900 dark:text-white font-medium">{sdm?.username ?? '—'}</dd></div>
                        <div><dt className="text-slate-500 dark:text-text-muted">Department</dt><dd className="text-slate-900 dark:text-white font-medium">{sdm?.department?.name ?? '—'}</dd></div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {can(['sdms.impersonate', 'sdms.view']) && sdm?.id && (
                            <LoginAsButton href={`/administrator/sdms/${sdm.id}/login-as`} label={`Log in as ${sdm.name || 'SDM'}`} />
                        )}
                        <ActionButton action="edit" href={`/administrator/sdms/${sdm?.id}/edit`} size="" variant="primary" label="Edit SDM" />
                        {can('sdms.delete') && sdm?.id && (
                            <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                        )}
                    </div>
                </div>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/sdms/${sdm.id}`)}
                    title="Delete SDM"
                    message={`Are you sure you want to delete ${sdm?.name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
