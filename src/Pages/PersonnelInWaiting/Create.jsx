import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';
import TitleCaseInput from '../../Components/TitleCaseInput';
import { TITLE_OPTIONS } from '../../lib/selectOptions';

const inputClass =
    'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

export default function PersonnelInWaitingCreate({ departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const isSdm = authRole === 'SDM';
    const defaultDepartmentId = isSdm && auth?.department_id ? String(auth.department_id) : '';
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        firstname: '',
        lastname: '',
        phone: '',
        department_id: defaultDepartmentId,
        username: '',
        start_date: '',
    });

    const base = '/authorised/personnel-in-waiting';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Add Personnel in Waiting">
            <div className="max-w-3xl">
                <p className="text-slate-500 dark:text-text-muted text-sm mb-6">
                    Add someone to the 3‑month probation list. End date will be set automatically to 3 months after start date.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); post(base); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <SearchableSelect
                                    value={data.title}
                                    onChange={(val) => setData('title', val)}
                                    options={TITLE_OPTIONS}
                                    placeholder="Select title"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>First name <span className="text-red-500">*</span></label>
                                <TitleCaseInput
                                    value={data.firstname}
                                    onChange={(val) => setData('firstname', val)}
                                    className={inputClass}
                                    required
                                />
                                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last name <span className="text-red-500">*</span></label>
                                <TitleCaseInput
                                    value={data.lastname}
                                    onChange={(val) => setData('lastname', val)}
                                    className={inputClass}
                                    required
                                />
                                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            {!isSdm && (
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
                            )}
                            <div>
                                <label className={labelClass}>Username <span className="text-red-500">*</span></label>
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
                                <label className={labelClass}>Start date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={base} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                            Add personnel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
