import { Link } from '@inertiajs/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTheme, toggleTheme } from '../theme';
import { useEffect, useState } from 'react';

const HOME_BY_ROLE = {
    SDM: '/sdm',
    Panelist: '/panelist',
    Director: '/director',
    Administrator: '/administrator',
};

function normalizePath(pathname) {
    const path = String(pathname || '/').replace(/\/+$/, '');
    return path || '/';
}

function isHomePath(pathname) {
    const path = normalizePath(pathname);
    return path === '/administrator' || path === '/sdm' || path === '/panelist' || path === '/director';
}

function fallbackPath(pathname, authRole) {
    const path = normalizePath(pathname);
    const home = HOME_BY_ROLE[authRole] || '/administrator';

    if (path.startsWith('/administrator/roles')) {
        return '/administrator/settings';
    }

    if (path.startsWith('/administrator/questions')
        || path.startsWith('/administrator/interviews/create')
        || path.startsWith('/administrator/interviews/edit')) {
        return '/administrator/interviews';
    }

    if (path.startsWith('/administrator/posting-recommendations/')) {
        return '/administrator/posting-recommendations';
    }

    if (path.startsWith('/administrator/job-families')
        || path.startsWith('/administrator/ranks')
        || path.startsWith('/administrator/departments')) {
        return path === '/administrator/menu' ? home : '/administrator/menu';
    }

    if (path === '/administrator/menu' || path === '/administrator/stakeholders') {
        return home;
    }

    if (path.startsWith('/administrator/sdms')
        || path.startsWith('/administrator/panelists')
        || path.startsWith('/administrator/directors')
        || path.startsWith('/administrator/admins')) {
        const parts = path.split('/');
        if (parts.length > 3) {
            return `/${parts.slice(1, 3).join('/')}`;
        }
        return '/administrator/stakeholders';
    }

    if (path.startsWith('/authorised/manage')) {
        return authRole === 'SDM' ? '/sdm/interviews' : '/administrator/interviews';
    }

    if (path.startsWith('/authorised/view')) {
        return authRole === 'SDM' ? '/sdm/applicants' : '/administrator/applicants/staff';
    }

    if (path.startsWith('/authorised/personnel-in-waiting/')) {
        return '/authorised/personnel-in-waiting';
    }

    const parts = path.split('/').filter(Boolean);
    if (parts.length > 1) {
        parts.pop();
        const parent = `/${parts.join('/')}`;
        if (parent === '/authorised') return home;
        return parent || home;
    }

    return home;
}

export default function Header({ pageTitle, onOpenSidebar, authRole }) {
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');
    const location = useLocation();
    const navigate = useNavigate();
    const showBack = !isHomePath(location.pathname);

    useEffect(() => {
        setIsDark(getTheme() === 'dark');
    }, []);

    const handleThemeToggle = () => {
        setIsDark(toggleTheme());
    };

    const goBack = () => {
        const idx = window.history.state?.idx;
        if (typeof idx === 'number' && idx > 0) {
            navigate(-1);
            return;
        }
        navigate(fallbackPath(location.pathname, authRole));
    };

    return (
        <header className="app-topbar">
            <div className="app-topbar__left">
                <button
                    type="button"
                    className="app-icon-btn lg-hide"
                    onClick={onOpenSidebar}
                    aria-label="Open menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                {showBack ? (
                    <button
                        type="button"
                        className="app-icon-btn app-topbar__back"
                        onClick={goBack}
                        aria-label="Go back"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="app-topbar__back-label">Back</span>
                    </button>
                ) : null}
                <div>
                    <h1 className="app-topbar__title">{pageTitle || 'Portal'}</h1>
                </div>
            </div>
            <div className="app-topbar__right">
                <button
                    type="button"
                    className="app-icon-btn"
                    onClick={handleThemeToggle}
                    aria-label="Toggle theme"
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    <span className="material-symbols-outlined">
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
                <Link href="/" className="btn-mca btn-mca-secondary btn-mca-sm">
                    <span className="material-symbols-outlined" aria-hidden="true">
                        public
                    </span>
                    Website
                </Link>
            </div>
        </header>
    );
}
