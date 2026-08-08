import { useState, useEffect } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import Alert from '../../Components/Alert';

const RANKS_BASE = '/administrator/ranks';

export default function RanksIndex() {
    const { auth, authRole, menu, appName, ranks = [], flash } = usePage().props;
    const ranksList = Array.isArray(ranks) ? ranks : [];
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showFlash, setShowFlash] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    useEffect(() => {
        if (flash?.message) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`${RANKS_BASE}/store`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`${RANKS_BASE}/delete/${deleteId}`, { preserveScroll: true });
        setDeleteId(null);
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Ranks">
            <div className="space-y-6">
                {/* Back + flash */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        href="/administrator/menu"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Administration
                    </Link>
                </div>

                {showFlash && flash?.message && (
                    <Alert type="success" message={flash.message} onDismiss={() => setShowFlash(false)} />
                )}

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ranks</h2>
                            <p className="text-sm text-text-muted mt-0.5">
                                Administrative ranks used across the system.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create Rank
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {ranksList.length === 0 ? (
                            <EmptyState
                                icon="star"
                                title="No ranks"
                                description="Create your first administrative rank."
                                actionLabel="Create Rank"
                                onAction={() => setShowModal(true)}
                                className="m-8"
                            />
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[280px]">
                                <thead>
                                    <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-4 sm:px-6 py-3 sm:py-4">#</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4">Name</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right w-[72px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {ranksList.map((r, i) => (
                                        <tr
                                            key={r.id}
                                            className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-700 dark:text-slate-300 tabular-nums">
                                                {i + 1}
                                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-900 dark:text-white font-medium">
                                                {r.name}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteId(r.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                    title="Delete rank"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} title="Create Rank">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="form-control"
                            placeholder="e.g. Senior Manager"
                            required
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            Create Rank
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Rank"
                message="Are you sure you want to delete this rank?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
