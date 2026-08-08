import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Alert from '../../../Components/Alert';
import { useCan } from '../../../lib/can';

const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';
const inputClass =
    'form-control';
const textareaClass = `${inputClass} min-h-[110px]`;

function Section({ title, icon, children }) {
    return (
        <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </section>
    );
}

function Field({ label, className = '', children }) {
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
}

export default function SettingsIndex({ branding = {}, home = {}, kc = {}, settingsReady = true }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const [tab, setTab] = useState(() => {
        if (typeof window === 'undefined') return 'site';
        return new URLSearchParams(window.location.search).get('tab') === 'kc' ? 'kc' : 'site';
    });

    const { data, setData, post, processing, errors } = useForm({
        site_name: branding.site_name ?? '',
        site_tagline: branding.site_tagline ?? '',
        footer_credit: branding.footer_credit ?? '',
        logo: null,
        favicon: null,
        hero_image: null,
        hero_title: home.hero_title ?? '',
        hero_lead: home.hero_lead ?? '',
        hero_tagline: home.hero_tagline ?? '',
        applicant_cta_label: home.applicant_cta_label ?? '',
        admin_cta_label: home.admin_cta_label ?? '',
        trust_1: home.trust_1 ?? '',
        trust_2: home.trust_2 ?? '',
        trust_3: home.trust_3 ?? '',
        trust_4: home.trust_4 ?? '',
        applicant_eyebrow: home.applicant_eyebrow ?? '',
        applicant_title: home.applicant_title ?? '',
        applicant_body: home.applicant_body ?? '',
        applicant_button: home.applicant_button ?? '',
        staff_eyebrow: home.staff_eyebrow ?? '',
        staff_title: home.staff_title ?? '',
        staff_body: home.staff_body ?? '',
        staff_button: home.staff_button ?? '',
        about_eyebrow: home.about_eyebrow ?? '',
        about_title: home.about_title ?? '',
        about_body: home.about_body ?? '',
        faith_eyebrow: home.faith_eyebrow ?? '',
        faith_title: home.faith_title ?? '',
        faith_intro: home.faith_intro ?? '',
        faith_belief_intro: home.faith_belief_intro ?? '',
        faith_items: home.faith_items ?? '',
        posting_eyebrow: home.posting_eyebrow ?? '',
        posting_title: home.posting_title ?? '',
        posting_body: home.posting_body ?? '',
        posting_button: home.posting_button ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/administrator/settings', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const kcForm = useForm({
        enabled: !!kc.enabled,
        access_token: '',
        events: {
            interview_scheduled: kc.events?.interview_scheduled ?? true,
            interview_updated: kc.events?.interview_updated ?? true,
            documents_confirmed: kc.events?.documents_confirmed ?? true,
            progress_updated: kc.events?.progress_updated ?? false,
        },
        templates: {
            interview_scheduled: kc.templates?.interview_scheduled ?? '',
            interview_updated: kc.templates?.interview_updated ?? '',
            documents_confirmed: kc.templates?.documents_confirmed ?? '',
            progress_updated: kc.templates?.progress_updated ?? '',
        },
    });

    const submitKc = (e) => {
        e.preventDefault();
        kcForm.post('/administrator/settings/kc', { preserveScroll: true });
    };

    const switchTab = (next) => {
        setTab(next);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (next === 'kc') url.searchParams.set('tab', 'kc');
            else url.searchParams.delete('tab');
            window.history.replaceState({}, '', url);
        }
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Settings">
            <div className="max-w-5xl space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                        Manage site branding, KingsChat notifications, and access roles.
                    </p>
                </div>

                {can('roles.view') && (
                    <div className="dash-kpi-grid dash-kpi-grid--3">
                        <Link href="/administrator/roles" className="dash-kpi">
                            <span className="dash-kpi__icon" aria-hidden="true">
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                            </span>
                            <div className="dash-kpi__content">
                                <p className="dash-kpi__label">Roles &amp; permissions</p>
                                <p className="dash-kpi__value">—</p>
                                <p className="dash-kpi__hint">Create roles and assign permissions</p>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-border-dark pb-px">
                    <button
                        type="button"
                        onClick={() => switchTab('site')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                            tab === 'site'
                                ? 'bg-white dark:bg-surface-dark text-primary border border-b-white dark:border-b-surface-dark border-slate-200 dark:border-border-dark -mb-px'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        Site settings
                    </button>
                    <button
                        type="button"
                        onClick={() => switchTab('kc')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                            tab === 'kc'
                                ? 'bg-white dark:bg-surface-dark text-primary border border-b-white dark:border-b-surface-dark border-slate-200 dark:border-border-dark -mb-px'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        KingsChat notifications
                    </button>
                </div>

                {!settingsReady && (
                    <Alert
                        type="error"
                        message="Settings storage is not set up on this server. Run the portal_settings migration, then refresh this page."
                    />
                )}

            {tab === 'kc' ? (
                <form onSubmit={submitKc} className="space-y-6">
                    {(kcForm.errors.settings || errors.settings) && (
                        <Alert type="error" message={kcForm.errors.settings || errors.settings} />
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={kcForm.processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                        >
                            <span className="material-symbols-outlined text-lg">save</span>
                            {kcForm.processing ? 'Saving…' : 'Save notifications'}
                        </button>
                    </div>
                    <Section title="Delivery" icon="chat">
                        <Field label="Send KingsChat messages" className="md:col-span-2">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={!!kcForm.data.enabled}
                                    onChange={(e) => kcForm.setData('enabled', e.target.checked)}
                                />
                                Enable applicant notifications over KingsChat
                            </label>
                        </Field>
                        <Field label="KingsChat access token" className="md:col-span-2">
                            <input
                                type="password"
                                autoComplete="off"
                                value={kcForm.data.access_token}
                                onChange={(e) => kcForm.setData('access_token', e.target.value)}
                                className={inputClass}
                                placeholder={kc.has_token ? `Saved token ${kc.token_hint || ''} — leave blank to keep` : 'Paste a KingsChat access token'}
                            />
                            <p className="text-xs text-slate-500 dark:text-text-muted mt-1">
                                Used to send messages as your KingsChat app/user. Stored encrypted. Never share this token.
                            </p>
                        </Field>
                    </Section>
                    <Section title="Events" icon="notifications">
                        {[
                            ['interview_scheduled', 'Interview scheduled'],
                            ['interview_updated', 'Interview rescheduled'],
                            ['documents_confirmed', 'Documents confirmed'],
                            ['progress_updated', 'Application progress updated'],
                        ].map(([key, label]) => (
                            <Field key={key} label={label} className="md:col-span-2">
                                <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={!!kcForm.data.events[key]}
                                        onChange={(e) =>
                                            kcForm.setData('events', { ...kcForm.data.events, [key]: e.target.checked })
                                        }
                                    />
                                    Notify the applicant
                                </label>
                            </Field>
                        ))}
                    </Section>
                    <Section title="Message templates" icon="edit_note">
                        <p className="md:col-span-2 text-xs text-slate-500 dark:text-text-muted -mt-1">
                            Placeholders: {'{name}'}, {'{site}'}, {'{date}'}, {'{time}'}, {'{step}'}, {'{status}'}
                        </p>
                        {[
                            ['interview_scheduled', 'Interview scheduled'],
                            ['interview_updated', 'Interview rescheduled'],
                            ['documents_confirmed', 'Documents confirmed'],
                            ['progress_updated', 'Progress updated'],
                        ].map(([key, label]) => (
                            <Field key={key} label={label} className="md:col-span-2">
                                <textarea
                                    value={kcForm.data.templates[key]}
                                    onChange={(e) =>
                                        kcForm.setData('templates', { ...kcForm.data.templates, [key]: e.target.value })
                                    }
                                    className={textareaClass}
                                    rows={3}
                                />
                            </Field>
                        ))}
                    </Section>
                </form>
            ) : (
            <form onSubmit={submit} className="space-y-6">
                {errors.settings && <Alert type="error" message={errors.settings} />}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        {processing ? 'Saving…' : 'Save site settings'}
                    </button>
                </div>

                <Section title="Site branding" icon="brand_family">
                    <Field label="Site name" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.site_name}
                            onChange={(e) => setData('site_name', e.target.value)}
                            className={inputClass}
                        />
                        {errors.site_name && <p className="text-red-500 text-xs mt-1">{errors.site_name}</p>}
                    </Field>
                    <Field label="Tagline">
                        <input
                            type="text"
                            value={data.site_tagline}
                            onChange={(e) => setData('site_tagline', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Footer credit">
                        <input
                            type="text"
                            value={data.footer_credit}
                            onChange={(e) => setData('footer_credit', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Logo">
                        <div className="space-y-3">
                            {branding.logo_url && (
                                <img
                                    src={branding.logo_url}
                                    alt="Current logo"
                                    className="h-16 w-16 rounded-full object-contain bg-slate-100 dark:bg-white/10 p-1"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                            />
                            {errors.logo && <p className="text-red-500 text-xs">{errors.logo}</p>}
                        </div>
                    </Field>
                    <Field label="Favicon">
                        <div className="space-y-3">
                            {branding.favicon_url && (
                                <img
                                    src={branding.favicon_url}
                                    alt="Current favicon"
                                    className="h-10 w-10 object-contain bg-slate-100 dark:bg-white/10 p-1 rounded"
                                />
                            )}
                            <input
                                type="file"
                                accept=".ico,image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                                onChange={(e) => setData('favicon', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                            />
                            {errors.favicon && <p className="text-red-500 text-xs">{errors.favicon}</p>}
                        </div>
                    </Field>
                </Section>

                <Section title="Hero section" icon="web">
                    <Field label="Hero image (right side)" className="md:col-span-2">
                        <div className="space-y-3">
                            {(branding.hero_image_url || '/images/hero.jpg') && (
                                <img
                                    src={branding.hero_image_url || '/images/hero.jpg'}
                                    alt="Current hero"
                                    className="h-28 w-full max-w-md rounded-lg object-cover object-right bg-slate-100 dark:bg-white/10"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={(e) => setData('hero_image', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                            />
                            <p className="text-xs text-slate-500 dark:text-text-muted">
                                Wide image works best (about 16:9), with the main subject on the right.
                            </p>
                            {errors.hero_image && <p className="text-red-500 text-xs">{errors.hero_image}</p>}
                        </div>
                    </Field>
                    <Field label="Hero title" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.hero_title}
                            onChange={(e) => setData('hero_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Hero lead text" className="md:col-span-2">
                        <textarea
                            value={data.hero_lead}
                            onChange={(e) => setData('hero_lead', e.target.value)}
                            className={textareaClass}
                            rows={4}
                        />
                    </Field>
                    <Field label="Hero tagline" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.hero_tagline}
                            onChange={(e) => setData('hero_tagline', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Applicant Login button (existing applicants — update profile)">
                        <input
                            type="text"
                            value={data.applicant_cta_label}
                            onChange={(e) => setData('applicant_cta_label', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Ministry opportunity button (new applicants)">
                        <input
                            type="text"
                            value={data.admin_cta_label}
                            onChange={(e) => setData('admin_cta_label', e.target.value)}
                            className={inputClass}
                            placeholder="Opportunity to work in ministry"
                        />
                    </Field>
                </Section>

                <Section title="Trust strip" icon="verified">
                    {['trust_1', 'trust_2', 'trust_3', 'trust_4'].map((key, i) => (
                        <Field key={key} label={`Item ${i + 1}`}>
                            <input
                                type="text"
                                value={data[key]}
                                onChange={(e) => setData(key, e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    ))}
                </Section>

                <Section title="Applicants path card" icon="person">
                    <Field label="Eyebrow">
                        <input
                            type="text"
                            value={data.applicant_eyebrow}
                            onChange={(e) => setData('applicant_eyebrow', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Button label">
                        <input
                            type="text"
                            value={data.applicant_button}
                            onChange={(e) => setData('applicant_button', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.applicant_title}
                            onChange={(e) => setData('applicant_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Body" className="md:col-span-2">
                        <textarea
                            value={data.applicant_body}
                            onChange={(e) => setData('applicant_body', e.target.value)}
                            className={textareaClass}
                            rows={3}
                        />
                    </Field>
                </Section>

                <Section title="Staff path card" icon="group">
                    <Field label="Eyebrow">
                        <input
                            type="text"
                            value={data.staff_eyebrow}
                            onChange={(e) => setData('staff_eyebrow', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Button label">
                        <input
                            type="text"
                            value={data.staff_button}
                            onChange={(e) => setData('staff_button', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.staff_title}
                            onChange={(e) => setData('staff_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Body" className="md:col-span-2">
                        <textarea
                            value={data.staff_body}
                            onChange={(e) => setData('staff_body', e.target.value)}
                            className={textareaClass}
                            rows={3}
                        />
                    </Field>
                </Section>

                <Section title="About Us" icon="info">
                    <Field label="Eyebrow">
                        <input
                            type="text"
                            value={data.about_eyebrow}
                            onChange={(e) => setData('about_eyebrow', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title">
                        <input
                            type="text"
                            value={data.about_title}
                            onChange={(e) => setData('about_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Body (separate paragraphs with a blank line)" className="md:col-span-2">
                        <textarea
                            value={data.about_body}
                            onChange={(e) => setData('about_body', e.target.value)}
                            className={`${textareaClass} min-h-[180px]`}
                            rows={8}
                        />
                    </Field>
                </Section>

                <Section title="Statement of Faith" icon="menu_book">
                    <Field label="Eyebrow">
                        <input
                            type="text"
                            value={data.faith_eyebrow}
                            onChange={(e) => setData('faith_eyebrow', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title">
                        <input
                            type="text"
                            value={data.faith_title}
                            onChange={(e) => setData('faith_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Intro" className="md:col-span-2">
                        <textarea
                            value={data.faith_intro}
                            onChange={(e) => setData('faith_intro', e.target.value)}
                            className={textareaClass}
                            rows={3}
                        />
                    </Field>
                    <Field label="Belief intro" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.faith_belief_intro}
                            onChange={(e) => setData('faith_belief_intro', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Belief items (one per line)" className="md:col-span-2">
                        <textarea
                            value={data.faith_items}
                            onChange={(e) => setData('faith_items', e.target.value)}
                            className={`${textareaClass} min-h-[160px]`}
                            rows={6}
                        />
                    </Field>
                </Section>

                <Section title="Opportunity to work in ministry" icon="work">
                    <Field label="Eyebrow">
                        <input
                            type="text"
                            value={data.posting_eyebrow}
                            onChange={(e) => setData('posting_eyebrow', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Button label">
                        <input
                            type="text"
                            value={data.posting_button}
                            onChange={(e) => setData('posting_button', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title" className="md:col-span-2">
                        <input
                            type="text"
                            value={data.posting_title}
                            onChange={(e) => setData('posting_title', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Body (separate paragraphs with a blank line)" className="md:col-span-2">
                        <textarea
                            value={data.posting_body}
                            onChange={(e) => setData('posting_body', e.target.value)}
                            className={textareaClass}
                            rows={5}
                        />
                    </Field>
                </Section>

                <div className="flex justify-end pb-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        {processing ? 'Saving…' : 'Save site settings'}
                    </button>
                </div>
            </form>
            )}
            </div>
        </Layout>
    );
}
