import { Link, usePage } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import LoginAsButton from '../../../Components/LoginAsButton';
import { useCan } from '../../../lib/can';

export default function SdmsShow({ sdm }) {
    const { auth, authRole, menu, appName } = usePage().props;
    const { can } = useCan();
    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={sdm?.name ?? 'SDM'}>
            <div className="max-w-xl mx-auto space-y-6">
                <Link href="/administrator/sdms" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to SDMs
                </Link>
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{sdm?.name ?? '—'}</h2>
                    <dl className="space-y-2 text-sm">
                        <div><dt className="text-slate-500 dark:text-text-muted">Username</dt><dd className="text-slate-900 dark:text-white font-medium">{sdm?.username ?? '—'}</dd></div>
                        <div><dt className="text-slate-500 dark:text-text-muted">Department</dt><dd className="text-slate-900 dark:text-white font-medium">{sdm?.department?.name ?? '—'}</dd></div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {can(['sdms.impersonate', 'sdms.view']) && sdm?.id && (
                            <LoginAsButton href={`/administrator/sdms/${sdm.id}/login-as`} label={`Log in as ${sdm.name || 'SDM'}`} />
                        )}
                        <Link href={`/administrator/sdms/${sdm?.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit SDM
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
