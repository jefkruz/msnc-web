import { useState } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import SearchableSelect from '../../Components/SearchableSelect';
import { useCan } from '../../lib/can';

export default function ApplicantsEdit({ applicant, families = [], departments = [], ranks = [], groups = [], nomenclature_ranks = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const isAdmin = authRole === 'Administrator';
    const { data, setData, put, processing, errors } = useForm({
        title: applicant?.title ?? '',
        first_name: applicant?.first_name ?? '',
        last_name: applicant?.last_name ?? '',
        username: applicant?.username ?? '',
        phone: applicant?.phone ?? '',
        department_id: applicant?.department_id ?? '',
        nomenclature_category_id: applicant?.nomenclature_category_id ?? '',
        nomenclature_group_id: applicant?.nomenclature_group_id ?? '',
        nomenclature_rank_id: applicant?.nomenclature_rank_id ?? '',
        rank_id: applicant?.rank_id ?? '',
        date: applicant?.date ? applicant.date.split(' ')[0] : '',
    });

    const filteredGroups = groups.filter((g) => String(g.nomenclature_category_id) === String(data.nomenclature_category_id));
    const filteredRanks = nomenclature_ranks.filter((r) => String(r.nomenclature_group_id) === String(data.nomenclature_group_id));

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Edit ${applicant?.first_name} ${applicant?.last_name}`}>
            <div className="max-w-4xl">
                <form onSubmit={(e) => { e.preventDefault(); put(`/administrator/applicants/update/${applicant.id}`); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                <input type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="form-control" required />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                <input type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="form-control" required />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                                <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="form-control" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="form-control" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                <SearchableSelect
                                    value={data.department_id}
                                    onChange={(val) => setData('department_id', val)}
                                    options={departments}
                                    placeholder="Select department"
                                    error={errors.department_id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Family</label>
                                <SearchableSelect
                                    value={data.nomenclature_category_id}
                                    onChange={(val) => {
                                        setData('nomenclature_category_id', val);
                                        setData('nomenclature_group_id', '');
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={families}
                                    placeholder="Select family"
                                    error={errors.nomenclature_category_id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Group</label>
                                <SearchableSelect
                                    value={data.nomenclature_group_id}
                                    onChange={(val) => {
                                        setData('nomenclature_group_id', val);
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={filteredGroups}
                                    placeholder="Select group"
                                    disabled={!data.nomenclature_category_id}
                                    error={errors.nomenclature_group_id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Rank</label>
                                <SearchableSelect
                                    value={data.nomenclature_rank_id}
                                    onChange={(val) => setData('nomenclature_rank_id', val)}
                                    options={filteredRanks}
                                    placeholder="Select rank"
                                    disabled={!data.nomenclature_group_id}
                                    error={errors.nomenclature_rank_id}
                                />
                            </div>
                            {isAdmin && ranks?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Administrative rank</label>
                                    <SearchableSelect
                                        value={data.rank_id}
                                        onChange={(val) => setData('rank_id', val)}
                                        options={ranks}
                                        placeholder="Select administrative rank"
                                        error={errors.rank_id}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/authorised/view/${applicant.id}`} className="btn btn-secondary">Cancel</Link>
                        <button type="submit" disabled={processing} className="btn btn-primary">Update Applicant</button>
                        {can('applicants.delete') && applicant?.id && (
                            <button type="button" className="btn btn-danger ml-auto" onClick={() => setConfirmDelete(true)}>Delete</button>
                        )}
                    </div>
                </form>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/applicants/delete/${applicant.id}`)}
                    title="Delete applicant"
                    message="Are you sure you want to delete this applicant? This cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
