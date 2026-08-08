const STORAGE_KEY = 'mca_theme';

export function getTheme() {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(theme) {
    if (typeof document === 'undefined') return theme === 'dark';
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
    return isDark;
}

export function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next === 'dark';
}
