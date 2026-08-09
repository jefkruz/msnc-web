import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Modal from '../../../Components/Modal';
import ConfirmModal from '../../../Components/ConfirmModal';
import Alert from '../../../Components/Alert';
import ActionButton from '../../../Components/ActionButton';
import { useCan } from '../../../lib/can';
import SettingsShell from '../Settings/SettingsShell';

const BASE = '/administrator/roles';

export default function RolesIndex() {
    const {
        roles = [],
        permissions = [],
        permissionGroups = [],
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

    const selected = rolesList.find((r) => r.id === selectedId) || rolesList[0] || null;

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
        <SettingsShell
            title="Roles & permissions"
            description="Choose a role, then grant or revoke access. System roles cannot be deleted."
            settingsReady
            activeHref="/administrator/roles"
        >
            <div className="roles-page">
                <div className="roles-toolbar">
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

                {(pageErrors.role || pageErrors.permission || pageErrors.name) && (
                    <Alert
                        type="error"
                        message={[].concat(pageErrors.role || pageErrors.permission || pageErrors.name)[0]}
                    />
                )}

                <div className="roles-layout">
                    <section className="roles-panel">
                        <div className="roles-panel__head">
                            <h3>Roles</h3>
                            <p>Select a role to manage its permissions.</p>
                        </div>
                        <div className="roles-list">
                            {rolesList.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedId(role.id)}
                                    className={`roles-list__item${selected?.id === role.id ? ' is-active' : ''}`}
                                >
                                    <span className="roles-list__row">
                                        <strong>{role.name}</strong>
                                        {role.is_protected ? <span className="badge badge-info">System</span> : null}
                                    </span>
                                    <span className="roles-list__meta">
                                        {role.permissions?.length || 0} permissions · {role.users_count || 0} users
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="roles-panel">
                        {selected ? (
                            <form onSubmit={saveRole}>
                                <div className="roles-panel__head roles-panel__head--split">
                                    <div>
                                        <h3>{selected.name}</h3>
                                        <p>
                                            {selected.is_protected
                                                ? 'System role — name is locked, permissions can still be changed.'
                                                : 'Custom role — update permissions or delete.'}
                                        </p>
                                    </div>
                                    <div className="roles-panel__actions">
                                        {can('roles.delete') && !selected.is_protected && (
                                            <ActionButton action="delete" onClick={() => setDeleteRoleId(selected.id)} />
                                        )}
                                        {can('roles.update') && (
                                            <button type="submit" className="btn btn-primary btn-sm">
                                                <span className="material-symbols-outlined text-lg">save</span>
                                                Save permissions
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="roles-panel__body">
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Filter permissions…"
                                        className="form-control"
                                    />
                                    <div className="roles-groups">
                                        {filteredGroups.map((group) => (
                                            <div key={group.name} className="roles-group">
                                                <div className="roles-group__head">
                                                    <h4>{group.name}</h4>
                                                    {can('roles.update') && (
                                                        <button
                                                            type="button"
                                                            className="roles-group__toggle"
                                                            onClick={() => toggleGroup(group.permissions)}
                                                        >
                                                            Toggle group
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="roles-perm-grid">
                                                    {group.permissions.map((name) => {
                                                        const on = checked.includes(name);
                                                        return (
                                                            <label key={name} className={`roles-perm${on ? ' is-checked' : ''}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={on}
                                                                    disabled={!can('roles.update')}
                                                                    onChange={() => togglePermission(name)}
                                                                />
                                                                <span>{name}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="roles-panel__empty">No roles found.</div>
                        )}
                    </section>
                </div>

                <section className="roles-panel">
                    <div className="roles-panel__head">
                        <h3>All permissions</h3>
                        <p>{permissions.length} named abilities available to assign.</p>
                    </div>
                    <div className="roles-all-grid">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="roles-all-card">
                                <span className="roles-all-card__name">{permission.name}</span>
                                {can('permissions.delete') && (
                                    <ActionButton action="delete" onClick={() => setDeletePermissionId(permission.id)} />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Modal
                show={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                title="Create role"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Cancel</button>
                        <button type="submit" form="role-create" className="btn btn-primary" disabled={roleForm.processing}>Create role</button>
                    </>
                )}
            >
                <form id="role-create" onSubmit={createRole} className="space-y-4">
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
                </form>
            </Modal>

            <Modal
                show={showPermissionModal}
                onClose={() => setShowPermissionModal(false)}
                title="Create permission"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowPermissionModal(false)}>Cancel</button>
                        <button type="submit" form="permission-create" className="btn btn-primary" disabled={permissionForm.processing}>Create permission</button>
                    </>
                )}
            >
                <form id="permission-create" onSubmit={createPermission} className="space-y-4">
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
        </SettingsShell>
    );
}
