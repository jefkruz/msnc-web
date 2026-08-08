import { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import { useCan } from '../../lib/can';

const STATUS_LABELS = {
    in_progress: 'In progress',
    due: 'Due',
    completed: 'Completed',
    rejected: 'Rejected',
    extended: 'Extended',
};

function formatDate(d) {
    if (!d) return '—';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PersonnelInWaitingShow({ person, departments = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [completeModal, setCompleteModal] = useState(false);
    const [extendModal, setExtendModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [completeRemarks, setCompleteRemarks] = useState('');
    const [extendEndDate, setExtendEndDate] = useState(() => {
        const d = person?.end_date;
        if (!d) return '';
        const date = typeof d === 'string' ? new Date(d) : d;
        return date.toISOString().slice(0, 10);
    });
    const [rejectRemarks, setRejectRemarks] = useState('');

    const base = '/authorised/personnel-in-waiting';
    const id = person?.id;
    const name = [person?.title, person?.firstname, person?.lastname].filter(Boolean).join(' ');
    const canAct = person && !['completed', 'rejected'].includes(person.status);

    const handleComplete = (e) => {
        e.preventDefault();
        router.post(`${base}/${id}/complete`, { remarks: completeRemarks }, {
            preserveScroll: true,
            onSuccess: () => { setCompleteModal(false); setCompleteRemarks(''); },
        });
    };

    const handleExtend = (e) => {
        e.preventDefault();
        if (!extendEndDate) return;
        router.post(`${base}/${id}/extend`, { end_date: extendEndDate }, {
            preserveScroll: true,
            onSuccess: () => { setExtendModal(false); },
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        router.post(`${base}/${id}/reject`, { remarks: rejectRemarks }, {
            preserveScroll: true,
            onSuccess: () => { setRejectModal(false); setRejectRemarks(''); },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={name || 'Personnel in Waiting'}>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href={base} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to list
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`${base}/${id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium text-sm"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span> Edit
                        </Link>
                        {can('personnel-in-waiting.delete') && id && (
                            <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Delete</button>
                        )}
                        {canAct && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setCompleteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700"
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span> Mark completed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExtendModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700"
                                >
                                    <span className="material-symbols-outlined text-lg">schedule</span> Extend end date
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRejectModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700"
                                >
                                    <span className="material-symbols-outlined text-lg">cancel</span> Reject
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name || '—'}</h2>
                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                            Status: <span className="font-medium text-slate-700 dark:text-slate-300">{STATUS_LABELS[person?.status] || person?.status}</span>
                        </p>
                    </div>
                    <dl className="px-6 py-4 space-y-3">
                        <div>
                            <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">Phone</dt>
                            <dd className="text-slate-900 dark:text-white mt-0.5">{person?.phone ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">Department</dt>
                            <dd className="text-slate-900 dark:text-white mt-0.5">{person?.department?.name ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">Username</dt>
                            <dd className="text-slate-900 dark:text-white mt-0.5">{person?.username ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">Start date</dt>
                            <dd className="text-slate-900 dark:text-white mt-0.5">{formatDate(person?.start_date)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">End date</dt>
                            <dd className="text-slate-900 dark:text-white mt-0.5">{formatDate(person?.end_date)}</dd>
                        </div>
                        {person?.remarks && (
                            <div>
                                <dt className="text-xs font-semibold text-slate-500 dark:text-text-muted uppercase tracking-wider">Remarks</dt>
                                <dd className="text-slate-900 dark:text-white mt-0.5 whitespace-pre-wrap">{person.remarks}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            <Modal
                show={completeModal}
                onClose={() => setCompleteModal(false)}
                title="Mark as completed"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setCompleteModal(false)}>Cancel</button>
                        <button type="submit" form="piw-complete" className="btn btn-success">Confirm completed</button>
                    </>
                )}
            >
                <form id="piw-complete" onSubmit={handleComplete} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Remarks (optional)</label>
                        <textarea
                            value={completeRemarks}
                            onChange={(e) => setCompleteRemarks(e.target.value)}
                            rows={3}
                            className="form-control"
                            placeholder="Add any remarks..."
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                show={extendModal}
                onClose={() => setExtendModal(false)}
                title="Extend end date"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setExtendModal(false)}>Cancel</button>
                        <button type="submit" form="piw-extend" className="btn btn-primary">Extend</button>
                    </>
                )}
            >
                <form id="piw-extend" onSubmit={handleExtend} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">New end date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={extendEndDate}
                            onChange={(e) => setExtendEndDate(e.target.value)}
                            min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })()}
                            className="form-control"
                            required
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                show={rejectModal}
                onClose={() => setRejectModal(false)}
                title="Reject personnel"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setRejectModal(false)}>Cancel</button>
                        <button type="submit" form="piw-reject" className="btn btn-danger">Reject</button>
                    </>
                )}
            >
                <form id="piw-reject" onSubmit={handleReject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Remarks (optional)</label>
                        <textarea
                            value={rejectRemarks}
                            onChange={(e) => setRejectRemarks(e.target.value)}
                            rows={3}
                            className="form-control"
                            placeholder="Reason or remarks..."
                        />
                    </div>
                </form>
            </Modal>
            <ConfirmModal
                show={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => router.delete(`${base}/${id}`)}
                title="Remove personnel"
                message="Are you sure you want to remove this person from the list? This cannot be undone."
                confirmLabel="Remove"
                variant="danger"
            />
        </Layout>
    );
}
