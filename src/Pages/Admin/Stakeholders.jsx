import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const cards = [
    { label: 'Panelists', valueKey: 'panelists', href: '/administrator/panelists', icon: 'group' },
    { label: "SDM's", valueKey: 'sdms', href: '/administrator/sdms', icon: 'group' },
    { label: 'Directors', valueKey: 'directors', href: '/administrator/directors', icon: 'shield' },
    { label: 'Administrators', valueKey: 'admins', href: '/administrator/admins', icon: 'badge' },
];

export default function Stakeholders(props) {
    const { auth, authRole, menu, appName } = usePage().props;
    const data = { ...props };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Stakeholders">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.valueKey}
                        href={card.href}
                        className="block bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-text-muted">{card.label}</p>
                            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">{card.icon}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            {data[card.valueKey] ?? 0}
                        </h3>
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
