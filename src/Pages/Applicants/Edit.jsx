import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function ApplicantsEdit({ applicant, families = [], departments = [], ranks = [], groups = [], nomenclature_ranks = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
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
                                <select value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} className="form-control">
                                    <option value="">Select</option>
                                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Family</label>
                                <select value={data.nomenclature_category_id} onChange={(e) => { setData('nomenclature_category_id', e.target.value); setData('nomenclature_group_id', ''); setData('nomenclature_rank_id', ''); }} className="form-control">
                                    <option value="">Select</option>
                                    {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Group</label>
                                <select value={data.nomenclature_group_id} onChange={(e) => { setData('nomenclature_group_id', e.target.value); setData('nomenclature_rank_id', ''); }} className="form-control">
                                    <option value="">Select</option>
                                    {filteredGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Rank</label>
                                <select value={data.nomenclature_rank_id} onChange={(e) => setData('nomenclature_rank_id', e.target.value)} className="form-control">
                                    <option value="">Select</option>
                                    {filteredRanks.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            {isAdmin && ranks?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Administrative rank</label>
                                    <select value={data.rank_id} onChange={(e) => setData('rank_id', e.target.value)} className="form-control">
                                        <option value="">Select</option>
                                        {ranks.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/authorised/view/${applicant.id}`} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Update Applicant</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
