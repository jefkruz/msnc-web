import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';
import PostingLetterForm from '../../../Components/PostingLetterForm';
import SearchableSelect from '../../../Components/SearchableSelect';

export default function PostingLettersCreate({ applicants = [], recommendations = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [selectedApplicantId, setSelectedApplicantId] = useState('');
    const [selectedRecommendationId, setSelectedRecommendationId] = useState('');
    const [generating, setGenerating] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        applicant_id: '',
        letter_date: '',
        recipient_address: '',
        salutation: '',
        mission_station: '',
        posting_status: '',
        effective_from: '',
        employer: '',
        employee_name: '',
        designation: '',
        rank: '',
        signatory_title: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/administrator/posting-letters/store', { preserveScroll: true });
    };

    const generate = (payload) => {
        setGenerating(true);
        router.post('/administrator/posting-letters/generate', payload, {
            preserveScroll: false,
            onFinish: () => setGenerating(false),
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Create Posting Letter">
            <div className="space-y-6">
                <Link
                    href="/administrator/posting-letters"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Posting Letters
                </Link>

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-amber-50 dark:bg-amber-900/20">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">auto_awesome</span>
                            Generate from sample
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Auto-fill using MSNC Sample 1 (posting letter) and Sample 2 (terms). Applicant data and any posting recommendation are used.
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Applicant</label>
                                <SearchableSelect
                                    value={selectedApplicantId}
                                    onChange={(val) => setSelectedApplicantId(val)}
                                    options={applicants}
                                    placeholder="Select applicant"
                                    getOptionValue={(a) => a?.id ?? ''}
                                    getOptionLabel={(a) => [a?.title, a?.first_name, a?.last_name].filter(Boolean).join(' ')}
                                />
                            </div>
                            <button
                                type="button"
                                disabled={!selectedApplicantId || generating}
                                onClick={() => generate({ applicant_id: selectedApplicantId })}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">description</span>
                                {generating ? 'Generating…' : 'Generate letter'}
                            </button>
                        </div>
                        {recommendations.length > 0 && (
                            <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-slate-200 dark:border-border-dark">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Or from posting recommendation</label>
                                    <SearchableSelect
                                        value={selectedRecommendationId}
                                        onChange={(val) => setSelectedRecommendationId(val)}
                                        options={recommendations}
                                        placeholder="Select recommendation"
                                        getOptionValue={(r) => r?.id ?? ''}
                                        getOptionLabel={(r) => r?.label ?? '—'}
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={!selectedRecommendationId || generating}
                                    onClick={() => generate({ posting_recommendation_id: selectedRecommendationId })}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-500 text-amber-700 dark:text-amber-400 font-medium text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50"
                                >
                                    Generate from recommendation
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-slate-500 dark:text-text-muted text-sm border-t border-slate-200 dark:border-border-dark pt-4">
                    Or create manually below.
                </p>

                <PostingLetterForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    applicants={applicants}
                    onSubmit={submit}
                    processing={processing}
                    submitLabel="Create"
                />
            </div>
        </Layout>
    );
}
