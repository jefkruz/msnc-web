import { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Modal from '../../../Components/Modal';
import ConfirmModal from '../../../Components/ConfirmModal';
import EmptyState from '../../../Components/EmptyState';
import SearchableSelect from '../../../Components/SearchableSelect';
import TitleCaseInput from '../../../Components/TitleCaseInput';
import ActionButton, { ActionGroup } from '../../../Components/ActionButton';
import { useCan } from '../../../lib/can';
import { departmentName, personName } from '../../../lib/titleCase';

export default function AdminsIndex({ admins = [], departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        department_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/administrator/admins', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Administrators">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Administrators</h2>
                    <div className="flex gap-2">
                        {can('admins.create') && (
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create Admin
                        </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {admins.length === 0 ? (
                        <EmptyState
                            icon="person_add"
                            title="No administrators"
                            description="Create your first administrator."
                            actionLabel="Create Admin"
                            onAction={() => setShowModal(true)}
                            className="m-8"
                        />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Full name</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {admins.map((admin, i) => (
                                    <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/administrator/admins/${admin.id}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {personName(admin.name)}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{admin.username}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            {admin.department ? departmentName(admin.department) : 'ALL'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionGroup>
                                                <ActionButton action="view" href={`/administrator/admins/${admin.id}`} />
                                                {can('admins.update') && (
                                                    <ActionButton action="edit" href={`/administrator/admins/${admin.id}/edit`} />
                                                )}
                                                {can('admins.delete') && (
                                                    <ActionButton action="delete" onClick={() => setDeleteId(admin.id)} />
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

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Create Administrator"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        <button type="submit" form="admin-create" className="btn btn-primary" disabled={processing}>Create Admin</button>
                    </>
                )}
            >
                <form id="admin-create" onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-sm font-medium mb-1">KingsChat Username</label>
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
                            onChange={(val) => setData('department_id', val)}
                            options={departments}
                            placeholder="All Departments"
                            error={errors.department_id}
                        />
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`/administrator/admins/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete Administrator"
                message="Are you sure you want to delete this administrator?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
