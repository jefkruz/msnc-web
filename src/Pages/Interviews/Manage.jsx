import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { storageUrl } from '../../lib/api';

const DOCUMENT_LABELS = {
    authorization_recruit_form: 'Authorization & Recruit Form',
    terms_of_reference: 'Terms of Reference',
    cv: 'CV',
    foundation_school: 'Foundation School',
    baptismal_certificate: 'Baptismal Certificate',
    educational_qualification: 'Educational Qualification',
    birth_certificate: 'Birth Certificate',
    church_pastor_attestation: 'Church Pastor Attestation',
    ministry_referee_attestation: 'Ministry Referee Attestation',
    guarantors_letter: "Guarantor's Letter",
    ministry_profile: 'Ministry Profile',
    application_letter: 'Application Letter',
    campus_letter: 'Campus Letter',
    others: 'Others',
};

export default function InterviewsManage({ interview, applicant, panelistNames = [], questions = [], recommendationsByQuestion = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const doc = applicant?.document || {};
    const fullName = applicant ? [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') : '—';
    const imageUrl = applicant?.image || '/images/default.png';
    const interviewDate = interview?.date ? new Date(interview.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : '—';

    const hasDocuments = Object.keys(DOCUMENT_LABELS).some((field) => doc[field]);

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Manage Interview">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Interview</h2>
                    <Link
                        href="/administrator/interviews"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Interviews
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main column - 2/3 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Applicant Information */}
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Applicant Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-slate-500 dark:text-text-muted">Full Name:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{fullName}</span></div>
                                    <div><span className="text-slate-500 dark:text-text-muted">Username:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{applicant?.username ?? '—'}</span></div>
                                    <div><span className="text-slate-500 dark:text-text-muted">Email:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{applicant?.email ?? 'N/A'}</span></div>
                                    <div><span className="text-slate-500 dark:text-text-muted">Department:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{applicant?.department?.name ?? 'N/A'}</span></div>
                                    <div><span className="text-slate-500 dark:text-text-muted">Job Family:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{applicant?.family?.name ?? 'N/A'}</span></div>
                                    <div><span className="text-slate-500 dark:text-text-muted">Rank:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{applicant?.rank?.name ?? 'N/A'}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Documents</h3>
                            </div>
                            <div className="p-6">
                                {hasDocuments ? (
                                    <ul className="space-y-4">
                                        {Object.entries(DOCUMENT_LABELS).map(([field, label]) =>
                                            doc[field] ? (
                                                <li key={field} className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-border-dark last:border-0 last:pb-0">
                                                    <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-3xl">description</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-slate-900 dark:text-white">{label}</div>
                                                        <small className="text-slate-500 dark:text-text-muted">Click to view/download</small>
                                                    </div>
                                                    <a
                                                        href={storageUrl(doc[field])}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors shrink-0"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">download</span>
                                                        Download
                                                    </a>
                                                </li>
                                            ) : null
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 dark:text-text-muted text-sm">No documents uploaded yet.</p>
                                )}
                            </div>
                        </div>

                        {authRole !== 'SDM' && (
                            <>
                                {/* Interview Questions & Panelist Scores */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">quiz</span>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Questions Asked & Scores Given</h3>
                                    </div>
                                    <div className="p-6">
                                        {(recommendationsByQuestion && recommendationsByQuestion.length > 0) || (questions && questions.length > 0) ? (
                                            <div className="space-y-6">
                                                {(recommendationsByQuestion.length > 0 ? recommendationsByQuestion : questions.map((q) => ({ id: q.id, title: q.title, responses: [] }))).map((item, idx) => (
                                                    <div key={item.id} className="p-4 rounded-lg border border-slate-200 dark:border-border-dark">
                                                        <h6 className="font-medium text-slate-900 dark:text-white mb-3">
                                                            {idx + 1}. {item.title ?? '—'}
                                                        </h6>
                                                        {item.responses && item.responses.length > 0 ? (
                                                            <ul className="space-y-3">
                                                                {item.responses.map((r, rIdx) => (
                                                                    <li key={rIdx} className="pl-3 border-l-2 border-primary/30 space-y-1">
                                                                        <p className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">
                                                                            {r.panelist_name}
                                                                        </p>
                                                                        {r.answer != null && r.answer !== '' && (
                                                                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{r.answer}</p>
                                                                        )}
                                                                        {r.score != null && (
                                                                            <p className="text-sm">
                                                                                <span className="text-slate-500 dark:text-text-muted">Score: </span>
                                                                                <span className="font-semibold text-slate-900 dark:text-white">{r.score}/5</span>
                                                                            </p>
                                                                        )}
                                                                        {(!r.answer || r.answer === '') && r.score == null && (
                                                                            <p className="text-xs text-slate-400 dark:text-text-muted">— No response yet</p>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-slate-500 dark:text-text-muted text-sm">No panelist responses yet for this question.</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 dark:text-text-muted text-sm">No questions for this applicant&apos;s job family and rank. Panelists will see a question pool once questions exist.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar - 1/3 */}
                    <div className="space-y-6">
                        {/* Interview Date & Applicant */}
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark text-center">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Interview Date</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{interviewDate}</p>
                            </div>
                            <div className="p-6 text-center">
                                <img
                                    src={imageUrl}
                                    alt={fullName}
                                    className="w-28 h-28 rounded-full object-cover border-2 border-slate-200 dark:border-border-dark mx-auto mb-4"
                                />
                                <div className="font-semibold text-slate-900 dark:text-white mb-1">{fullName}</div>
                                <div className="text-slate-500 dark:text-text-muted text-sm mb-1">{applicant?.department?.name ?? 'N/A'}</div>
                                <div className="text-xs text-slate-500 dark:text-text-muted">Username: {applicant?.username ?? '—'}</div>
                            </div>
                        </div>

                        {/* Panelists */}
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">groups</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Panelists</h3>
                            </div>
                            <div className="p-6">
                                {panelistNames && panelistNames.length > 0 ? (
                                    <ul className="space-y-3">
                                        {panelistNames.map((name, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary text-xl">person</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 dark:text-text-muted text-sm">No panelists assigned.</p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Status</h3>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-text-muted">Interview Status</span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                        {interview?.status ? String(interview.status) : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-text-muted">Applicant Status</span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                        {applicant?.status ? String(applicant.status) : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
