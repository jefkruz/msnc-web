import { Link, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { formatDisplayDate, monthName } from '../../lib/formatDate';

function hasValue(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string' && v.trim() === '') return false;
    return true;
}

function formatGender(g) {
    if (!g) return null;
    const s = String(g).toLowerCase();
    if (s === 'm' || s === 'male') return 'Male';
    if (s === 'f' || s === 'female') return 'Female';
    return g;
}

function formatDob(user) {
    if (user?.dob_day && user?.dob_month && user?.dob_year) {
        return `${Number(user.dob_day)} ${monthName(user.dob_month)} ${user.dob_year}`;
    }
    if (user?.dob_day && user?.dob_month) {
        return `${Number(user.dob_day)} ${monthName(user.dob_month)}`;
    }
    return formatDisplayDate(user?.dob, null) || user?.dob || null;
}

function initials(user) {
    const a = (user?.firstName || '').trim().charAt(0);
    const b = (user?.lastName || '').trim().charAt(0);
    return ((a + b) || '?').toUpperCase();
}

function Field({ label, value, href }) {
    if (!hasValue(value)) return null;
    return (
        <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-text-muted mb-1">{label}</dt>
            <dd className="text-sm font-medium text-slate-900 dark:text-white break-words">
                {href ? (
                    <a href={href} className="text-primary hover:underline">{value}</a>
                ) : (
                    value
                )}
            </dd>
        </div>
    );
}

function Section({ icon, title, children, empty }) {
    if (empty) return null;
    return (
        <section className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-border-dark flex items-center gap-2 bg-slate-50/80 dark:bg-white/5">
                <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
            </div>
        </section>
    );
}

function sectionHasContent(fields) {
    return fields.some((f) => hasValue(f));
}

export default function TblUsersShow({ user }) {
    const { auth, authRole, menu, appName } = usePage().props;
    if (!user) return null;

    const enabled = user.enabled === '1' || user.enabled === 1;
    const gender = formatGender(user.gender);
    const dob = formatDob(user);
    const portalId = user.portalID || user.portal_id;
    const yearHref = user.year ? `/administrator/tbl-users/year/${user.year}` : '/administrator/tbl-users';

    const personalFields = [user.firstName, user.otherName, user.lastName, gender, user.marital, dob, user.title_former];
    const contactFields = [user.phoneNum, user.emailAddress, user.altEmail, user.postalAddress];
    const workFields = [
        user.userID, portalId, user.deptID, user.rolecode, user.rank_old, user.nomenclature_rank,
        user.specificJobTitleofPos, user.supervisor, user.acct, user.app_status, user.dateCreated, user.applicationPurpose,
    ];
    const ministryFields = [
        user.church, user.zone, user.region, user.min_curr_ass, user.min_curr_ass_addy,
        user.min_ldr_pos, user.min_office, user.min_office_yr, user.min_mem_yr,
        user.foundation_year, user.datebornagain, user.datebaptized, user.partnershipArms,
    ];
    const locationFields = [user.country, user.nationality, user.state_origin];

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle={user.full_name || 'User'}>
            <div className="space-y-6 max-w-6xl">
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-text-muted">
                        <Link href="/administrator/tbl-users" className="hover:text-primary font-medium">Users</Link>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                        {user.year ? (
                            <>
                                <Link href={yearHref} className="hover:text-primary font-medium">{user.year}</Link>
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </>
                        ) : null}
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">
                            {user.full_name || `User #${user.id}`}
                        </span>
                    </nav>
                    <Link
                        href={yearHref}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Profile card */}
                    <aside className="lg:col-span-4">
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm lg:sticky lg:top-6">
                            <div className="h-20 bg-gradient-to-br from-primary/80 to-indigo-600" />
                            <div className="px-6 pb-6 -mt-10">
                                <div className="flex justify-center mb-4">
                                    {user.picturePath ? (
                                        <img
                                            src={user.picturePath.startsWith('http') || user.picturePath.startsWith('/') ? user.picturePath : `/${user.picturePath}`}
                                            alt={user.full_name}
                                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-surface-dark shadow-md bg-slate-100"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`w-24 h-24 rounded-2xl border-4 border-white dark:border-surface-dark shadow-md bg-primary/15 text-primary flex items-center justify-center text-2xl font-bold ${user.picturePath ? 'hidden' : ''}`}
                                    >
                                        {initials(user)}
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                                        {user.full_name || '—'}
                                    </h1>
                                    {hasValue(user.specificJobTitleofPos) && (
                                        <p className="text-sm text-slate-500 dark:text-text-muted mt-1">{user.specificJobTitleofPos}</p>
                                    )}
                                    {hasValue(user.nomenclature_rank || user.rank_old) && (
                                        <p className="text-xs text-slate-400 dark:text-text-muted mt-0.5">
                                            {user.nomenclature_rank || user.rank_old}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mb-5">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        enabled
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                        {enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                    {gender && (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                                            {gender}
                                        </span>
                                    )}
                                    {user.year && (
                                        <Link
                                            href={yearHref}
                                            className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                                        >
                                            {user.year}
                                        </Link>
                                    )}
                                </div>

                                <div className="space-y-3 text-sm border-t border-slate-200 dark:border-border-dark pt-4">
                                    {hasValue(user.userID) && (
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">badge</span>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-text-muted">User ID</p>
                                                <p className="font-medium text-slate-900 dark:text-white break-all">{user.userID}</p>
                                            </div>
                                        </div>
                                    )}
                                    {hasValue(user.emailAddress) && (
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">mail</span>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-text-muted">Email</p>
                                                <a href={`mailto:${user.emailAddress}`} className="font-medium text-primary hover:underline break-all">
                                                    {user.emailAddress}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {hasValue(user.phoneNum) && (
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">call</span>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-text-muted">Phone</p>
                                                <a href={`tel:${user.phoneNum}`} className="font-medium text-primary hover:underline">
                                                    {user.phoneNum}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {hasValue(user.church) && (
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">church</span>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-text-muted">Church</p>
                                                <p className="font-medium text-slate-900 dark:text-white">{user.church}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Detail sections */}
                    <div className="lg:col-span-8 space-y-5">
                        <Section icon="person" title="Personal" empty={!sectionHasContent(personalFields)}>
                            <Field label="Title" value={user.title} />
                            <Field label="Former title" value={user.title_former} />
                            <Field label="First name" value={user.firstName} />
                            <Field label="Other name" value={user.otherName} />
                            <Field label="Last name" value={user.lastName} />
                            <Field label="Gender" value={gender} />
                            <Field label="Marital status" value={user.marital} />
                            <Field label="Date of birth" value={dob} />
                        </Section>

                        <Section icon="contact_mail" title="Contact" empty={!sectionHasContent(contactFields)}>
                            <Field label="Phone" value={user.phoneNum} href={user.phoneNum ? `tel:${user.phoneNum}` : undefined} />
                            <Field label="Email" value={user.emailAddress} href={user.emailAddress ? `mailto:${user.emailAddress}` : undefined} />
                            <Field label="Alt email" value={user.altEmail} href={user.altEmail ? `mailto:${user.altEmail}` : undefined} />
                            <div className="sm:col-span-2">
                                <Field label="Postal address" value={user.postalAddress} />
                            </div>
                        </Section>

                        <Section icon="work" title="Work & account" empty={!sectionHasContent(workFields)}>
                            <Field label="User ID" value={user.userID} />
                            <Field label="Portal ID" value={portalId} />
                            <Field label="Department ID" value={user.deptID} />
                            <Field label="Role code" value={user.rolecode} />
                            <Field label="Rank" value={user.nomenclature_rank || user.rank_old} />
                            <Field label="Job title" value={user.specificJobTitleofPos} />
                            <Field label="Supervisor" value={user.supervisor} />
                            <Field label="Account" value={user.acct} />
                            <Field label="App status" value={user.app_status} />
                            <Field label="Date created" value={formatDisplayDate(user.dateCreated, user.dateCreated || null)} />
                            <div className="sm:col-span-2">
                                <Field label="Application purpose" value={user.applicationPurpose} />
                            </div>
                        </Section>

                        <Section icon="diversity_3" title="Ministry & church" empty={!sectionHasContent(ministryFields)}>
                            <Field label="Church" value={user.church} />
                            <Field label="Zone" value={user.zone} />
                            <Field label="Region" value={user.region} />
                            <Field label="Current assembly" value={user.min_curr_ass} />
                            <div className="sm:col-span-2">
                                <Field label="Assembly address" value={user.min_curr_ass_addy} />
                            </div>
                            <Field label="Leadership position" value={user.min_ldr_pos} />
                            <Field label="Office" value={user.min_office} />
                            <Field label="Office year" value={user.min_office_yr} />
                            <Field label="Membership year" value={user.min_mem_yr} />
                            <Field label="Foundation year" value={user.foundation_year} />
                            <Field label="Born again" value={formatDisplayDate(user.datebornagain, user.datebornagain || null)} />
                            <Field label="Baptized" value={formatDisplayDate(user.datebaptized, user.datebaptized || null)} />
                            <div className="sm:col-span-2">
                                <Field label="Partnership arms" value={user.partnershipArms} />
                            </div>
                        </Section>

                        <Section icon="location_on" title="Location" empty={!sectionHasContent(locationFields)}>
                            <Field label="Country" value={user.country} />
                            <Field label="Nationality" value={user.nationality} />
                            <Field label="State of origin" value={user.state_origin} />
                        </Section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
