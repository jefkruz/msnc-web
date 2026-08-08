import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';
import PostingRecommendationForm from '../../../Components/PostingRecommendationForm';

const inputClass = 'form-control';

export default function PostingRecommendationsCreate({ applicants = [], interviews = [] }) {
    const { auth, authRole, menu, appName, flash } = usePage().props;
    const [selectedInterviewId, setSelectedInterviewId] = useState('');
    const [generating, setGenerating] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        applicant_id: '',
        memo_to: '',
        memo_from: '',
        memo_cc: '',
        memo_date: '',
        memo_re: '',
        recommendation_intro: '',
        applicant_name_dob: '',
        contact_address: '',
        marital_status: '',
        department_applied_to: '',
        position_applied_for: '',
        entry_level_posting_requested: '',
        qualification_details: '',
        date_joined_ministry: '',
        current_local_assembly: '',
        ministry_involvement: '',
        work_experience: '',
        panel_recommendation: '',
        panelist_comments: '',
        other_assessment: '',
        average_score: '',
        salary_expectation: '',
        referee_pastor_comment: '',
        referee_ministry_comment: '',
        referee_guarantor_comment: '',
        director_recommendation: '',
        placement_analysis: '',
    });

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data };
        if (payload.memo_date) payload.memo_date = payload.memo_date;
        if (payload.average_score !== '') payload.average_score = Number(payload.average_score);
        post('/administrator/posting-recommendations/store', { preserveScroll: true });
    };

    const handleGenerateFromInterview = (e) => {
        e.preventDefault();
        if (!selectedInterviewId) return;
        setGenerating(true);
        router.post('/administrator/posting-recommendations/generate-from-interview', { interview_id: selectedInterviewId }, {
            preserveScroll: false,
            onFinish: () => setGenerating(false),
        });
    };

    const interviewList = Array.isArray(interviews) ? interviews : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Create Posting Recommendation">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        href="/administrator/posting-recommendations"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Posting Recommendations
                    </Link>
                </div>

                {/* Generate from interview */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-amber-50 dark:bg-amber-900/20">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">auto_awesome</span>
                            Generate from interview
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Auto-fill a posting recommendation from applicant data, biodata, and panelist recommendations. You can then review and edit before saving.
                        </p>
                    </div>
                    <div className="p-6 flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select interview</label>
                            <select
                                value={selectedInterviewId}
                                onChange={(e) => setSelectedInterviewId(e.target.value)}
                                className={inputClass}
                            >
                                <option value="">— Select an interview —</option>
                                {interviewList.map((i) => (
                                    <option key={i?.id ?? i} value={i?.id ?? ''}>
                                        {i?.applicant_name ?? '—'} – {i?.date ?? ''} ({i?.department_name ?? '—'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleGenerateFromInterview}
                            disabled={!selectedInterviewId || generating}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">description</span>
                            {generating ? 'Generating…' : 'Generate document'}
                        </button>
                    </div>
                </div>

                {flash?.error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                        {flash.error}
                    </div>
                )}
                <div className="text-slate-500 dark:text-text-muted text-sm border-t border-slate-200 dark:border-border-dark pt-4">
                    Or create manually below by selecting an applicant and filling the sections.
                </div>

                <PostingRecommendationForm
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
