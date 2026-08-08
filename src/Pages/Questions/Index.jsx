import { useState } from 'react';
import { usePage, router, useForm } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import Alert from '../../Components/Alert';

const API_BASE = '/administrator/questions';

export default function QuestionsIndex({ questions = [], families = [], administrativeRanks = [] }) {
    const { auth, authRole, menu, appName, errors: pageErrors = {} } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        nomenclature_category_id: '',
        rank_id: '',
        questions: [{ title: '' }],
    });

    const addQuestion = () => {
        setData('questions', [...data.questions, { title: '' }]);
    };

    const removeQuestion = (index) => {
        if (data.questions.length <= 1) return;
        setData('questions', data.questions.filter((_, i) => i !== index));
    };

    const setQuestionTitle = (index, title) => {
        const next = [...data.questions];
        next[index] = { ...next[index], title };
        setData('questions', next);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const filtered = data.questions.map((q) => ({ title: (q.title || '').trim() })).filter((q) => q.title !== '');
        if (filtered.length === 0) return;
        const payload = {
            nomenclature_category_id: data.nomenclature_category_id,
            rank_id: data.rank_id,
            questions: filtered,
        };
        setIsSubmitting(true);
        router.post(`${API_BASE}/store`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
                setData('questions', [{ title: '' }]);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openModal = () => {
        reset();
        setData('questions', [{ title: '' }]);
        setShowModal(true);
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Interview Questions">
            {usePage().props.flash?.message && (
                <Alert type="success" message={usePage().props.flash.message} className="mb-6" />
            )}
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interview Questions</h2>
                    <button
                        type="button"
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-lg">add</span> Create Question
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {questions.length === 0 ? (
                        <EmptyState
                            icon="help"
                            title="No questions"
                            description="Create interview questions for a job family and administrative rank."
                            actionLabel="Create Question"
                            onAction={openModal}
                            className="m-8"
                        />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Question</th>
                                    <th className="px-6 py-4">Category / Group / Rank</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {questions.map((q, i) => (
                                    <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{i + 1}</td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white">{q.title ?? q.question ?? q.body ?? '—'}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            {q.category?.name ?? q.nomenclature_category?.name ?? '—'} / {q.group?.name ?? '—'} / {q.nomenclatureRank?.name ?? '—'}
                                            {q.rank?.name ? ` (Admin: ${q.rank.name})` : ''}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setDeleteId(q.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} title="Create Questions" size="lg">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job family (Category) <span className="text-red-500">*</span></label>
                            <select
                                value={data.nomenclature_category_id}
                                onChange={(e) => setData('nomenclature_category_id', e.target.value)}
                                className="form-control"
                                required
                            >
                                <option value="">Select category</option>
                                {families.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                            {(errors.nomenclature_category_id || pageErrors.nomenclature_category_id) && <p className="text-red-500 text-xs mt-1">{errors.nomenclature_category_id || pageErrors.nomenclature_category_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Administrative rank <span className="text-red-500">*</span></label>
                            <select
                                value={data.rank_id}
                                onChange={(e) => setData('rank_id', e.target.value)}
                                className="form-control"
                                required
                            >
                                <option value="">Select administrative rank</option>
                                {administrativeRanks.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            {(errors.rank_id || pageErrors.rank_id) && <p className="text-red-500 text-xs mt-1">{errors.rank_id || pageErrors.rank_id}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Questions <span className="text-red-500">*</span></label>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-lg">add_circle</span> Add question
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {data.questions.map((q, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        value={q.title ?? ''}
                                        onChange={(e) => setQuestionTitle(index, e.target.value)}
                                        placeholder={`Question ${index + 1}`}
                                        className="flex-1 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-slate-900 dark:text-white text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(index)}
                                        disabled={data.questions.length <= 1}
                                        className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:pointer-events-none"
                                        title="Remove question"
                                    >
                                        <span className="material-symbols-outlined">remove_circle</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {(errors.questions || pageErrors.questions) && <p className="text-red-500 text-xs mt-1">{errors.questions || pageErrors.questions}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-border-dark">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                            Create questions
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`${API_BASE}/delete/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete Question"
                message="Are you sure you want to delete this question?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
