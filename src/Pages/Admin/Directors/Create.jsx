import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function DirectorsCreate({ departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ name: '', username: '', departments: [] });

    const toggleDept = (id) => {
        setData('departments', data.departments.includes(id) ? data.departments.filter((d) => d !== id) : [...data.departments, id]);
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Create Director">
            <div className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); post('/administrator/directors'); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="form-control" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                            <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="form-control" required />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Departments</label>
                            <div className="flex flex-wrap gap-2">
                                {departments.map((d) => (
                                    <label key={d.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-border-dark cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                                        <input type="checkbox" checked={data.departments.includes(d.id)} onChange={() => toggleDept(d.id)} className="rounded text-primary" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{d.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/administrator/directors" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Create Director</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
