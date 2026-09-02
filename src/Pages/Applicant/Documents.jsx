import { useForm, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ApplicantProfilePhoto from '../../Components/ApplicantProfilePhoto';
import { statusBadgeClass } from '../../lib/applicantDocuments';

const inputClass =
    'w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium';

export default function ApplicantDocumentsPage({ fields = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const uploadableFields = fields.filter((field) => field.uploadable);

    const initialData = Object.fromEntries(uploadableFields.map((field) => [field.key, null]));
    const { data, setData, post, processing, errors } = useForm(initialData);

    const submit = (e) => {
        e.preventDefault();
        post('/applicant/documents', { forceFormData: true, preserveScroll: true });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Documents">
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                <ApplicantProfilePhoto photoUrl={auth?.image} />

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Documents</h3>
                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                            Upload your required documents. Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each).
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 dark:text-text-muted text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                    <th className="px-6 py-3 w-14 text-center">#</th>
                                    <th className="px-6 py-3">Document</th>
                                    <th className="px-6 py-3 w-32 text-center">Status</th>
                                    <th className="px-6 py-3 w-36 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {fields.map((field, idx) => (
                                    <tr key={field.key} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-center text-slate-500 dark:text-text-muted">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{field.label}</div>
                                            {field.note && (
                                                <p className="text-xs text-slate-500 dark:text-text-muted mt-1">{field.note}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(field.status)}`}>
                                                {field.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {field.url ? (
                                                <a
                                                    href={field.url}
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
                </div>

                {uploadableFields.length > 0 && (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Documents</h3>
                            <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                                Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each).
                            </p>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {uploadableFields.map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {field.label}
                                            {field.status === 'uploaded' && (
                                                <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                                                    (replace existing)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => setData(field.key, e.target.files[0] ?? null)}
                                            className={inputClass}
                                        />
                                        {errors[field.key] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200 dark:border-border-dark">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">upload_file</span>
                                    {processing ? 'Uploading…' : 'Upload documents'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
}
