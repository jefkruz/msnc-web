import { usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { formatStatusLabel } from '../../lib/formatStatus';

function statusClass(status) {
    const value = (status || '').toLowerCase();
    if (value === 'scheduled') return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
    if (value === 'approved') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
    if (value === 'rejected') return 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30';
    return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
}

export default function ApplicantInterviewPage({ interview = null }) {
    const { auth, authRole, menu, appName } = usePage().props;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Interview">
            <div className="max-w-3xl mx-auto pb-12 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Interview
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-muted">
                        View your scheduled interview date and status.
                    </p>
                </div>

                {!interview ? (
                    <div className="applicant-interview-empty bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm p-8 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">event_busy</span>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No interview scheduled yet</h3>
                        <p className="text-sm text-slate-500 dark:text-text-muted max-w-md mx-auto">
                            When your interview is scheduled, the date and time will appear here. You will also receive a notification.
                        </p>
                    </div>
                ) : (
                    <div className="applicant-interview-card bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="applicant-interview-card__banner" />
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-muted mb-2">
                                        {interview.is_upcoming ? 'Upcoming interview' : 'Interview details'}
                                    </p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        {interview.datetime_label || '—'}
                                    </h3>
                                </div>
                                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusClass(interview.status)}`}>
                                    {formatStatusLabel(interview.status)}
                                </span>
                            </div>

                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="applicant-interview-detail">
                                    <dt className="applicant-interview-detail__label">Date</dt>
                                    <dd className="applicant-interview-detail__value">{interview.date_label || '—'}</dd>
                                </div>
                                <div className="applicant-interview-detail">
                                    <dt className="applicant-interview-detail__label">Time</dt>
                                    <dd className="applicant-interview-detail__value">{interview.time_label || '—'}</dd>
                                </div>
                                {interview.department_name && (
                                    <div className="applicant-interview-detail sm:col-span-2">
                                        <dt className="applicant-interview-detail__label">Department</dt>
                                        <dd className="applicant-interview-detail__value">{interview.department_name}</dd>
                                    </div>
                                )}
                            </dl>

                            {interview.is_upcoming && (
                                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15 text-sm text-slate-700 dark:text-slate-300">
                                    <p className="font-medium text-slate-900 dark:text-white mb-1">Please be prepared and on time</p>
                                    <p>Make sure your biodata and documents are complete before your interview.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
