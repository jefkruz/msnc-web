import { useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import SearchableSelect from '../../Components/SearchableSelect';
import TitleCaseInput from '../../Components/TitleCaseInput';
import { departmentName } from '../../lib/titleCase';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';

const COMPANY_OPTIONS = [{ value: 'AMDL', label: 'AMDL' }, { value: 'MSNC', label: 'MSNC' }];

export default function DepartmentsIndex({ regionId, departments = [], regionName = 'Departments' }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editDept, setEditDept] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');

    const filteredDepartments = departments.filter((d) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (d.name ?? '').toLowerCase().includes(q) || (d.company ?? '').toLowerCase().includes(q);
    });
    const { data, setData, post, processing, errors, reset, transform } = useForm({ name: '', company: 'AMDL' });
    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({ name: '', company: 'AMDL', region_id: regionId });

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((formData) => ({ ...formData, region_id: regionId }));
        post('/administrator/departments/store', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset({ name: '', company: 'AMDL' });
            },
        });
    };

    const openEdit = (d) => {
        setEditDept(d);
        setEditData({ name: d.name ?? '', company: d.company ?? 'AMDL', region_id: regionId });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editDept?.id) return;
        putEdit(`/administrator/departments/update/${editDept.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDept(null);
                resetEdit({ name: '', company: 'AMDL', region_id: regionId });
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={regionName}>
            <div className="space-y-4">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{regionName}</h2>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-56 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button type="button" onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">add</span> Add Department
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {departments.length === 0 ? (
                        <EmptyState icon="apartment" title="No departments" description="Add a department." actionLabel="Add Department" onAction={() => setShowModal(true)} className="m-8" />
                    ) : filteredDepartments.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-text-muted text-sm">No departments match your search.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Applicants</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {filteredDepartments.map((d, i) => (
                                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{departmentName(d)}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{d.company ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/administrator/applicants/staff?department_id=${d.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                                title={`View applicants in ${departmentName(d)}`}
                                            >
                                                {d.applicants_count ?? 0} staff
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionGroup>
                                                <ActionButton action="edit" onClick={() => openEdit(d)} />
                                                <ActionButton action="delete" onClick={() => setDeleteId(d.id)} />
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
                title="Add Department"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        <button type="submit" form="department-create" className="btn btn-primary" disabled={processing}>Add</button>
                    </>
                )}
            >
                <form id="department-create" onSubmit={handleSubmit} className="space-y-4">
                    {errors?.error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {errors.error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <TitleCaseInput value={data.name} onChange={(val) => setData('name', val)} className="form-control" required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <SearchableSelect
                            value={data.company}
                            onChange={(val) => setData('company', val)}
                            options={COMPANY_OPTIONS}
                            placeholder="Select company"
                            required
                            error={errors.company}
                        />
                    </div>
                </form>
            </Modal>
            <Modal
                show={!!editDept}
                onClose={() => { setEditDept(null); resetEdit(); }}
                title="Edit Department"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditDept(null); resetEdit(); }}>Close</button>
                        <button type="submit" form="department-edit" className="btn btn-primary" disabled={editProcessing}>Save</button>
                    </>
                )}
            >
                <form id="department-edit" onSubmit={handleEditSubmit} className="space-y-4">
                    {editErrors?.error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {editErrors.error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <TitleCaseInput value={editData.name} onChange={(val) => setEditData('name', val)} className="form-control" required />
                        {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <SearchableSelect
                            value={editData.company}
                            onChange={(val) => setEditData('company', val)}
                            options={COMPANY_OPTIONS}
                            placeholder="Select company"
                            required
                            error={editErrors.company}
                        />
                    </div>
                </form>
            </Modal>
            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (!deleteId) return;
                    router.delete(`/administrator/departments/delete/${deleteId}?region_id=${encodeURIComponent(regionId ?? '')}`, {
                        preserveScroll: true,
                    });
                    setDeleteId(null);
                }}
                title="Delete Department"
                message="Are you sure you want to delete this department?"
                confirmLabel="Delete"
                variant="danger"
            />
            </div>
        </Layout>
    );
}
