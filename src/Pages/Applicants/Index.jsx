import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';
import SearchableSelect from '../../Components/SearchableSelect';
import { useCan } from '../../lib/can';
import { formatDisplayDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';
import { departmentName, personName } from '../../lib/titleCase';
import {
    SOURCE_PUBLIC,
    SOURCE_STAFF,
    applicantSourceBadgeClass,
    applicantSourceFromRecord,
    applicantSourceLabel,
} from '../../lib/applicantSource';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MONTH_OPTIONS = MONTH_NAMES.slice(1).map((name, index) => ({
    value: String(index + 1),
    label: name,
}));

const SOURCE_TABS = [
    { value: null, label: 'All applicants', countKey: 'all' },
    { value: SOURCE_STAFF, label: 'Added by staff', countKey: 'staff' },
    { value: SOURCE_PUBLIC, label: 'Ministry registration', countKey: 'public' },
];

function periodSummary({ filterMonth, filterYear, count }) {
    if (filterMonth && filterYear) {
        return <>Showing <strong>{count}</strong> applicants for {MONTH_NAMES[filterMonth]} {filterYear}</>;
    }
    if (filterYear) {
        return <>Showing <strong>{count}</strong> applicants for {filterYear}</>;
    }
    return null;
}

function listParams({ search, source, filterMonth, filterYear, departmentId }) {
    const params = {};
    if (search) params.search = search;
    if (source) params.source = source;
    if (departmentId) params.department_id = departmentId;
    if (filterYear) params.year = filterYear;
    if (filterMonth) params.month = filterMonth;
    return params;
}

function statusBadgeClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('hire') || s.includes('accept')) return 'badge badge-success';
    if (s.includes('interview')) return 'badge badge-info';
    if (s.includes('review') || s.includes('pending')) return 'badge badge-warning';
    return 'badge badge-primary';
}

function applicantAddedDate(applicant) {
    return formatDisplayDate(applicant.created_at ?? applicant.date);
}

function applicantName(applicant) {
    return personName(applicant.title, applicant.first_name, applicant.last_name);
}

function applicantContact(applicant) {
    return applicant.username || applicant.email || applicant.phone || '—';
}

