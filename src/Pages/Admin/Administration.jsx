import { usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import DashKpiGrid from '../../Components/DashKpiGrid';

export default function Administration({
    hqDept = 0,
    lagosDept = 0,
    outstations = 0,
    nomenclature = 0,
    ranks = 0,
}) {
    const { auth, authRole, menu, appName } = usePage().props;

    const cards = [
        { label: 'HQ Departments', value: hqDept, href: '/administrator/departments/1', icon: 'apartment', hint: 'Headquarters departments' },
        { label: 'Lagos Zones', value: lagosDept, href: '/administrator/departments/56', icon: 'location_city', hint: 'Lagos zone departments' },
        { label: 'Outstations', value: outstations, href: '/administrator/departments/outstations', icon: 'business', hint: 'Outstation departments' },
        { label: 'Job Families', value: nomenclature, href: '/administrator/job-families', icon: 'work', hint: 'Nomenclature families' },
        { label: 'Ranks', value: ranks, href: '/administrator/ranks', icon: 'list', hint: 'Rank catalogue' },
    ];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Administration">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Administration</h2>
                    <p>Configure departments, job families, and ranks.</p>
                </div>
                <DashKpiGrid items={cards} />
            </div>
        </Layout>
    );
}
