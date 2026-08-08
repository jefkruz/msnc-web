import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function QuestionsCreate({ families = [], groups = [], ranks = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        nomenclature_category_id: '',
        nomenclature_group_id: '',
        nomenclature_rank_id: '',
    });

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Create Question">
            <div className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); post('/administrator/questions/store'); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Question</label>
                            <textarea value={data.question} onChange={(e) => setData('question', e.target.value)} rows={4} className="form-control" required />
                            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category (Job Family)</label>
                            <select value={data.nomenclature_category_id} onChange={(e) => setData('nomenclature_category_id', e.target.value)} className="form-control">
                                <option value="">Select</option>
                                {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group</label>
                            <select value={data.nomenclature_group_id} onChange={(e) => setData('nomenclature_group_id', e.target.value)} className="form-control">
                                <option value="">Select</option>
                                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rank</label>
                            <select value={data.nomenclature_rank_id} onChange={(e) => setData('nomenclature_rank_id', e.target.value)} className="form-control">
                                <option value="">Select</option>
                                {ranks.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/administrator/questions" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Create Question</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
