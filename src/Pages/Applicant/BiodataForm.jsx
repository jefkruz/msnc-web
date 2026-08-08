import { useForm, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const inputClass =
    'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

const defaultWorkEntry = () => ({
    organisation: '',
    address: '',
    city_state: '',
    period_from: '',
    period_to: '',
    designation: '',
    monthly_package: '',
    reason_for_leaving: '',
});

const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
};

function formatBirthday(day, month) {
    if (!day || !month) return '—';
    const monthLabel = monthNames[Number(month)] || month;
    return `${day} ${monthLabel}`;
}

export default function BiodataForm({ biodata = null, applicant = null }) {
    const { auth, authRole, menu = [], appName, flash } = usePage().props;

    const workHistory = Array.isArray(biodata?.work_history) && biodata.work_history.length > 0
        ? biodata.work_history
        : [defaultWorkEntry()];

    // Title, surname (last_name), first_name, birthday come from applicant table – not edited here
    const { data, setData, post, processing, errors, progress } = useForm({
        other_names: biodata?.other_names ?? '',
        marital_status: biodata?.marital_status ?? '',
        gender: biodata?.gender ?? '',
        is_christian: biodata?.is_christian ?? null,
        born_again_when: biodata?.born_again_when ?? '',
        born_again_where: biodata?.born_again_where ?? '',
        holy_spirit_when: biodata?.holy_spirit_when ?? '',
        holy_spirit_where: biodata?.holy_spirit_where ?? '',
        joined_lw_when: biodata?.joined_lw_when ?? '',
        joined_lw_where: biodata?.joined_lw_where ?? '',
        current_assembly: biodata?.current_assembly ?? '',
        current_assembly_date_joined: biodata?.current_assembly_date_joined ?? '',
        baptized_when_where: biodata?.baptized_when_where ?? '',
        foundation_school_when_where: biodata?.foundation_school_when_where ?? '',
        referee1_name: biodata?.referee1_name ?? '',
        referee1_contact: biodata?.referee1_contact ?? '',
        referee2_name: biodata?.referee2_name ?? '',
        referee2_contact: biodata?.referee2_contact ?? '',
        work_history: workHistory,
        cv: null,
    });

    const setWorkHistory = (index, field, value) => {
        const next = [...data.work_history];
        next[index] = { ...next[index], [field]: value };
        setData('work_history', next);
    };
    const addWorkEntry = () => setData('work_history', [...data.work_history, defaultWorkEntry()]);
    const removeWorkEntry = (index) => {
        const next = data.work_history.filter((_, i) => i !== index);
        setData('work_history', next.length ? next : [defaultWorkEntry()]);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/applicant/biodata', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Biodata">
            <div className="max-w-4xl mx-auto pb-12">
                {flash?.message && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                        {flash.message}
                    </div>
                )}
                {(flash?.error || errors.form) && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm" role="alert">
                        {flash?.error || errors.form}
                    </div>
                )}
                {Object.keys(errors).filter((key) => key !== 'form' && key !== 'cv').length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm" role="alert">
                        Please fix the highlighted fields and try again.
                    </div>
                )}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Biodata Form
                    </h2>
                    <p className="text-slate-500 dark:text-text-muted text-sm">
                        Please complete all sections. You can save and return later.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Personal / family */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">person</span>
                                Personal / family
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* From applicant record – read-only */}
                            <div>
                                <label className={labelClass}>Title</label>
                                <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                    {applicant?.title || '—'}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Surname</label>
                                <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                    {applicant?.last_name || '—'}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>First name</label>
                                <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                    {applicant?.first_name || '—'}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Other names</label>
                                <input type="text" value={data.other_names} onChange={(e) => setData('other_names', e.target.value)} className={inputClass} placeholder="Other names" />
                            </div>
                            <div>
                                <label className={labelClass}>Marital status</label>
                                <select value={data.marital_status} onChange={(e) => setData('marital_status', e.target.value)} className={inputClass}>
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Gender</label>
                                <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className={inputClass}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Date of birth</label>
                                <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                    {formatBirthday(applicant?.dob_day, applicant?.dob_month)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Faith */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">church</span>
                                Faith
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Are you a Christian?</label>
                                <select value={data.is_christian === null ? '' : (data.is_christian ? '1' : '0')} onChange={(e) => setData('is_christian', e.target.value === '' ? null : e.target.value === '1')} className={inputClass}>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>When were you born again?</label>
                                    <input type="text" value={data.born_again_when} onChange={(e) => setData('born_again_when', e.target.value)} className={inputClass} placeholder="When" />
                                </div>
                                <div>
                                    <label className={labelClass}>Where were you born again?</label>
                                    <input type="text" value={data.born_again_where} onChange={(e) => setData('born_again_where', e.target.value)} className={inputClass} placeholder="Where" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>When did you receive the Holy Spirit?</label>
                                    <input type="text" value={data.holy_spirit_when} onChange={(e) => setData('holy_spirit_when', e.target.value)} className={inputClass} placeholder="When" />
                                </div>
                                <div>
                                    <label className={labelClass}>Where did you receive the Holy Spirit?</label>
                                    <input type="text" value={data.holy_spirit_where} onChange={(e) => setData('holy_spirit_where', e.target.value)} className={inputClass} placeholder="Where" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>When did you join LW Inc.?</label>
                                    <input type="text" value={data.joined_lw_when} onChange={(e) => setData('joined_lw_when', e.target.value)} className={inputClass} placeholder="When" />
                                </div>
                                <div>
                                    <label className={labelClass}>Where did you join LW Inc.?</label>
                                    <input type="text" value={data.joined_lw_where} onChange={(e) => setData('joined_lw_where', e.target.value)} className={inputClass} placeholder="Where" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Current local assembly</label>
                                    <input type="text" value={data.current_assembly} onChange={(e) => setData('current_assembly', e.target.value)} className={inputClass} placeholder="Assembly name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Date joined current assembly</label>
                                    <input type="text" value={data.current_assembly_date_joined} onChange={(e) => setData('current_assembly_date_joined', e.target.value)} className={inputClass} placeholder="e.g. Jan 2024" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>When and where were you baptized by immersion?</label>
                                <input type="text" value={data.baptized_when_where} onChange={(e) => setData('baptized_when_where', e.target.value)} className={inputClass} placeholder="When and where" />
                            </div>
                            <div>
                                <label className={labelClass}>When and where did you attend Foundation School?</label>
                                <input type="text" value={data.foundation_school_when_where} onChange={(e) => setData('foundation_school_when_where', e.target.value)} className={inputClass} placeholder="When and where" />
                            </div>
                        </div>
                    </section>

                    {/* Referees */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">contacts</span>
                                Referees
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Referee {i} – Name</label>
                                        <input type="text" value={data[`referee${i}_name`]} onChange={(e) => setData(`referee${i}_name`, e.target.value)} className={inputClass} placeholder={`Referee ${i} name`} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Referee {i} – Contact (address, email, phone)</label>
                                        <textarea value={data[`referee${i}_contact`]} onChange={(e) => setData(`referee${i}_contact`, e.target.value)} className={inputClass} rows={2} placeholder="Address, email, phone" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Work history */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">work_history</span>
                                Work history (chronological)
                            </h3>
                            <button type="button" onClick={addWorkEntry} className="text-sm font-medium text-primary hover:underline">
                                + Add entry
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {data.work_history.map((entry, index) => (
                                <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-border-dark space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Entry {index + 1}</span>
                                        {data.work_history.length > 1 && (
                                            <button type="button" onClick={() => removeWorkEntry(index)} className="text-red-500 hover:text-red-600 text-sm">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Organisation (name + address, city/state)</label>
                                            <input type="text" value={entry.organisation} onChange={(e) => setWorkHistory(index, 'organisation', e.target.value)} className={inputClass} placeholder="Organisation name" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Address</label>
                                            <input type="text" value={entry.address} onChange={(e) => setWorkHistory(index, 'address', e.target.value)} className={inputClass} placeholder="Address" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>City / State</label>
                                            <input type="text" value={entry.city_state} onChange={(e) => setWorkHistory(index, 'city_state', e.target.value)} className={inputClass} placeholder="City, State" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Period from (e.g. month/year)</label>
                                            <input type="text" value={entry.period_from} onChange={(e) => setWorkHistory(index, 'period_from', e.target.value)} className={inputClass} placeholder="e.g. Jan 2020" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Period to</label>
                                            <input type="text" value={entry.period_to} onChange={(e) => setWorkHistory(index, 'period_to', e.target.value)} className={inputClass} placeholder="e.g. Dec 2023" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Designation</label>
                                            <input type="text" value={entry.designation} onChange={(e) => setWorkHistory(index, 'designation', e.target.value)} className={inputClass} placeholder="Job title" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Monthly package</label>
                                            <input type="text" value={entry.monthly_package} onChange={(e) => setWorkHistory(index, 'monthly_package', e.target.value)} className={inputClass} placeholder="Amount" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Reason for leaving</label>
                                            <textarea value={entry.reason_for_leaving} onChange={(e) => setWorkHistory(index, 'reason_for_leaving', e.target.value)} className={inputClass} rows={2} placeholder="Reason" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CV upload */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">upload_file</span>
                                CV
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <p className="text-sm text-slate-500 dark:text-text-muted">
                                Upload your CV (PDF, DOC, DOCX, JPG, or PNG — max 10MB).
                            </p>
                            {applicant?.cv_url && (
                                <p className="text-sm">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Current CV uploaded.</span>{' '}
                                    <a
                                        href={applicant.cv_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary font-medium hover:underline"
                                    >
                                        View file
                                    </a>
                                </p>
                            )}
                            <div>
                                <label className={labelClass}>
                                    {applicant?.cv_url ? 'Replace CV' : 'Upload CV'}
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => setData('cv', e.target.files?.[0] ?? null)}
                                    className={`${inputClass} file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium`}
                                />
                                {data.cv && (
                                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                                        Selected: {data.cv.name}
                                    </p>
                                )}
                                {errors.cv && (
                                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                                        {errors.cv}
                                    </p>
                                )}
                                {progress && (
                                    <p className="mt-1.5 text-sm text-slate-500">Uploading… {progress.percentage}%</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            {processing ? 'Saving…' : 'Save biodata'}
                            <span className="material-symbols-outlined text-lg">save</span>
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
