import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';
import { TITLE_OPTIONS } from '../../lib/selectOptions';

const inputClass =
    'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

export default function Create({ families = [], departments = [], groups = [], nomenclature_ranks = [], ranks = [], errors: pageErrors = {} }) {
    const { auth, authRole, menu, appName, errors: inertiaErrors } = usePage().props;
    const errors = inertiaErrors ?? pageErrors ?? {};
    const [submitting, setSubmitting] = useState(false);
    const isSdm = authRole === 'SDM';
    const defaultDepartmentId = isSdm && auth?.department_id ? String(auth.department_id) : '';
    const { data, setData } = useForm({
        title: '',
        first_name: '',
        last_name: '',
        username: '',
        phone: '',
        date: '',
        nomenclature_category_id: '',
        nomenclature_group_id: '',
        nomenclature_rank_id: '',
        department_id: defaultDepartmentId,
        rank_id: '',
    });

    const filteredGroups = groups.filter(
        (g) => String(g.nomenclature_category_id) === String(data.nomenclature_category_id)
    );
    const filteredNomenclatureRanks = nomenclature_ranks.filter(
        (r) => String(r.nomenclature_group_id) === String(data.nomenclature_group_id)
    );

    const submitUrl = isSdm ? '/authorised/store' : '/administrator/applicants/create';
    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data };
        if (payload.date) {
            payload.date = new Date(payload.date).getTime();
        }
        setSubmitting(true);
        router.post(submitUrl, payload, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <Layout
            auth={auth}
            authRole={authRole}
            menu={menu}
            appName={appName}
            pageTitle="Add New Applicant"
        >
            <div className="max-w-3xl mx-auto pb-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Add New Applicant
                    </h2>
                    <p className="text-slate-500 dark:text-text-muted text-sm">
                        Enter the required details to create an applicant. More details can be added after creation.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Personal details (required) */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">person</span>
                                Personal details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                                <SearchableSelect
                                    value={data.title}
                                    onChange={(val) => setData('title', val)}
                                    options={TITLE_OPTIONS}
                                    placeholder="Select title"
                                    required
                                    error={errors.title}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>First name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="e.g. John"
                                    className={inputClass}
                                    required
                                />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="e.g. Doe"
                                    className={inputClass}
                                    required
                                />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Username"
                                    className={inputClass}
                                    required
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="e.g. +1 555 000 0000"
                                    className={inputClass}
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Job details (required) - overflow-visible so SearchableSelect dropdowns can extend outside */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-visible shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 rounded-t-xl">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">work</span>
                                Job details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Job family <span className="text-red-500">*</span></label>
                                <SearchableSelect
                                    value={data.nomenclature_category_id}
                                    onChange={(val) => {
                                        setData('nomenclature_category_id', val);
                                        setData('nomenclature_group_id', '');
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={families}
                                    placeholder="Select family"
                                    required
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_category_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job group <span className="text-red-500">*</span></label>
                                <SearchableSelect
                                    value={data.nomenclature_group_id}
                                    onChange={(val) => {
                                        setData('nomenclature_group_id', val);
                                        setData('nomenclature_rank_id', '');
                                    }}
                                    options={filteredGroups}
                                    placeholder="Select group"
                                    disabled={!data.nomenclature_category_id}
                                    required
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_group_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job rank <span className="text-red-500">*</span></label>
                                <SearchableSelect
                                    value={data.nomenclature_rank_id}
                                    onChange={(val) => setData('nomenclature_rank_id', val)}
                                    options={filteredNomenclatureRanks}
                                    placeholder="Select rank"
                                    disabled={!data.nomenclature_group_id}
                                    required
                                    getOptionValue={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.name}
                                    error={errors.nomenclature_rank_id}
                                />
                            </div>
                            {!isSdm && ranks?.length > 0 && (
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
                            {!isSdm && (
                                <div>
                                    <label className={labelClass}>Department <span className="text-red-500">*</span></label>
                                    <SearchableSelect
                                        value={data.department_id}
                                        onChange={(val) => setData('department_id', val)}
                                        options={departments}
                                        placeholder="Select department"
                                        required
                                        getOptionValue={(opt) => opt.id}
                                        getOptionLabel={(opt) => opt.name}
                                        error={errors.department_id}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                        <Link
                            href="/administrator/applicants"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to applicants
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            Create applicant
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
