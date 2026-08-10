import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import SearchableSelect from '../../../Components/SearchableSelect';
import SettingsShell from './SettingsShell';
import { Field, FileField, HeaderPreview, Section, ToggleField, inputClass } from './fields';

export default function SettingsIndex({ branding = {}, kc = {}, settingsReady = true }) {
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
    });

    const kcForm = useForm({
        enabled: !!kc.enabled,
        sender_admin_id: kc.sender_admin_id ?? '',
        events: {
            interview_scheduled: kc.events?.interview_scheduled ?? true,
            interview_updated: kc.events?.interview_updated ?? true,
            documents_confirmed: kc.events?.documents_confirmed ?? true,
            progress_updated: kc.events?.progress_updated ?? false,
        },
    });

    const switchTab = (next) => {
        setTab(next);
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (next === 'kc') url.searchParams.set('tab', 'kc');
        else url.searchParams.delete('tab');
        window.history.replaceState({}, '', url);
    };

    const isKc = tab === 'kc';
    const formId = isKc ? 'settings-kc-form' : 'settings-branding-form';
    const saveLabel = isKc ? 'Save notifications' : 'Save branding';
    const processingNow = isKc ? kcForm.processing : processing;
    const formError = isKc ? (kcForm.errors.settings || errors.settings) : errors.settings;

    return (
        <SettingsShell
            title="Settings"
            description="Branding and KingsChat notifications. Public page copy is under Website contents."
            formId={formId}
            saveLabel={saveLabel}
            processing={processingNow}
            settingsReady={settingsReady}
            error={formError}
            activeHref="/administrator/settings"
            tabs={[
                { id: 'site', label: 'Site branding', icon: 'palette' },
                { id: 'kc', label: 'KingsChat', icon: 'chat' },
            ]}
            activeTab={tab}
            onTabChange={switchTab}
        >
            {isKc ? (
                <form
                    id={formId}
                    onSubmit={(e) => {
                        e.preventDefault();
                        kcForm.post('/administrator/settings/kc', { preserveScroll: true });
                    }}
                    className="space-y-4"
                >
                    <Section title="Delivery" icon="chat" hint="Messages are sent as the selected admin. That admin must have signed in with KingsChat at least once.">
                        <ToggleField
                            label="Send KingsChat messages"
                            description="Enable applicant notifications over KingsChat"
                            checked={kcForm.data.enabled}
                            onChange={(e) => kcForm.setData('enabled', e.target.checked)}
                        />
                        <Field
                            label="Send as admin"
                            className="settings-field--full"
                            hint={
                                (kc.admins || []).some((admin) => admin.has_token)
                                    ? 'Only admins who have signed in with KingsChat can send.'
                                    : 'No admin has a KingsChat session yet. Sign in to the portal with KingsChat as an administrator, then return here.'
                            }
                        >
                            <SearchableSelect
                                value={kcForm.data.sender_admin_id}
                                onChange={(value) => kcForm.setData('sender_admin_id', value)}
                                options={kc.admins || []}
                                placeholder="Select an admin"
                                getOptionValue={(admin) => admin.id}
                                getOptionLabel={(admin) =>
                                    `${admin.name || 'Admin'}${admin.username ? ` (@${admin.username})` : ''}${admin.has_token ? '' : ' — not connected'}`
                                }
                                error={kcForm.errors.sender_admin_id}
                            />
                        </Field>
                    </Section>
                    <Section title="Events" icon="notifications" hint="Choose which applicant events trigger a message. Wording is fixed in the app, not edited here.">
                        {[
                            ['interview_scheduled', 'Interview scheduled'],
                            ['interview_updated', 'Interview rescheduled'],
                            ['documents_confirmed', 'Documents confirmed'],
                            ['progress_updated', 'Application progress updated'],
                        ].map(([key, label]) => (
                            <ToggleField
                                key={key}
                                label={label}
                                description="Notify the applicant"
                                checked={kcForm.data.events[key]}
                                onChange={(e) => kcForm.setData('events', { ...kcForm.data.events, [key]: e.target.checked })}
                            />
                        ))}
                    </Section>
                </form>
            ) : (
                <form
                    id={formId}
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/administrator/settings', { forceFormData: true, preserveScroll: true });
                    }}
                    className="space-y-4"
                >
                    <Section title="Identity" icon="badge" hint="This is the public header next to the favicon: name on the first line, tagline underneath.">
                        <HeaderPreview name={data.site_name} tagline={data.site_tagline} faviconUrl={branding.favicon_url} />
                        <Field label="Site name" className="settings-field--full" hint="Example: MSNC Portal">
                            <input type="text" value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} className={inputClass} />
                            {errors.site_name && <p className="text-red-500 text-xs mt-1">{errors.site_name}</p>}
                        </Field>
                        <Field label="Tagline" className="settings-field--full" hint="Example: Recruitment & hiring portal">
                            <input type="text" value={data.site_tagline} onChange={(e) => setData('site_tagline', e.target.value)} className={inputClass} />
                        </Field>
                        <Field label="Footer credit" className="settings-field--full">
                            <input type="text" value={data.footer_credit} onChange={(e) => setData('footer_credit', e.target.value)} className={inputClass} />
                        </Field>
                    </Section>
                    <Section title="Marks" icon="image" hint="Logo appears in the header; favicon in the browser tab.">
                        <FileField
                            label="Logo"
                            existingUrl={branding.logo_url}
                            file={data.logo}
                            previewAlt="Current logo"
                            accept="image/*"
                            error={errors.logo}
                            onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                        />
                        <FileField
                            label="Favicon"
                            existingUrl={branding.favicon_url}
                            file={data.favicon}
                            previewAlt="Current favicon"
                            accept=".ico,image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                            error={errors.favicon}
                            onChange={(e) => setData('favicon', e.target.files?.[0] ?? null)}
                        />
                    </Section>
                </form>
            )}
        </SettingsShell>
    );
}
