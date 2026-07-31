"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { PermissionGuard } from "../components/PermissionGuard";
import { useAuth } from "../components/AuthContext";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  ROLE_SECTION_LABELS,
} from "@/types/permissions.types";
import type {
  Permission,
  Role,
  RoleSection,
  CreateRoleInput,
} from "@/types/permissions.types";
import {
  listAdminRoles,
  createAdminRole,
  updateAdminRole,
  deactivateAdminRole,
  activateAdminRole,
} from "@/lib/api/users";
import {
  Plus,
  Edit,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Info,
  AlertCircle,
  Loader,
} from "lucide-react";

const SECTIONS: RoleSection[] = [
  "management",
  "editorial",
  "news",
  "features",
  "sports",
  "literary",
  "media",
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

interface RoleFormState {
  name: string;
  section: RoleSection;
  permissions: Permission[];
}

const EMPTY_FORM: RoleFormState = {
  name: "",
  section: "news",
  permissions: [],
};

function PermissionRow({
  permission,
  checked,
  onChange,
}: {
  permission: Permission;
  checked: boolean;
  onChange: (p: Permission, val: boolean) => void;
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(permission, e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-800">
            {PERMISSION_LABELS[permission]}
          </span>
          <button
            type="button"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            className="text-gray-400 hover:text-gray-600 relative"
          >
            <Info size={13} />
            {showTip && (
              <div className="absolute left-5 top-0 z-10 w-56 rounded-md bg-gray-800 text-white text-xs p-2 shadow-lg">
                {PERMISSION_DESCRIPTIONS[permission]}
              </div>
            )}
          </button>
        </div>
      </div>
    </label>
  );
}

function RoleForm({
  initial,
  onSave,
  onCancel,
  saving = false,
}: {
  initial?: RoleFormState;
  onSave: (data: CreateRoleInput) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<RoleFormState>(initial ?? EMPTY_FORM);

  const togglePermission = (p: Permission, val: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: val
        ? [...prev.permissions, p]
        : prev.permissions.filter((x) => x !== p),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      slug: slugify(form.name.trim()),
      section: form.section,
      permissions: form.permissions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Filipino Editor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
          {form.name && (
            <p className="mt-1 text-xs text-gray-500">
              Slug: <span className="font-mono">{slugify(form.name)}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            value={form.section}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, section: e.target.value as RoleSection }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {ROLE_SECTION_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, permissions: [...ALL_PERMISSIONS] }))
              }
              className="text-xs text-red-600 hover:underline"
            >
              Select all
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, permissions: [] }))}
              className="text-xs text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-2 grid grid-cols-1 sm:grid-cols-2 gap-0.5">
          {ALL_PERMISSIONS.map((p) => (
            <PermissionRow
              key={p}
              permission={p}
              checked={form.permissions.includes(p)}
              onChange={togglePermission}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {form.permissions.length} of {ALL_PERMISSIONS.length} permissions selected
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          disabled={!form.name.trim() || saving}
        >
          {saving && <Loader size={13} className="animate-spin" />}
          Save Role
        </button>
      </div>
    </form>
  );
}

function RoleCard({
  role,
  onEdit,
  onToggleActive,
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onToggleActive: (role: Role) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-lg border ${role.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-1.5 rounded-md ${role.isActive ? "bg-red-50" : "bg-gray-100"}`}>
            <Shield size={15} className={role.isActive ? "text-red-600" : "text-gray-400"} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 text-sm">{role.name}</span>
              {role.isDefault && (
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  Default
                </span>
              )}
              {!role.isActive && (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {ROLE_SECTION_LABELS[role.section]} &middot; {role.permissions.length} permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(role)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            title="Edit role"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => onToggleActive(role)}
            className={`p-1.5 rounded-md transition-colors ${
              role.isActive
                ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
            }`}
            title={role.isActive ? "Deactivate role" : "Activate role"}
          >
            {role.isActive ? <X size={15} /> : <Check size={15} />}
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
            title="Toggle permissions"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-2">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Permissions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_PERMISSIONS.map((p) => (
              <span
                key={p}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  role.permissions.includes(p)
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {role.permissions.includes(p) ? (
                  <Check size={10} />
                ) : (
                  <X size={10} />
                )}
                {PERMISSION_LABELS[p]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") ?? "" : "";
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [filterSection, setFilterSection] = useState<RoleSection | "all">("all");
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    listAdminRoles(token)
      .then(setRoles)
      .catch((err) => setRolesError(err instanceof Error ? err.message : "Failed to load roles"))
      .finally(() => setRolesLoading(false));
  }, [token]);

  const filteredRoles = roles.filter(
    (r) => filterSection === "all" || r.section === filterSection
  );

  const grouped = SECTIONS.reduce<Record<RoleSection, Role[]>>((acc, s) => {
    acc[s] = filteredRoles.filter((r) => r.section === s);
    return acc;
  }, {} as Record<RoleSection, Role[]>);

  const handleSave = async (data: CreateRoleInput) => {
    setFormSaving(true);
    setActionError(undefined);
    try {
      if (editingRole) {
        const updated = await updateAdminRole(token, editingRole._id, {
          name: data.name,
          section: data.section,
          permissions: data.permissions,
        });
        setRoles((prev) => prev.map((r) => r._id === editingRole._id ? updated : r));
      } else {
        const created = await createAdminRole(token, data);
        setRoles((prev) => [...prev, created]);
      }
      setShowForm(false);
      setEditingRole(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setFormSaving(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleToggleActive = async (role: Role) => {
    setActionError(undefined);
    try {
      if (role.isActive) {
        await deactivateAdminRole(token, role._id);
        setRoles((prev) => prev.map((r) => r._id === role._id ? { ...r, isActive: false } : r));
      } else {
        await activateAdminRole(token, role._id);
        setRoles((prev) => prev.map((r) => r._id === role._id ? { ...r, isActive: true } : r));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  if (!hasPermission("manage_roles")) {
    return (
      <DashboardLayout title="Roles">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">
            Only Super Admins and Technical Advisers can manage roles.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (rolesLoading) {
    return (
      <DashboardLayout title="Role Management">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400 gap-2">
          <Loader size={16} className="animate-spin" /> Loading roles…
        </div>
      </DashboardLayout>
    );
  }

  if (rolesError) {
    return (
      <DashboardLayout title="Role Management">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <AlertCircle size={15} /> {rolesError}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Role Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              {roles.filter((r) => r.isActive).length} active &middot; {roles.length} total
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value as RoleSection | "all")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Sections</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {ROLE_SECTION_LABELS[s]}
                </option>
              ))}
            </select>
            {!showForm && (
              <button
                onClick={() => {
                  setEditingRole(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Plus size={15} />
                New Role
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
            <AlertCircle size={14} /> {actionError}
          </div>
        )}

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
            </h3>
            <RoleForm
              initial={
                editingRole
                  ? {
                      name: editingRole.name,
                      section: editingRole.section,
                      permissions: [...editingRole.permissions],
                    }
                  : undefined
              }
              onSave={handleSave}
              saving={formSaving}
              onCancel={() => {
                setShowForm(false);
                setEditingRole(null);
              }}
            />
          </div>
        )}

        {/* Roles grouped by section */}
        {SECTIONS.map((section) => {
          const sectionRoles = grouped[section];
          if (sectionRoles.length === 0) return null;

          return (
            <div key={section}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {ROLE_SECTION_LABELS[section]}
                </h2>
                <span className="text-xs text-gray-400">{sectionRoles.length}</span>
              </div>
              <div className="space-y-2">
                {sectionRoles.map((role) => (
                  <RoleCard
                    key={role._id}
                    role={role}
                    onEdit={handleEdit}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
