"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  ROLE_SECTION_LABELS,
} from "@/types/permissions.types";
import type { Permission, Role, RoleSection } from "@/types/permissions.types";
import type { User } from "@/types/user.types";
import {
  Plus,
  Users,
  Shield,
  Search,
  UserCheck,
  UserX,
  Check,
  X,
  Eye,
  EyeOff,
  Pencil,
  UserMinus,
} from "lucide-react";
import {
  listAdminUsers,
  listAdminRoles,
  createAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  reactivateAdminUser,
} from "@/lib/api/users";


const SECTIONS_ORDER: RoleSection[] = [
  "management",
  "editorial",
  "news",
  "features",
  "sports",
  "literary",
  "media",
];

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
}

interface EditUserForm {
  name: string;
  roleId: string;
  position: string;
}

const EMPTY_FORM: CreateUserForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  roleId: "",
};

function PermissionPreview({ permissions }: { permissions: Permission[] }) {
  return (
    <div className="mt-3 border border-gray-100 rounded-lg p-3 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Inherited Permissions
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {ALL_PERMISSIONS.map((p) => (
          <div key={p} className="flex items-center gap-1.5">
            {permissions.includes(p) ? (
              <Check size={12} className="text-green-600 shrink-0" />
            ) : (
              <X size={12} className="text-gray-300 shrink-0" />
            )}
            <span
              className={`text-xs ${
                permissions.includes(p) ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {PERMISSION_LABELS[p]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleSelector({
  value,
  onChange,
  roles,
}: {
  value: string;
  onChange: (v: string) => void;
  roles: Role[];
}) {
  const groupedRoles = SECTIONS_ORDER.reduce<Record<RoleSection, Role[]>>(
    (acc, s) => {
      acc[s] = roles.filter((r) => r.section === s && r.isActive);
      return acc;
    },
    {} as Record<RoleSection, Role[]>
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
    >
      <option value="">— Select a role —</option>
      {SECTIONS_ORDER.map((section) => {
        const roles = groupedRoles[section];
        if (!roles.length) return null;
        return (
          <optgroup key={section} label={ROLE_SECTION_LABELS[section]}>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}

function CreateUserPanel({
  onSave,
  onCancel,
  roles,
  error,
}: {
  onSave: (form: CreateUserForm) => void | Promise<void>;
  onCancel: () => void;
  roles: Role[];
  error?: string;
}) {
  const [form, setForm] = useState<CreateUserForm>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateUserForm>>({});

  const selectedRole = roles.find((r) => r._id === form.roleId);

  const validate = (): boolean => {
    const e: Partial<CreateUserForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.roleId) e.roleId = "Please select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Maria Santos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@beacon.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.email && <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temporary Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Min 8 characters"
              className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-0.5 text-xs text-red-500">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="Re-enter password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.confirmPassword && (
            <p className="mt-0.5 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <RoleSelector
          value={form.roleId}
          onChange={(v) => setForm((p) => ({ ...p, roleId: v }))}
          roles={roles}
        />
        {errors.roleId && <p className="mt-0.5 text-xs text-red-500">{errors.roleId}</p>}
        {selectedRole && <PermissionPreview permissions={selectedRole.permissions} />}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

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
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Create User
        </button>
      </div>
    </form>
  );
}

function EditUserPanel({
  user,
  onSave,
  onCancel,
  roles,
  error,
}: {
  user: User;
  onSave: (data: EditUserForm) => void;
  onCancel: () => void;
  roles: Role[];
  error?: string;
}) {
  const initialRole = roles.find((r) => r._id === user.roleId || r.slug === user.roleSlug);
  const [form, setForm] = useState<EditUserForm>({
    name: user.name,
    roleId: initialRole?._id ?? user.roleId,
    position: user.position ?? "",
  });
  const [errors, setErrors] = useState<Partial<EditUserForm>>({});

  const selectedRole = roles.find((r) => r._id === form.roleId);

  const validate = (): boolean => {
    const e: Partial<EditUserForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.roleId) e.roleId = "Please select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Maria Santos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.position}
            onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
            placeholder="e.g. Senior Reporter"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <RoleSelector
          value={form.roleId}
          onChange={(v) => setForm((p) => ({ ...p, roleId: v }))}
          roles={roles}
        />
        {errors.roleId && <p className="mt-0.5 text-xs text-red-500">{errors.roleId}</p>}
        {selectedRole && <PermissionPreview permissions={selectedRole.permissions} />}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

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
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function UserRow({
  user,
  currentUserId,
  onToggleActive,
  onEdit,
}: {
  user: User;
  currentUserId?: string;
  onToggleActive: (user: User) => void;
  onEdit: (user: User) => void;
}) {
  const isSelf = user._id === currentUserId;

  return (
    <tr className={`hover:bg-gray-50 ${!user.isActive ? "opacity-60" : ""}`}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-semibold text-sm shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.name}
              {isSelf && (
                <span className="ml-2 text-xs text-gray-400">(you)</span>
              )}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div>
          <p className="text-sm text-gray-800">{user.roleName}</p>
          <p className="text-xs text-gray-500">
            {ROLE_SECTION_LABELS[user.roleSection]}
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {user.permissions.slice(0, 3).map((p) => (
            <span
              key={p}
              className="inline-block px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
            >
              {PERMISSION_LABELS[p]}
            </span>
          ))}
          {user.permissions.length > 3 && (
            <span className="inline-block px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
              +{user.permissions.length - 3} more
            </span>
          )}
          {user.permissions.length === 0 && (
            <span className="text-xs text-gray-400">No permissions</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isActive ? <UserCheck size={11} /> : <UserX size={11} />}
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            title="Edit user"
            className="text-xs px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={() => onToggleActive(user)}
            disabled={isSelf}
            title={
              isSelf
                ? "Cannot deactivate your own account"
                : user.isActive
                ? "Deactivate account"
                : "Reactivate account"
            }
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ${
              user.isActive
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-green-200 text-green-600 hover:bg-green-50"
            }`}
          >
            {user.isActive ? (
              <>
                <UserMinus size={12} />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck size={12} />
                Reactivate
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function UsersTable({
  rows,
  currentUserId,
  onToggleActive,
  onEdit,
  emptyMessage,
}: {
  rows: User[];
  currentUserId?: string;
  onToggleActive: (user: User) => void;
  onEdit: (user: User) => void;
  emptyMessage: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              User
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Role / Section
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Permissions
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Joined
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                <Users size={28} className="mx-auto mb-2 text-gray-300" />
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((u) => (
              <UserRow
                key={u._id}
                user={u}
                currentUserId={currentUserId}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function UsersPage() {
  const { hasPermission, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [createError, setCreateError] = useState<string | undefined>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editError, setEditError] = useState<string | undefined>();
  const [toggleError, setToggleError] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState<RoleSection | "all">("all");
  const [viewMode, setViewMode] = useState<"active" | "deactivated">("active");

  const loadData = () => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError(undefined);
    Promise.all([listAdminUsers(token), listAdminRoles(token)])
      .then(([userList, roleList]) => {
        setUsers(userList);
        setRoles(roleList);
      })
      .catch(() => setFetchError("Could not reach the server. Check that the backend is running."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.roleName.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === "all" || u.roleSection === filterSection;
    return matchSearch && matchSection;
  });

  const activeFiltered = filtered.filter((u) => u.isActive);
  const inactiveFiltered = filtered.filter((u) => !u.isActive);

  const handleCreateUser = async (form: CreateUserForm) => {
    setCreateError(undefined);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const newUser = await createAdminUser(token, {
        name: form.name,
        email: form.email,
        password: form.password,
        roleId: form.roleId,
      });
      setUsers((prev) => [newUser, ...prev]);
      setShowForm(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create user. Please try again.");
    }
  };

  const handleEditUser = async (data: EditUserForm) => {
    if (!editingUser) return;
    setEditError(undefined);

    const role = roles.find((r) => r._id === data.roleId);
    if (!role) return;

    const updated: User = {
      ...editingUser,
      name: data.name,
      roleId: role._id,
      roleName: role.name,
      roleSlug: role.slug,
      roleSection: role.section,
      permissions: [...role.permissions],
      position: data.position || undefined,
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u._id === editingUser._id ? updated : u)));
    setEditingUser(null);

    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await updateAdminUser(token, editingUser._id, {
        name: data.name,
        roleId: data.roleId,
        position: data.position || undefined,
      });
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save changes");
      setUsers((prev) => prev.map((u) => (u._id === editingUser._id ? editingUser : u)));
      setEditingUser(editingUser);
    }
  };

  const handleToggleActive = async (user: User) => {
    setToggleError(undefined);

    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id
          ? { ...u, isActive: !u.isActive, updatedAt: new Date().toISOString() }
          : u
      )
    );

    try {
      const token = localStorage.getItem("adminToken") ?? "";
      if (user.isActive) {
        await deactivateAdminUser(token, user._id);
      } else {
        await reactivateAdminUser(token, user._id);
      }
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: user.isActive } : u))
      );
      setToggleError(err instanceof Error ? err.message : "Action failed. Please try again.");
    }
  };

  if (!hasPermission("manage_users")) {
    return (
      <DashboardLayout title="Users">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">
            Only Super Admins and Technical Advisers can manage users.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="User Management">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          Loading…
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout title="User Management">
        <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
          <Shield size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">{fetchError}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-500">
            {users.filter((u) => u.isActive).length} active &middot;{" "}
            {users.filter((u) => !u.isActive).length} deactivated &middot;{" "}
            {users.length} total
          </p>
          {!showForm && !editingUser && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus size={15} />
              New User
            </button>
          )}
        </div>

        {/* Toggle error banner */}
        {toggleError && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <p className="text-sm text-red-700">{toggleError}</p>
            <button
              onClick={() => setToggleError(undefined)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Create User Panel */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Create New User</h3>
            <CreateUserPanel
              onSave={handleCreateUser}
              onCancel={() => { setShowForm(false); setCreateError(undefined); }}
              roles={roles}
              error={createError}
            />
          </div>
        )}

        {/* Edit User Panel */}
        {editingUser && (
          <div className="bg-white border border-blue-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Edit User — {editingUser.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{editingUser.email}</p>
            <EditUserPanel
              user={editingUser}
              onSave={handleEditUser}
              onCancel={() => { setEditingUser(null); setEditError(undefined); }}
              roles={roles}
              error={editError}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role…"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value as RoleSection | "all")}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Sections</option>
            {SECTIONS_ORDER.map((s) => (
              <option key={s} value={s}>
                {ROLE_SECTION_LABELS[s]}
              </option>
            ))}
          </select>

          {/* Active / Deactivated toggle */}
          <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden text-sm shrink-0">
            <button
              onClick={() => setViewMode("active")}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${
                viewMode === "active"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserCheck size={14} />
              Active
            </button>
            <div className="w-px h-full bg-gray-300" />
            <button
              onClick={() => setViewMode("deactivated")}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${
                viewMode === "deactivated"
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserMinus size={14} />
              Deactivated
            </button>
          </div>
        </div>

        {/* Active Members Table */}
        {viewMode === "active" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <UserCheck size={15} className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">Active Members</h3>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {activeFiltered.length}
              </span>
            </div>
            <UsersTable
              rows={activeFiltered}
              currentUserId={currentUser?._id}
              onToggleActive={handleToggleActive}
              onEdit={(u) => { setEditingUser(u); setShowForm(false); setEditError(undefined); }}
              emptyMessage="No active users match your search"
            />
          </div>
        )}

        {/* Deactivated Accounts Table */}
        {viewMode === "deactivated" && (
          <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-amber-200 flex items-center gap-2 bg-amber-50">
              <UserMinus size={15} className="text-amber-600" />
              <h3 className="text-sm font-semibold text-amber-800">Deactivated Accounts</h3>
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {inactiveFiltered.length}
              </span>
            </div>
            <UsersTable
              rows={inactiveFiltered}
              currentUserId={currentUser?._id}
              onToggleActive={handleToggleActive}
              onEdit={(u) => { setEditingUser(u); setShowForm(false); setEditError(undefined); }}
              emptyMessage="No deactivated accounts match your search"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
