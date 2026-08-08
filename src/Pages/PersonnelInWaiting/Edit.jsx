import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';

const TITLE_OPTIONS = ['Brother', 'Sister', 'Deacon', 'Deaconess', 'Reverend', 'Pastor', 'Evangelist'];

const inputClass =
    'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

function formatDateForInput(d) {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
}

export default function PersonnelInWaitingEdit({ person, departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title: person?.title ?? '',
        firstname: person?.firstname ?? '',
        lastname: person?.lastname ?? '',
        phone: person?.phone ?? '',
        department_id: person?.department_id ?? '',
        username: person?.username ?? '',
        start_date: formatDateForInput(person?.start_date),
        end_date: formatDateForInput(person?.end_date),
    });

    const base = '/authorised/personnel-in-waiting';
    const id = person?.id;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Edit Personnel in Waiting">
            <div className="max-w-3xl">
                <form onSubmit={(e) => { e.preventDefault(); put(`${base}/${id}`); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <select value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass}>
                                    <option value="">Select</option>
                                    {TITLE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>First name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.firstname} onChange={(e) => setData('firstname', e.target.value)} className={inputClass} required />
                                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} className={inputClass} required />
                                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Department</label>
                                <SearchableSelect
                                    value={data.department_id}
                                    onChange={(id) => setData('department_id', id)}
                                    options={departments}
                                    placeholder="Search department..."
                                    getOptionValue={(d) => d.id}
                                    getOptionLabel={(d) => d.name}
                                    error={errors.department_id}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                                <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className={inputClass} required />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Start date <span className="text-red-500">*</span></label>
                                <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className={inputClass} required />
                                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>End date <span className="text-red-500">*</span></label>
                                <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className={inputClass} required />
                                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`${base}/${id}`} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Update</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
