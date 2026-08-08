import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import EmptyState from '../../../Components/EmptyState';
import { useState } from 'react';
import { useCan } from '../../../lib/can';
import LoginAsButton from '../../../Components/LoginAsButton';
import ActionButton, { ActionGroup } from '../../../Components/ActionButton';

export default function DirectorsIndex({ directors = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Directors">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Directors</h2>
                    {can('directors.create') && (
                    <Link
                        href="/administrator/directors/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Create Director
                    </Link>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {directors.length === 0 ? (
                        <EmptyState icon="group" title="No directors" description="Create your first director." actionLabel="Create Director" onAction={() => window.location.href = '/administrator/directors/create'} className="m-8" />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Full name</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Departments</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {directors.map((d, i) => (
                                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/administrator/directors/${d.id}`} className="font-medium text-primary hover:underline">{d.name}</Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{d.username}</td>
                                        <td className="px-6 py-4">
                                            {d.departments?.length ? d.departments.map((dept) => (
                                                <span key={dept.id} className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium mr-1 mb-1">{dept.name}</span>
                                            )) : <span className="text-text-muted">No departments</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionGroup>
                                                <ActionButton action="view" href={`/administrator/directors/${d.id}`} />
                                                {can(['directors.impersonate', 'directors.view']) && (
                                                    <LoginAsButton compact href={`/administrator/directors/${d.id}/login-as`} label={`Log in as ${d.name}`} />
                                                )}
                                                {can('directors.update') && (
                                                    <ActionButton action="edit" href={`/administrator/directors/${d.id}/edit`} />
                                                )}
                                                {can('directors.delete') && (
                                                    <ActionButton action="delete" onClick={() => setDeleteId(d.id)} />
                                                )}
                                            </ActionGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <ConfirmModal show={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { router.delete(`/administrator/directors/${deleteId}`); setDeleteId(null); } }} title="Delete Director" message="Are you sure you want to delete this director?" confirmLabel="Delete" variant="danger" />
        </Layout>
    );
}
