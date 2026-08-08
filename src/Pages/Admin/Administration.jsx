import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const cards = [
    { label: 'HQ Departments', valueKey: 'hqDept', href: '/administrator/departments/1', icon: 'apartment', color: 'bg-emerald-500' },
    { label: 'Lagos Zones', valueKey: 'lagosDept', href: '/administrator/departments/56', icon: 'location_city', color: 'bg-red-500' },
    { label: 'Outstations', valueKey: 'outstations', href: '/administrator/departments/outstations', icon: 'business', color: 'bg-slate-500' },
    { label: 'Job Families', valueKey: 'nomenclature', href: '/administrator/job-families', icon: 'work', color: 'bg-purple-500' },
    { label: 'Ranks', valueKey: 'ranks', href: '/administrator/ranks', icon: 'list', color: 'bg-blue-500' },
    { label: 'Interview Questions', valueKey: 'questions', href: '/administrator/questions', icon: 'help', color: 'bg-primary' },
    { label: 'Posting Recommendations', valueKey: 'postingRecommendations', href: '/administrator/posting-recommendations', icon: 'recommend', color: 'bg-amber-500' },
    { label: 'Settings', valueKey: 'settings', href: '/administrator/settings', icon: 'settings', color: 'bg-indigo-500', hideCount: true, description: 'Site branding, content & KingsChat notifications' },
    { label: 'Roles & Permissions', valueKey: 'roles', href: '/administrator/roles', icon: 'admin_panel_settings', color: 'bg-rose-500', hideCount: true, description: 'Create roles and assign permissions' },
];

export default function Administration(props) {
    const { auth, authRole, menu, appName } = usePage().props;
    const data = { ...props };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Administration">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.valueKey}
                        href={card.href}
                        className="block bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-text-muted">{card.label}</p>
                            <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white`}>
                                <span className="material-symbols-outlined">{card.icon}</span>
                            </div>
                        </div>
                        {!card.hideCount && (
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {data[card.valueKey] ?? 0}
                            </h3>
                        )}
                        {card.hideCount && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                {card.description}
                            </p>
                        )}
                        <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
                            Click to manage
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </span>
                    </Link>
                ))}
            </div>
        </Layout>
    );
}
