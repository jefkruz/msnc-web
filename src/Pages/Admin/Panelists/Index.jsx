import { Link, usePage, router, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Modal from '../../../Components/Modal';
import ConfirmModal from '../../../Components/ConfirmModal';
import EmptyState from '../../../Components/EmptyState';
import SearchableSelect from '../../../Components/SearchableSelect';
import TitleCaseInput from '../../../Components/TitleCaseInput';
import ActionButton, { ActionGroup } from '../../../Components/ActionButton';
import { useState } from 'react';

export default function PanelistsIndex({ panelists = [], departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        department_id: '',
    });
    const departmentOptions = Array.isArray(departments) ? departments : [];

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post('/administrator/panelists', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Panelists">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Panelists</h2>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-lg">add</span> Create Panelist
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {panelists.length === 0 ? (
                        <EmptyState icon="group" title="No panelists" description="Create your first panelist." actionLabel="Create Panelist" onAction={() => setShowModal(true)} className="m-8" />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {panelists.map((p, i) => (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4"><Link href={`/administrator/panelists/${p.id}`} className="font-medium text-primary hover:underline">{p.name}</Link></td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{p.username}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{p.department?.name ?? '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionGroup>
                                                <ActionButton action="view" href={`/administrator/panelists/${p.id}`} />
                                                <ActionButton action="edit" href={`/administrator/panelists/${p.id}/edit`} />
                                                <ActionButton action="delete" onClick={() => setDeleteId(p.id)} />
                                            </ActionGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Create Panelist"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        <button type="submit" form="panelist-create" className="btn btn-primary" disabled={processing}>Create Panelist</button>
                    </>
                )}
            >
                <form id="panelist-create" onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <TitleCaseInput
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            className="form-control"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="form-control"
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <SearchableSelect
                            value={data.department_id}
                            onChange={(v) => setData('department_id', v)}
                            options={departmentOptions}
                            placeholder="Select department"
                            required
                            getOptionValue={(d) => d.id}
                            getOptionLabel={(d) => d.name}
                            error={errors.department_id}
                        />
                    </div>
                </form>
            </Modal>

            <ConfirmModal show={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { router.delete(`/administrator/panelists/${deleteId}`); setDeleteId(null); } }} title="Delete Panelist" message="Are you sure you want to delete this panelist?" confirmLabel="Delete" variant="danger" />
        </Layout>
    );
}
