import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';
import EmptyState from '../../Components/EmptyState';
import { useState } from 'react';
import { useCan } from '../../lib/can';
import { formatDisplayDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

function statusBadge(s) {
    const v = (s || '').toLowerCase();
    if (v === 'scheduled') return 'badge badge-warning';
    if (v === 'approved') return 'badge badge-success';
    if (v === 'rejected') return 'badge badge-danger';
    return 'badge badge-secondary';
}

export default function InterviewsIndex({ interviews = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);
    const list = Array.isArray(interviews) ? interviews : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Interviews">
            <div className="dash-page">
                <div className="dash-page__header d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h2>Interviews</h2>
                        <p>Schedule and manage candidate interviews.</p>
                    </div>
                    {can('interviews.create') && (
                    <Link href="/administrator/interviews/create" className="btn btn-primary btn-sm">
                        <span className="material-symbols-outlined">add</span>
                        Create interview
                    </Link>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title mb-0">All interviews</h3>
                    </div>
                    {list.length === 0 ? (
                        <EmptyState
                            icon="event_busy"
                            title="No interviews"
                            description="Schedule an interview."
                            actionLabel="Create interview"
                            onAction={() => { window.location.href = '/administrator/interviews/create'; }}
                        />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Applicant</th>
                                        <th>Department</th>
                                        <th>Panelists</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th className="admin-table-actions">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((inv, i) => (
                                        <tr key={inv.id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {inv.applicant ? (
                                                    <Link href={`/authorised/view/${inv.applicant.id}`}>
                                                        {inv.applicant.first_name} {inv.applicant.last_name}
                                                        <div className="small text-muted">{inv.applicant.username ?? inv.applicant.email ?? '—'}</div>
                                                    </Link>
                                                ) : '—'}
                                            </td>
                                            <td>{inv.applicant?.department?.name ?? '—'}</td>
                                            <td>{Array.isArray(inv.panelist_names) ? inv.panelist_names.join(', ') : (Array.isArray(inv.panelists) ? inv.panelists.join(', ') : '—')}</td>
                                            <td>{formatDisplayDate(inv.date)}</td>
                                            <td><span className={statusBadge(inv.status)}>{formatStatusLabel(inv.status)}</span></td>
                                            <td className="admin-table-actions">
                                                <ActionGroup>
                                                    <ActionButton action="edit" href={`/administrator/interviews/edit/${inv.id}`} />
                                                    <ActionButton action="manage" href={`/authorised/manage/${inv.id}`} />
                                                    {can('interviews.delete') && (
                                                        <ActionButton action="delete" onClick={() => setDeleteId(inv.id)} />
                                                    )}
                                                </ActionGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`/administrator/interviews/delete/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete interview"
                message="Are you sure you want to delete this interview?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
