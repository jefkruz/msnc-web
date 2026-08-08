import { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import Modal from '../../Components/Modal';
import ConfirmModal from '../../Components/ConfirmModal';
import EmptyState from '../../Components/EmptyState';
import SearchableSelect from '../../Components/SearchableSelect';
import DashKpiGrid from '../../Components/DashKpiGrid';
import TitleCaseInput from '../../Components/TitleCaseInput';
import ActionButton, { ActionGroup } from '../../Components/ActionButton';

const BASE = '/administrator/job-families';

export default function NomenclatureIndex() {
    const { auth, authRole, menu, appName, stats = {}, categories } = usePage().props;
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


    const statCards = [
        { label: 'Categories', value: safeStats.total_categories, icon: 'folder', hint: 'Job families' },
        { label: 'Groups', value: safeStats.total_groups, icon: 'layers', hint: 'Nomenclature groups' },
        { label: 'Ranks', value: safeStats.total_ranks, icon: 'star', hint: 'Nomenclature ranks' },
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
                <DashKpiGrid items={statCards} />

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
                                                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <ActionGroup>
                                                        <ActionButton action="edit" onClick={() => setEditCategory({ id: category.id, name: category.name })} />
                                                        <ActionButton action="delete" onClick={() => setDeleteTarget({ type: 'category', id: category.id, name: category.name })} />
                                                    </ActionGroup>
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
                                                                            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                                <ActionGroup>
                                                                                    <ActionButton action="edit" onClick={() => setEditGroup({
                                                                                        id: group.id,
                                                                                        nomenclature_category_id: String(group.nomenclature_category_id ?? category.id),
                                                                                        name: group.name,
                                                                                    })} />
                                                                                    <ActionButton action="delete" onClick={() => setDeleteTarget({ type: 'group', id: group.id, name: group.name })} />
                                                                                </ActionGroup>
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
                                                                                                <div className="flex-shrink-0 opacity-0 group-hover/rank:opacity-100 transition-opacity">
                                                                                                    <ActionGroup>
                                                                                                        <ActionButton action="edit" onClick={() => setEditRank({
                                                                                                            id: rank.id,
                                                                                                            nomenclature_group_id: String(rank.nomenclature_group_id ?? group.id),
                                                                                                            name: rank.name,
                                                                                                        })} />
                                                                                                        <ActionButton action="delete" onClick={() => setDeleteTarget({ type: 'rank', id: rank.id, name: rank.name })} />
                                                                                                    </ActionGroup>
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
            <Modal
                show={showCreateCategory}
                onClose={() => setShowCreateCategory(false)}
                title="Create Category"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreateCategory(false)}>Cancel</button>
                        <button type="submit" form="nomen-create-category" className="btn btn-primary" disabled={createCategoryForm.processing}>Create Category</button>
                    </>
                )}
            >
                <form id="nomen-create-category" onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <TitleCaseInput
                            value={createCategoryForm.data.name}
                            onChange={(val) => createCategoryForm.setData('name', val)}
                            className="form-control"
                            placeholder="e.g. Engineering"
                            required
                        />
                        {createCategoryForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createCategoryForm.errors.name}</p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Create Group Modal */}
            <Modal
                show={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                title="Create Group"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreateGroup(false)}>Cancel</button>
                        <button type="submit" form="nomen-create-group" className="btn btn-primary" disabled={createGroupForm.processing}>Create Group</button>
                    </>
                )}
            >
                <form id="nomen-create-group" onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <SearchableSelect
                            value={createGroupForm.data.nomenclature_category_id}
                            onChange={(val) => createGroupForm.setData('nomenclature_category_id', val)}
                            options={categoriesList}
                            placeholder="Select category"
                            required
                            error={createGroupForm.errors.nomenclature_category_id}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Group name</label>
                        <TitleCaseInput
                            value={createGroupForm.data.name}
                            onChange={(val) => createGroupForm.setData('name', val)}
                            className="form-control"
                            placeholder="e.g. Software Development"
                            required
                        />
                        {createGroupForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createGroupForm.errors.name}</p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Create Rank Modal */}
            <Modal
                show={showCreateRank}
                onClose={() => setShowCreateRank(false)}
                title="Create Rank"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreateRank(false)}>Cancel</button>
                        <button type="submit" form="nomen-create-rank" className="btn btn-primary" disabled={createRankForm.processing}>Create Rank</button>
                    </>
                )}
            >
                <form id="nomen-create-rank" onSubmit={handleCreateRank} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Group</label>
                        <SearchableSelect
                            value={createRankForm.data.nomenclature_group_id}
                            onChange={(val) => createRankForm.setData('nomenclature_group_id', val)}
                            options={allGroups}
                            placeholder="Select group"
                            required
                            getOptionValue={(g) => g.id}
                            getOptionLabel={(g) => `${g.categoryName} → ${g.name}`}
                            error={createRankForm.errors.nomenclature_group_id}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Rank name</label>
                        <TitleCaseInput
                            value={createRankForm.data.name}
                            onChange={(val) => createRankForm.setData('name', val)}
                            className="form-control"
                            placeholder="e.g. Senior"
                            required
                        />
                        {createRankForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{createRankForm.errors.name}</p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                show={!!editCategory}
                onClose={() => setEditCategory(null)}
                title="Edit Category"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditCategory(null)}>Cancel</button>
                        <button type="submit" form="nomen-edit-category" className="btn btn-primary">Save changes</button>
                    </>
                )}
            >
                {editCategory && (
                    <form id="nomen-edit-category" onSubmit={handleUpdateCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <TitleCaseInput
                                value={editCategory.name}
                                onChange={(val) => setEditCategory((p) => ({ ...p, name: val }))}
                                className="form-control"
                                required
                            />
                        </div>
                    </form>
                )}
            </Modal>

            {/* Edit Group Modal */}
            <Modal
                show={!!editGroup}
                onClose={() => setEditGroup(null)}
                title="Edit Group"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditGroup(null)}>Cancel</button>
                        <button type="submit" form="nomen-edit-group" className="btn btn-primary">Save changes</button>
                    </>
                )}
            >
                {editGroup && (
                    <form id="nomen-edit-group" onSubmit={handleUpdateGroup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <SearchableSelect
                                value={editGroup.nomenclature_category_id}
                                onChange={(val) => setEditGroup((p) => ({ ...p, nomenclature_category_id: val }))}
                                options={categoriesList}
                                placeholder="Select category"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Group name</label>
                            <TitleCaseInput
                                value={editGroup.name}
                                onChange={(val) => setEditGroup((p) => ({ ...p, name: val }))}
                                className="form-control"
                                required
                            />
                        </div>
                    </form>
                )}
            </Modal>

            {/* Edit Rank Modal */}
            <Modal
                show={!!editRank}
                onClose={() => setEditRank(null)}
                title="Edit Rank"
                footer={(
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditRank(null)}>Cancel</button>
                        <button type="submit" form="nomen-edit-rank" className="btn btn-primary">Save changes</button>
                    </>
                )}
            >
                {editRank && (
                    <form id="nomen-edit-rank" onSubmit={handleUpdateRank} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Group</label>
                            <SearchableSelect
                                value={editRank.nomenclature_group_id}
                                onChange={(val) => setEditRank((p) => ({ ...p, nomenclature_group_id: val }))}
                                options={allGroups}
                                placeholder="Select group"
                                required
                                getOptionValue={(g) => g.id}
                                getOptionLabel={(g) => `${g.categoryName} → ${g.name}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rank name</label>
                            <TitleCaseInput
                                value={editRank.name}
                                onChange={(val) => setEditRank((p) => ({ ...p, name: val }))}
                                className="form-control"
                                required
                            />
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
