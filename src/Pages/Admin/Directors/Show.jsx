import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import LoginAsButton from '../../../Components/LoginAsButton';
import ActionButton from '../../../Components/ActionButton';
import { useCan } from '../../../lib/can';

export default function DirectorsShow({ director }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    if (!director) return null;
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={director.name}>
            <div className="max-w-2xl space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Director Details</h3>
                    <dl className="grid grid-cols-1 gap-3">
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Name</dt><dd className="text-slate-900 dark:text-white font-medium">{director.name}</dd></div>
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Username</dt><dd className="text-slate-900 dark:text-white">{director.username}</dd></div>
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Departments</dt><dd className="text-slate-900 dark:text-white">{director.departments?.map((d) => d.name).join(', ') || 'None'}</dd></div>
                    </dl>
                </div>
                <div className="flex flex-wrap gap-3">
                    {can(['directors.impersonate', 'directors.view']) && (
                        <LoginAsButton href={`/administrator/directors/${director.id}/login-as`} label={`Log in as ${director.name}`} />
                    )}
                    <ActionButton action="edit" href={`/administrator/directors/${director.id}/edit`} size="" variant="primary" />
                    <ActionButton action="back" href="/administrator/directors" size="" />
                    {can('directors.delete') && (
                        <ActionButton action="delete" size="" variant="danger" className="ml-auto" onClick={() => setConfirmDelete(true)} />
                    )}
                </div>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/directors/${director.id}`)}
                    title="Delete Director"
                    message={`Are you sure you want to delete ${director.name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
