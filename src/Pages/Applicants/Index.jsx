import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';
import SearchableSelect from '../../Components/SearchableSelect';
import { useCan } from '../../lib/can';
import { formatDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

export default function Index({
    applicants = [],
    departments = [],
    search: initialSearch = '',
    filterMonth = null,
    filterYear = null,
    monthsWithApplicants = [],
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);
    const [departmentId, setDepartmentId] = useState('');

    const visibleApplicants = departmentId
        ? applicants.filter((a) => String(a.department_id ?? a.department?.id) === String(departmentId))
        : applicants;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        const params = q ? { search: q } : {};
        if (filterMonth && filterYear) {
            params.month = filterMonth;
            params.year = filterYear;
        }
        router.get('/administrator/applicants', params, { preserveState: false });
    };

    const handleMonthChange = (v) => {
        if (!v) {
            router.get('/administrator/applicants', { search: initialSearch || undefined }, { preserveState: false });
            return;
        }
        const [y, m] = String(v).split('-').map(Number);
        const params = { month: m, year: y };
        if (initialSearch) params.search = initialSearch;
        router.get('/administrator/applicants', params, { preserveState: false });
    };

    const emptyDescription = initialSearch
        ? 'Try a different search term.'
        : (filterMonth && filterYear)
            ? `No applicants in ${MONTH_NAMES[filterMonth]} ${filterYear}.`
            : departmentId
                ? 'No applicants in this department.'
                : 'Create an applicant to get started.';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Applicants">
            <div className="dash-page min-w-0">
                <div className="dash-page__header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2>Applicants</h2>
                        <p>
                            {filterMonth && filterYear ? (
                                <>Showing <strong>{visibleApplicants.length}</strong> applicants for {MONTH_NAMES[filterMonth]} {filterYear}</>
                            ) : (
                                'Manage and track all recruitment candidates.'
                            )}
                        </p>
                    </div>
                    {can('applicants.create') && (
                        <Link href="/administrator/applicants/create" className="btn btn-primary btn-sm w-full sm:w-auto justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">person_add</span>
                            Create applicant
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm min-w-0">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">All applicants</h3>
                            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_11rem_12rem_auto] gap-2 w-full min-w-0 lg:max-w-3xl">
                                <div className="relative sm:col-span-2 xl:col-span-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted text-xl pointer-events-none">search</span>
                                    <input
                                        type="search"
                                        name="search"
                                        defaultValue={initialSearch}
                                        placeholder="Search name, username, or job family…"
                                        className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted"
                                    />
                                </div>
                                <SearchableSelect
                                    value={filterMonth && filterYear ? `${filterYear}-${filterMonth}` : ''}
                                    onChange={handleMonthChange}
                                    options={monthsWithApplicants.map(({ year, month }) => ({
                                        value: `${year}-${month}`,
                                        label: `${MONTH_NAMES[month]} ${year}`,
                                    }))}
                                    placeholder="All months"
                                />
                                <SearchableSelect
                                    value={departmentId}
                                    onChange={setDepartmentId}
                                    options={departments}
                                    placeholder="All departments"
                                    getOptionValue={(d) => d.id}
                                    getOptionLabel={(d) => d.name}
                                />
                                <button type="submit" className="btn btn-outline-primary btn-sm w-full xl:w-auto justify-center">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {visibleApplicants.length === 0 ? (
                        <EmptyState
                            icon="group"
                            title={initialSearch || departmentId || (filterMonth && filterYear) ? 'No matches' : 'No applicants yet'}
                            description={emptyDescription}
                            actionLabel={can('applicants.create') && !initialSearch && !departmentId ? 'Create applicant' : undefined}
                            onAction={() => router.visit('/administrator/applicants/create')}
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
                                        {visibleApplicants.map((applicant, i) => (
                                            <tr key={applicant.id}>
                                                <td className="msnc-data-table__sn text-slate-700 dark:text-slate-300">{i + 1}</td>
                                                <td className="msnc-data-table__primary msnc-data-table__entity" data-label="Name">
                                                    <Link href={`/authorised/view/${applicant.id}`}>{applicantName(applicant)}</Link>
                                                    <div className="msnc-data-table__meta">KingsChat: {applicantContact(applicant)}</div>
                                                </td>
                                                <td data-label="Department">{applicant.department?.name ?? '—'}</td>
                                                <td data-label="Job family">{applicant.family?.name ?? '—'}</td>
                                                <td data-label="Status">
                                                    <span className={statusBadgeClass(applicant.status ?? 'Applied')}>
                                                        {formatStatusLabel(applicant.status || 'Applied')}
                                                    </span>
                                                </td>
                                                <td data-label="Interview">{formatInterviewSummary(applicant.interviews)}</td>
                                                <td className="admin-table-actions msnc-data-table__actions" data-label="Actions">
                                                    <ActionGroup>
                                                        <ActionButton action="view" href={`/authorised/view/${applicant.id}`} />
                                                        <ActionButton action="edit" href={`/administrator/applicants/edit/${applicant.id}`} />
                                                        {can('applicants.delete') && (
                                                            <ActionButton action="delete" onClick={() => setDeleteId(applicant.id)} />
                                                        )}
                                                    </ActionGroup>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-border-dark text-sm text-slate-500 dark:text-text-muted">
                                {visibleApplicants.length} {visibleApplicants.length === 1 ? 'applicant' : 'applicants'}
                                {departmentId ? ' in this department' : ''}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`/administrator/applicants/delete/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete applicant"
                message="Are you sure you want to delete this applicant? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
