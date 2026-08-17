import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import EmptyState from '../../../Components/EmptyState';
import ActionButton, { ActionGroup } from '../../../Components/ActionButton';
import { useCan } from '../../../lib/can';
import { formatDate } from '../../../lib/formatDate';
import { openApiPdf } from '../../../lib/api';

export default function PostingLettersIndex({ postingLetters = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [deleteId, setDeleteId] = useState(null);
    const list = Array.isArray(postingLetters) ? postingLetters : [];

    const applicantName = (letter) => {
        const a = letter.applicant;
        if (!a) return letter.employee_name || '—';
        return [a.title, a.first_name, a.last_name].filter(Boolean).join(' ') || letter.employee_name || '—';
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Posting Letters">
            <div className="space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Posting Letters</h2>
                            <p className="text-sm text-text-muted mt-0.5">
                                Generate the posting letter (Sample 1) and terms sheet (Sample 2).
                            </p>
                        </div>
                        <Link
                            href="/administrator/posting-letters/create"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 w-full sm:w-auto shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {list.length === 0 ? (
                            <EmptyState
                                icon="mail"
                                title="No posting letters"
                                description="Generate a posting letter and terms document for an applicant."
                                actionLabel="Create"
                                onAction={() => (window.location.href = '/administrator/posting-letters/create')}
                                className="m-8"
                            />
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[480px]">
                                <thead>
                                    <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-4 sm:px-6 py-3">#</th>
                                        <th className="px-4 sm:px-6 py-3">Applicant</th>
                                        <th className="px-4 sm:px-6 py-3">Mission station</th>
                                        <th className="px-4 sm:px-6 py-3">Letter date</th>
                                        <th className="px-4 sm:px-6 py-3 text-right w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {list.map((letter, i) => (
                                        <tr key={letter.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300 tabular-nums">{i + 1}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-900 dark:text-white font-medium">{applicantName(letter)}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300">{letter.mission_station || '—'}</td>
                                            <td className="px-4 sm:px-6 py-3 text-slate-700 dark:text-slate-300">{formatDate(letter.letter_date)}</td>
                                            <td className="px-4 sm:px-6 py-3 text-right">
                                                <ActionGroup>
                                                    <ActionButton action="edit" href={`/administrator/posting-letters/edit/${letter.id}`} />
                                                    <ActionButton
                                                        action="view"
                                                        icon="mail"
                                                        label="Letter"
                                                        onClick={() => openApiPdf(`/administrator/posting-letters/print/${letter.id}/letter`, 'posting-letter.pdf')}
                                                    />
                                                    <ActionButton
                                                        action="view"
                                                        icon="description"
                                                        label="Terms"
                                                        onClick={() => openApiPdf(`/administrator/posting-letters/print/${letter.id}/terms`, 'posting-terms.pdf')}
                                                    />
                                                    {can('posting-letters.delete') && (
                                                        <ActionButton action="delete" onClick={() => setDeleteId(letter.id)} />
                                                    )}
                                                </ActionGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmModal
                show={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(`/administrator/posting-letters/delete/${deleteId}`);
                        setDeleteId(null);
                    }
                }}
                title="Delete posting letter"
                message="Are you sure you want to delete this posting letter?"
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
