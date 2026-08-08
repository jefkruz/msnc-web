import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { downloadApiFile } from '../lib/api';

export default function SearchExportBar({
    search = '',
    indexPath,
    exportPath,
    exportFilename = 'export.csv',
    canExport = false,
    placeholder = 'Search by name, username, department…',
    children,
}) {
    const [query, setQuery] = useState(search);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        setQuery(search);
    }, [search]);

    const submit = (e) => {
        e.preventDefault();
        const next = query.trim();
        router.get(indexPath, next ? { search: next } : {}, { preserveState: false });
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            await downloadApiFile(exportPath, exportFilename, search ? { search } : {});
        } catch (err) {
            let message = err?.message || 'Export failed.';
            const blob = err?.response?.data;
            if (blob instanceof Blob) {
                try {
                    const parsed = JSON.parse(await blob.text());
                    message = parsed.message || parsed.error || message;
                } catch {
                    // keep fallback
                }
            } else if (err?.response?.data?.message) {
                message = err.response.data.message;
            }
            window.__inertiaApplyFlash?.({ error: message });
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <form onSubmit={submit} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative min-w-48 sm:min-w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted text-xl pointer-events-none">search</span>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted"
                    />
                </div>
                <button type="submit" className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-border-dark flex-shrink-0">
                    Search
                </button>
            </form>
            {canExport && (
                <button
                    type="button"
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-border-dark disabled:opacity-60 flex-shrink-0"
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    {exporting ? 'Exporting…' : 'Export'}
                </button>
            )}
            {children}
        </div>
    );
}
