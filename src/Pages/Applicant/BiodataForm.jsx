import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import ApplicantProfilePhoto from '../../Components/ApplicantProfilePhoto';
import BiodataStepNav from '../../Components/BiodataStepNav';
import SearchableSelect from '../../Components/SearchableSelect';
import TitleCaseInput from '../../Components/TitleCaseInput';
import { monthName } from '../../lib/formatDate';
import {
    BIODATA_SECTIONS,
    biodataSectionStatuses,
    firstIncompleteSectionId,
    nextSectionId,
    previousSectionId,
    sectionValidationErrors,
} from '../../lib/biodataSections';

const inputClass = 'form-control';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

const defaultWorkEntry = () => ({
    organisation: '',
    address: '',
    city_state: '',
    period_from: '',
    period_to: '',
    designation: '',
    monthly_package: '',
    reason_for_leaving: '',
});

function formatBirthday(day, month) {
    if (!day || !month) return '—';
    return `${Number(day)} ${monthName(month)}`;
}

function sectionFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return BIODATA_SECTIONS.some((section) => section.id === hash) ? hash : null;
}

export default function BiodataForm({ biodata = null, applicant = null }) {
    const { auth, authRole, menu = [], appName } = usePage().props;

    const workHistory = Array.isArray(biodata?.work_history) && biodata.work_history.length > 0
        ? biodata.work_history
        : [defaultWorkEntry()];

    const initialFormData = {
        other_names: biodata?.other_names ?? '',
        marital_status: biodata?.marital_status ?? '',
        gender: biodata?.gender ?? '',
        is_christian: biodata?.is_christian ?? null,
        born_again_when: biodata?.born_again_when ?? '',
        born_again_where: biodata?.born_again_where ?? '',
        holy_spirit_when: biodata?.holy_spirit_when ?? '',
        holy_spirit_where: biodata?.holy_spirit_where ?? '',
        joined_lw_when: biodata?.joined_lw_when ?? '',
        joined_lw_where: biodata?.joined_lw_where ?? '',
        current_assembly: biodata?.current_assembly ?? '',
        current_assembly_date_joined: biodata?.current_assembly_date_joined ?? '',
        baptized_when_where: biodata?.baptized_when_where ?? '',
        foundation_school_when_where: biodata?.foundation_school_when_where ?? '',
        referee1_name: biodata?.referee1_name ?? '',
        referee1_contact: biodata?.referee1_contact ?? '',
        referee2_name: biodata?.referee2_name ?? '',
        referee2_contact: biodata?.referee2_contact ?? '',
        work_history: workHistory,
        cv: null,
    };

    const [activeSection, setActiveSection] = useState(() => (
        sectionFromHash() ?? firstIncompleteSectionId(initialFormData, applicant)
    ));
    const [sectionErrors, setSectionErrors] = useState({});
    const [savedMessage, setSavedMessage] = useState('');

    const { data, setData, post, processing, errors, progress } = useForm(initialFormData);

    const sectionStatuses = useMemo(
        () => biodataSectionStatuses(data, applicant),
        [data, applicant],
    );

    const activeMeta = BIODATA_SECTIONS.find((section) => section.id === activeSection) ?? BIODATA_SECTIONS[0];
    const isLastSection = activeSection === BIODATA_SECTIONS[BIODATA_SECTIONS.length - 1].id;
    const showChristianFields = data.is_christian === true || data.is_christian === 1 || data.is_christian === '1';

    useEffect(() => {
        const hash = `#${activeSection}`;
        if (window.location.hash !== hash) {
            window.history.replaceState(null, '', hash);
        }
    }, [activeSection]);

    const setWorkHistory = (index, field, value) => {
        const next = [...data.work_history];
        next[index] = { ...next[index], [field]: value };
        setData('work_history', next);
    };

    const addWorkEntry = () => setData('work_history', [...data.work_history, defaultWorkEntry()]);

    const removeWorkEntry = (index) => {
        const next = data.work_history.filter((_, i) => i !== index);
        setData('work_history', next.length ? next : [defaultWorkEntry()]);
    };

    const goToSection = (sectionId) => {
        const target = sectionStatuses.find((section) => section.id === sectionId);
        if (target?.accessible) {
            setActiveSection(sectionId);
            setSectionErrors({});
            setSavedMessage('');
        }
    };

    const submitSection = (event) => {
        event.preventDefault();
        setSavedMessage('');

        const localErrors = sectionValidationErrors(activeSection, data, applicant);
        if (Object.keys(localErrors).length > 0) {
            setSectionErrors(localErrors);
            return;
        }

        setSectionErrors({});

        post('/applicant/biodata', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSavedMessage(`${activeMeta.label} saved.`);
                const next = nextSectionId(activeSection);
                if (next) {
                    setActiveSection(next);
                }
            },
        });
    };

    const fieldError = (key) => sectionErrors[key] || errors[key];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Biodata">
            <div className="biodata-wizard max-w-6xl mx-auto pb-12">
                {(errors.form || savedMessage) && (
                    <div className="space-y-3 mb-6">
                        {errors.form && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm" role="alert">
                                {errors.form}
                            </div>
                        )}
                        {savedMessage && (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm" role="status">
                                {savedMessage}
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                        Biodata Form
                    </h2>
                    <p className="text-slate-500 dark:text-text-muted text-sm">
                        Complete each section in order. Your progress is saved as you go.
                    </p>
                </div>

                <ApplicantProfilePhoto photoUrl={applicant?.photo_url} className="mb-6" />

                <div className="biodata-wizard__layout">
                    <BiodataStepNav
                        sections={sectionStatuses}
                        activeId={activeSection}
                        onSelect={goToSection}
                    />

                    <form onSubmit={submitSection} className="biodata-wizard__panel">
                        <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">{activeMeta.icon}</span>
                                    {activeMeta.label}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-text-muted mt-1">{activeMeta.description}</p>
                            </div>

                            <div className="p-6">
                                {activeSection === 'personal' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Title</label>
                                            <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                                {applicant?.title || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Surname</label>
                                            <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                                {applicant?.last_name || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>First name</label>
                                            <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                                {applicant?.first_name || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Other names</label>
                                            <TitleCaseInput value={data.other_names} onChange={(val) => setData('other_names', val)} className={inputClass} placeholder="Other names" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Marital status</label>
                                            <SearchableSelect
                                                value={data.marital_status}
                                                onChange={(val) => setData('marital_status', val)}
                                                options={[
                                                    { value: 'Single', label: 'Single' },
                                                    { value: 'Married', label: 'Married' },
                                                    { value: 'Divorced', label: 'Divorced' },
                                                    { value: 'Widowed', label: 'Widowed' },
                                                ]}
                                                placeholder="Select"
                                            />
                                            {fieldError('marital_status') && <p className="text-red-500 text-xs mt-1">{fieldError('marital_status')}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Gender</label>
                                            <SearchableSelect
                                                value={data.gender}
                                                onChange={(val) => setData('gender', val)}
                                                options={[
                                                    { value: 'Male', label: 'Male' },
                                                    { value: 'Female', label: 'Female' },
                                                ]}
                                                placeholder="Select"
                                            />
                                            {fieldError('gender') && <p className="text-red-500 text-xs mt-1">{fieldError('gender')}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Date of birth</label>
                                            <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                                                {formatBirthday(applicant?.dob_day, applicant?.dob_month)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'faith' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Are you a Christian?</label>
                                            <SearchableSelect
                                                value={data.is_christian === null ? '' : (data.is_christian ? '1' : '0')}
                                                onChange={(val) => setData('is_christian', val === '' ? null : val === '1')}
                                                options={[
                                                    { value: '1', label: 'Yes' },
                                                    { value: '0', label: 'No' },
                                                ]}
                                                placeholder="Select"
                                            />
                                            {fieldError('is_christian') && <p className="text-red-500 text-xs mt-1">{fieldError('is_christian')}</p>}
                                        </div>

                                        {showChristianFields && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelClass}>When were you born again?</label>
                                                        <input type="text" value={data.born_again_when} onChange={(e) => setData('born_again_when', e.target.value)} className={inputClass} placeholder="When" />
                                                        {fieldError('born_again_when') && <p className="text-red-500 text-xs mt-1">{fieldError('born_again_when')}</p>}
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Where were you born again?</label>
                                                        <input type="text" value={data.born_again_where} onChange={(e) => setData('born_again_where', e.target.value)} className={inputClass} placeholder="Where" />
                                                        {fieldError('born_again_where') && <p className="text-red-500 text-xs mt-1">{fieldError('born_again_where')}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelClass}>When did you receive the Holy Spirit?</label>
                                                        <input type="text" value={data.holy_spirit_when} onChange={(e) => setData('holy_spirit_when', e.target.value)} className={inputClass} placeholder="When" />
                                                        {fieldError('holy_spirit_when') && <p className="text-red-500 text-xs mt-1">{fieldError('holy_spirit_when')}</p>}
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Where did you receive the Holy Spirit?</label>
                                                        <input type="text" value={data.holy_spirit_where} onChange={(e) => setData('holy_spirit_where', e.target.value)} className={inputClass} placeholder="Where" />
                                                        {fieldError('holy_spirit_where') && <p className="text-red-500 text-xs mt-1">{fieldError('holy_spirit_where')}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelClass}>When did you join LW Inc.?</label>
                                                        <input type="text" value={data.joined_lw_when} onChange={(e) => setData('joined_lw_when', e.target.value)} className={inputClass} placeholder="When" />
                                                        {fieldError('joined_lw_when') && <p className="text-red-500 text-xs mt-1">{fieldError('joined_lw_when')}</p>}
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Where did you join LW Inc.?</label>
                                                        <input type="text" value={data.joined_lw_where} onChange={(e) => setData('joined_lw_where', e.target.value)} className={inputClass} placeholder="Where" />
                                                        {fieldError('joined_lw_where') && <p className="text-red-500 text-xs mt-1">{fieldError('joined_lw_where')}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelClass}>Current local assembly</label>
                                                        <TitleCaseInput value={data.current_assembly} onChange={(val) => setData('current_assembly', val)} className={inputClass} placeholder="Assembly name" />
                                                        {fieldError('current_assembly') && <p className="text-red-500 text-xs mt-1">{fieldError('current_assembly')}</p>}
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Date joined current assembly</label>
                                                        <input type="text" value={data.current_assembly_date_joined} onChange={(e) => setData('current_assembly_date_joined', e.target.value)} className={inputClass} placeholder="e.g. Jan 2024" />
                                                        {fieldError('current_assembly_date_joined') && <p className="text-red-500 text-xs mt-1">{fieldError('current_assembly_date_joined')}</p>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClass}>When and where were you baptized by immersion?</label>
                                                    <input type="text" value={data.baptized_when_where} onChange={(e) => setData('baptized_when_where', e.target.value)} className={inputClass} placeholder="When and where" />
                                                    {fieldError('baptized_when_where') && <p className="text-red-500 text-xs mt-1">{fieldError('baptized_when_where')}</p>}
                                                </div>
                                                <div>
                                                    <label className={labelClass}>When and where did you attend Foundation School?</label>
                                                    <input type="text" value={data.foundation_school_when_where} onChange={(e) => setData('foundation_school_when_where', e.target.value)} className={inputClass} placeholder="When and where" />
                                                    {fieldError('foundation_school_when_where') && <p className="text-red-500 text-xs mt-1">{fieldError('foundation_school_when_where')}</p>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeSection === 'referees' && (
                                    <div className="space-y-6">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelClass}>Referee {i} – Name</label>
                                                    <TitleCaseInput value={data[`referee${i}_name`]} onChange={(val) => setData(`referee${i}_name`, val)} className={inputClass} placeholder={`Referee ${i} name`} />
                                                    {fieldError(`referee${i}_name`) && <p className="text-red-500 text-xs mt-1">{fieldError(`referee${i}_name`)}</p>}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className={labelClass}>Referee {i} – Contact (address, email, phone)</label>
                                                    <textarea value={data[`referee${i}_contact`]} onChange={(e) => setData(`referee${i}_contact`, e.target.value)} className={inputClass} rows={2} placeholder="Address, email, phone" />
                                                    {fieldError(`referee${i}_contact`) && <p className="text-red-500 text-xs mt-1">{fieldError(`referee${i}_contact`)}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'work' && (
                                    <div className="space-y-6">
                                        {fieldError('work_history') && (
                                            <p className="text-red-500 text-sm" role="alert">{fieldError('work_history')}</p>
                                        )}
                                        <div className="flex justify-end">
                                            <button type="button" onClick={addWorkEntry} className="text-sm font-medium text-primary hover:underline">
                                                + Add entry
                                            </button>
                                        </div>
                                        {data.work_history.map((entry, index) => (
                                            <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-border-dark space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Entry {index + 1}</span>
                                                    {data.work_history.length > 1 && (
                                                        <button type="button" onClick={() => removeWorkEntry(index)} className="text-red-500 hover:text-red-600 text-sm">
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="sm:col-span-2">
                                                        <label className={labelClass}>Organisation</label>
                                                        <TitleCaseInput value={entry.organisation} onChange={(val) => setWorkHistory(index, 'organisation', val)} className={inputClass} placeholder="Organisation name" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Address</label>
                                                        <input type="text" value={entry.address} onChange={(e) => setWorkHistory(index, 'address', e.target.value)} className={inputClass} placeholder="Address" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>City / State</label>
                                                        <TitleCaseInput value={entry.city_state} onChange={(val) => setWorkHistory(index, 'city_state', val)} className={inputClass} placeholder="City, State" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Period from</label>
                                                        <input type="text" value={entry.period_from} onChange={(e) => setWorkHistory(index, 'period_from', e.target.value)} className={inputClass} placeholder="e.g. Jan 2020" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Period to</label>
                                                        <input type="text" value={entry.period_to} onChange={(e) => setWorkHistory(index, 'period_to', e.target.value)} className={inputClass} placeholder="e.g. Dec 2023" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Designation</label>
                                                        <TitleCaseInput value={entry.designation} onChange={(val) => setWorkHistory(index, 'designation', val)} className={inputClass} placeholder="Job title" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Monthly package</label>
                                                        <input type="text" value={entry.monthly_package} onChange={(e) => setWorkHistory(index, 'monthly_package', e.target.value)} className={inputClass} placeholder="Amount" />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className={labelClass}>Reason for leaving</label>
                                                        <textarea value={entry.reason_for_leaving} onChange={(e) => setWorkHistory(index, 'reason_for_leaving', e.target.value)} className={inputClass} rows={2} placeholder="Reason" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'cv' && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-slate-500 dark:text-text-muted">
                                            Upload your CV (PDF, DOC, DOCX, JPG, or PNG — max 10MB).
                                        </p>
                                        {applicant?.cv_url && (
                                            <p className="text-sm">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Current CV uploaded.</span>{' '}
                                                <a href={applicant.cv_url} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">
                                                    View file
                                                </a>
                                            </p>
                                        )}
                                        <div>
                                            <label className={labelClass}>{applicant?.cv_url ? 'Replace CV' : 'Upload CV'}</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('cv', e.target.files?.[0] ?? null)}
                                                className={`${inputClass} file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium`}
                                            />
                                            {data.cv && (
                                                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    Selected: {data.cv.name}
                                                </p>
                                            )}
                                            {fieldError('cv') && <p className="mt-1.5 text-sm text-red-600" role="alert">{fieldError('cv')}</p>}
                                            {progress && <p className="mt-1.5 text-sm text-slate-500">Uploading… {progress.percentage}%</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                                {previousSectionId(activeSection) ? (
                                    <button
                                        type="button"
                                        onClick={() => goToSection(previousSectionId(activeSection))}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                                        Previous section
                                    </button>
                                ) : (
                                    <span />
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Saving…' : isLastSection ? 'Save & finish' : 'Save & continue'}
                                    <span className="material-symbols-outlined text-lg">{isLastSection ? 'check' : 'arrow_forward'}</span>
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
