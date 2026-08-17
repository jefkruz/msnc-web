import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SignaturePad from '../../Components/SignaturePad';
import UserAvatar from '../../Components/UserAvatar';

const fileInputClass =
    'w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium';

export default function ApplicantIdCardPage({ id_card: idCard = {} }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [passportPreview, setPassportPreview] = useState(null);
    const [signatureMode, setSignatureMode] = useState('draw');

    const { data, setData, post, processing, errors } = useForm({
        passport: null,
        signature: null,
    });

    const displayName = auth?.name || 'Applicant';
    const passportUrl = passportPreview || idCard.passport_url || null;
    const signatureUrl = idCard.signature_url || null;
    const company = idCard.company || null;

    const submit = (event) => {
        event.preventDefault();
        post('/applicant/id-card', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPassportPreview(null);
                setData('passport', null);
                setData('signature', null);
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Staff ID Card">
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Staff ID Card
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-muted">
                        Upload your passport photo and sign your signature for your staff ID card.
                        {company ? (
                            <> Your department company is <span className="font-medium text-slate-700 dark:text-white">{company}</span>.</>
                        ) : null}
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">badge</span>
                            ID card assets
                        </h3>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Passport photo
                                {idCard.has_passport && !passportPreview && (
                                    <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">(saved)</span>
                                )}
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <UserAvatar
                                    name={displayName}
                                    src={passportUrl}
                                    size="passport"
                                    variant="passport"
                                    className="border border-slate-200 dark:border-border-dark"
                                />
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        setData('passport', file);
                                        setPassportPreview(file ? URL.createObjectURL(file) : null);
                                    }}
                                    className={fileInputClass}
                                />
                            </div>
                            {errors.passport && <p className="text-red-500 text-xs">{errors.passport}</p>}
                        </div>

                        <div className="space-y-3 border-t border-slate-200 dark:border-border-dark pt-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Signature
                                    {idCard.has_signature && !data.signature && (
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

                            {signatureUrl && signatureMode === 'draw' && !data.signature && (
                                <div className="w-full max-w-xs rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 p-3">
                                    <p className="text-xs text-slate-500 dark:text-text-muted mb-2">Current saved signature</p>
                                    <img src={signatureUrl} alt="Saved signature" className="max-h-24 object-contain" />
                                </div>
                            )}

                            {signatureMode === 'draw' ? (
                                <SignaturePad onChange={(file) => setData('signature', file)} />
                            ) : (
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    onChange={(event) => setData('signature', event.target.files?.[0] ?? null)}
                                    className={fileInputClass}
                                />
                            )}
                            {errors.signature && <p className="text-red-500 text-xs">{errors.signature}</p>}
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-border-dark">
                            <button
                                type="submit"
                                disabled={processing || (!data.passport && !data.signature)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">save</span>
                                {processing ? 'Saving…' : 'Save ID card details'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
