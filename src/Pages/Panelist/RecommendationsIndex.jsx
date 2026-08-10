import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import EmptyState from '../../Components/EmptyState';
import { formatDisplayDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

function finalRecBadge(value) {
    const v = (value || '').toLowerCase();
    if (v === 'strongly_recommended') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (v === 'recommended') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (v === 'conditional') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    if (v === 'not_recommended') return 'bg-red-500/10 text-red-600 dark:text-red-400';
    return 'bg-slate-500/10 text-slate-400';
}

export default function PanelistRecommendationsIndex({
    recommendations = {},
    finalRecommendations = {},
}) {
    const { auth, authRole, menu, appName } = usePage().props;

    const entries = recommendations && typeof recommendations === 'object'
        ? Object.entries(recommendations)
        : [];

    return (
        <Layout
            auth={auth}
            authRole={authRole}
            menu={menu}
            appName={appName}
            pageTitle="My Recommendations"
        >
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Recommendations</h2>
                </div>
                <div className="p-6">
                    {entries.length === 0 ? (
                        <EmptyState
                            icon="rate_review"
                            title="No recommendations yet"
                            description="Submit recommendations from your interview manage page."
                            className="m-0"
                        />
                    ) : (
                        <ul className="space-y-6">
                            {entries.map(([interviewId, interviewRecs]) => {
                                const list = Array.isArray(interviewRecs) ? interviewRecs : [];
                                const first = list[0];
                                const interview = first?.interview;
                                const applicant = interview?.applicant ?? first?.applicant;
                                const finalRec = finalRecommendations?.[interviewId] ?? null;
                                const applicantName = applicant
                                    ? [applicant.first_name, applicant.last_name].filter(Boolean).join(' ')
                                    : 'Applicant';

                                return (
                                    <li
                                        key={interviewId}
                                        className="border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-slate-200 dark:border-border-dark flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {(applicant?.first_name?.[0] || '') + (applicant?.last_name?.[0] || '')}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {applicantName}
                                                    </p>
                                                    <p className="text-sm text-text-muted">
                                                        {formatDisplayDate(interview?.date)}
                                                        {applicant?.category && ` · ${applicant.category.name}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/panelist/interview/${interviewId}/manage`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                View details
                                            </Link>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div>
                                                <h5 className="text-xs font-bold uppercase text-text-muted mb-2">
                                                    Question recommendations ({list.length})
                                                </h5>
                                                <ul className="space-y-2">
                                                    {list.map((rec) => (
                                                        <li
                                                            key={rec.id}
                                                            className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-border-dark"
                                                        >
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {rec.question?.title ?? rec.question?.body ?? 'Question'}
                                                            </p>
                                                            {rec.answer && (
                                                                <p className="text-sm text-text-muted mt-1">{rec.answer}</p>
                                                            )}
                                                            {rec.score && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">
                                                                    Score: {rec.score}/5
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {finalRec ? (
                                                <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
                                                    <h5 className="text-xs font-bold uppercase text-text-muted mb-2">
                                                        Final recommendation
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-text-muted">Position objective:</span>
                                                            <p className="text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                                                                {finalRec.position_objective}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-text-muted">Rank assessment:</span>
                                                            <p className="text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                                                                {finalRec.rank_assessment}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-text-muted">Organization fit:</span>
                                                            <p className="text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                                                                {finalRec.organization_fit}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-text-muted">Other comments:</span>
                                                            <p className="text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                                                                {finalRec.other_comments}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {finalRec.final_recommendation && (
                                                        <span
                                                            className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${finalRecBadge(
                                                                finalRec.final_recommendation
                                                            )}`}
                                                        >
                                                            {formatStatusLabel(finalRec.final_recommendation)}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="pt-4 border-t border-slate-200 dark:border-border-dark text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3">
                                                    Final recommendation not yet submitted for this interview.
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
}
