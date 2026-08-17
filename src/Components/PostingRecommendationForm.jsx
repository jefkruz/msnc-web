import { Link } from '@inertiajs/react';
import SearchableSelect from './SearchableSelect';

const inputClass = 'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

function Section({ title, icon, children }) {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function FullWidthSection({ title, icon, children }) {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
    );
}

export default function PostingRecommendationForm({ data, setData, errors = {}, applicants = [], onSubmit, processing, submitLabel = 'Save' }) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <Section title="Applicant" icon="person">
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
            </Section>

            <Section title="Memo header" icon="mail">
                <div>
                    <label className={labelClass}>To</label>
                    <input type="text" value={data.memo_to || ''} onChange={(e) => setData('memo_to', e.target.value)} className={inputClass} placeholder="e.g. Director, Directorate of Corporate Affairs" />
                </div>
                <div>
                    <label className={labelClass}>From</label>
                    <input type="text" value={data.memo_from || ''} onChange={(e) => setData('memo_from', e.target.value)} className={inputClass} placeholder="e.g. Director, AMDL" />
                </div>
                <div>
                    <label className={labelClass}>CC</label>
                    <input type="text" value={data.memo_cc || ''} onChange={(e) => setData('memo_cc', e.target.value)} className={inputClass} placeholder="The CEO; AMDL CSO" />
                </div>
                <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" value={data.memo_date || ''} onChange={(e) => setData('memo_date', e.target.value)} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Re (Subject)</label>
                    <input type="text" value={data.memo_re || ''} onChange={(e) => setData('memo_re', e.target.value)} className={inputClass} placeholder="Posting Recommendation for 1 Applicant into..." />
                </div>
            </Section>

            <FullWidthSection title="Recommendation intro" icon="description">
                <textarea value={data.recommendation_intro || ''} onChange={(e) => setData('recommendation_intro', e.target.value)} className={inputClass} rows={3} placeholder="Warm greetings... Kindly find below the posting recommendation..." />
            </FullWidthSection>

            <Section title="Applicant details (summary)" icon="badge">
                <div className="md:col-span-2">
                    <label className={labelClass}>Name & DOB</label>
                    <input type="text" value={data.applicant_name_dob || ''} onChange={(e) => setData('applicant_name_dob', e.target.value)} className={inputClass} placeholder="e.g. Sis Joy Alonzo (August 10th 1999): 25 Years" />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Contact address / Residential</label>
                    <input type="text" value={data.contact_address || ''} onChange={(e) => setData('contact_address', e.target.value)} className={inputClass} placeholder="Address" />
                </div>
                <div>
                    <label className={labelClass}>Marital status / No of children</label>
                    <input type="text" value={data.marital_status || ''} onChange={(e) => setData('marital_status', e.target.value)} className={inputClass} placeholder="e.g. Single" />
                </div>
                <div>
                    <label className={labelClass}>Department applied to</label>
                    <input type="text" value={data.department_applied_to || ''} onChange={(e) => setData('department_applied_to', e.target.value)} className={inputClass} placeholder="Directorate of Corporate Affairs" />
                </div>
                <div>
                    <label className={labelClass}>Position applied for</label>
                    <input type="text" value={data.position_applied_for || ''} onChange={(e) => setData('position_applied_for', e.target.value)} className={inputClass} placeholder="Accounts Officer" />
                </div>
                <div>
                    <label className={labelClass}>Entry level & posting status requested</label>
                    <input type="text" value={data.entry_level_posting_requested || ''} onChange={(e) => setData('entry_level_posting_requested', e.target.value)} className={inputClass} placeholder="e.g. Senior Financial Analyst Trainee 1 (Contract)" />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Qualification / Year / Institute</label>
                    <textarea value={data.qualification_details || ''} onChange={(e) => setData('qualification_details', e.target.value)} className={inputClass} rows={2} placeholder="B.Sc.: Accounting: Federal University..." />
                </div>
                <div>
                    <label className={labelClass}>Date joined the ministry</label>
                    <input type="text" value={data.date_joined_ministry || ''} onChange={(e) => setData('date_joined_ministry', e.target.value)} className={inputClass} placeholder="e.g. 1999 (Christ Embassy...)" />
                </div>
                <div>
                    <label className={labelClass}>Current local assembly</label>
                    <input type="text" value={data.current_local_assembly || ''} onChange={(e) => setData('current_local_assembly', e.target.value)} className={inputClass} placeholder="Phenom Church, Christ Embassy Lagos Virtual Zone" />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Ministry involvement</label>
                    <textarea value={data.ministry_involvement || ''} onChange={(e) => setData('ministry_involvement', e.target.value)} className={inputClass} rows={4} placeholder="She became a Teens Haven Governor..." />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Work experience</label>
                    <textarea value={data.work_experience || ''} onChange={(e) => setData('work_experience', e.target.value)} className={inputClass} rows={4} placeholder="Accountant: Targfit Experiential Limited..." />
                </div>
            </Section>

            <FullWidthSection title="Panel recommendation" icon="groups">
                <div>
                    <label className={labelClass}>Recommendation from the panel</label>
                    <textarea value={data.panel_recommendation || ''} onChange={(e) => setData('panel_recommendation', e.target.value)} className={inputClass} rows={3} placeholder="Written and oral interviews were conducted for the candidate..." />
                </div>
                <div>
                    <label className={labelClass}>Oral interview panelists</label>
                    <textarea value={data.oral_interview_panelists || ''} onChange={(e) => setData('oral_interview_panelists', e.target.value)} className={inputClass} rows={3} placeholder="Sister Clementina Bedford – AMDL CSO" />
                </div>
                <div>
                    <label className={labelClass}>Panelist comments (each panelist said: ...)</label>
                    <textarea value={data.panelist_comments || ''} onChange={(e) => setData('panelist_comments', e.target.value)} className={inputClass} rows={5} placeholder="Brother X said: &quot;...&quot; Sister Y said: &quot;...&quot;" />
                </div>
            </FullWidthSection>

            <Section title="Other assessment & salary" icon="assessment">
                <div className="md:col-span-2">
                    <label className={labelClass}>Other assessment (Appearance, Composure, etc.)</label>
                    <textarea value={data.other_assessment || ''} onChange={(e) => setData('other_assessment', e.target.value)} className={inputClass} rows={3} placeholder="Appearance – Good, Composure – Good..." />
                </div>
                <div>
                    <label className={labelClass}>Average score (%)</label>
                    <input type="number" step="0.01" value={data.average_score ?? ''} onChange={(e) => setData('average_score', e.target.value)} className={inputClass} placeholder="41" />
                </div>
                <div>
                    <label className={labelClass}>Understanding of the job</label>
                    <textarea value={data.understanding_of_the_job || ''} onChange={(e) => setData('understanding_of_the_job', e.target.value)} className={inputClass} rows={2} placeholder="Candidate understanding of the role" />
                </div>
                <div>
                    <label className={labelClass}>Overall score in the written interview</label>
                    <input type="text" value={data.written_interview_score || ''} onChange={(e) => setData('written_interview_score', e.target.value)} className={inputClass} placeholder="e.g. 72%" />
                </div>
                <div>
                    <label className={labelClass}>Salary the applicant will like to be paid</label>
                    <input type="text" value={data.salary_expectation || ''} onChange={(e) => setData('salary_expectation', e.target.value)} className={inputClass} placeholder="e.g. #150,000.00 and above" />
                </div>
            </Section>

            <FullWidthSection title="External referees comments" icon="contact_support">
                <div>
                    <label className={labelClass}>Recommendation from Pastor (current assembly)</label>
                    <textarea value={data.referee_pastor_comment || ''} onChange={(e) => setData('referee_pastor_comment', e.target.value)} className={inputClass} rows={4} />
                </div>
                <div>
                    <label className={labelClass}>Recommendation from Ministry referee</label>
                    <textarea value={data.referee_ministry_comment || ''} onChange={(e) => setData('referee_ministry_comment', e.target.value)} className={inputClass} rows={4} />
                </div>
                <div>
                    <label className={labelClass}>Recommendation from Guarantor</label>
                    <textarea value={data.referee_guarantor_comment || ''} onChange={(e) => setData('referee_guarantor_comment', e.target.value)} className={inputClass} rows={4} />
                </div>
            </FullWidthSection>

            <FullWidthSection title="Director recommendation & placement" icon="recommend">
                <div>
                    <label className={labelClass}>Recommendation from Director (AMDL or MSNC)</label>
                    <textarea value={data.director_recommendation || ''} onChange={(e) => setData('director_recommendation', e.target.value)} className={inputClass} rows={3} placeholder="Based on the recommendations... recommended on 6 Months CONTRACT posting..." />
                </div>
                <div>
                    <label className={labelClass}>Placement analysis</label>
                    <textarea value={data.placement_analysis || ''} onChange={(e) => setData('placement_analysis', e.target.value)} className={inputClass} rows={3} placeholder="Graduated 2023 (B.Sc.) 2023 – 2024 = Financial Analyst Trainee 2" />
                </div>
                <div>
                    <label className={labelClass}>Closing</label>
                    <textarea value={data.memo_closing || ''} onChange={(e) => setData('memo_closing', e.target.value)} className={inputClass} rows={2} placeholder="We expect your response to our recommendation on whether we may go ahead to produce the Posting letter..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Signatory name</label>
                        <input type="text" value={data.signatory_name || ''} onChange={(e) => setData('signatory_name', e.target.value)} className={inputClass} placeholder="Pastor Ifeoma Chiemeka" />
                    </div>
                    <div>
                        <label className={labelClass}>Signatory title</label>
                        <input type="text" value={data.signatory_title || ''} onChange={(e) => setData('signatory_title', e.target.value)} className={inputClass} placeholder="Director, Advantage Management Definition Limited" />
                    </div>
                </div>
            </FullWidthSection>

            <div className="flex justify-end gap-3">
                <Link
                    href="/administrator/posting-recommendations"
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
