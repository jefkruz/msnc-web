import { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import SearchableSelect from '../../../Components/SearchableSelect';
import { useCan } from '../../../lib/can';

const inputClass = 'form-control';

export default function PanelistsEdit({ panelist, departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: panelist?.name ?? '',
        username: panelist?.username ?? '',
        department_id: panelist?.department_id != null ? String(panelist.department_id) : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/administrator/panelists/${panelist.id}`, { preserveScroll: true });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Edit Panelist">
            <div className="max-w-xl mx-auto space-y-6">
                <Link
                    href="/administrator/panelists"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Panelists
                </Link>
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Edit Panelist</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                            <SearchableSelect
                                value={data.department_id}
                                onChange={(v) => setData('department_id', v)}
                                options={departments}
                                placeholder="Select department"
                                required
                                getOptionValue={(d) => d.id}
                                getOptionLabel={(d) => d.name}
                                error={errors.department_id}
                            />
                            {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pt-4">
                            <Link href="/administrator/panelists" className="btn btn-secondary">Cancel</Link>
                            <button type="submit" disabled={processing} className="btn btn-primary">Update Panelist</button>
                            {can('panelists.delete') && panelist?.id && (
                                <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Delete</button>
                            )}
                        </div>
                    </form>
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
