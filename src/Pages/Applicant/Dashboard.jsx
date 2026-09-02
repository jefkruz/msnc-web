import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import UserAvatar from '../../Components/UserAvatar';
import { formatStatusLabel } from '../../lib/formatStatus';

function taskStatusClass(complete) {
    return complete
        ? 'applicant-task-card applicant-task-card--complete'
        : 'applicant-task-card applicant-task-card--pending';
}

function stepStatusClass(status) {
    const value = (status || 'pending').toLowerCase();
    if (value === 'completed') return 'applicant-progress-step applicant-progress-step--completed';
    if (value === 'in_progress') return 'applicant-progress-step applicant-progress-step--active';
    return 'applicant-progress-step applicant-progress-step--pending';
}

function applicantStatusClass(status) {
    const value = (status || '').toLowerCase();
    if (value === 'uploaded') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30';
    if (value === 'pending') return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
    return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
}

export default function ApplicantDashboard({
    profile = {},
    onboarding = {},
    recruitment = {},
    interview = null,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const tasks = Array.isArray(onboarding.tasks) ? onboarding.tasks : [];
    const steps = Array.isArray(recruitment.steps) ? recruitment.steps : [];
    const nextTask = onboarding.next_task;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Dashboard">
            <div className="applicant-dashboard max-w-6xl mx-auto pb-12 space-y-6">
                <section className="applicant-dashboard-hero">
                    <div className="applicant-dashboard-hero__banner" />
                    <div className="applicant-dashboard-hero__body">
                        <div className="flex flex-wrap items-end gap-4 mb-6">
                            <UserAvatar
                                name={profile.name || auth?.name || 'Applicant'}
                                src={profile.photo_url}
                                size="xl"
                                className="applicant-dashboard-hero__avatar"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-500 dark:text-text-muted mb-1">Welcome back</p>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {profile.name || auth?.name || 'Applicant'}
                                </h2>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {profile.department_name && (
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{profile.department_name}</span>
                                    )}
                                    {profile.status && (
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${applicantStatusClass(profile.status)}`}>
                                            {formatStatusLabel(profile.status)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="applicant-dashboard-stat">
                                <p className="applicant-dashboard-stat__label">Your application tasks</p>
                                <p className="applicant-dashboard-stat__value">{onboarding.tasks_percent ?? 0}%</p>
                                <p className="applicant-dashboard-stat__hint">
                                    {onboarding.tasks_complete ?? 0} of {onboarding.tasks_total ?? 0} complete
                                </p>
                                <div className="applicant-dashboard-stat__track">
                                    <div className="applicant-dashboard-stat__bar" style={{ width: `${onboarding.tasks_percent ?? 0}%` }} />
                                </div>
                            </div>
                            <div className="applicant-dashboard-stat">
                                <p className="applicant-dashboard-stat__label">Recruitment progress</p>
                                <p className="applicant-dashboard-stat__value">{recruitment.percent ?? 0}%</p>
                                <p className="applicant-dashboard-stat__hint">
                                    {recruitment.completed_count ?? 0} of {recruitment.total_count ?? 0} stages completed
                                </p>
                                <div className="applicant-dashboard-stat__track">
                                    <div className="applicant-dashboard-stat__bar applicant-dashboard-stat__bar--secondary" style={{ width: `${recruitment.percent ?? 0}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {!onboarding.ready_for_review && nextTask && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Continue your application</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                Next step: {nextTask.label}. {nextTask.description}
                            </p>
                        </div>
                        <Link
                            href={nextTask.href}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Get started
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>
                )}

                {onboarding.ready_for_review && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-800 dark:text-emerald-300">
                        Your application tasks are complete. The recruitment team will review your submission and update your progress below.
                    </div>
                )}

                {interview && (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl">event</span>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Interview scheduled</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{interview.datetime_label}</p>
                            </div>
                        </div>
                        <Link href={interview.href} className="text-sm font-medium text-primary hover:underline">
                            View details
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Your tasks</h3>
                            <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                                Complete these before the recruitment team can fully process your application.
                            </p>
                        </div>
                        <div className="p-4 sm:p-6 space-y-3">
                            {tasks.map((task) => (
                                <Link key={task.key} href={task.href} className={taskStatusClass(task.complete)}>
                                    <span className="material-symbols-outlined applicant-task-card__icon">{task.icon}</span>
                                    <span className="min-w-0 flex-1">
                                        <span className="applicant-task-card__title">{task.label}</span>
                                        <span className="applicant-task-card__description">{task.description}</span>
                                        <span className="applicant-task-card__meta">{task.progress_label}</span>
                                    </span>
                                    <span className="material-symbols-outlined applicant-task-card__chevron">
                                        {task.complete ? 'check_circle' : 'chevron_right'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Recruitment progress</h3>
                            <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                                Track where you are in the recruitment pipeline.
                            </p>
                        </div>
                        <div className="p-4 sm:p-6">
                            {steps.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-text-muted">Progress updates will appear here.</p>
                            ) : (
                                <ol className="applicant-progress-timeline">
                                    {steps.map((step, index) => (
                                        <li key={step.id} className={stepStatusClass(step.status)}>
                                            <div className="applicant-progress-step__marker">
                                                {step.status === 'completed' ? (
                                                    <span className="material-symbols-outlined">check</span>
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <div className="applicant-progress-step__content">
                                                <p className="applicant-progress-step__title">{step.name}</p>
                                                {step.description && (
                                                    <p className="applicant-progress-step__description">{step.description}</p>
                                                )}
                                                <span className="applicant-progress-step__status">
                                                    {formatStatusLabel(step.status, 'Pending')}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
