import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ImpersonationBanner from './ImpersonationBanner';
import { FlashAlerts } from '../lib/flash';

export default function Layout({ auth, authRole, menu, appName, children, pageTitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.body.className = 'app-body';
        return () => {
            document.body.className = '';
        };
    }, []);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 992) setSidebarOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div className={`app-shell${sidebarOpen ? ' sidebar-open' : ''}`} id="app-shell">
            <Sidebar
                menu={menu}
                appName={appName}
                auth={auth}
                authRole={authRole}
                onClose={() => setSidebarOpen(false)}
            />
            <div
                className="app-sidebar-backdrop"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            <div className="app-main">
                <ImpersonationBanner />
                <Header
                    pageTitle={pageTitle}
                    authRole={authRole}
                    onOpenSidebar={() => setSidebarOpen(true)}
                />
                <div className="app-content">
                    <FlashAlerts />
                    {children}
                </div>
                <footer className="app-footer">
                    &copy; {new Date().getFullYear()} {appName || 'MSNC Recruitment'}
                </footer>
            </div>
        </div>
    );
}
