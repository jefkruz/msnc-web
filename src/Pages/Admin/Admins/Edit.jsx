import { useState } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import ActionButton from '../../../Components/ActionButton';
import SearchableSelect from '../../../Components/SearchableSelect';
import TitleCaseInput from '../../../Components/TitleCaseInput';
import { useCan } from '../../../lib/can';

export default function AdminsEdit({ admin, departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: admin?.name ?? '',
        username: admin?.username ?? '',
        department_id: admin?.department_id ?? '',
    });

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Edit ${admin?.name}`}>
            <div className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); put(`/administrator/admins/${admin.id}`); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <TitleCaseInput value={data.name} onChange={(val) => setData('name', val)} className="form-control" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                            <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="form-control" required />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                            <SearchableSelect
                                value={data.department_id}
                                onChange={(val) => setData('department_id', val)}
                                options={departments}
                                placeholder="All Departments"
                                error={errors.department_id}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/administrator/admins/${admin.id}`} className="btn btn-secondary">Cancel</Link>
                        <button type="submit" disabled={processing} className="btn btn-primary">Update Admin</button>
                        {can('admins.delete') && admin?.id && (
                            <ActionButton action="delete" size="" variant="danger" className="ml-auto" onClick={() => setConfirmDelete(true)} />
                        )}
                    </div>
                </form>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/admins/${admin.id}`)}
                    title="Delete Administrator"
                    message={`Are you sure you want to delete ${admin?.name}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
