import { useForm } from '@inertiajs/react';
import SettingsShell from './SettingsShell';
import { Field, FileField, Section, inputClass, textareaClass } from './fields';

const JUMP = [
    { id: 'hero', label: 'Hero' },
    { id: 'trust', label: 'Trust strip' },
    { id: 'applicants-path', label: 'Applicants card' },
    { id: 'staff-path', label: 'Staff card' },
    { id: 'about', label: 'About' },
    { id: 'faith', label: 'Faith' },
    { id: 'ministry', label: 'Ministry' },
];

export default function SettingsWebsite({ branding = {}, home = {}, settingsReady = true }) {
    const { data, setData, post, processing, errors } = useForm({
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

    return (
        <SettingsShell
            title="Website contents"
            description="Edit public homepage, About, Statement of Faith, and ministry opportunity copy."
            formId="settings-website-form"
            saveLabel="Save website contents"
            processing={processing}
            settingsReady={settingsReady}
            error={errors.settings}
            activeHref="/administrator/settings/website"
        >
            <nav className="settings-jump" aria-label="Jump to section">
                {JUMP.map((item) => (
                    <a key={item.id} href={`#${item.id}`}>{item.label}</a>
                ))}
            </nav>

            <form
                id="settings-website-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    post('/administrator/settings/website', { forceFormData: true, preserveScroll: true });
                }}
                className="space-y-4"
            >
                <Section id="hero" title="Hero section" icon="web" hint="Top of the public homepage: headline, lead text, and Applicant Login button.">
                    <FileField
                        label="Hero image (right side)"
                        hint="Wide image works best (about 16:9), with the main subject on the right."
                        existingUrl={branding.hero_image_url || '/images/hero.jpg'}
                        file={data.hero_image}
                        previewAlt="Current hero"
                        previewClassName="is-wide"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        error={errors.hero_image}
                        onChange={(e) => setData('hero_image', e.target.files?.[0] ?? null)}
                    />
                    <Field label="Hero title" className="settings-field--full">
                        <input type="text" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Hero lead text" className="settings-field--full">
                        <textarea value={data.hero_lead} onChange={(e) => setData('hero_lead', e.target.value)} className={textareaClass} rows={4} />
                    </Field>
                    <Field label="Hero tagline" className="settings-field--full">
                        <input type="text" value={data.hero_tagline} onChange={(e) => setData('hero_tagline', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Applicant Login button (existing applicants — update profile)">
                        <input type="text" value={data.applicant_cta_label} onChange={(e) => setData('applicant_cta_label', e.target.value)} className={inputClass} />
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

                <Section id="trust" title="Trust strip" icon="verified" hint="Four short lines under the hero that summarise what MSNC offers.">
                    {['trust_1', 'trust_2', 'trust_3', 'trust_4'].map((key, i) => (
                        <Field key={key} label={`Item ${i + 1}`}>
                            <input type="text" value={data[key]} onChange={(e) => setData(key, e.target.value)} className={inputClass} />
                        </Field>
                    ))}
                </Section>

                <Section id="applicants-path" title="Applicants path card" icon="person" hint="For people who already applied — send them to Applicant Login.">
                    <Field label="Eyebrow">
                        <input type="text" value={data.applicant_eyebrow} onChange={(e) => setData('applicant_eyebrow', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Button label">
                        <input type="text" value={data.applicant_button} onChange={(e) => setData('applicant_button', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Title" className="settings-field--full">
                        <input type="text" value={data.applicant_title} onChange={(e) => setData('applicant_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Body" className="settings-field--full">
                        <textarea value={data.applicant_body} onChange={(e) => setData('applicant_body', e.target.value)} className={textareaClass} rows={3} />
                    </Field>
                </Section>

                <Section id="staff-path" title="Staff path card" icon="group" hint="New applicants / ministry opportunity card on the homepage (Register).">
                    <Field label="Eyebrow">
                        <input type="text" value={data.staff_eyebrow} onChange={(e) => setData('staff_eyebrow', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Button label">
                        <input type="text" value={data.staff_button} onChange={(e) => setData('staff_button', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Title" className="settings-field--full">
                        <input type="text" value={data.staff_title} onChange={(e) => setData('staff_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Body" className="settings-field--full">
                        <textarea value={data.staff_body} onChange={(e) => setData('staff_body', e.target.value)} className={textareaClass} rows={3} />
                    </Field>
                </Section>

                <Section id="about" title="About Us" icon="info" hint="Public /about page.">
                    <Field label="Eyebrow">
                        <input type="text" value={data.about_eyebrow} onChange={(e) => setData('about_eyebrow', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Title">
                        <input type="text" value={data.about_title} onChange={(e) => setData('about_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Body (separate paragraphs with a blank line)" className="settings-field--full">
                        <textarea value={data.about_body} onChange={(e) => setData('about_body', e.target.value)} className={`${textareaClass} min-h-[180px]`} rows={8} />
                    </Field>
                </Section>

                <Section id="faith" title="Statement of Faith" icon="menu_book" hint="Public /statement-of-faith page.">
                    <Field label="Eyebrow">
                        <input type="text" value={data.faith_eyebrow} onChange={(e) => setData('faith_eyebrow', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Title">
                        <input type="text" value={data.faith_title} onChange={(e) => setData('faith_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Intro" className="settings-field--full">
                        <textarea value={data.faith_intro} onChange={(e) => setData('faith_intro', e.target.value)} className={textareaClass} rows={3} />
                    </Field>
                    <Field label="Belief intro" className="settings-field--full">
                        <input type="text" value={data.faith_belief_intro} onChange={(e) => setData('faith_belief_intro', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Belief items (one per line)" className="settings-field--full">
                        <textarea value={data.faith_items} onChange={(e) => setData('faith_items', e.target.value)} className={`${textareaClass} min-h-[160px]`} rows={6} />
                    </Field>
                </Section>

                <Section id="ministry" title="Opportunity to work in ministry" icon="work" hint="Public registration page copy.">
                    <Field label="Eyebrow">
                        <input type="text" value={data.posting_eyebrow} onChange={(e) => setData('posting_eyebrow', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Button label">
                        <input type="text" value={data.posting_button} onChange={(e) => setData('posting_button', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Title" className="settings-field--full">
                        <input type="text" value={data.posting_title} onChange={(e) => setData('posting_title', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Body (separate paragraphs with a blank line)" className="settings-field--full">
                        <textarea value={data.posting_body} onChange={(e) => setData('posting_body', e.target.value)} className={textareaClass} rows={5} />
                    </Field>
                </Section>
            </form>
        </SettingsShell>
    );
}
