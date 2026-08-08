import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { prefetchGet, toSpaHref } from '../lib/api';
import { toggleTheme, getTheme } from '../theme';

const iconMap = {
    'solar:home-smile-angle-outline': 'dashboard',
    dashboard: 'dashboard',
    'fa fa-users': 'group',
    group: 'group',
    'fa fa-rocket': 'rocket_launch',
    'fa fa-users-gear': 'manage_accounts',
    'fa fa-briefcase': 'work',
    'fa fa-list': 'list',
    'fa fa-question-circle': 'help',
    'fa fa-th-large': 'grid_view',
    'fa fa-calendar-plus': 'event_available',
    'fa fa-users-rectangle': 'group',
    'fa fa-clock': 'schedule',
    'fa fa-file-lines': 'recommend',
    'fa fa-plus': 'add',
    'fa fa-history': 'history',
    'fa fa-power-off': 'logout',
    'solar:case-outline': 'work',
    'solar:users-group-rounded-outline': 'group',
    'solar:user-shield-outline': 'shield',
    'solar:user-id-outline': 'badge',
    'solar:star-outline': 'star',
    'fa fa-user-lock': 'admin_panel_settings',
    'fa fa-cog': 'settings',
    'fa fa-globe': 'language',
};

function getMaterialIcon(icon) {
    if (!icon) return 'circle';
    return iconMap[icon] || iconMap[icon?.replace?.('fa ', 'fa ')] || 'circle';
}

const routeToPath = {
    'sdms.index': '/administrator/sdms',
    'panelists.index': '/administrator/panelists',
    'directors.index': '/administrator/directors',
    'admins.index': '/administrator/admins',
    stakeholders: '/administrator/stakeholders',
    'families.index': '/administrator/job-families',
    'ranks.index': '/administrator/ranks',
    'questions.index': '/administrator/questions',
    'roles.index': '/administrator/roles',
    administration: '/administrator/menu',
    admin: '/administrator',
    'admin.activity-log': '/administrator/activity-log',
    'applicants.index': '/administrator/applicants',
    'interviews.index': '/administrator/interviews',
    'interviews.create': '/administrator/interviews/create',
    'personnel-in-waiting.index': '/authorised/personnel-in-waiting',
    'admin.analytics': '/administrator/analytics',
    'tbl-users.index': '/administrator/tbl-users',
    'settings.edit': '/administrator/settings',
    'settings.website': '/administrator/settings/website',
    'settings.kc': '/administrator/settings?tab=kc',
    'posting-recommendations.index': '/administrator/posting-recommendations',
    'posting-recommendations.create': '/administrator/posting-recommendations/create',
    sdmHome: '/sdm',
    'sdm.applicants': '/sdm/applicants',
    'sdm.applicants.create': '/sdm/applicants/create',
    'sdm.interviews': '/sdm/interviews',
    adminpanelistuser: '/panelist',
    'panelist.interviews.index': '/panelist/interviews',
    'panelist.recommendations.index': '/panelist/recommendations',
    'director.index': '/director',
};

function getHref(item) {
    const href = item?.href;
    if (href && href !== '#') return toSpaHref(href);
    return routeToPath[item?.route] || '#';
}

function initials(name = '') {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return parts
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('');
}

export default function Sidebar({ menu = [], appName, auth, authRole, onClose }) {
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');
    const hasActiveChild = (item) => item.submenu?.some((s) => s.active === 'active');
    const [openSubmenus, setOpenSubmenus] = useState(() => {
        const initial = {};
        menu.forEach((item) => {
            if (item.submenu?.length && hasActiveChild(item)) {
                initial[item.route] = true;
            }
        });
        return initial;
    });

    const closeOnNavigate = () => {
        if (typeof onClose === 'function' && window.innerWidth < 992) onClose();
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <aside className="app-sidebar" id="app-sidebar">
            <div className="app-sidebar__brand">
                <img src="/logo.png" alt="" />
                <div className="app-sidebar__brand-text">
                    <strong>{appName || 'MSNC Recruitment'}</strong>
                    <span>Admin Console</span>
                </div>
                <button
                    type="button"
                    className="app-sidebar__close lg-hide"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="app-sidebar__user">
                <span className="user-avatar user-avatar--md user-avatar--tone-1">
                    {auth?.image ? <img src={auth.image} alt="" /> : <span className="user-avatar__initials">{initials(auth?.name)}</span>}
                </span>
                <div>
                    <strong>{auth?.name || 'Guest'}</strong>
                    <span>{authRole || 'User'}</span>
                </div>
            </div>

            <nav className="app-sidebar__nav">
                {menu.map((item) => {
                    if (item.route === 'logout') return null;
                    if (item.submenu && item.submenu.length) {
                        const isOpen = openSubmenus[item.route] === true || (openSubmenus[item.route] === undefined && hasActiveChild(item));
                        const groupActive = hasActiveChild(item);
                        return (
                            <div key={item.route} className={`app-nav-group${isOpen ? ' is-open' : ''}`}>
                                <button
                                    type="button"
                                    className={`app-nav-group__btn${groupActive ? ' is-active' : ''}`}
                                    onClick={() =>
                                        setOpenSubmenus((prev) => ({
                                            ...prev,
                                            [item.route]: !(prev[item.route] ?? hasActiveChild(item)),
                                        }))
                                    }
                                >
                                    <span>
                                        <span className="material-symbols-outlined">{getMaterialIcon(item.icon)}</span>
                                        {item.name}
                                    </span>
                                    <span className="material-symbols-outlined app-nav-group__chevron">expand_more</span>
                                </button>
                                <div className="app-nav-group__children">
                                    {item.submenu.map((sub) => {
                                        if (sub.route === 'logout') return null;
                                        return (
                                            <Link
                                                key={sub.route}
                                                href={getHref(sub)}
                                                onClick={closeOnNavigate}
                                                onMouseEnter={() => prefetchGet(getHref(sub))}
                                                onFocus={() => prefetchGet(getHref(sub))}
                                                className={`app-nav-link is-nested${sub.active === 'active' ? ' is-active' : ''}`}
                                            >
                                                {sub.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.route}
                            href={getHref(item)}
                            onClick={closeOnNavigate}
                            onMouseEnter={() => prefetchGet(getHref(item))}
                            onFocus={() => prefetchGet(getHref(item))}
                            className={`app-nav-link${item.active === 'active' ? ' is-active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{getMaterialIcon(item.icon)}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="app-sidebar__footer">
                <button
                    type="button"
                    className="app-sidebar__theme"
                    onClick={() => setIsDark(toggleTheme())}
                >
                    <span className="material-symbols-outlined" aria-hidden="true">
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>Toggle theme</span>
                </button>
                <a href="/logout" className="app-nav-link" onClick={handleLogout}>
                    <span className="material-symbols-outlined">power_settings_new</span>
                    <span>Log out</span>
                </a>
            </div>
        </aside>
    );
}
