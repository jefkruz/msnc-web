import { Link, usePage } from '@inertiajs/react';
import { toSpaHref } from '../lib/api';

const iconMap = {
    'solar:home-smile-angle-outline': 'dashboard',
    'dashboard': 'dashboard',
    'fa fa-users': 'group',
    'group': 'group',
    'fa fa-rocket': 'rocket_launch',
    'fa fa-users-gear': 'account_balance_wallet',
    'fa fa-briefcase': 'work',
    'fa fa-list': 'list',
    'fa fa-question-circle': 'help',
    'fa fa-users-rectangle': 'group',
    'solar:user-shield-outline': 'shield',
    'solar:user-id-outline': 'badge',
};

function getMaterialIcon(icon) {
    if (!icon) return 'circle';
    return iconMap[icon] || 'circle';
}

const routeToPath = {
    admin: '/administrator',
    'admin.activity-log': '/administrator/activity-log',
    'applicants.index': '/administrator/applicants',
    'interviews.index': '/administrator/interviews',
    'administration': '/administrator/menu',
    stakeholders: '/administrator/stakeholders',
    'families.index': '/administrator/job-families',
    'ranks.index': '/administrator/ranks',
    'questions.index': '/administrator/questions',
    'roles.index': '/administrator/roles',
    'sdms.index': '/administrator/sdms',
    'panelists.index': '/administrator/panelists',
    'directors.index': '/administrator/directors',
    'admins.index': '/administrator/admins',
};

function getHref(item) {
    const href = item?.href;
    if (href && href !== '#') return toSpaHref(href);
    return routeToPath[item?.route] || '#';
}

// First 4 items only; 5th slot is "Menu" (opens side menu) for admin
function getNavItems(menu) {
    if (!Array.isArray(menu)) return [];
    const items = [];
    for (const item of menu) {
        if (item.route === 'logout') continue;
        const href = getHref(item) || (item.submenu?.[0] && getHref(item.submenu[0]));
        if (href && href !== '#') {
            items.push({
                name: item.name,
                href,
                icon: getMaterialIcon(item.icon),
                active: item.active === 'active' || item.submenu?.some((s) => s.active === 'active'),
            });
        }
        if (items.length >= 4) break; // 4 links + Menu button = 5
    }
    return items;
}

export default function MobileBottomNav({ onToggleMenu }) {
    const { menu } = usePage().props;
    const page = usePage();
    const rawUrl = (page.url && typeof page.url === 'string') ? page.url : (typeof window !== 'undefined' ? window.location.pathname : '');
    const currentPath = rawUrl.split('?')[0].split('#')[0];
    const items = getNavItems(menu || []);

    if (items.length === 0 && !onToggleMenu) return null;

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111822] border-t border-slate-200 dark:border-border-dark"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
        >
            <div className="flex items-center justify-around h-16">
                {items.map((item) => {
                    let hrefPath = item.href;
                    try {
                        if (item.href.startsWith('http')) hrefPath = new URL(item.href).pathname;
                    } catch (_) {}
                    const isActive = item.active || (currentPath && hrefPath && (currentPath === hrefPath || currentPath.startsWith(hrefPath.replace(/\/?$/, '/'))));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 min-w-0 py-2 px-1 transition-colors ${
                                isActive
                                    ? 'text-primary'
                                    : 'text-slate-500 dark:text-text-muted hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium truncate w-full text-center mt-0.5">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                {onToggleMenu && (
                    <button
                        type="button"
                        onClick={onToggleMenu}
                        className="flex flex-col items-center justify-center flex-1 min-w-0 py-2 px-1 transition-colors text-slate-500 dark:text-text-muted hover:text-slate-900 dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined text-[24px]">menu</span>
                        <span className="text-[10px] font-medium truncate w-full text-center mt-0.5">Menu</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
