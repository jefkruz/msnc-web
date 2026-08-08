import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import Alert from '../../Components/Alert';
import { useCan } from '../../lib/can';

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
    const dateStr = first.date ? new Date(first.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const status = first.status || 'scheduled';
    const extra = interviews.length > 1 ? ` (+${interviews.length - 1})` : '';
    return dateStr ? `${dateStr} – ${status}${extra}` : (status + extra) || '—';
}

export default function Index({ applicants = [], departments = [], search: initialSearch = '', filterMonth = null, filterYear = null, monthsWithApplicants = [] }) {
    const { auth, authRole, menu, appName, flash } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);

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

    const handleMonthChange = (e) => {
        const v = e.target.value;
        if (!v) {
            router.get('/administrator/applicants', { search: initialSearch || undefined }, { preserveState: false });
            return;
        }
        const [y, m] = v.split('-').map(Number);
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

                {flash?.message && <Alert type="success" message={flash.message} />}

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
                            <select
                                value={filterMonth && filterYear ? `${filterYear}-${filterMonth}` : ''}
                                onChange={handleMonthChange}
                                className="form-control"
                                style={{ maxWidth: 200 }}
                            >
                                <option value="">All months</option>
                                {monthsWithApplicants.map(({ year, month }) => (
                                    <option key={`${year}-${month}`} value={`${year}-${month}`}>
                                        {MONTH_NAMES[month]} {year}
                                    </option>
                                ))}
                            </select>
                            <select className="form-control" style={{ maxWidth: 200 }}>
                                <option>All departments</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
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
                                {applicants.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            {initialSearch ? 'No applicants match your search.' : (filterMonth && filterYear) ? `No applicants in ${MONTH_NAMES[filterMonth]} ${filterYear}.` : 'No applicants yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    applicants.map((applicant, i) => (
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
                                                    {applicant.status || 'Applied'}
                                                </span>
                                            </td>
                                            <td>{formatInterviewSummary(applicant.interviews)}</td>
                                            <td className="admin-table-actions">
                                                <Link href={`/authorised/view/${applicant.id}`} className="btn btn-outline-primary btn-sm" title="View">View</Link>
                                                <Link href={`/administrator/applicants/edit/${applicant.id}`} className="btn btn-secondary btn-sm" title="Edit">Edit</Link>
                                                {can('applicants.delete') && (
                                                <button type="button" onClick={() => setDeleteId(applicant.id)} className="btn btn-outline-danger btn-sm" title="Delete">Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {applicants.length > 0 && (
                        <div className="card-footer">
                            Showing 1-{applicants.length} of {applicants.length} applicants
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
