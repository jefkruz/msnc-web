import { useForm } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';

export default function PanelistInterviewManage({
    interview,
    applicant,
    questions = [],
    recommendations = {},
    finalRecommendation,
}) {
    const { auth, authRole, menu, appName } = usePage().props;

    const recsByQ = recommendations && typeof recommendations === 'object' ? recommendations : {};
    const initialRecs = Array.isArray(questions)
        ? questions.map((q) => ({
              question_id: q.id,
              selected: recsByQ[q.id] ? '1' : '',
              answer: recsByQ[q.id]?.answer ?? '',
              score: recsByQ[q.id]?.score ? String(recsByQ[q.id].score) : '',
          }))
        : [];

    const { data: recData, setData: setRecData, post: postRecs, processing: recProcessing } = useForm({
        recommendations: initialRecs,
    });

    const { data: finalData, setData: setFinalData, post: postFinal, processing: finalProcessing } = useForm({
        position_objective: finalRecommendation?.position_objective ?? '',
        rank_assessment: finalRecommendation?.rank_assessment ?? '',
        organization_fit: finalRecommendation?.organization_fit ?? '',
        other_comments: finalRecommendation?.other_comments ?? '',
        final_recommendation: finalRecommendation?.final_recommendation ?? '',
    });

    const fullName = applicant
        ? [applicant.first_name, applicant.last_name].filter(Boolean).join(' ')
        : 'Applicant';
    const interviewId = interview?.id;
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
    const recInitRef = useRef(false);
    const finalInitRef = useRef(false);

    const toggleQuestion = (index, checked) => {
        const next = [...(recData.recommendations || [])];
        next[index] = { ...next[index], selected: checked ? '1' : '' };
        setRecData('recommendations', next);
    };

    const setRecField = (index, field, value) => {
        const next = [...(recData.recommendations || [])];
        next[index] = { ...next[index], [field]: value };
        setRecData('recommendations', next);
    };

    // Autosave recommendations whenever answers/selection/score change.
    useEffect(() => {
        if (!interviewId) return;
        if (!recInitRef.current) {
            recInitRef.current = true;
            return;
        }
        const timer = setTimeout(() => {
            setAutoSaveStatus('saving');
            postRecs(`/panelist/interview/${interviewId}/recommendations`, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => setAutoSaveStatus('saved'),
                onError: () => setAutoSaveStatus('error'),
            });
        }, 800);
        return () => clearTimeout(timer);
    }, [recData.recommendations]);

    // Autosave final recommendation fields while typing/selecting.
    useEffect(() => {
        if (!interviewId) return;
        if (!finalInitRef.current) {
            finalInitRef.current = true;
            return;
        }
        const timer = setTimeout(() => {
            setAutoSaveStatus('saving');
            postFinal(`/panelist/interview/${interviewId}/final-recommendation`, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => setAutoSaveStatus('saved'),
                onError: () => setAutoSaveStatus('error'),
            });
        }, 800);
        return () => clearTimeout(timer);
    }, [finalData.position_objective, finalData.rank_assessment, finalData.organization_fit, finalData.other_comments, finalData.final_recommendation]);

    return (
        <Layout
            auth={auth}
            authRole={authRole}
            menu={menu}
            appName={appName}
            pageTitle={`Manage - ${fullName}`}
        >
            <div className="max-w-4xl space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Interview: {fullName}
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className={`text-xs font-medium ${
                                autoSaveStatus === 'saving'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : autoSaveStatus === 'saved'
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : autoSaveStatus === 'error'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-slate-500 dark:text-text-muted'
                            }`}>
                                {autoSaveStatus === 'saving' && 'Autosaving...'}
                                {autoSaveStatus === 'saved' && 'All changes saved'}
                                {autoSaveStatus === 'error' && 'Autosave failed'}
                                {autoSaveStatus === 'idle' && 'Autosave enabled'}
                            </span>
                            <Link
                                href="/panelist"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                    <p className="text-text-muted text-sm mb-6">
                        Date: {interview?.date ? new Date(interview.date).toLocaleString() : '—'}
                    </p>
                    {applicant?.category && (
                        <p className="text-text-muted text-sm">
                            Job Family: {applicant.category.name}
                            {applicant.group && ` → ${applicant.group.name}`}
                            {applicant.nomenclatureRank && ` → ${applicant.nomenclatureRank.name}`}
                        </p>
                    )}
                </div>

                {Array.isArray(questions) && questions.length > 0 ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            postRecs(`/panelist/interview/${interviewId}/recommendations`);
                        }}
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-6"
                    >
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                            Question pool (applicant&apos;s job family &amp; rank)
                        </h4>
                        <p className="text-sm text-text-muted">
                            Check the questions you asked, optionally write the candidate&apos;s answer, give a score (1–5), then submit.
                        </p>
                        <ul className="space-y-4">
                            {(recData.recommendations || []).map((rec, i) => (
                                <li
                                    key={questions[i]?.id ?? i}
                                    className="p-4 rounded-lg border border-slate-200 dark:border-border-dark"
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={rec.selected === '1'}
                                            onChange={(e) => toggleQuestion(i, e.target.checked)}
                                            className="rounded border-slate-300 dark:border-border-dark text-primary focus:ring-primary mt-1"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white mb-2">
                                                {questions[i]?.title ?? questions[i]?.body ?? `Question ${i + 1}`}
                                            </p>
                                            <div className="space-y-2 mt-2">
                                                <textarea
                                                    placeholder="Your answer/notes (optional)"
                                                    rows={2}
                                                    value={rec.answer}
                                                    onChange={(e) => setRecField(i, 'answer', e.target.value)}
                                                    className="form-control"
                                                />
                                                <SearchableSelect
                                                    value={rec.score}
                                                    onChange={(val) => setRecField(i, 'score', val)}
                                                    options={[
                                                        { value: '1', label: '1 - Poor' },
                                                        { value: '2', label: '2 - Below Average' },
                                                        { value: '3', label: '3 - Average' },
                                                        { value: '4', label: '4 - Good' },
                                                        { value: '5', label: '5 - Excellent' },
                                                    ]}
                                                    placeholder="Score (1–5)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="submit"
                            disabled={recProcessing}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                        >
                            Save recommendations
                        </button>
                    </form>
                ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-800 dark:text-amber-200 text-sm">
                        No questions available for this applicant&apos;s nomenclature.
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        postFinal(`/panelist/interview/${interviewId}/final-recommendation`);
                    }}
                    className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4"
                >
                    <h4 className="font-semibold text-slate-900 dark:text-white">Final recommendation</h4>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Position objective <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={finalData.position_objective}
                            onChange={(e) => setFinalData('position_objective', e.target.value)}
                            className="form-control"
                            placeholder="Candidate's understanding of the job..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Rank assessment <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={finalData.rank_assessment}
                            onChange={(e) => setFinalData('rank_assessment', e.target.value)}
                            className="form-control"
                            placeholder="Under/over qualified for the rank..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Organization fit <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={finalData.organization_fit}
                            onChange={(e) => setFinalData('organization_fit', e.target.value)}
                            className="form-control"
                            placeholder="Fit with the organization..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Other comments <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={finalData.other_comments}
                            onChange={(e) => setFinalData('other_comments', e.target.value)}
                            className="form-control"
                            placeholder="Additional comments and recommendation..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Final recommendation status
                        </label>
                        <SearchableSelect
                            value={finalData.final_recommendation}
                            onChange={(val) => setFinalData('final_recommendation', val)}
                            options={[
                                { value: 'strongly_recommended', label: 'Strongly recommended' },
                                { value: 'recommended', label: 'Recommended' },
                                { value: 'conditional', label: 'Conditional' },
                                { value: 'not_recommended', label: 'Not recommended' },
                            ]}
                            placeholder="Select..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={finalProcessing}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Save final recommendation
                    </button>
                </form>
            </div>
        </Layout>
    );
}
