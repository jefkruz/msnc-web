import { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import ConfirmModal from '../../../Components/ConfirmModal';
import ActionButton from '../../../Components/ActionButton';
import PostingLetterForm from '../../../Components/PostingLetterForm';
import { useCan } from '../../../lib/can';
import { openApiPdf } from '../../../lib/api';

function dateInputValue(val) {
    if (!val) return '';
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function PostingLettersEdit({ postingLetter, applicants = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const letter = postingLetter || {};

    const { data, setData, put, processing, errors } = useForm({
        applicant_id: String(letter.applicant_id ?? ''),
        posting_recommendation_id: letter.posting_recommendation_id ?? '',
        letter_date: dateInputValue(letter.letter_date),
        recipient_address: letter.recipient_address ?? '',
        salutation: letter.salutation ?? '',
        mission_station: letter.mission_station ?? '',
        posting_status: letter.posting_status ?? '',
        effective_from: letter.effective_from ?? '',
        employer: letter.employer ?? '',
        employee_name: letter.employee_name ?? '',
        designation: letter.designation ?? '',
        rank: letter.rank ?? '',
        signatory_title: letter.signatory_title ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/administrator/posting-letters/update/${letter.id}`, { preserveScroll: true });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Edit Posting Letter">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        href="/administrator/posting-letters"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Posting Letters
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        {letter.id && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => openApiPdf(`/administrator/posting-letters/print/${letter.id}/letter`, 'posting-letter.pdf')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10"
                                >
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                    Print letter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openApiPdf(`/administrator/posting-letters/print/${letter.id}/terms`, 'posting-terms.pdf')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10"
                                >
                                    <span className="material-symbols-outlined text-lg">description</span>
                                    Print terms
                                </button>
                            </>
                        )}
                        {can('posting-letters.delete') && letter.id && (
                            <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                        )}
                    </div>
                </div>

                <PostingLetterForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    applicants={applicants}
                    onSubmit={submit}
                    processing={processing}
                    submitLabel="Update"
                />
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/posting-letters/delete/${letter.id}`)}
                    title="Delete posting letter"
                    message="Are you sure you want to delete this posting letter? This cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
