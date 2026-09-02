import { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import ActionButton from '../../Components/ActionButton';
import LoginAsButton from '../../Components/LoginAsButton';
import UserAvatar from '../../Components/UserAvatar';
import SignaturePad from '../../Components/SignaturePad';
import { storageUrl } from '../../lib/api';
import { useCan } from '../../lib/can';
import { formatStatusLabel } from '../../lib/formatStatus';
import { formatDate } from '../../lib/formatDate';
import { STAFF_UPLOAD_DOCUMENT_FIELDS, statusBadgeClass } from '../../lib/applicantDocuments';

const fileInputClass =
    'w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium';

function applicantStatusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
    if (s === 'uploaded') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30';
    return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
}

function DetailField({ label, value, children }) {
    return (
        <div className="applicant-detail-field">
            <dt className="applicant-detail-field__label">{label}</dt>
            <dd className="applicant-detail-field__value">{children ?? value ?? '—'}</dd>
        </div>
    );
}

function ActionTile({ href, onClick, icon, label, variant = 'default', disabled = false, title }) {
    const base =
        'applicant-action-tile inline-flex flex-col items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors min-w-[7.5rem]';
    const variants = {
        default:
            'border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10',
        primary: 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15',
        success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15',
        danger: 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/15',
        muted: 'border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-400 cursor-not-allowed opacity-70',
    };

    const className = `${base} ${disabled ? variants.muted : variants[variant]}`;

    if (href && !disabled) {
        return (
            <Link href={href} className={className} title={title}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span>{label}</span>
            </Link>
        );
    }

    if (onClick && !disabled) {
        return (
            <button type="button" onClick={onClick} className={className} title={title}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span>{label}</span>
            </button>
        );
    }

    return (
        <span className={className} title={title} aria-disabled="true">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
            <span>{label}</span>
        </span>
    );
}

