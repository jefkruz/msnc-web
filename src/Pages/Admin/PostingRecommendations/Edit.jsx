import { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import PostingRecommendationForm from '../../../Components/PostingRecommendationForm';
import { useCan } from '../../../lib/can';

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
        other_assessment: r.other_assessment ?? '',
        average_score: r.average_score != null ? String(r.average_score) : '',
        salary_expectation: r.salary_expectation ?? '',
        referee_pastor_comment: r.referee_pastor_comment ?? '',
        referee_ministry_comment: r.referee_ministry_comment ?? '',
        referee_guarantor_comment: r.referee_guarantor_comment ?? '',
        director_recommendation: r.director_recommendation ?? '',
        placement_analysis: r.placement_analysis ?? '',
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
                    {can('posting-recommendations.delete') && r.id && (
                        <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Delete</button>
                    )}
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
