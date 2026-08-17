import { useState } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import ActionButton from '../../Components/ActionButton';
import SearchableSelect from '../../Components/SearchableSelect';
import TitleCaseInput from '../../Components/TitleCaseInput';
import { useCan } from '../../lib/can';
import { TITLE_OPTIONS } from '../../lib/selectOptions';

const inputClass = 'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

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
    const fullName = [applicant?.first_name, applicant?.last_name].filter(Boolean).join(' ') || 'Applicant';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Edit ${fullName}`}>
            <div className="max-w-3xl mx-auto pb-12">
                <div className="mb-8">
                    <Link
                        href={`/authorised/view/${applicant.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to applicant
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Edit applicant
                    </h2>
                    <p className="text-slate-500 dark:text-text-muted text-sm">
                        Update personal and job details for {fullName}.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/administrator/applicants/update/${applicant.id}`);
                    }}
                    className="space-y-8"
                >
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">person</span>
                                Personal details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <SearchableSelect
                                    value={data.title}
                                    onChange={(val) => setData('title', val)}
                                    options={TITLE_OPTIONS}
                                    placeholder="Select title"
                                    error={errors.title}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>First name</label>
                                <TitleCaseInput
                                    value={data.first_name}
                                    onChange={(val) => setData('first_name', val)}
                                    className={inputClass}
                                    required
                                />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last name</label>
                                <TitleCaseInput
                                    value={data.last_name}
                                    onChange={(val) => setData('last_name', val)}
                                    className={inputClass}
                                    required
                                />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Username</label>
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
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-visible shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 rounded-t-xl">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">work</span>
                                Job details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Department</label>
                                <SearchableSelect
                                    value={data.department_id}
                                    onChange={(val) => setData('department_id', val)}
                                    options={departments}
                                    placeholder="Select department"
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.department_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job family</label>
                                <SearchableSelect
                                    value={data.nomenclature_category_id}
                                    onChange={(val) => {
                                        setData('nomenclature_category_id', val);
                                        setData('nomenclature_group_id', '');
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={families}
                                    placeholder="Select family"
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_category_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job group</label>
                                <SearchableSelect
                                    value={data.nomenclature_group_id}
                                    onChange={(val) => {
                                        setData('nomenclature_group_id', val);
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={filteredGroups}
                                    placeholder="Select group"
                                    disabled={!data.nomenclature_category_id}
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_group_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job rank</label>
                                <SearchableSelect
                                    value={data.nomenclature_rank_id}
                                    onChange={(val) => setData('nomenclature_rank_id', val)}
                                    options={filteredRanks}
                                    placeholder="Select rank"
                                    disabled={!data.nomenclature_group_id}
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_rank_id}
                                />
                            </div>
                            {isAdmin && ranks?.length > 0 && (
                                <div>
                                    <label className={labelClass}>Administrative rank</label>
                                    <SearchableSelect
                                        value={data.rank_id}
                                        onChange={(val) => setData('rank_id', val)}
                                        options={ranks}
                                        placeholder="Select administrative rank"
                                        getOptionValue={(opt) => opt.id}
                                        getOptionLabel={(opt) => opt.name}
                                        error={errors.rank_id}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={`/authorised/view/${applicant.id}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            {can('applicants.delete') && applicant?.id && (
                                <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            {processing ? 'Saving…' : 'Save changes'}
                            <span className="material-symbols-outlined text-lg">save</span>
                        </button>
                    </div>
                </form>

                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/applicants/delete/${applicant.id}`)}
                    title="Delete applicant"
                    message={`Are you sure you want to delete ${fullName}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
