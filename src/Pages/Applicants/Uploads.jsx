import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const DOC_FIELDS = [
    { key: 'authorization_recruit_form', label: 'Authorization to Recruit Form' },
    { key: 'terms_of_reference', label: 'Terms of Reference' },
    { key: 'cv', label: 'CV' },
    { key: 'foundation_school', label: 'Foundation School Certificate' },
    { key: 'baptismal_certificate', label: 'Baptismal Certificate' },
    { key: 'educational_qualification', label: 'Educational Qualification' },
    { key: 'birth_certificate', label: 'Birth Certificate' },
    { key: 'church_pastor_attestation', label: 'Church Pastor Attestation Letter' },
    { key: 'ministry_referee_attestation', label: 'Ministry Referee Attestation Letter' },
    { key: 'guarantors_letter', label: "Guarantor's Letter" },
    { key: 'ministry_profile', label: 'Ministry Profile' },
    { key: 'application_letter', label: 'Application Letter' },
    { key: 'campus_letter', label: 'Campus Letter (For Graduate Pastors)' },
    { key: 'others', label: 'Others' },
];

const inputClass =
    'w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium';

export default function ApplicantsUploads({ applicant }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const existing = applicant?.document || {};

    const { data, setData, post, processing, errors } = useForm({
        applicant_id: applicant?.id ?? '',
        ...Object.fromEntries(DOC_FIELDS.map((d) => [d.key, null])),
    });

    const fullName = applicant ? [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') : 'Applicant';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={`Uploads - ${fullName}`}>
            <div className="max-w-5xl space-y-6">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Documents</h3>
                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                            Upload one or more documents for {fullName}. Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each).
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post('/authorised/store/docs', { forceFormData: true });
                        }}
                        className="p-6 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DOC_FIELDS.map(({ key, label }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {label}
                                        {existing[key] && (
                                            <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                                                (already uploaded)
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => setData(key, e.target.files[0] ?? null)}
                                        className={inputClass}
                                    />
                                    {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-border-dark">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                            >
                                Upload documents
                            </button>
                            <Link
                                href={`/authorised/view/${applicant.id}`}
                                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium text-sm"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
