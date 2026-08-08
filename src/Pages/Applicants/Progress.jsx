import { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import SearchableSelect from '../../Components/SearchableSelect';
import { formatDate } from '../../lib/formatDate';
import { formatStatusLabel } from '../../lib/formatStatus';

const POSTING_DECLINED_ACCEPTED_NAME = 'Posting declined or Posting accepted';

function statusBadge(status) {
    const s = (status || 'pending').toLowerCase();
    const label = formatStatusLabel(status || 'pending');
    if (s === 'completed') return { label, class: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (s === 'in_progress') return { label, class: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' };
    return { label, class: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' };
}

function dateInputValue(val) {
    if (!val) return '';
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function ApplicantsProgress({ applicant, progressSteps = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [editStage, setEditStage] = useState(null);

    const fullName = applicant ? [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') : 'Applicant';
    const applicantProgressMap = (applicant?.progresses || []).reduce((acc, p) => {
        acc[p.id] = p.pivot || {};
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm({
        progress_id: '',
        status: 'pending',
        started_at: '',
        completed_at: '',
        outcome: '',
    });

    const openEdit = (progress) => {
        const pivot = applicantProgressMap[progress.id] || {};
        setData({
            progress_id: String(progress.id),
            status: pivot.status || 'pending',
            started_at: dateInputValue(pivot.started_at),
            completed_at: dateInputValue(pivot.completed_at),
            outcome: pivot.outcome || '',
        });
        setEditStage(progress);
    };

    const closeEdit = () => {
        setEditStage(null);
        setData({ progress_id: '', status: 'pending', started_at: '', completed_at: '', outcome: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/administrator/applicants/update/progress/${applicant.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEdit(),
        });
    };

    const steps = Array.isArray(progressSteps) ? progressSteps : [];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Progress - ${fullName}`}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Applicant Status</h2>
                    <Link
                        href={`/authorised/view/${applicant?.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to applicant
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Progress Timeline (flow chart) */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">timeline</span>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                <span className="hidden sm:inline">{fullName} – </span>
                                Progress Timeline
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                {steps.map((progress, index) => {
                                    const pivot = applicantProgressMap[progress.id] || {};
                                    const status = pivot.status || 'pending';
                                    const badge = statusBadge(status);
                                    const startedAt = formatDate(pivot.started_at, null);
                                    const completedAt = formatDate(pivot.completed_at, null);
                                    const isLast = index === steps.length - 1;

                                    return (
                                        <div key={progress.id} className="flex gap-4 mb-6 last:mb-0">
                                            <div className="flex flex-col items-center flex-shrink-0">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                                        status === 'completed'
                                                            ? 'bg-emerald-500 text-white border-emerald-500'
                                                            : status === 'in_progress'
                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {status === 'completed' ? 'check_circle' : status === 'in_progress' ? 'schedule' : 'pending'}
                                                    </span>
                                                </div>
                                                {!isLast && (
                                                    <div
                                                        className="w-0.5 flex-1 min-h-[24px] mt-1 bg-slate-200 dark:bg-border-dark"
                                                        style={{ minHeight: '32px' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pb-6 last:pb-0">
                                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden">
                                                    <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-border-dark">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white">{progress.name}</h4>
                                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${badge.class}`}>
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                                            {progress.description || 'No description provided.'}
                                                        </p>
                                                        {startedAt && (
                                                            <p className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-1">
                                                                <span className="material-symbols-outlined text-blue-500 text-lg">event</span>
                                                                <strong>Started:</strong> {startedAt}
                                                            </p>
                                                        )}
                                                        {completedAt && (
                                                            <p className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                                                <strong>Completed:</strong> {completedAt}
                                                            </p>
                                                        )}
                                                        {progress.name === POSTING_DECLINED_ACCEPTED_NAME && pivot.outcome && (
                                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                                <span className={`material-symbols-outlined text-lg ${pivot.outcome === 'accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                    {pivot.outcome === 'accepted' ? 'thumb_up' : 'thumb_down'}
                                                                </span>
                                                                <strong>Outcome:</strong>
                                                                <span className={pivot.outcome === 'accepted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                                                    {pivot.outcome === 'accepted' ? 'Accepted' : 'Declined'}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Manage Progress table + actions */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Manage Progress</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-500 dark:text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-6 py-3 w-14 text-center">#</th>
                                        <th className="px-6 py-3">Stage</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Outcome</th>
                                        <th className="px-6 py-3 w-28 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {steps.map((progress, index) => {
                                        const pivot = applicantProgressMap[progress.id] || {};
                                        const status = pivot.status || 'pending';
                                        const badge = statusBadge(status);
                                        return (
                                            <tr key={progress.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-3 text-center text-slate-600 dark:text-slate-400 tabular-nums">{index + 1}</td>
                                                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{progress.name}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${badge.class}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    {progress.name === POSTING_DECLINED_ACCEPTED_NAME && pivot.outcome ? (
                                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${pivot.outcome === 'accepted' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                                            {pivot.outcome === 'accepted' ? 'Accepted' : 'Declined'}
                                                        </span>
                                                    ) : progress.name === POSTING_DECLINED_ACCEPTED_NAME ? (
                                                        <span className="text-slate-400 dark:text-text-muted text-xs">—</span>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(progress)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium text-sm transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Progress modal */}
            <Modal
                show={!!editStage}
                onClose={closeEdit}
                title="Update Progress"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
                        <button type="submit" form="progress-update" className="btn btn-primary" disabled={processing}>Save Changes</button>
                    </>
                )}
            >
                {editStage && (
                    <form id="progress-update" onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="progress_id" value={data.progress_id} />

                        <div>
                            <label className="block text-sm font-medium mb-1">Stage</label>
                            <input
                                type="text"
                                value={editStage.name}
                                disabled
                                className="form-control"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <SearchableSelect
                                value={data.status}
                                onChange={(val) => setData('status', val)}
                                options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'in_progress', label: 'In Progress' },
                                    { value: 'completed', label: 'Completed' },
                                ]}
                                placeholder="Select status"
                                required
                                error={errors.status}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Started At</label>
                            <input
                                type="date"
                                value={data.started_at}
                                onChange={(e) => setData('started_at', e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Completed At</label>
                            <input
                                type="date"
                                value={data.completed_at}
                                onChange={(e) => setData('completed_at', e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {editStage.name === POSTING_DECLINED_ACCEPTED_NAME && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Posting outcome</label>
                                <SearchableSelect
                                    value={data.outcome}
                                    onChange={(val) => setData('outcome', val)}
                                    options={[
                                        { value: 'accepted', label: 'Accepted' },
                                        { value: 'declined', label: 'Declined' },
                                    ]}
                                    placeholder="Select outcome"
                                    error={errors.outcome}
                                />
                            </div>
                        )}
                    </form>
                )}
            </Modal>
        </Layout>
    );
}
