import { Link, usePage } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Alert from '../../../Components/Alert';
import { useCan } from '../../../lib/can';
import { SaveBar } from './fields';

export function settingsNavLinks(activeHref, { canRoles = false } = {}) {
    const links = [
        { href: '/administrator/settings', icon: 'tune', label: 'Overview', hint: 'Branding and KingsChat notifications' },
        { href: '/administrator/settings/website', icon: 'web', label: 'Website contents', hint: 'Homepage, About, Faith, ministry copy' },
    ];
    if (canRoles) {
        links.push({
            href: '/administrator/roles',
            icon: 'admin_panel_settings',
            label: 'Roles & permissions',
            hint: 'Create roles and assign access',
        });
    }

    return links.map((item) => ({ ...item, active: item.href === activeHref }));
}

export default function SettingsShell({
    pageTitle,
    title,
    description,
    formId,
    saveLabel,
    processing = false,
    settingsReady = true,
    error,
    activeHref,
    tabs = [],
    activeTab,
    onTabChange,
    children,
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    const links = settingsNavLinks(activeHref, { canRoles: can('roles.view') });

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={pageTitle || title}>
            <div className="dash-page settings-page min-w-0">
                <div className="dash-page__header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2>{title}</h2>
                        {description ? <p>{description}</p> : null}
                    </div>
                    {formId ? (
                        <button type="submit" form={formId} disabled={processing} className="btn btn-primary w-full sm:w-auto justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">save</span>
                            {processing ? 'Saving…' : saveLabel || 'Save changes'}
                        </button>
                    ) : null}
                </div>

                <nav className="settings-link-grid" aria-label="Settings sections">
                    {links.map((item) => (
                        <Link key={item.href} href={item.href} className={`settings-link-card${item.active ? ' is-active' : ''}`}>
                            <span className="settings-link-card__icon material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                            <span className="min-w-0">
                                <span className="settings-link-card__label">{item.label}</span>
                                {item.hint ? <span className="settings-link-card__hint">{item.hint}</span> : null}
                            </span>
                            <span className="material-symbols-outlined settings-link-card__chevron" aria-hidden="true">chevron_right</span>
                        </Link>
                    ))}
                </nav>

                {tabs.length > 0 && (
                    <div className="settings-tabs" role="tablist">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={`settings-tabs__btn${activeTab === tab.id ? ' is-active' : ''}`}
                                onClick={() => onTabChange?.(tab.id)}
                            >
                                {tab.icon ? <span className="material-symbols-outlined text-lg">{tab.icon}</span> : null}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {!settingsReady && (
                    <Alert type="error" message="Settings storage is not set up on this server. Run the portal_settings migration, then refresh this page." />
                )}
                {error ? <Alert type="error" message={error} /> : null}

                {children}

                {formId ? <SaveBar formId={formId} processing={processing} label={saveLabel} /> : null}
            </div>
        </Layout>
    );
}
