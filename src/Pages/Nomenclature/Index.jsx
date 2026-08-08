import { useState, useEffect } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import Alert from '../../Components/Alert';

const BASE = '/administrator/job-families';

export default function NomenclatureIndex() {
    const { auth, authRole, menu, appName, stats = {}, categories, flash } = usePage().props;
    const safeStats = {
        total_categories: stats?.total_categories ?? 0,
        total_groups: stats?.total_groups ?? 0,
        total_ranks: stats?.total_ranks ?? 0,
    };
    const categoriesList = Array.isArray(categories) ? categories : [];
    const [openCategoryId, setOpenCategoryId] = useState(categoriesList[0]?.id ?? null);
    const [openGroupIds, setOpenGroupIds] = useState({});

    // Create modals
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCreateRank, setShowCreateRank] = useState(false);
    const createCategoryForm = useForm({ name: '' });
    const createGroupForm = useForm({ nomenclature_category_id: '', name: '' });
    const createRankForm = useForm({ nomenclature_group_id: '', name: '' });

    // Edit state: { id, name } or { id, nomenclature_category_id, name } or { id, nomenclature_group_id, name }
    const [editCategory, setEditCategory] = useState(null);
    const [editGroup, setEditGroup] = useState(null);
    const [editRank, setEditRank] = useState(null);

    // Delete confirm: { type: 'category'|'group'|'rank', id, name? }
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Flash message
    const [showFlash, setShowFlash] = useState(false);
    useEffect(() => {
        if (flash?.message) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.message]);

    const statCards = [
        { label: 'Categories', value: safeStats.total_categories, icon: 'folder', color: 'bg-primary' },
        { label: 'Groups', value: safeStats.total_groups, icon: 'layers', color: 'bg-emerald-500' },
        { label: 'Ranks', value: safeStats.total_ranks, icon: 'star', color: 'bg-amber-500' },
    ];

    const toggleCategory = (id) => {
        setOpenCategoryId((prev) => (prev === id ? null : id));
    };

    const toggleGroup = (id) => {
        setOpenGroupIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Flat list of groups with category info for rank form
    const allGroups = categoriesList.flatMap((c) =>
        (c.groups || []).map((g) => ({ ...g, categoryName: c.name, categoryId: c.id }))
    );

    const handleCreateCategory = (e) => {
        e.preventDefault();
        createCategoryForm.post(`${BASE}/categories`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateCategory(false);
                createCategoryForm.reset();
            },
        });
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        createGroupForm.post(`${BASE}/groups`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateGroup(false);
                createGroupForm.reset();
            },
        });
    };

    const handleCreateRank = (e) => {
        e.preventDefault();
        createRankForm.post(`${BASE}/ranks`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateRank(false);
                createRankForm.reset();
            },
        });
    };

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        if (!editCategory?.id) return;
        router.put(`${BASE}/categories/${editCategory.id}`, { name: editCategory.name }, {
            preserveScroll: true,
            onSuccess: () => setEditCategory(null),
        });
    };

    const handleUpdateGroup = (e) => {
        e.preventDefault();
        if (!editGroup?.id) return;
        router.put(`${BASE}/groups/${editGroup.id}`, {
            nomenclature_category_id: editGroup.nomenclature_category_id,
            name: editGroup.name,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditGroup(null),
        });
    };

    const handleUpdateRank = (e) => {
        e.preventDefault();
        if (!editRank?.id) return;
        router.put(`${BASE}/ranks/${editRank.id}`, {
            nomenclature_group_id: editRank.nomenclature_group_id,
            name: editRank.name,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditRank(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        const { type, id } = deleteTarget;
        if (type === 'category') router.delete(`${BASE}/categories/${id}`, { preserveScroll: true });
        else if (type === 'group') router.delete(`${BASE}/groups/${id}`, { preserveScroll: true });
        else if (type === 'rank') router.delete(`${BASE}/ranks/${id}`, { preserveScroll: true });
        setDeleteTarget(null);
    };

    return (
        <Layout auth={auth} authRole={authRole} menu={menu} appName={appName} pageTitle="Job Families & Nomenclature">
            <div className="space-y-8">
                {showFlash && flash?.message && (
                    <Alert type="success" message={flash.message} onDismiss={() => setShowFlash(false)} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted">{s.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center text-white`}>
                                    <span className="material-symbols-outlined">{s.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Job Families & Nomenclature
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCreateCategory(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Create Category
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateGroup(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Create Group
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateRank(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium text-sm hover:bg-amber-700"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Create Rank
                            </button>
                            <Link
                                href="/administrator/ranks"
                                className="px-4 py-2 border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-surface-dark"
                            >
                                Manage Ranks
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {categoriesList.length === 0 ? (
                            <EmptyState
                                icon="folder_open"
                                title="No categories yet"
                                description="Create your first job family category to get started."
                                actionLabel="Create Category"
                                onAction={() => setShowCreateCategory(true)}
                                className="py-12"
                            />
                        ) : (
                            <div className="space-y-2">
                                {categoriesList.map((category) => {
                                    const isCategoryOpen = openCategoryId === category.id;
                                    const groups = category.groups || [];
                                    return (
                                        <div
                                            key={category.id}
                                            className="border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden"
                                        >
                                            <div className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 dark:bg-white/5">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCategory(category.id)}
                                                    className="flex-1 flex items-center justify-between gap-3 text-left min-w-0 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors rounded-lg -m-2 p-2"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                                            <span className="material-symbols-outlined">folder</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {category.name}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                                                            {groups.length} group{groups.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`material-symbols-outlined text-slate-500 transition-transform flex-shrink-0 ${
                                                            isCategoryOpen ? 'rotate-180' : ''
                                                        }`}
                                                    >
                                                        expand_more
                                                    </span>
                                                </button>
                                                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditCategory({ id: category.id, name: category.name })}
                                                        className="p-2 rounded-lg hover:bg-primary/10 text-primary"
                                                        title="Edit category"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget({ type: 'category', id: category.id, name: category.name })}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                                                        title="Delete category"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                            {isCategoryOpen && (
                                                <div className="border-t border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark">
                                                    {groups.length === 0 ? (
                                                        <div className="px-6 py-8 flex items-center justify-center gap-3 text-text-muted text-sm">
                                                            No groups in this category.
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    createGroupForm.setData('nomenclature_category_id', String(category.id));
                                                                    setShowCreateGroup(true);
                                                                }}
                                                                className="text-primary font-medium hover:underline"
                                                            >
                                                                Add group
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 space-y-3">
                                                            {groups.map((group) => {
                                                                const isGroupOpen = openGroupIds[group.id] !== false;
                                                                const ranks = group.ranks || [];
                                                                return (
                                                                    <div
                                                                        key={group.id}
                                                                        className="border border-slate-200 dark:border-border-dark rounded-lg overflow-hidden"
                                                                    >
                                                                        <div className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50/50 dark:bg-white/5">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => toggleGroup(group.id)}
                                                                                className="flex-1 flex items-center justify-between gap-3 text-left min-w-0 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-colors rounded-lg -m-2 p-2"
                                                                            >
                                                                                <div className="flex items-center gap-2 min-w-0">
                                                                                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">
                                                                                        layers
                                                                                    </span>
                                                                                    <span className="font-medium text-slate-900 dark:text-white truncate">
                                                                                        {group.name}
                                                                                    </span>
                                                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                                        {ranks.length} rank{ranks.length !== 1 ? 's' : ''}
                                                                                    </span>
                                                                                </div>
                                                                                <span
                                                                                    className={`material-symbols-outlined text-slate-400 text-lg transition-transform flex-shrink-0 ${
                                                                                        isGroupOpen ? 'rotate-180' : ''
                                                                                    }`}
                                                                                >
                                                                                    expand_more
                                                                                </span>
                                                                            </button>
                                                                            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setEditGroup({
                                                                                        id: group.id,
                                                                                        nomenclature_category_id: String(group.nomenclature_category_id ?? category.id),
                                                                                        name: group.name,
                                                                                    })}
                                                                                    className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                                                    title="Edit group"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setDeleteTarget({ type: 'group', id: group.id, name: group.name })}
                                                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                                                                                    title="Delete group"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {isGroupOpen && (
                                                                            <div className="border-t border-slate-200 dark:border-border-dark px-4 py-3 bg-white dark:bg-background-dark">
                                                                                {ranks.length === 0 ? (
                                                                                    <p className="text-sm text-text-muted flex items-center gap-2">
                                                                                        No ranks in this group.
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                createRankForm.setData('nomenclature_group_id', String(group.id));
                                                                                                setShowCreateRank(true);
                                                                                            }}
                                                                                            className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                                                                                        >
                                                                                            Add rank
                                                                                        </button>
                                                                                    </p>
                                                                                ) : (
                                                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                                                        {ranks.map((rank) => (
                                                                                            <li
                                                                                                key={rank.id}
                                                                                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 group/rank"
                                                                                            >
                                                                                                <div className="flex items-center gap-2 min-w-0">
                                                                                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg flex-shrink-0">
                                                                                                        star
                                                                                                    </span>
                                                                                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                                                        {rank.name}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1 opacity-0 group-hover/rank:opacity-100 transition-opacity flex-shrink-0">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => setEditRank({
                                                                                                            id: rank.id,
                                                                                                            nomenclature_group_id: String(rank.nomenclature_group_id ?? group.id),
                                                                                                            name: rank.name,
                                                                                                        })}
                                                                                                        className="p-1.5 rounded hover:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                                                                                        title="Edit rank"
                                                                                                    >
                                                                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => setDeleteTarget({ type: 'rank', id: rank.id, name: rank.name })}
                                                                                                        className="p-1.5 rounded hover:bg-red-500/20 text-red-500"
                                                                                                        title="Delete rank"
                                                                                                    >
                                                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Category Modal */}
            <Modal show={showCreateCategory} onClose={() => setShowCreateCategory(false)} title="Create Category">
                <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={createCategoryForm.data.name}
                            onChange={(e) => createCategoryForm.setData('name', e.target.value)}
                            className="form-control"
                            placeholder="e.g. Engineering"
                            required
                        />
                        {createCategoryForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createCategoryForm.errors.name}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setShowCreateCategory(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={createCategoryForm.processing} className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50">
                            Create Category
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Create Group Modal */}
            <Modal show={showCreateGroup} onClose={() => setShowCreateGroup(false)} title="Create Group">
                <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                            value={createGroupForm.data.nomenclature_category_id}
                            onChange={(e) => createGroupForm.setData('nomenclature_category_id', e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">Select category</option>
                            {categoriesList.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {createGroupForm.errors.nomenclature_category_id && (
                            <p className="text-red-500 text-xs mt-1">{createGroupForm.errors.nomenclature_category_id}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group name</label>
                        <input
                            type="text"
                            value={createGroupForm.data.name}
                            onChange={(e) => createGroupForm.setData('name', e.target.value)}
                            className="form-control"
                            placeholder="e.g. Software Development"
                            required
                        />
                        {createGroupForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createGroupForm.errors.name}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setShowCreateGroup(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={createGroupForm.processing} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50">
                            Create Group
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Create Rank Modal */}
            <Modal show={showCreateRank} onClose={() => setShowCreateRank(false)} title="Create Rank">
                <form onSubmit={handleCreateRank} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group</label>
                        <select
                            value={createRankForm.data.nomenclature_group_id}
                            onChange={(e) => createRankForm.setData('nomenclature_group_id', e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">Select group</option>
                            {allGroups.map((g) => (
                                <option key={g.id} value={g.id}>{g.categoryName} → {g.name}</option>
                            ))}
                        </select>
                        {createRankForm.errors.nomenclature_group_id && (
                            <p className="text-red-500 text-xs mt-1">{createRankForm.errors.nomenclature_group_id}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rank name</label>
                        <input
                            type="text"
                            value={createRankForm.data.name}
                            onChange={(e) => createRankForm.setData('name', e.target.value)}
                            className="form-control"
                            placeholder="e.g. Senior"
                            required
                        />
                        {createRankForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createRankForm.errors.name}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setShowCreateRank(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={createRankForm.processing} className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50">
                            Create Rank
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal show={!!editCategory} onClose={() => setEditCategory(null)} title="Edit Category">
                {editCategory && (
                    <form onSubmit={handleUpdateCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input
                                type="text"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory((p) => ({ ...p, name: e.target.value }))}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setEditCategory(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                                Save changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Edit Group Modal */}
            <Modal show={!!editGroup} onClose={() => setEditGroup(null)} title="Edit Group">
                {editGroup && (
                    <form onSubmit={handleUpdateGroup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <select
                                value={editGroup.nomenclature_category_id}
                                onChange={(e) => setEditGroup((p) => ({ ...p, nomenclature_category_id: e.target.value }))}
                                className="form-control"
                                required
                            >
                                {categoriesList.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group name</label>
                            <input
                                type="text"
                                value={editGroup.name}
                                onChange={(e) => setEditGroup((p) => ({ ...p, name: e.target.value }))}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setEditGroup(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700">
                                Save changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Edit Rank Modal */}
            <Modal show={!!editRank} onClose={() => setEditRank(null)} title="Edit Rank">
                {editRank && (
                    <form onSubmit={handleUpdateRank} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group</label>
                            <select
                                value={editRank.nomenclature_group_id}
                                onChange={(e) => setEditRank((p) => ({ ...p, nomenclature_group_id: e.target.value }))}
                                className="form-control"
                                required
                            >
                                {allGroups.map((g) => (
                                    <option key={g.id} value={g.id}>{g.categoryName} → {g.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rank name</label>
                            <input
                                type="text"
                                value={editRank.name}
                                onChange={(e) => setEditRank((p) => ({ ...p, name: e.target.value }))}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setEditRank(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-white font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700">
                                Save changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete confirmation */}
            <ConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title={deleteTarget ? `Delete ${deleteTarget.type}` : 'Confirm'}
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name ?? deleteTarget.type}"? This may remove related groups and ranks.`
                        : ''
                }
                confirmLabel="Delete"
                variant="danger"
            />
        </Layout>
    );
}
