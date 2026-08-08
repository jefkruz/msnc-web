import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';

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
                            <SearchableSelect
                                value={data.nomenclature_category_id}
                                onChange={(val) => setData('nomenclature_category_id', val)}
                                options={families}
                                placeholder="Select category"
                                error={errors.nomenclature_category_id}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group</label>
                            <SearchableSelect
                                value={data.nomenclature_group_id}
                                onChange={(val) => setData('nomenclature_group_id', val)}
                                options={groups}
                                placeholder="Select group"
                                error={errors.nomenclature_group_id}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rank</label>
                            <SearchableSelect
                                value={data.nomenclature_rank_id}
                                onChange={(val) => setData('nomenclature_rank_id', val)}
                                options={ranks}
                                placeholder="Select rank"
                                error={errors.nomenclature_rank_id}
                            />
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
