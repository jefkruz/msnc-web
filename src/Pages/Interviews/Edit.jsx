import { useState } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ConfirmModal from '../../Components/ConfirmModal';
import ActionButton from '../../Components/ActionButton';
import SearchableSelect from '../../Components/SearchableSelect';
import SearchableMultiSelect from '../../Components/SearchableMultiSelect';
import { useCan } from '../../lib/can';

function applicantLabel(a) {
    if (!a) return '';
    const first = (a.first_name || '').trim();
    const last = (a.last_name || '').trim();
    const full = [first, last].filter(Boolean).join(' ');
    return full || a.title || `Applicant #${a.id}`;
}

export default function InterviewsEdit({ interview, applicants = [], panelists = [] }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        applicant_id: String(interview?.applicant_id ?? ''),
        date: interview?.date ?? '',
        panelists: Array.isArray(interview?.panelists) ? interview.panelists.map(String) : [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/administrator/interviews/update/${interview.id}`);
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Edit Interview">
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Applicant</label>
                            <SearchableSelect
                                value={data.applicant_id}
                                onChange={(id) => setData('applicant_id', id)}
                                options={applicants}
                                placeholder="Search applicant..."
                                required
                                getOptionValue={(a) => a.id}
                                getOptionLabel={applicantLabel}
                                error={errors.applicant_id}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="form-control"
                                required
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Panelists</label>
                            <SearchableMultiSelect
                                value={data.panelists}
                                onChange={(ids) => setData('panelists', ids)}
                                options={panelists}
                                placeholder="Search and select panelists..."
                                required
                                getOptionValue={(p) => p.id}
                                getOptionLabel={(p) => p.name || ''}
                                error={errors.panelists}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/administrator/interviews" className="btn btn-secondary">Cancel</Link>
                        <button type="submit" disabled={processing} className="btn btn-primary">Update Interview</button>
                        {can('interviews.delete') && interview?.id && (
                            <ActionButton action="delete" size="" variant="danger" className="ml-auto" onClick={() => setConfirmDelete(true)} />
                        )}
                    </div>
                </form>
                <ConfirmModal
                    show={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => router.delete(`/administrator/interviews/delete/${interview.id}`)}
                    title="Delete interview"
                    message="Are you sure you want to delete this interview? This cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </Layout>
    );
}
