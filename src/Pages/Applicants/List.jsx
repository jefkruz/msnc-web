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

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MONTH_OPTIONS = MONTH_NAMES.slice(1).map((name, index) => ({
    value: String(index + 1),
    label: name,
}));

const LIST_NAV = [
    {
        listType: 'staff',
        path: '/administrator/applicants/staff',
        label: 'Added by staff',
        countKey: 'staff',
    },
    {
        listType: 'self-registration',
        path: '/administrator/applicants/self-registration',
        label: 'Opportunity to work in ministry',
        countKey: 'public',
    },
];

const LIST_META = {
    staff: {
        title: 'Added by staff',
        description: 'Applicants created by administrators or SDMs.',
        emptyDefault: 'No staff-added applicants yet.',
        showCreate: true,
        showDepartment: true,
        showJobFamily: true,
    },
    'self-registration': {
        title: 'Opportunity to work in ministry',
        description: 'Applicants who self-registered online.',
        emptyDefault: 'No self registrations yet.',
        showCreate: false,
        showDepartment: false,
        showJobFamily: false,
    },
};

function periodSummary({ filterMonth, filterYear, count }) {
    if (filterMonth && filterYear) {
        return <>Showing <strong>{count}</strong> applicants for {MONTH_NAMES[filterMonth]} {filterYear}</>;
    }
    if (filterYear) {
        return <>Showing <strong>{count}</strong> applicants for {filterYear}</>;
    }
    return null;
}

function listParams({ search, filterMonth, filterYear, departmentId, sort = 'date', dir = 'desc' }) {
    const params = {};
    if (search) params.search = search;
    if (departmentId) params.department_id = departmentId;
    if (filterYear) params.year = filterYear;
    if (filterMonth) params.month = filterMonth;
    if (sort !== 'date') params.sort = sort;
    if (dir !== 'desc') params.dir = dir;
    return params;
}

