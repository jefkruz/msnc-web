import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import { useCan } from '../../../lib/can';

export default function AdminsShow({ admin }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    if (!admin) return null;
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={admin.name}>
            <div className="max-w-2xl space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Administrator Details</h3>
                    <dl className="grid grid-cols-1 gap-3">
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Name</dt><dd className="text-slate-900 dark:text-white font-medium">{admin.name}</dd></div>
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Username</dt><dd className="text-slate-900 dark:text-white">{admin.username}</dd></div>
                        <div><dt className="text-xs font-medium text-text-muted uppercase">Department</dt><dd className="text-slate-900 dark:text-white">{admin.department?.name ?? 'ALL'}</dd></div>
                    </dl>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href={`/administrator/admins/${admin.id}/edit`} className="btn btn-primary">Edit</Link>
                    <Link href="/administrator/admins" className="btn btn-secondary">Back to list</Link>
                    {can('admins.delete') && (
                        <button type="button" className="btn btn-danger ml-auto" onClick={() => setConfirmDelete(true)}>Delete</button>
                    )}
                </div>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/admins/${admin.id}`)}
                    title="Delete Administrator"
                    message={`Are you sure you want to delete ${admin.name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
