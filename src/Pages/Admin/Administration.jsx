import { usePage, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const cards = [
    { label: 'HQ Departments', valueKey: 'hqDept', href: '/administrator/departments/1', icon: 'apartment', hint: 'Headquarters departments' },
    { label: 'Lagos Zones', valueKey: 'lagosDept', href: '/administrator/departments/56', icon: 'location_city', hint: 'Lagos zone departments' },
    { label: 'Outstations', valueKey: 'outstations', href: '/administrator/departments/outstations', icon: 'business', hint: 'Outstation departments' },
    { label: 'Job Families', valueKey: 'nomenclature', href: '/administrator/job-families', icon: 'work', hint: 'Nomenclature families' },
    { label: 'Ranks', valueKey: 'ranks', href: '/administrator/ranks', icon: 'list', hint: 'Rank catalogue' },
];

export default function Administration(props) {
    const { auth, authRole, menu, appName } = usePage().props;
    const data = { ...props };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Administration">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Administration</h2>
                    <p>Configure departments, job families, and ranks.</p>
                </div>

                <div className="dash-kpi-grid dash-kpi-grid--3">
                    {cards.map((card) => (
                        <Link key={card.valueKey} href={card.href} className="dash-kpi">
                            <span className="dash-kpi__icon" aria-hidden="true">
                                <span className="material-symbols-outlined">{card.icon}</span>
                            </span>
                            <div className="dash-kpi__content">
                                <p className="dash-kpi__label">{card.label}</p>
                                <p className="dash-kpi__value">{card.hideCount ? '—' : (data[card.valueKey] ?? 0)}</p>
                                <p className="dash-kpi__hint">{card.hint}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
