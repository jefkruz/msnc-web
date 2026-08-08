import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
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
    const status = first.status || 'scheduled';
    const extra = interviews.length > 1 ? ` (+${interviews.length - 1})` : '';
    return dateStr ? `${dateStr} – ${status}${extra}` : (status + extra) || '—';
}

export default function Index({ applicants = [], departments = [], search: initialSearch = '', filterMonth = null, filterYear = null, monthsWithApplicants = [] }) {
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

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Applicants">
            <div className="dash-page">
                <div className="dash-page__header d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h2>Applicants</h2>
                        <p>
                            {filterMonth && filterYear ? (
                                <>Showing <strong>{applicants.length}</strong> applicants for {MONTH_NAMES[filterMonth]} {filterYear}</>
                            ) : (
                                'Manage and track all recruitment candidates.'
                            )}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-secondary btn-sm">
                            <span className="material-symbols-outlined">file_download</span>
                            Export
                        </button>
                        {can('applicants.create') && (
                        <Link href="/administrator/applicants/create" className="btn btn-primary btn-sm">
                            <span className="material-symbols-outlined">person_add</span>
                            Create applicant
                        </Link>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title mb-0">All applicants</h3>
                    </div>
                    <div className="card-body pb-0">
                        <form onSubmit={handleSearchSubmit} className="admin-table-toolbar mb-3">
                            <input
                                type="text"
                                name="search"
                                defaultValue={initialSearch}
                                placeholder="Search by name, email, or job..."
                                className="form-control"
                                style={{ maxWidth: 280 }}
                            />
                            <div style={{ maxWidth: 200, minWidth: 160 }}>
                                <SearchableSelect
                                    value={filterMonth && filterYear ? `${filterYear}-${filterMonth}` : ''}
                                    onChange={handleMonthChange}
                                    options={monthsWithApplicants.map(({ year, month }) => ({
                                        value: `${year}-${month}`,
                                        label: `${MONTH_NAMES[month]} ${year}`,
                                    }))}
                                    placeholder="All months"
                                />
                            </div>
                            <div style={{ maxWidth: 200, minWidth: 160 }}>
                                <SearchableSelect
                                    value={departmentId}
                                    onChange={setDepartmentId}
                                    options={departments}
                                    placeholder="All departments"
                                    getOptionValue={(d) => d.id}
                                    getOptionLabel={(d) => d.name}
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-primary btn-sm">Search</button>
                        </form>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Name & contact</th>
                                    <th>Department</th>
                                    <th>Job family</th>
                                    <th>Status</th>
                                    <th>Interview date</th>
                                    <th className="admin-table-actions">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleApplicants.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            {initialSearch ? 'No applicants match your search.' : (filterMonth && filterYear) ? `No applicants in ${MONTH_NAMES[filterMonth]} ${filterYear}.` : departmentId ? 'No applicants in this department.' : 'No applicants yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    visibleApplicants.map((applicant, i) => (
                                        <tr key={applicant.id}>
                                            <td className="js-row-sn">{i + 1}</td>
                                            <td>
                                                <Link href={`/authorised/view/${applicant.id}`}>
                                                    {applicant.first_name} {applicant.last_name}
                                                </Link>
                                                <div className="small text-muted">KingsChat: {applicant.username || applicant.email || '—'}</div>
                                            </td>
                                            <td>{applicant.department?.name ?? '—'}</td>
                                            <td>{applicant.family?.name ?? '—'}</td>
                                            <td>
                                                <span className={statusBadgeClass(applicant.status ?? 'Applied')}>
                                                    {formatStatusLabel(applicant.status || 'Applied')}
                                                </span>
                                            </td>
                                            <td>{formatInterviewSummary(applicant.interviews)}</td>
                                            <td className="admin-table-actions">
                                                <ActionGroup>
                                                    <ActionButton action="view" href={`/authorised/view/${applicant.id}`} />
                                                    <ActionButton action="edit" href={`/administrator/applicants/edit/${applicant.id}`} />
                                                    {can('applicants.delete') && (
                                                        <ActionButton action="delete" onClick={() => setDeleteId(applicant.id)} />
                                                    )}
                                                </ActionGroup>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {visibleApplicants.length > 0 && (
                        <div className="card-footer">
                            Showing 1-{visibleApplicants.length} of {visibleApplicants.length} applicants
                        </div>
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
