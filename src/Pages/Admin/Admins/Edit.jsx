import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function AdminsEdit({ admin, departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: admin?.name ?? '',
        username: admin?.username ?? '',
        department_id: admin?.department_id ?? '',
    });

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Edit ${admin?.name}`}>
            <div className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); put(`/administrator/admins/${admin.id}`); }} className="space-y-6">
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                            <select value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} className="form-control">
                                <option value="">All Departments</option>
                                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/administrator/admins/${admin.id}`} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Update Admin</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
