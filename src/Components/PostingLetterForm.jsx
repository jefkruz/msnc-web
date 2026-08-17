import { Link } from '@inertiajs/react';
import SearchableSelect from './SearchableSelect';

const inputClass = 'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

export default function PostingLetterForm({ data, setData, errors = {}, applicants = [], onSubmit, processing, submitLabel = 'Save' }) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Letter details</h3>
                    <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                        These fields fill both Sample 1 (posting letter) and Sample 2 (terms and conditions).
                    </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Applicant *</label>
                        <SearchableSelect
                            value={data.applicant_id}
                            onChange={(val) => setData('applicant_id', val)}
                            options={applicants || []}
                            placeholder="Select applicant"
                            required
                            getOptionValue={(a) => a.id}
                            getOptionLabel={(a) => [a.title, a.first_name, a.last_name].filter(Boolean).join(' ') || String(a.id)}
                            error={errors.applicant_id}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Letter date</label>
                        <input type="date" value={data.letter_date || ''} onChange={(e) => setData('letter_date', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Salutation</label>
                        <input type="text" value={data.salutation || ''} onChange={(e) => setData('salutation', e.target.value)} className={inputClass} placeholder="Dear Brother ," />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Recipient address</label>
                        <textarea value={data.recipient_address || ''} onChange={(e) => setData('recipient_address', e.target.value)} className={inputClass} rows={3} placeholder="Street, city, state" />
                    </div>
                    <div>
                        <label className={labelClass}>Mission station / posting station</label>
                        <input type="text" value={data.mission_station || ''} onChange={(e) => setData('mission_station', e.target.value)} className={inputClass} placeholder="International School of Ministry" />
                    </div>
                    <div>
                        <label className={labelClass}>Posting status</label>
                        <input type="text" value={data.posting_status || ''} onChange={(e) => setData('posting_status', e.target.value)} className={inputClass} placeholder="Six Months CONTRACT renewable" />
                    </div>
                    <div>
                        <label className={labelClass}>Effective from / posting date</label>
                        <input type="text" value={data.effective_from || ''} onChange={(e) => setData('effective_from', e.target.value)} className={inputClass} placeholder="January 2026" />
                    </div>
                    <div>
                        <label className={labelClass}>Employer</label>
                        <input type="text" value={data.employer || ''} onChange={(e) => setData('employer', e.target.value)} className={inputClass} placeholder="Mission Support Network Centre" />
                    </div>
                    <div>
                        <label className={labelClass}>Employee name</label>
                        <input type="text" value={data.employee_name || ''} onChange={(e) => setData('employee_name', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Designation</label>
                        <input type="text" value={data.designation || ''} onChange={(e) => setData('designation', e.target.value)} className={inputClass} placeholder="Web Programmer" />
                    </div>
                    <div>
                        <label className={labelClass}>Rank</label>
                        <input type="text" value={data.rank || ''} onChange={(e) => setData('rank', e.target.value)} className={inputClass} placeholder="Junior Programmer 4" />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Signatory</label>
                        <input type="text" value={data.signatory_title || ''} onChange={(e) => setData('signatory_title', e.target.value)} className={inputClass} placeholder="HEAD OF RECRUITMENT, MISSION SUPPORT NETWORK CENTER" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href="/administrator/posting-letters"
                    className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-white/10"
                >
                    Cancel
                </Link>
                <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2">
                    {submitLabel}
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                </button>
            </div>
        </form>
    );
}
