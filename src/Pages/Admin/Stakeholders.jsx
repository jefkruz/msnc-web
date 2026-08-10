import { usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import DashKpiGrid from '../../Components/DashKpiGrid';

export default function Stakeholders({ panelists = 0, sdms = 0, directors = 0, admins = 0 }) {
    const { auth, authRole, menu, appName } = usePage().props;

    const cards = [
        { label: "SDM's", value: sdms, href: '/administrator/sdms', icon: 'group', hint: 'Staff development managers' },
        { label: 'Panelists', value: panelists, href: '/administrator/panelists', icon: 'groups', hint: 'Interview panel members' },
        { label: 'Directors', value: directors, href: '/administrator/directors', icon: 'shield', hint: 'Directorate accounts' },
        { label: 'Administrators', value: admins, href: '/administrator/admins', icon: 'badge', hint: 'System administrators' },
    ];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Stakeholders">
            <div className="dash-page">
                <div className="dash-page__header">
                    <h2>Stakeholders</h2>
                    <p>SDMs, panelists, directors, and administrators.</p>
                </div>
                <DashKpiGrid items={cards} />
            </div>
        </Layout>
    );
}
