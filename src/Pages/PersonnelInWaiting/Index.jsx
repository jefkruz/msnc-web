import { Link, usePage, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import SearchableSelect from '../../Components/SearchableSelect';
import { useRef, useState } from 'react';
import { useCan } from '../../lib/can';

const STATUS_LABELS = {
    in_progress: { label: 'In progress', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    due: { label: 'Due', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    completed: { label: 'Completed', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    extended: { label: 'Extended', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
};

function formatDate(d) {
    if (!d) return '—';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PersonnelInWaitingIndex({ personnel = [], departments = [], search: initialSearch = '', status: initialStatus = '' }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);
    const searchFormRef = useRef(null);

    const base = '/authorised/personnel-in-waiting';

    const [statusFilter, setStatusFilter] = useState(initialStatus || '');

    const applyFilters = (nextStatus, searchValue) => {
        const q = (searchValue ?? '').trim();
        const params = {};
        if (q) params.search = q;
        if (nextStatus) params.status = nextStatus;
        router.get(base, params, { preserveState: false });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters(statusFilter, e.currentTarget.search?.value);
    };

    const exportHref = `/administrator/personnel-in-waiting/export?search=${encodeURIComponent(initialSearch || '')}&status=${encodeURIComponent(initialStatus || '')}`;

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Personnel in Waiting">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personnel in Waiting</h2>
                        <form ref={searchFormRef} onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <div className="relative min-w-48 sm:min-w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted text-xl pointer-events-none">search</span>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={initialSearch}
                                    placeholder="Search by name, username, department..."
                                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted"
                                />
                            </div>
                            <div className="w-full sm:w-auto min-w-[170px]">
                                <SearchableSelect
                                    value={statusFilter}
                                    onChange={(val) => {
                                        setStatusFilter(val);
                                        applyFilters(val, searchFormRef.current?.search?.value);
                                    }}
                                    options={[
                                        { value: 'in_progress', label: 'In progress' },
                                        { value: 'due', label: 'Due' },
                                        { value: 'completed', label: 'Completed' },
                                        { value: 'rejected', label: 'Rejected' },
                                        { value: 'extended', label: 'Extended' },
                                    ]}
                                    placeholder="All status"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
                        {can('personnel-in-waiting.export') && (
                            <a
                                href={exportHref}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-border-dark"
                            >
                                <span className="material-symbols-outlined text-lg">download</span> Export
                            </a>
                        )}
                        {can('personnel-in-waiting.create') && (
                        <Link
                            href={`${base}/create`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined text-lg">add</span> Add personnel
                        </Link>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {personnel.length === 0 ? (
                        <EmptyState
                            icon="schedule"
                            title={initialSearch ? 'No matches' : 'No personnel in waiting'}
                            description={initialSearch ? 'Try a different search term.' : 'Add someone to start their 3‑month probation period.'}
                            actionLabel="Add personnel"
                            onAction={() => router.visit(`${base}/create`)}
                            className="m-8"
                        />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Start / End</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {personnel.map((p, i) => {
                                    const statusStyle = STATUS_LABELS[p.status] || STATUS_LABELS.in_progress;
                                    const name = [p.title, p.firstname, p.lastname].filter(Boolean).join(' ');
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <Link href={`${base}/${p.id}`} className="font-medium text-primary hover:underline">
                                                        {name || '—'}
                                                    </Link>
                                                    <span className="text-slate-500 dark:text-text-muted text-xs mt-0.5">
                                                        KingsChat: {p.username ?? '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{p.department?.name ?? '—'}</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                                {formatDate(p.start_date)} → {formatDate(p.end_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${statusStyle.class}`}>
                                                    {statusStyle.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`${base}/${p.id}`} className="p-2 rounded-lg hover:bg-primary/10 text-primary inline-flex mr-1" title="View">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </Link>
                                                {can('personnel-in-waiting.update') && (
                                                <Link href={`${base}/${p.id}/edit`} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 inline-flex mr-1" title="Edit">
                                                    <span className="material-symbols-outlined">edit</span>
                                                </Link>
                                                )}
                                                {can('personnel-in-waiting.delete') && (
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteId(p.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 inline-flex"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`${base}/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Remove personnel"
                message="Are you sure you want to remove this person from the list?"
                confirmLabel="Remove"
                variant="danger"
            />
        </Layout>
    );
}
