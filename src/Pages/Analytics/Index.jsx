import { router, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import SearchableSelect from '../../Components/SearchableSelect';
import DashKpiGrid from '../../Components/DashKpiGrid';
import { useEffect, useMemo, useState } from 'react';

const MONTHS = [
    { value: '', label: 'Full year' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

export default function AnalyticsIndex({
    analyticsUrl = '/administrator/analytics',
    year,
    month,
    periodLabel,
    totalApplicants,
    totalPersonnel,
    totalInterviewed,
    monthsWithData = [],
}) {
    const { auth, authRole, menu, appName } = usePage().props;
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectedMonth, setSelectedMonth] = useState(month ?? '');

    useEffect(() => {
        setSelectedYear(year);
        setSelectedMonth(month ?? '');
    }, [year, month]);

    const years = useMemo(() => {
        const current = new Date().getFullYear();
        const list = [];
        for (let y = current; y >= current - 5; y--) list.push(y);
        return list;
    }, []);

    const applyFilters = () => {
        const params = { year: selectedYear };
        if (selectedMonth !== '') params.month = selectedMonth;
        router.get(analyticsUrl || '/administrator/analytics', params, { preserveState: true });
    };

    const scopeLabel = 'All departments';

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Analytics">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analytics</h2>
                    <span className="text-sm text-slate-500 dark:text-text-muted">{scopeLabel}</span>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Filter by period</p>
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-text-muted mb-1">Year</label>
                            <div className="min-w-[120px]">
                                <SearchableSelect
                                    value={selectedYear}
                                    onChange={(val) => setSelectedYear(Number(val))}
                                    options={years.map((y) => ({ value: y, label: String(y) }))}
                                    placeholder="Year"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-text-muted mb-1">Month</label>
                            <div className="min-w-[140px]">
                                <SearchableSelect
                                    value={selectedMonth}
                                    onChange={(val) => setSelectedMonth(val === '' ? '' : Number(val))}
                                    options={MONTHS}
                                    placeholder="Full year"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">{periodLabel}</p>
                    <DashKpiGrid
                        items={[
                            { label: 'Applicants', value: totalApplicants, icon: 'group', hint: 'Registered in this period' },
                            { label: 'Personnel in waiting', value: totalPersonnel, icon: 'hourglass_top', hint: 'Added in this period' },
                            { label: 'Interviewed', value: totalInterviewed, icon: 'event_available', hint: 'In this period' },
                        ]}
                    />
                </div>

                {monthsWithData.length > 0 && (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Summary by month ({year})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-text-muted text-xs font-bold uppercase tracking-wider border-b border-border-dark bg-slate-50 dark:bg-white/5">
                                        <th className="px-6 py-3">Month</th>
                                        <th className="px-6 py-3">Applicants</th>
                                        <th className="px-6 py-3">Personnel in waiting</th>
                                        <th className="px-6 py-3">Interviewed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {monthsWithData.map((row) => (
                                        <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-3 text-slate-900 dark:text-white font-medium">{row.label}</td>
                                            <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{row.applicants}</td>
                                            <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{row.personnel}</td>
                                            <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{row.interviews}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
