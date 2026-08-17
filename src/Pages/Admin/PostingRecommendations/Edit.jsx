import { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import ActionButton from '../../../Components/ActionButton';
import PostingRecommendationForm from '../../../Components/PostingRecommendationForm';
import { useCan } from '../../../lib/can';
import { openApiPdf } from '../../../lib/api';

function dateInputValue(val) {
    if (!val) return '';
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function PostingRecommendationsEdit({ postingRecommendation, applicants = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const r = postingRecommendation || {};

    const { data, setData, put, processing, errors } = useForm({
        applicant_id: String(r.applicant_id ?? ''),
        memo_to: r.memo_to ?? '',
        memo_from: r.memo_from ?? '',
        memo_cc: r.memo_cc ?? '',
        memo_date: dateInputValue(r.memo_date),
        memo_re: r.memo_re ?? '',
        recommendation_intro: r.recommendation_intro ?? '',
        applicant_name_dob: r.applicant_name_dob ?? '',
        contact_address: r.contact_address ?? '',
        marital_status: r.marital_status ?? '',
        department_applied_to: r.department_applied_to ?? '',
        position_applied_for: r.position_applied_for ?? '',
        entry_level_posting_requested: r.entry_level_posting_requested ?? '',
        qualification_details: r.qualification_details ?? '',
        date_joined_ministry: r.date_joined_ministry ?? '',
        current_local_assembly: r.current_local_assembly ?? '',
        ministry_involvement: r.ministry_involvement ?? '',
        work_experience: r.work_experience ?? '',
        panel_recommendation: r.panel_recommendation ?? '',
        panelist_comments: r.panelist_comments ?? '',
        oral_interview_panelists: r.oral_interview_panelists ?? '',
        other_assessment: r.other_assessment ?? '',
        average_score: r.average_score != null ? String(r.average_score) : '',
        understanding_of_the_job: r.understanding_of_the_job ?? '',
        written_interview_score: r.written_interview_score ?? '',
        salary_expectation: r.salary_expectation ?? '',
        referee_pastor_comment: r.referee_pastor_comment ?? '',
        referee_ministry_comment: r.referee_ministry_comment ?? '',
        referee_guarantor_comment: r.referee_guarantor_comment ?? '',
        director_recommendation: r.director_recommendation ?? '',
        placement_analysis: r.placement_analysis ?? '',
        memo_closing: r.memo_closing ?? '',
        signatory_name: r.signatory_name ?? '',
        signatory_title: r.signatory_title ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data };
        if (payload.average_score !== '') payload.average_score = Number(payload.average_score);
        put(`/administrator/posting-recommendations/update/${r.id}`, { preserveScroll: true });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Edit Posting Recommendation">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        href="/administrator/posting-recommendations"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Posting Recommendations
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        {r.id && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => openApiPdf(`/administrator/posting-recommendations/print/${r.id}`, 'posting-recommendation.pdf')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10"
                                >
                                    <span className="material-symbols-outlined text-lg">print</span>
                                    Print memo
                                </button>
                                {can('posting-letters.create') && (
                                    <button
                                        type="button"
                                        onClick={() => router.post('/administrator/posting-letters/generate', { posting_recommendation_id: r.id })}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">mail</span>
                                        Generate letter
                                    </button>
                                )}
                            </>
                        )}
                        {can('posting-recommendations.delete') && r.id && (
                            <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                        )}
                    </div>
                </div>

                <PostingRecommendationForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    applicants={applicants}
                    onSubmit={submit}
                    processing={processing}
                    submitLabel="Update"
                />
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/posting-recommendations/delete/${r.id}`)}
                    title="Delete posting recommendation"
                    message="Are you sure you want to delete this posting recommendation? This cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