function sortIcon(sort, dir, column) {
    if (sort !== column) return 'unfold_more';
    return dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
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

export default function ApplicantsList({
    applicants = [],
    departments = [],
    search: initialSearch = '',
    sourceCounts = { all: 0, staff: 0, public: 0 },
    filterDepartmentId = null,
    filterMonth = null,
    filterYear = null,
    availableYears = [],
    sort = 'date',
    dir = 'desc',
    listType = 'staff',
}) {
    const meta = LIST_META[listType] ?? LIST_META.staff;
    const basePath = LIST_NAV.find((item) => item.listType === listType)?.path ?? '/administrator/applicants/staff';

    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);

    const departmentId = filterDepartmentId ? String(filterDepartmentId) : '';
    const activeDepartment = departments.find((d) => String(d.id) === departmentId);

    const visitList = (overrides = {}) => {
        router.get(basePath, listParams({
            search: initialSearch || undefined,
            departmentId,
            filterMonth,
            filterYear,
            sort,
            dir,
            ...overrides,
        }), { preserveState: false });
    };

    const toggleSort = (column) => {
        if (sort === column) {
            visitList({ dir: dir === 'asc' ? 'desc' : 'asc' });
            return;
        }
        visitList({ sort: column, dir: column === 'date' ? 'desc' : 'asc' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        visitList({ search: q || undefined });
    };

    const handleYearChange = (v) => {
        const nextYear = v ? Number(v) : null;
        visitList({
            filterYear: nextYear || undefined,
            filterMonth: nextYear ? filterMonth || undefined : undefined,
        });
    };

    const handleMonthChange = (v) => {
        if (!filterYear) return;
        visitList({ filterMonth: v ? Number(v) : undefined });
    };

    const handleDepartmentChange = (nextDepartmentId) => {
        visitList({ departmentId: nextDepartmentId || undefined });
    };

    const emptyDescription = initialSearch
        ? 'Try a different search term.'
        : (filterMonth && filterYear)
            ? `No applicants in ${MONTH_NAMES[filterMonth]} ${filterYear}.`
            : filterYear
                ? `No applicants in ${filterYear}.`
                : departmentId
                    ? 'No applicants in this department.'
                    : meta.emptyDefault;

    const filterGridClass = meta.showDepartment
        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_7rem_8rem_12rem_auto] gap-2 w-full min-w-0 lg:max-w-4xl'
        : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_7rem_8rem_auto] gap-2 w-full min-w-0 lg:max-w-3xl';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={meta.title}>
            <div className="dash-page min-w-0">
                <div className="dash-page__header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2>{meta.title}</h2>
                        <p>
                            {periodSummary({ filterMonth, filterYear, count: applicants.length }) ?? (
                                activeDepartment ? (
                                    <>Applicants in <strong>{departmentName(activeDepartment)}</strong>.</>
                                ) : (
                                    meta.description
                                )
                            )}
                        </p>
                    </div>
                    {meta.showCreate && can('applicants.create') && (
                        <Link href="/administrator/applicants/create" className="btn btn-primary btn-sm w-full sm:w-auto justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">person_add</span>
                            Create applicant
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm min-w-0">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-wrap gap-2">
                        {LIST_NAV.map((item) => {
                            const active = item.listType === listType;
                            const count = sourceCounts?.[item.countKey] ?? 0;
                            return (
                                <Link
                                    key={item.listType}
                                    href={item.path}
                                    className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-primary'}`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {item.label}
                                    <span className="ml-1 opacity-80">({count})</span>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{meta.title}</h3>
                            <form onSubmit={handleSearchSubmit} className={filterGridClass}>
                                <div className="relative sm:col-span-2 xl:col-span-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted text-xl pointer-events-none">search</span>
                                    <input
                                        type="search"
                                        name="search"
                                        defaultValue={initialSearch}
                                        placeholder={meta.showJobFamily ? 'Search name, username, or job family…' : 'Search name, username, or email…'}
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
                                {meta.showDepartment && (
                                    <SearchableSelect
                                        value={departmentId}
                                        onChange={handleDepartmentChange}
                                        options={departments}
                                        placeholder="All departments"
                                        getOptionValue={(d) => d.id}
                                        getOptionLabel={(d) => d.name}
                                    />
                                )}
                                <button type="submit" className="btn btn-outline-primary btn-sm w-full xl:w-auto justify-center">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {applicants.length === 0 ? (
                        <EmptyState
                            icon="group"
                            title={initialSearch || departmentId || filterYear || (filterMonth && filterYear) ? 'No matches' : 'No applicants yet'}
                            description={emptyDescription}
                            actionLabel={meta.showCreate && can('applicants.create') && !initialSearch && !departmentId && !filterYear ? 'Create applicant' : undefined}
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
                                            <th>
                                                <button type="button" className="table-sort" onClick={() => toggleSort('name')}>
                                                    Name &amp; contact
                                                    <span className="material-symbols-outlined">{sortIcon(sort, dir, 'name')}</span>
                                                </button>
                                            </th>
                                            {meta.showDepartment && (
                                                <th>
                                                    <button type="button" className="table-sort" onClick={() => toggleSort('department')}>
                                                        Department
                                                        <span className="material-symbols-outlined">{sortIcon(sort, dir, 'department')}</span>
                                                    </button>
                                                </th>
                                            )}
                                            {meta.showJobFamily && <th>Job family</th>}
                                            <th>
                                                <button type="button" className="table-sort" onClick={() => toggleSort('status')}>
                                                    Status
                                                    <span className="material-symbols-outlined">{sortIcon(sort, dir, 'status')}</span>
                                                </button>
                                            </th>
                                            <th>
                                                <button type="button" className="table-sort" onClick={() => toggleSort('date')}>
                                                    Date
                                                    <span className="material-symbols-outlined">{sortIcon(sort, dir, 'date')}</span>
                                                </button>
                                            </th>
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
                                                {meta.showDepartment && (
                                                    <td data-label="Department">{departmentName(applicant.department)}</td>
                                                )}
                                                {meta.showJobFamily && (
                                                    <td data-label="Job family">{applicant.family?.name ?? '—'}</td>
                                                )}
                                                <td data-label="Status">
                                                    <span className={statusBadgeClass(applicant.status ?? 'Applied')}>
                                                        {formatStatusLabel(applicant.status || 'Applied')}
                                                    </span>
                                                </td>
                                                <td data-label="Date">{applicantAddedDate(applicant)}</td>
                                                <td className="admin-table-actions msnc-data-table__actions" data-label="Actions">
                                                    <ActionGroup>
                                                        <ActionButton action="view" href={`/authorised/view/${applicant.id}`} />
                                                        {listType === 'staff' && (
                                                            <ActionButton action="edit" href={`/administrator/applicants/edit/${applicant.id}`} />
                                                        )}
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
                                {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
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
