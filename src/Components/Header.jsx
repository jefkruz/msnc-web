import { Link } from '@inertiajs/react';
import { getTheme, toggleTheme } from '../theme';
import { useEffect, useState } from 'react';

export default function Header({ pageTitle, onOpenSidebar }) {
    const [isDark, setIsDark] = useState(() => getTheme() === 'dark');

    useEffect(() => {
        setIsDark(getTheme() === 'dark');
    }, []);

    const handleThemeToggle = () => {
        setIsDark(toggleTheme());
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
