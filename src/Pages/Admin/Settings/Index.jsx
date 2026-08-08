import { useForm, usePage } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Alert from '../../../Components/Alert';

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

export default function SettingsIndex({ branding = {}, home = {}, settingsReady = true }) {
    const { auth, authRole, menu, appName, flash } = usePage().props;

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

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Website Settings">
            <form onSubmit={submit} className="space-y-6 max-w-5xl">
                {flash?.message && <Alert type="success" message={flash.message} />}
                {!settingsReady && (
                    <Alert
                        type="error"
                        message="Website settings storage is not set up on this server. Run the portal_settings migration, then refresh this page."
                    />
                )}
                {errors.settings && <Alert type="error" message={errors.settings} />}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Website Settings
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">
                            Manage homepage content, logo, favicon, and hero image for the public site.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        {processing ? 'Saving…' : 'Save changes'}
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
                        {processing ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </Layout>
    );
}