export default function ApplicantsView({ applicant }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [passportPreview, setPassportPreview] = useState(null);
    const [signatureMode, setSignatureMode] = useState('draw');
    const idCardForm = useForm({ passport: null, signature: null });

    if (!applicant) return null;

    const fullName = [applicant.title, applicant.first_name, applicant.last_name].filter(Boolean).join(' ') || applicant.fullname || '—';
    const shortName = [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') || applicant.fullname || 'Applicant';
    const passportUrl = passportPreview || storageUrl(applicant.image);
    const profilePhotoUrl = storageUrl(applicant.kc_avatar);
    const signatureUrl = storageUrl(applicant.signature);
    const doc = applicant.document || {};
    const isAdmin = authRole === 'Administrator';
    const company = applicant.department?.company || '';
    const canPrintIdCard = Boolean(applicant.image && applicant.signature && company);
    const applicantsListHref = applicant.registration_source === 'public'
        ? '/administrator/applicants/self-registration'
        : '/administrator/applicants/staff';

    const documentRows = STAFF_UPLOAD_DOCUMENT_FIELDS.map(({ key, label }) => ({
        key,
        label,
        path: doc[key],
        uploaded: Boolean(doc[key]),
    }));
    const uploadedCount = documentRows.filter((row) => row.uploaded).length;
    const documentProgress = documentRows.length ? Math.round((uploadedCount / documentRows.length) * 100) : 0;

    const submitIdCardAssets = (e) => {
        e.preventDefault();
        idCardForm.post(`/administrator/applicants/id-card/${applicant.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                idCardForm.reset('passport', 'signature');
                setPassportPreview(null);
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={shortName}>
            <div className="applicant-view max-w-6xl mx-auto pb-12 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={applicantsListHref}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to applicants
                    </Link>
                    <div className="flex items-center gap-2">
                        {can('applicants.delete') && (
                            <ActionButton action="delete" size="" variant="danger" onClick={() => setConfirmDelete(true)} />
                        )}
                        <Link
                            href={`/administrator/applicants/edit/${applicant.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit
                        </Link>
                    </div>
                </div>

                <section className="applicant-view-hero">
                    <div className="applicant-view-hero__banner" />
                    <div className="applicant-view-hero__body">
                        <div className="applicant-view-hero__profile">
                            <UserAvatar
                                name={shortName}
                                src={profilePhotoUrl}
                                size="xl"
                                className="applicant-view-hero__avatar"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{fullName}</h2>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${applicantStatusBadge(applicant.status)}`}>
                                        {formatStatusLabel(applicant.status, 'N/A')}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-text-muted">
                                    @{applicant.username ?? '—'}
                                    {applicant.registration_source === 'public' ? ' · Self-registered' : ' · Staff-added'}
                                </p>
                            </div>
                        </div>

                        <dl className="applicant-view-hero__details">
                            <DetailField label="Department" value={applicant.department?.name} />
                            <DetailField label="Job family" value={applicant.family?.name ?? applicant.nomenclature_category?.name} />
                            <DetailField label="Job group" value={applicant.group?.name} />
                            <DetailField label="Job rank" value={applicant.nomenclature_rank?.name ?? applicant.nomenclatureRank?.name} />
                            {isAdmin && <DetailField label="Administrative rank" value={applicant.rank?.name} />}
                            <DetailField label="Phone" value={applicant.phone} />
                            <DetailField label="Registered" value={formatDate(applicant.date)} />
                            {company && <DetailField label="ID card company" value={company} />}
                        </dl>
                    </div>
                </section>

                <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Quick actions</h3>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-wrap gap-3">
                        {applicant.status === 'pending' && (
                            <ActionTile href={`/authorised/upload/${applicant.id}/docs`} icon="upload_file" label="Upload documents" variant="primary" />
                        )}
                        {isAdmin && (
                            <>
                                <ActionTile
                                    href={`/administrator/applicants/confirm/${applicant.id}`}
                                    icon={applicant.status === 'uploaded' ? 'cancel' : 'check_circle'}
                                    label={applicant.status === 'uploaded' ? 'Unconfirm' : 'Confirm docs'}
                                    variant={applicant.status === 'uploaded' ? 'danger' : 'success'}
                                />
                                <ActionTile href={`/administrator/applicants/status/${applicant.id}`} icon="progress_activity" label="Manage status" />
                            </>
                        )}
                        {isAdmin && can(['applicants.impersonate', 'applicants.view']) && (
                            <LoginAsButton
                                href={`/administrator/applicants/${applicant.id}/login-as`}
                                label={`Log in as ${shortName}`}
                                className="applicant-action-tile applicant-action-tile--login-as"
                            />
                        )}
                        {isAdmin && (
                            <ActionTile
                                href={canPrintIdCard ? `/administrator/applicants/id-card/${applicant.id}` : undefined}
                                icon="badge"
                                label="Print ID card"
                                disabled={!canPrintIdCard}
                                title={canPrintIdCard ? 'Open printable ID card' : 'Upload passport, signature and assign a department company first'}
                            />
                        )}
                    </div>
                </section>

                <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">description</span>
                                    Documents
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                                    {uploadedCount} of {documentRows.length} documents uploaded
                                </p>
                            </div>
                            <div className="applicant-doc-progress" aria-label={`${documentProgress}% complete`}>
                                <span className="applicant-doc-progress__value">{documentProgress}%</span>
                                <div className="applicant-doc-progress__track">
                                    <div className="applicant-doc-progress__bar" style={{ width: `${documentProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 dark:text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark">
                                    <th className="px-6 py-3 w-14 text-center">#</th>
                                    <th className="px-6 py-3">Document</th>
                                    <th className="px-6 py-3 w-32 text-center">Status</th>
                                    <th className="px-6 py-3 w-28 text-center">File</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {documentRows.map((row, idx) => (
                                    <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3.5 text-center text-slate-500 dark:text-text-muted tabular-nums">{idx + 1}</td>
                                        <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{row.label}</td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(row.uploaded ? 'uploaded' : 'pending')}`}>
                                                {row.uploaded ? 'Uploaded' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            {row.path ? (
                                                <a
                                                    href={storageUrl(row.path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-base">open_in_new</span>
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 dark:text-text-muted text-sm">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {isAdmin && (
                    <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                                Staff ID card
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                                Upload passport photo and signature for printing.
                                {company ? (
                                    <> Template: <span className="font-medium text-slate-700 dark:text-white">{company}</span>.</>
                                ) : (
                                    <> Assign a company to this applicant&apos;s department to enable printing.</>
                                )}
                            </p>
                        </div>

                        <form onSubmit={submitIdCardAssets} className="p-6 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Passport photo
                                        {applicant.image && !passportPreview && (
                                            <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">(saved)</span>
                                        )}
                                    </label>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <UserAvatar
                                            name={shortName}
                                            src={passportUrl}
                                            size="passport"
                                            variant="passport"
                                            className="border border-slate-200 dark:border-border-dark"
                                        />
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;
                                                idCardForm.setData('passport', file);
                                                setPassportPreview(file ? URL.createObjectURL(file) : null);
                                            }}
                                            className={fileInputClass}
                                        />
                                    </div>
                                    {idCardForm.errors.passport && <p className="text-red-500 text-xs">{idCardForm.errors.passport}</p>}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Signature
                                            {applicant.signature && !idCardForm.data.signature && (
                                                <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">(saved)</span>
                                            )}
                                        </label>
                                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-border-dark overflow-hidden text-sm">
                                            <button
                                                type="button"
                                                onClick={() => setSignatureMode('draw')}
                                                className={`px-3 py-1.5 ${signatureMode === 'draw' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300'}`}
                                            >
                                                Sign here
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSignatureMode('upload')}
                                                className={`px-3 py-1.5 ${signatureMode === 'upload' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300'}`}
                                            >
                                                Upload image
                                            </button>
                                        </div>
                                    </div>

                                    {signatureUrl && signatureMode === 'draw' && !idCardForm.data.signature && (
                                        <div className="rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 p-3">
                                            <p className="text-xs text-slate-500 dark:text-text-muted mb-2">Current saved signature</p>
                                            <img src={signatureUrl} alt="Saved signature" className="max-h-24 object-contain" />
                                        </div>
                                    )}

                                    {signatureMode === 'draw' ? (
                                        <SignaturePad onChange={(file) => idCardForm.setData('signature', file)} />
                                    ) : (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="w-24 h-28 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                                                {signatureUrl ? (
                                                    <img src={signatureUrl} alt="Signature" className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-300 text-3xl">draw</span>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                                onChange={(e) => idCardForm.setData('signature', e.target.files?.[0] ?? null)}
                                                className={fileInputClass}
                                            />
                                        </div>
                                    )}
                                    {idCardForm.errors.signature && <p className="text-red-500 text-xs">{idCardForm.errors.signature}</p>}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-border-dark">
                                <button
                                    type="submit"
                                    disabled={idCardForm.processing || (!idCardForm.data.passport && !idCardForm.data.signature)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    {idCardForm.processing ? 'Saving…' : 'Save ID card assets'}
                                </button>
                                <a
                                    href={canPrintIdCard ? `/administrator/applicants/id-card/${applicant.id}` : undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-disabled={!canPrintIdCard}
                                    onClick={(e) => { if (!canPrintIdCard) e.preventDefault(); }}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                        canPrintIdCard
                                            ? 'border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10'
                                            : 'border border-slate-200 dark:border-border-dark text-slate-400 cursor-not-allowed opacity-60'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">print</span>
                                    Print ID card
                                </a>
                            </div>
                        </form>
                    </section>
                )}
            </div>

            <ConfirmModal
                show={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => router.delete(`/administrator/applicants/delete/${applicant.id}`)}
                title="Delete applicant"
                message={`Are you sure you want to delete ${shortName}? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