export default function Index({
    applicants = [],
    departments = [],
    search: initialSearch = '',
    source: initialSource = null,
    sourceCounts = { all: 0, staff: 0, public: 0 },
    filterDepartmentId = null,
    filterMonth = null,
    filterYear = null,
    availableYears = [],
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);

    const departmentId = filterDepartmentId ? String(filterDepartmentId) : '';
    const activeDepartment = departments.find((d) => String(d.id) === departmentId);
    const visibleApplicants = applicants;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        router.get('/administrator/applicants', listParams({
            search: q || undefined,
            source: initialSource,
            departmentId,
            filterMonth,
            filterYear,
        }), { preserveState: false });
    };

    const handleYearChange = (v) => {
        const nextYear = v ? Number(v) : null;
        router.get('/administrator/applicants', listParams({
            search: initialSearch || undefined,
            source: initialSource,
            departmentId,
            filterYear: nextYear || undefined,
            filterMonth: nextYear ? filterMonth || undefined : undefined,
        }), { preserveState: false });
    };

    const handleMonthChange = (v) => {
        if (!filterYear) return;
        router.get('/administrator/applicants', listParams({
            search: initialSearch || undefined,
            source: initialSource,
            departmentId,
            filterYear,
            filterMonth: v ? Number(v) : undefined,
        }), { preserveState: false });
    };

    const handleSourceChange = (nextSource) => {
        router.get('/administrator/applicants', listParams({
            search: initialSearch || undefined,
            source: nextSource,
            departmentId,
            filterMonth,
            filterYear,
        }), { preserveState: false });
    };

    const handleDepartmentChange = (nextDepartmentId) => {
        router.get('/administrator/applicants', listParams({
            search: initialSearch || undefined,
            source: initialSource,
            departmentId: nextDepartmentId || undefined,
            filterMonth,
            filterYear,
        }), { preserveState: false });
    };

    const activeSourceTab = SOURCE_TABS.find((tab) => tab.value === initialSource) ?? SOURCE_TABS[0];

    const emptyDescription = initialSearch
        ? 'Try a different search term.'
        : (filterMonth && filterYear)
            ? `No applicants in ${MONTH_NAMES[filterMonth]} ${filterYear}.`
            : filterYear
                ? `No applicants in ${filterYear}.`
                : departmentId
                ? 'No applicants in this department.'
                : initialSource === SOURCE_PUBLIC
                    ? 'No ministry registrations yet.'
                    : initialSource === SOURCE_STAFF
                        ? 'No staff-added applicants yet.'
                        : 'Create an applicant to get started.';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Applicants">
            <div className="dash-page min-w-0">
                <div className="dash-page__header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2>Applicants</h2>
                        <p>
                            {periodSummary({ filterMonth, filterYear, count: visibleApplicants.length }) ?? (
                                activeDepartment ? (
                                    <>Applicants in <strong>{departmentName(activeDepartment)}</strong>.</>
                                ) : initialSource === SOURCE_PUBLIC ? (
                                    'Self-registered through Opportunity to work in ministry.'
                                ) : initialSource === SOURCE_STAFF ? (
                                    'Applicants created by administrators or SDMs.'
                                ) : (
                                    'Manage and track all recruitment candidates.'
                                )
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
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-wrap gap-2">
                        {SOURCE_TABS.map((tab) => {
                            const active = tab.value === initialSource;
                            const count = sourceCounts?.[tab.countKey] ?? 0;
                            return (
                                <button
                                    key={tab.countKey}
                                    type="button"
                                    className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleSourceChange(tab.value)}
                                    aria-pressed={active}
                                >
                                    {tab.label}
                                    <span className="ml-1 opacity-80">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{activeSourceTab.label}</h3>
                            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_7rem_8rem_12rem_auto] gap-2 w-full min-w-0 lg:max-w-4xl">
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
                                    value={filterYear ? String(filterYear) : ''}
                                    onChange={handleYearChange}
                                    options={(availableYears.length ? availableYears : [new Date().getFullYear()]).map((year) => ({
                                        value: String(year),
                                        label: String(year),
                                    }))}
                                    placeholder="All years"
                                />
                                <SearchableSelect
                                    value={filterMonth ? String(filterMonth) : ''}
                                    onChange={handleMonthChange}
                                    options={MONTH_OPTIONS}
                                    placeholder={filterYear ? 'All months' : 'Select year'}
                                    disabled={!filterYear}
                                />
                                <SearchableSelect
                                    value={departmentId}
                                    onChange={handleDepartmentChange}
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
                            title={initialSearch || departmentId || filterYear || (filterMonth && filterYear) ? 'No matches' : 'No applicants yet'}
                            description={emptyDescription}
                            actionLabel={can('applicants.create') && !initialSearch && !departmentId && !filterYear ? 'Create applicant' : undefined}
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
                                            <th>Source</th>
                                            <th>Department</th>
                                            <th>Job family</th>
                                            <th>Status</th>
                                            <th>Date</th>
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
                                                <td data-label="Source">
                                                    {(() => {
                                                        const src = applicantSourceFromRecord(applicant);
                                                        return (
                                                            <span className={applicantSourceBadgeClass(src)}>
                                                                {applicantSourceLabel(src)}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td data-label="Department">{departmentName(applicant.department)}</td>
                                                <td data-label="Job family">{applicant.family?.name ?? '—'}</td>
                                                <td data-label="Status">
                                                    <span className={statusBadgeClass(applicant.status ?? 'Applied')}>
                                                        {formatStatusLabel(applicant.status || 'Applied')}
                                                    </span>
                                                </td>
                                                <td data-label="Date">{applicantAddedDate(applicant)}</td>
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
                                {filterYear && !departmentId ? (filterMonth ? ` in ${MONTH_NAMES[filterMonth]} ${filterYear}` : ` in ${filterYear}`) : ''}
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
