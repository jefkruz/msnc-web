import { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import ActionButton from '../../Components/ActionButton';
import { storageUrl } from '../../lib/api';
import { useCan } from '../../lib/can';
import { formatStatusLabel } from '../../lib/formatStatus';

const DOCUMENT_LABELS = {
    authorization_recruit_form: 'Authorization Recruit Form',
    terms_of_reference: 'Terms of Reference',
    cv: 'CV',
    foundation_school: 'Foundation School Certificate',
    baptismal_certificate: 'Baptismal Certificate',
    educational_qualification: 'Educational Qualification',
    birth_certificate: 'Birth Certificate',
    church_pastor_attestation: 'Church Pastor Attestation',
    ministry_referee_attestation: 'Ministry Referee Attestation',
    guarantors_letter: 'Guarantors Letter',
    ministry_profile: 'Ministry Profile',
    application_letter: 'Application Letter',
    campus_letter: 'Campus Letter',
    others: 'Others',
};

function statusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
    if (s === 'uploaded') return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
}

export default function ApplicantsView({ applicant }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const idCardForm = useForm({ passport: null, signature: null });
    if (!applicant) return null;

    const fullName = [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') || applicant.fullname || '—';
    const passportUrl = storageUrl(applicant.image);
    const signatureUrl = storageUrl(applicant.signature);
    const imageUrl = passportUrl || '/images/default.png';
    const doc = applicant.document || {};
    const isAdmin = authRole === 'Administrator';
    const company = applicant.department?.company || '';
    const canPrintIdCard = Boolean(applicant.image && applicant.signature && company);

    const submitIdCardAssets = (e) => {
        e.preventDefault();
        idCardForm.post(`/administrator/applicants/id-card/${applicant.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => idCardForm.reset('passport', 'signature'),
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={fullName || 'Applicant'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Applicant Information</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        {can('applicants.delete') && (
                            <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                        )}
                        <ActionButton action="back" href="/administrator/applicants" size="" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Applicant info card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Applicant Information</h3>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-center border-b border-slate-200 dark:border-border-dark pb-6 mb-6">
                                    <img
                                        src={imageUrl}
                                        alt={fullName}
                                        className="w-28 h-28 rounded-full object-cover border-2 border-slate-200 dark:border-border-dark mx-auto mb-4"
                                    />
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{fullName}</h4>
                                    <p className="text-sm text-slate-500 dark:text-text-muted">{applicant.username ?? '—'}</p>
                                </div>
                                <div className="mb-6">
                                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">info</span>
                                        Personal Info
                                    </h5>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between gap-2">
                                            <span className="text-slate-500 dark:text-text-muted">Department</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{applicant.department?.name ?? 'N/A'}</span>
                                        </li>
                                        {authRole === 'Administrator' && (
                                            <li className="flex justify-between gap-2">
                                                <span className="text-slate-500 dark:text-text-muted">Administrative rank</span>
                                                <span className="text-slate-900 dark:text-white font-medium">{applicant.rank?.name ?? 'N/A'}</span>
                                            </li>
                                        )}
                                        <li className="flex justify-between gap-2">
                                            <span className="text-slate-500 dark:text-text-muted">Job Family</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{applicant.family?.name ?? applicant.nomenclature_category?.name ?? 'N/A'}</span>
                                        </li>
                                        <li className="flex justify-between gap-2">
                                            <span className="text-slate-500 dark:text-text-muted">Phone</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{applicant.phone ?? 'N/A'}</span>
                                        </li>
                                        <li className="flex justify-between gap-2">
                                            <span className="text-slate-500 dark:text-text-muted">Status</span>
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${statusBadge(applicant.status)}`}>
                                                {formatStatusLabel(applicant.status, 'N/A')}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="border-t border-slate-200 dark:border-border-dark pt-6 mt-auto">
                                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">tune</span>
                                        Actions
                                    </h5>
                                    <div className="flex flex-col gap-2">
                                        {applicant.status === 'pending' && (
                                            <Link
                                                href={`/authorised/upload/${applicant.id}/docs`}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">upload_file</span>
                                                Upload Documents
                                            </Link>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href={`/administrator/applicants/confirm/${applicant.id}`}
                                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                                        applicant.status === 'uploaded'
                                                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {applicant.status === 'uploaded' ? 'cancel' : 'check_circle'}
                                                    </span>
                                                    {applicant.status === 'uploaded' ? 'Unconfirm Document' : 'Confirm Document'}
                                                </Link>
                                                <Link
                                                    href={`/administrator/applicants/status/${applicant.id}`}
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">progress_activity</span>
                                                    Manage Status
                                                </Link>
                                            </>
                                        )}
                                        <Link
                                            href={`/administrator/applicants/edit/${applicant.id}`}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                            Edit Applicant
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Documents table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Applicant Documents</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-500 dark:text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                            <th className="px-6 py-3 w-14 text-center">#</th>
                                            <th className="px-6 py-3">Document Name</th>
                                            <th className="px-6 py-3 w-32 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                        {Object.entries(DOCUMENT_LABELS).map(([field, label], idx) => {
                                            const path = doc[field];
                                            return (
                                                <tr key={field} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-3 text-center text-slate-600 dark:text-slate-400 tabular-nums">{idx + 1}</td>
                                                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{label}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        {path ? (
                                                            <a
                                                                href={storageUrl(path)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">download</span>
                                                                Download
                                                            </a>
                                                        ) : (
                                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                                                PENDING
                                                            </span>
                                                        )}
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

                {isAdmin && (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">badge</span>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Staff ID Card</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-slate-500 dark:text-text-muted">
                                Upload the passport photo and signature, then print the ID card. The card template is
                                chosen automatically from the applicant's department company
                                {company ? <> (<span className="font-medium text-slate-700 dark:text-white">{company}</span>)</> : ''}.
                            </p>

                            <form onSubmit={submitIdCardAssets} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Passport Photo
                                        {applicant.image && (
                                            <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">(uploaded)</span>
                                        )}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={passportUrl || '/images/default.png'}
                                            alt="Passport"
                                            className="w-24 h-28 rounded-lg object-cover border border-slate-200 dark:border-border-dark bg-slate-50"
                                        />
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e) => idCardForm.setData('passport', e.target.files[0] ?? null)}
                                            className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                                        />
                                    </div>
                                    {idCardForm.errors.passport && (
                                        <p className="text-red-500 text-xs">{idCardForm.errors.passport}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Signature
                                        {applicant.signature && (
                                            <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">(uploaded)</span>
                                        )}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-28 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 flex items-center justify-center overflow-hidden">
                                            {signatureUrl ? (
                                                <img src={signatureUrl} alt="Signature" className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-300 text-3xl">draw</span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e) => idCardForm.setData('signature', e.target.files[0] ?? null)}
                                            className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                                        />
                                    </div>
                                    {idCardForm.errors.signature && (
                                        <p className="text-red-500 text-xs">{idCardForm.errors.signature}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-border-dark">
                                    <button
                                        type="submit"
                                        disabled={idCardForm.processing || (!idCardForm.data.passport && !idCardForm.data.signature)}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-lg">upload</span>
                                        {idCardForm.processing ? 'Uploading...' : 'Save assets'}
                                    </button>
                                    <a
                                        href={canPrintIdCard ? `/administrator/applicants/id-card/${applicant.id}` : undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-disabled={!canPrintIdCard}
                                        onClick={(e) => { if (!canPrintIdCard) e.preventDefault(); }}
                                        title={canPrintIdCard ? 'Print ID card' : 'Upload passport, signature and assign a department company first'}
                                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                            canPrintIdCard
                                                ? 'border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10'
                                                : 'border border-slate-200 dark:border-border-dark text-slate-400 cursor-not-allowed opacity-60'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">badge</span>
                                        Print ID Card
                                    </a>
                                    {!company && (
                                        <span className="text-xs text-amber-600 dark:text-amber-400">
                                            Assign a company to this applicant's department to enable printing.
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmModal
                show={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => router.delete(`/administrator/applicants/delete/${applicant.id}`)}
                title="Delete applicant"
                message={`Are you sure you want to delete ${fullName}? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
