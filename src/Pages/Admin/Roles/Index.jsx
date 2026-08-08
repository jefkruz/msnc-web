import { useEffect, useMemo, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';
import Modal from '../../../Components/Modal';
import ConfirmModal from '../../../Components/ConfirmModal';
import Alert from '../../../Components/Alert';
import { useCan } from '../../../lib/can';

const BASE = '/administrator/roles';

export default function RolesIndex() {
    const {
        auth,
        authRole,
        menu,
        appName,
        roles = [],
        permissions = [],
        permissionGroups = [],
        flash,
        errors: pageErrors = {},
    } = usePage().props;
    const { can } = useCan();
    const rolesList = Array.isArray(roles) ? roles : [];
    const [selectedId, setSelectedId] = useState(rolesList[0]?.id ?? null);
    const [checked, setChecked] = useState([]);
    const [query, setQuery] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [deleteRoleId, setDeleteRoleId] = useState(null);
    const [deletePermissionId, setDeletePermissionId] = useState(null);
    const [showFlash, setShowFlash] = useState(false);

    const selected = rolesList.find((r) => r.id === selectedId) || rolesList[0] || null;

    useEffect(() => {
        if (flash?.message) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.message]);

    useEffect(() => {
        if (selected) {
            setChecked(selected.permissions || []);
            setSelectedId(selected.id);
        }
    }, [selected?.id, JSON.stringify(selected?.permissions || [])]);

    const roleForm = useForm({ name: '', permissions: [] });
    const permissionForm = useForm({ name: '' });

    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (permissionGroups || [])
            .map((group) => ({
                ...group,
                permissions: (group.permissions || []).filter((name) => !q || name.toLowerCase().includes(q)),
            }))
            .filter((group) => group.permissions.length > 0);
    }, [permissionGroups, query]);

    const togglePermission = (name) => {
        setChecked((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]));
    };

    const toggleGroup = (names) => {
        const allOn = names.every((name) => checked.includes(name));
        setChecked((prev) => {
            if (allOn) return prev.filter((p) => !names.includes(p));
            return Array.from(new Set([...prev, ...names]));
        });
    };

    const saveRole = (e) => {
        e.preventDefault();
        if (!selected) return;
        router.put(
            `${BASE}/${selected.id}`,
            { name: selected.name, permissions: checked },
            { preserveScroll: true }
        );
    };

    const createRole = (e) => {
        e.preventDefault();
        roleForm.post(BASE, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRoleModal(false);
                roleForm.reset();
            },
        });
    };

    const createPermission = (e) => {
        e.preventDefault();
        permissionForm.post('/administrator/permissions', {
            preserveScroll: true,
            onSuccess: () => {
                setShowPermissionModal(false);
                permissionForm.reset();
            },
        });
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Roles & Permissions">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        href="/administrator/menu"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Administration
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        {can('permissions.create') && (
                            <button type="button" onClick={() => setShowPermissionModal(true)} className="btn btn-secondary btn-sm">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New permission
                            </button>
                        )}
                        {can('roles.create') && (
                            <button type="button" onClick={() => setShowRoleModal(true)} className="btn btn-primary btn-sm">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New role
                            </button>
                        )}
                    </div>
                </div>

                {showFlash && flash?.message && <Alert type="success" message={flash.message} onDismiss={() => setShowFlash(false)} />}
                {(pageErrors.role || pageErrors.permission || pageErrors.name) && (
                    <Alert
                        type="error"
                        message={
                            [].concat(pageErrors.role || pageErrors.permission || pageErrors.name)[0]
                        }
                    />
                )}

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-border-dark">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Roles</h2>
                            <p className="text-sm text-text-muted mt-0.5">Select a role to manage its permissions.</p>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-border-dark">
                            {rolesList.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedId(role.id)}
                                    className={`w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 ${
                                        selected?.id === role.id ? 'bg-primary/5' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <strong className="text-slate-900 dark:text-white capitalize">{role.name}</strong>
                                        {role.is_protected && (
                                            <span className="badge badge-info text-xs">System</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">
                                        {role.permissions?.length || 0} permissions · {role.users_count || 0} users
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        {selected ? (
                            <form onSubmit={saveRole}>
                                <div className="px-5 py-4 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{selected.name}</h2>
                                        <p className="text-sm text-text-muted mt-0.5">
                                            {selected.is_protected
                                                ? 'System role — name is locked, permissions can still be changed.'
                                                : 'Custom role — rename, update permissions, or delete.'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {can('roles.delete') && !selected.is_protected && (
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setDeleteRoleId(selected.id)}>
                                                Delete
                                            </button>
                                        )}
                                        {can('roles.update') && (
                                            <button type="submit" className="btn btn-primary btn-sm">
                                                Save permissions
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Filter permissions…"
                                        className="form-control"
                                    />
                                    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                                        {filteredGroups.map((group) => (
                                            <div key={group.name}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{group.name}</h3>
                                                    {can('roles.update') && (
                                                        <button
                                                            type="button"
                                                            className="text-xs font-medium text-primary"
                                                            onClick={() => toggleGroup(group.permissions)}
                                                        >
                                                            Toggle group
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {group.permissions.map((name) => (
                                                        <label key={name} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-border-dark px-3 py-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked.includes(name)}
                                                                disabled={!can('roles.update')}
                                                                onChange={() => togglePermission(name)}
                                                            />
                                                            <span className="text-slate-800 dark:text-slate-200">{name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="p-8 text-text-muted">No roles found.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">All permissions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-wider text-text-muted border-b border-slate-200 dark:border-border-dark">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {permissions.map((permission) => (
                                    <tr key={permission.id}>
                                        <td className="px-5 py-3 text-slate-800 dark:text-slate-200">{permission.name}</td>
                                        <td className="px-5 py-3 text-right">
                                            {can('permissions.delete') && (
                                                <button
                                                    type="button"
                                                    className="text-red-500 text-sm font-medium"
                                                    onClick={() => setDeletePermissionId(permission.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} title="Create role">
                <form onSubmit={createRole} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Role name</label>
                        <input
                            className="form-control"
                            value={roleForm.data.name}
                            onChange={(e) => roleForm.setData('name', e.target.value.toLowerCase())}
                            placeholder="e.g. hr_officer"
                            required
                        />
                        {roleForm.errors.name && <p className="text-red-500 text-xs mt-1">{roleForm.errors.name}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowRoleModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={roleForm.processing}>Create role</button>
                    </div>
                </form>
            </Modal>

            <Modal show={showPermissionModal} onClose={() => setShowPermissionModal(false)} title="Create permission">
                <form onSubmit={createPermission} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Permission name</label>
                        <input
                            className="form-control"
                            value={permissionForm.data.name}
                            onChange={(e) => permissionForm.setData('name', e.target.value.toLowerCase())}
                            placeholder="e.g. reports.export"
                            required
                        />
                        <p className="text-xs text-text-muted mt-1">Use dotted names: resource.action</p>
                        {permissionForm.errors.name && <p className="text-red-500 text-xs mt-1">{permissionForm.errors.name}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPermissionModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={permissionForm.processing}>Create permission</button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={!!deleteRoleId}
                onClose={() => setDeleteRoleId(null)}
                onConfirm={() => {
                    if (deleteRoleId) router.delete(`${BASE}/${deleteRoleId}`, { preserveScroll: true });
                    setDeleteRoleId(null);
                }}
                title="Delete role"
                message="Delete this custom role? Users must be unassigned first."
                confirmLabel="Delete"
                variant="danger"
            />
            <ConfirmModal
                show={!!deletePermissionId}
                onClose={() => setDeletePermissionId(null)}
                onConfirm={() => {
                    if (deletePermissionId) router.delete(`/administrator/permissions/${deletePermissionId}`, { preserveScroll: true });
                    setDeletePermissionId(null);
                }}
                title="Delete permission"
                message="This permission will be removed from all roles."
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
