"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import { updateAdminUser, changePassword as apiChangePassword, uploadAvatar } from "@/lib/api/users";
import { getAdminSiteConfig, updateSiteConfig } from "@/lib/api/settings";
import {
  User,
  BookOpen,
  GitBranch,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Phone,
  Globe,
  AlertCircle,
} from "lucide-react";

type Tab = "profile" | "publication" | "workflow";

interface PublicationSettings {
  name: string;
  tagline: string;
  description: string;
  school: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

interface WorkflowSettings {
  requireMediaBeforeLayout: boolean;
  allowConcurrentReviews: boolean;
  autoArchiveDaysEnabled: boolean;
  autoArchiveDays: number;
  notifyEditorOnSubmission: boolean;
  notifyAuthorOnRevision: boolean;
  allowSelfApproval: boolean;
}

const DEFAULT_PUB: PublicationSettings = {
  name: "The Beacon",
  tagline: "The Official Student Publication",
  description: "",
  school: "Harrow Hill High School",
  mission: "",
  vision: "",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  twitter: "",
  instagram: "",
  youtube: "",
  tiktok: "",
};

const DEFAULT_WORKFLOW: WorkflowSettings = {
  requireMediaBeforeLayout: true,
  allowConcurrentReviews: false,
  autoArchiveDaysEnabled: false,
  autoArchiveDays: 90,
  notifyEditorOnSubmission: true,
  notifyAuthorOnRevision: true,
  allowSelfApproval: false,
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function SavedBanner({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">
      <CheckCircle size={16} />
      Settings saved successfully.
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
        checked ? "bg-red-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{children}</p>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  disabled,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon size={15} className="text-gray-400" />
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400 ${
          Icon ? "pl-9 pr-3" : "px-3"
        }`}
      />
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user, login } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") ?? "" : "";
  const [name, setName] = useState(user?.name ?? "");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  // avatarUrl = committed URL stored in DB; avatarPreview = local blob URL for display
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar ?? "");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    const stored = loadFromStorage<{
      position: string; bio: string; twitter: string; linkedin: string; facebook: string;
    }>(`clarionette_profile_${user?._id}`, {
      position: "", bio: "", twitter: "", linkedin: "", facebook: "",
    });
    setPosition(stored.position);
    setBio(stored.bio);
    setTwitter(stored.twitter);
    setLinkedin(stored.linkedin);
    setFacebook(stored.facebook);
  }, [user?._id]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // Show local preview immediately
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function handleSave() {
    if (newPw || confirmPw) {
      if (!currentPw) return setPwError("Enter your current password to change it.");
      if (newPw !== confirmPw) return setPwError("New passwords do not match.");
      if (newPw.length < 8) return setPwError("New password must be at least 8 characters.");
    }
    setPwError("");
    setSaveError("");
    setSaving(true);

    try {
      // Upload new avatar first if one was selected
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(token, avatarFile);
        setAvatarUrl(finalAvatarUrl);
        setAvatarPreview(finalAvatarUrl);
        setAvatarFile(null);
      }

      // Save core profile fields to backend
      if (user) {
        const updated = await updateAdminUser(token, user._id, {
          name, position, bio, avatar: finalAvatarUrl,
        });
        login(
          { ...user, name: updated.name, avatar: updated.avatar ?? user.avatar },
          token
        );
      }

      // Persist social links to localStorage (no backend field yet)
      localStorage.setItem(
        `clarionette_profile_${user?._id}`,
        JSON.stringify({ position, bio, twitter, linkedin, facebook })
      );

      // Change password if filled
      if (currentPw && newPw) {
        try {
          await apiChangePassword(token, currentPw, newPw);
        } catch (err) {
          setPwError(err instanceof Error ? err.message : "Failed to change password");
          setSaving(false);
          return;
        }
      }

      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  const displayName = name || user?.name || "?";
  const initials = displayName[0].toUpperCase();

  return (
    <div className="space-y-8">
      {saved && <SavedBanner onDismiss={() => setSaved(false)} />}
      {saveError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
          <AlertCircle size={15} /> {saveError}
        </div>
      )}

      {/* Avatar + role */}
      <div className="flex items-start gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        {/* Avatar preview */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-2xl overflow-hidden ring-2 ring-white shadow">
            {avatarPreview ? (
              <img src={avatarPreview} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {/* Upload button overlaid on avatar */}
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white cursor-pointer shadow transition-colors"
            title="Upload photo"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileSelect}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.roleName}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          {avatarFile && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
              New photo selected — will upload on save
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Click the icon to change your profile photo</p>
        </div>
      </div>

      {/* Basic info */}
      <div>
        <SectionLabel>Basic Information</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Display Name" required>
            <Input value={name} onChange={setName} placeholder="Your full name" />
          </Field>
          <Field label="Email">
            <Input value={user?.email ?? ""} disabled />
          </Field>
          <Field label="Position / Title" hint="e.g. News Editor, Staff Writer">
            <Input value={position} onChange={setPosition} placeholder="Your position in the publication" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio" hint="Shown on your author profile page">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A short bio about yourself..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Social links */}
      <div>
        <SectionLabel>Social Links</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Twitter / X">
            <Input value={twitter} onChange={setTwitter} placeholder="@username" icon={Twitter} />
          </Field>
          <Field label="LinkedIn">
            <Input value={linkedin} onChange={setLinkedin} placeholder="linkedin.com/in/..." icon={Linkedin} />
          </Field>
          <Field label="Facebook">
            <Input value={facebook} onChange={setFacebook} placeholder="facebook.com/..." icon={Facebook} />
          </Field>
        </div>
      </div>

      {/* Change password */}
      <div>
        <SectionLabel>Change Password</SectionLabel>
        {pwError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
            <AlertCircle size={15} />
            {pwError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Current Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Current password"
                className="w-full border border-gray-300 rounded-lg px-3 pr-9 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="New Password">
            <input
              type={showPw ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </Field>
          <Field label="Confirm New Password">
            <input
              type={showPw ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={15} />
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ─── Publication Tab ──────────────────────────────────────────────────────────

function PublicationTab() {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") ?? "" : "";
  const [settings, setSettings] = useState<PublicationSettings>(DEFAULT_PUB);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getAdminSiteConfig(token)
      .then((cfg) => {
        setSettings({
          name: cfg.name,
          tagline: cfg.tagline,
          description: cfg.description,
          school: cfg.school,
          mission: cfg.mission,
          vision: cfg.vision,
          email: cfg.email,
          phone: cfg.phone,
          address: cfg.address,
          facebook: cfg.facebook,
          twitter: cfg.twitter,
          instagram: cfg.instagram,
          youtube: cfg.youtube,
          tiktok: cfg.tiktok,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function set(key: keyof PublicationSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaveError("");
    setSaving(true);
    try {
      await updateSiteConfig(token, settings);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {saved && <SavedBanner onDismiss={() => setSaved(false)} />}
      {saveError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
          <AlertCircle size={15} /> {saveError}
        </div>
      )}

      {/* Identity */}
      <div>
        <SectionLabel>Publication Identity</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Publication Name" required>
            <Input value={settings.name} onChange={(v) => set("name", v)} placeholder="The Beacon" />
          </Field>
          <Field label="Tagline">
            <Input value={settings.tagline} onChange={(v) => set("tagline", v)} placeholder="The Official Student Publication" />
          </Field>
          <Field label="School / Institution">
            <Input value={settings.school} onChange={(v) => set("school", v)} placeholder="Harrow Hill High School" />
          </Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Description" hint="Shown in the footer and About page">
            <textarea
              value={settings.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="Short description of the publication..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            />
          </Field>
          <Field label="Mission Statement">
            <textarea
              value={settings.mission}
              onChange={(e) => set("mission", e.target.value)}
              rows={3}
              placeholder="Our mission is to..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            />
          </Field>
          <Field label="Vision Statement">
            <textarea
              value={settings.vision}
              onChange={(e) => set("vision", e.target.value)}
              rows={3}
              placeholder="We envision..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Contact */}
      <div>
        <SectionLabel>Contact Information</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Email">
            <Input value={settings.email} onChange={(v) => set("email", v)} placeholder="editors@school.edu" type="email" icon={Mail} />
          </Field>
          <Field label="Phone">
            <Input value={settings.phone} onChange={(v) => set("phone", v)} placeholder="+63 xxx xxx xxxx" icon={Phone} />
          </Field>
          <Field label="Address">
            <Input value={settings.address} onChange={(v) => set("address", v)} placeholder="Street, City" icon={Globe} />
          </Field>
        </div>
      </div>

      {/* Social */}
      <div>
        <SectionLabel>Social Media Accounts</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Facebook" hint="Full URL">
            <Input value={settings.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/page" icon={Facebook} />
          </Field>
          <Field label="Twitter / X" hint="Full URL">
            <Input value={settings.twitter} onChange={(v) => set("twitter", v)} placeholder="https://twitter.com/handle" icon={Twitter} />
          </Field>
          <Field label="Instagram" hint="Full URL">
            <Input value={settings.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/handle" icon={Globe} />
          </Field>
          <Field label="YouTube" hint="Full URL">
            <Input value={settings.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/@channel" icon={Globe} />
          </Field>
          <Field label="TikTok" hint="Full URL">
            <Input value={settings.tiktok} onChange={(v) => set("tiktok", v)} placeholder="https://tiktok.com/@handle" icon={Globe} />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={15} />
          {saving ? "Saving…" : "Save Publication Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── Workflow Tab ─────────────────────────────────────────────────────────────

interface WorkflowRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}

function WorkflowRow({ label, description, checked, onChange, children }: WorkflowRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        {checked && children && <div className="mt-3">{children}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function WorkflowTab() {
  const [settings, setSettings] = useState<WorkflowSettings>(() =>
    loadFromStorage("clarionette_workflow_settings", DEFAULT_WORKFLOW)
  );
  const [saved, setSaved] = useState(false);

  function set<K extends keyof WorkflowSettings>(key: K, value: WorkflowSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("clarionette_workflow_settings", JSON.stringify(settings));
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      {saved && <SavedBanner onDismiss={() => setSaved(false)} />}

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        <div className="px-5 py-4 border-b border-gray-200">
          <SectionLabel>Article Pipeline</SectionLabel>
        </div>
        <div className="px-5">
          <WorkflowRow
            label="Require media before layout"
            description="Articles must have media attached before they can enter the layout stage."
            checked={settings.requireMediaBeforeLayout}
            onChange={(v) => set("requireMediaBeforeLayout", v)}
          />
          <WorkflowRow
            label="Allow concurrent article reviews"
            description="Section editors can pick up multiple articles for review simultaneously."
            checked={settings.allowConcurrentReviews}
            onChange={(v) => set("allowConcurrentReviews", v)}
          />
          <WorkflowRow
            label="Prevent authors from self-approving"
            description="Authors who are also editors cannot approve their own submissions."
            checked={!settings.allowSelfApproval}
            onChange={(v) => set("allowSelfApproval", !v)}
          />
          <WorkflowRow
            label="Auto-archive published articles"
            description="Automatically archive articles after a set number of days."
            checked={settings.autoArchiveDaysEnabled}
            onChange={(v) => set("autoArchiveDaysEnabled", v)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Archive after</span>
              <input
                type="number"
                min={7}
                max={365}
                value={settings.autoArchiveDays}
                onChange={(e) => set("autoArchiveDays", Number(e.target.value))}
                className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
              <span className="text-sm text-gray-600">days</span>
            </div>
          </WorkflowRow>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        <div className="px-5 py-4 border-b border-gray-200">
          <SectionLabel>Notifications</SectionLabel>
        </div>
        <div className="px-5">
          <WorkflowRow
            label="Notify editors on article submission"
            description="Section editors receive a notification when a writer submits an article."
            checked={settings.notifyEditorOnSubmission}
            onChange={(v) => set("notifyEditorOnSubmission", v)}
          />
          <WorkflowRow
            label="Notify authors on revision request"
            description="Authors are notified when an editor requests a revision."
            checked={settings.notifyAuthorOnRevision}
            onChange={(v) => set("notifyAuthorOnRevision", v)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={15} />
          Save Workflow Settings
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "publication", label: "Publication", icon: BookOpen },
  { id: "workflow", label: "Workflow", icon: GitBranch },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <DashboardLayout title="Settings">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "publication" && <PublicationTab />}
        {activeTab === "workflow" && <WorkflowTab />}
      </div>
    </DashboardLayout>
  );
}
