import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import EmptyState from '../../Components/EmptyState';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';
import { useCan } from '../../lib/can';
import { formatDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

function statusBadgeClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('hire') || s.includes('accept')) return 'badge badge-success';
    if (s.includes('interview')) return 'badge badge-info';
    if (s.includes('review') || s.includes('pending')) return 'badge badge-warning';
    return 'badge badge-primary';
}

function formatInterviewSummary(interviews) {
    if (!Array.isArray(interviews) || interviews.length === 0) return '—';
    const first = interviews[0];
    const dateStr = first.date ? formatDate(first.date, '') : '';
    const status = formatStatusLabel(first.status || 'scheduled');
    const extra = interviews.length > 1 ? ` (+${interviews.length - 1})` : '';
    return dateStr ? `${dateStr} – ${status}${extra}` : `${status}${extra}`;
}

function applicantName(applicant) {
    return [applicant.title, applicant.first_name, applicant.last_name].filter(Boolean).join(' ') || '—';
}

function applicantContact(applicant) {
    return applicant.username || applicant.email || applicant.phone || '—';
}

export default function SdmApplicants({ applicants = [], search: initialSearch = '' }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const canCreate = can('applicants.create');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        router.get('/sdm/applicants', q ? { search: q } : {}, { preserveState: false });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Applicants">
            <div className="dash-page min-w-0">
                <div className="dash-page__header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2>Applicants</h2>
                        <p>Candidates in your department.</p>
                    </div>
                    {canCreate && (
                        <Link href="/sdm/applicants/create" className="btn btn-primary btn-sm w-full sm:w-auto justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">person_add</span>
                            Create applicant
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm min-w-0">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Department applicants</h3>
                            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 w-full min-w-0 lg:max-w-md">
                                <div className="relative flex-1 min-w-0">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted text-xl pointer-events-none">search</span>
                                    <input
                                        type="search"
                                        name="search"
                                        defaultValue={initialSearch}
                                        placeholder="Search name, username, or job family…"
                                        className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted"
                                    />
                                </div>
                                <button type="submit" className="btn btn-outline-primary btn-sm w-full sm:w-auto justify-center flex-shrink-0">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {applicants.length === 0 ? (
                        <EmptyState
                            icon="group"
                            title={initialSearch ? 'No matches' : 'No applicants yet'}
                            description={initialSearch ? 'Try a different search term.' : 'No applicants in your department yet.'}
                            actionLabel={canCreate && !initialSearch ? 'Create applicant' : undefined}
                            onAction={() => router.visit('/sdm/applicants/create')}
                            className="m-8"
                        />
                    ) : (
                        <>
                            <div className="md:overflow-x-auto">
                                <table className="msnc-data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name &amp; contact</th>
                                            <th>Department</th>
                                            <th>Job family</th>
                                            <th>Status</th>
                                            <th>Interview</th>
                                            <th className="admin-table-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map((applicant, i) => (
                                            <tr key={applicant.id}>
                                                <td className="msnc-data-table__sn text-slate-700 dark:text-slate-300">{i + 1}</td>
                                                <td className="msnc-data-table__primary msnc-data-table__entity" data-label="Name">
                                                    <Link href={`/authorised/view/${applicant.id}`}>{applicantName(applicant)}</Link>
                                                    <div className="msnc-data-table__meta">KingsChat: {applicantContact(applicant)}</div>
                                                </td>
                                                <td data-label="Department">{applicant.department?.name ?? '—'}</td>
                                                <td data-label="Job family">{applicant.family?.name ?? applicant.category?.name ?? '—'}</td>
                                                <td data-label="Status">
                                                    <span className={statusBadgeClass(applicant.status ?? 'Applied')}>
                                                        {formatStatusLabel(applicant.status || 'Applied')}
                                                    </span>
                                                </td>
                                                <td data-label="Interview">{formatInterviewSummary(applicant.interviews)}</td>
                                                <td className="admin-table-actions msnc-data-table__actions" data-label="Actions">
                                                    <ActionGroup>
                                                        <ActionButton action="view" href={`/authorised/view/${applicant.id}`} />
                                                    </ActionGroup>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-border-dark text-sm text-slate-500 dark:text-text-muted">
                                {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
