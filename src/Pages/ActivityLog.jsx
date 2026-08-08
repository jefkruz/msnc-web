import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import SearchableSelect from '../Components/SearchableSelect';

const TYPE_BADGE = {
    applicant: 'badge badge-primary',
    interview: 'badge badge-info',
    personnel: 'badge badge-warning',
};

function statusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('hire') || s.includes('accept') || s === 'approved' || s === 'completed') return 'badge badge-success';
    if (s.includes('interview') || s === 'scheduled') return 'badge badge-warning';
    if (s.includes('reject') || s === 'rejected') return 'badge badge-danger';
    if (s.includes('review') || s.includes('pending') || s === 'in_progress') return 'badge badge-info';
    return 'badge badge-secondary';
}

export default function ActivityLog({
    items = [],
    subtitle = null,
    search: initialSearch = '',
    type = 'all',
    sort = 'when',
    dir = 'desc',
    page = 1,
    per_page: perPage = 25,
    total = 0,
    last_page: lastPage = 1,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const list = Array.isArray(items) ? items : [];
    const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/sdm/')
        ? '/sdm/activity-log'
        : '/administrator/activity-log';

    const visit = (overrides = {}) => {
        const params = {
            search: initialSearch || undefined,
            type: type !== 'all' ? type : undefined,
            sort: sort !== 'when' ? sort : undefined,
            dir: dir !== 'desc' ? dir : undefined,
            per_page: perPage !== 25 ? perPage : undefined,
            page: page > 1 ? page : undefined,
            ...overrides,
        };
        Object.keys(params).forEach((key) => {
            if (params[key] === undefined || params[key] === '' || params[key] === null) {
                delete params[key];
            }
        });
        router.get(basePath, params, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const q = (e.currentTarget.search?.value || '').trim();
        visit({ search: q || undefined, page: undefined });
    };

    const toggleSort = (column) => {
        if (sort === column) {
            visit({ sort: column, dir: dir === 'asc' ? 'desc' : 'asc', page: undefined });
            return;
        }
        visit({ sort: column, dir: column === 'when' ? 'desc' : 'asc', page: undefined });
    };

    const sortIcon = (column) => {
        if (sort !== column) return 'unfold_more';
        return dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
    };

    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(total, page * perPage);

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Activity Log">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Activity Log</h2>
                    <p>{subtitle || 'Recent applications, interviews, and personnel updates.'}</p>
                </div>

                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h3 className="card-title mb-0">All activity</h3>
                        <span className="small text-muted">
                            {total} {total === 1 ? 'entry' : 'entries'}
                        </span>
                    </div>
                    <div className="card-body pb-0">
                        <form onSubmit={handleSearch} className="admin-table-toolbar mb-3">
                            <input
                                type="search"
                                name="search"
                                defaultValue={initialSearch}
                                placeholder="Search name, job, status…"
                                className="form-control"
                                style={{ maxWidth: 280 }}
                            />
                            <div style={{ maxWidth: 180, minWidth: 140 }}>
                                <SearchableSelect
                                    value={type || 'all'}
                                    onChange={(val) => visit({ type: val === 'all' ? undefined : val, page: undefined })}
                                    options={[
                                        { value: 'all', label: 'All types' },
                                        { value: 'applicant', label: 'Applications' },
                                        { value: 'interview', label: 'Interviews' },
                                        { value: 'personnel', label: 'Personnel' },
                                    ]}
                                    placeholder="All types"
                                    required
                                />
                            </div>
                            <div style={{ maxWidth: 140, minWidth: 120 }}>
                                <SearchableSelect
                                    value={perPage}
                                    onChange={(val) => visit({ per_page: Number(val) === 25 ? undefined : Number(val), page: undefined })}
                                    options={[
                                        { value: 10, label: '10 / page' },
                                        { value: 25, label: '25 / page' },
                                        { value: 50, label: '50 / page' },
                                        { value: 100, label: '100 / page' },
                                    ]}
                                    placeholder="Per page"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-primary btn-sm">Search</button>
                        </form>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped activity-log-table">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>
                                        <button type="button" className="table-sort" onClick={() => toggleSort('type')}>
                                            Type
                                            <span className="material-symbols-outlined">{sortIcon('type')}</span>
                                        </button>
                                    </th>
                                    <th>
                                        <button type="button" className="table-sort" onClick={() => toggleSort('title')}>
                                            Name
                                            <span className="material-symbols-outlined">{sortIcon('title')}</span>
                                        </button>
                                    </th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>
                                        <button type="button" className="table-sort" onClick={() => toggleSort('when')}>
                                            When
                                            <span className="material-symbols-outlined">{sortIcon('when')}</span>
                                        </button>
                                    </th>
                                    <th className="admin-table-actions">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            {initialSearch || type !== 'all'
                                                ? 'No activity matches your filters.'
                                                : 'No activity yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((item, i) => (
                                        <tr key={`${item.type}-${item.id}`}>
                                            <td>{from + i}</td>
                                            <td>
                                                <span className={TYPE_BADGE[item.type] || 'badge badge-secondary'}>
                                                    {item.type_label || item.type}
                                                </span>
                                            </td>
                                            <td className="admin-table-entity">
                                                <Link href={item.href || '#'}>{item.title}</Link>
                                            </td>
                                            <td className="admin-table-entity">{item.description}</td>
                                            <td>
                                                <span className={statusBadge(item.status)}>{item.status || '—'}</span>
                                            </td>
                                            <td>
                                                <div>{item.when_label || '—'}</div>
                                                {item.time_ago ? (
                                                    <div className="small text-muted">{item.time_ago}</div>
                                                ) : null}
                                            </td>
                                            <td className="admin-table-actions">
                                                <Link href={item.href || '#'} className="btn btn-outline-primary btn-sm">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {lastPage > 1 ? (
                        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <span className="small text-muted">
                                Showing {from}–{to} of {total}
                            </span>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={page <= 1}
                                    onClick={() => visit({ page: page - 1 <= 1 ? undefined : page - 1 })}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={page >= lastPage}
                                    onClick={() => visit({ page: page + 1 })}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </Layout>
    );
}
