import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';
import SearchableMultiSelect from '../../Components/SearchableMultiSelect';

function applicantLabel(a) {
    if (!a) return '';
    const first = (a.first_name || '').trim();
    const last = (a.last_name || '').trim();
    const full = [first, last].filter(Boolean).join(' ');
    return full || a.title || `Applicant #${a.id}`;
}

export default function InterviewsCreate({ applicants = [], panelists = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        applicant_id: '',
        date: '',
        panelists: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/administrator/interviews/store');
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Create Interview">
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Applicant</label>
                            <SearchableSelect
                                value={data.applicant_id}
                                onChange={(id) => setData('applicant_id', id)}
                                options={applicants}
                                placeholder="Search applicant..."
                                required
                                getOptionValue={(a) => a.id}
                                getOptionLabel={applicantLabel}
                                error={errors.applicant_id}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="form-control"
                                required
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Panelists</label>
                            <SearchableMultiSelect
                                value={data.panelists}
                                onChange={(ids) => setData('panelists', ids)}
                                options={panelists}
                                placeholder="Search and select panelists..."
                                required
                                getOptionValue={(p) => p.id}
                                getOptionLabel={(p) => p.name || ''}
                                error={errors.panelists}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/administrator/interviews" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">Create Interview</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
