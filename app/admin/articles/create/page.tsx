"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../components/AuthContext";
import RichTextEditor, { type RichTextEditorHandle } from "../../components/RichTextEditor";
import MediaPickerModal from "../../components/MediaPickerModal";
import { Shield, AlertCircle, FileText, ImagePlus, X } from "lucide-react";
import type { ArticleCategory } from "@/types";
import { createArticle } from "@/lib/api/articles";

const CATEGORIES: ArticleCategory[] = ["news", "features", "sports", "literary", "filipino"];
const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  news: "News",
  features: "Features",
  sports: "Sports",
  literary: "Literary",
  filipino: "Filipino",
};

interface FormState {
  title: string;
  category: ArticleCategory | "";
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  featured: false,
};

export default function CreateArticlePage() {
  const router = useRouter();
  const { hasPermission, isLoading } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();

  // Media picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"cover" | "inline">("cover");
  const editorRef = useRef<RichTextEditorHandle>(null);
  const token = typeof window !== "undefined" ? (localStorage.getItem("adminToken") ?? "") : "";

  useEffect(() => {
    if (!isLoading && !hasPermission("create_articles")) {
      router.replace("/admin/articles");
    }
  }, [isLoading, hasPermission, router]);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category) e.category = "Category is required";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.content.trim()) e.content = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSaveError(undefined);
    try {
      const article = await createArticle(
        {
          title: form.title.trim(),
          category: form.category as ArticleCategory,
          excerpt: form.excerpt.trim(),
          content: form.content.trim(),
          coverImage: form.coverImage.trim() || undefined,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          featured: form.featured,
        },
        token
      );
      router.push(`/admin/articles/${article._id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to create article.");
      setSaving(false);
    }
  };

  const openCoverPicker = () => {
    setPickerTarget("cover");
    setPickerOpen(true);
  };
  const openInlinePicker = () => {
    setPickerTarget("inline");
    setPickerOpen(true);
  };
  const handleMediaSelect = (url: string, altOrFilename: string) => {
    if (pickerTarget === "cover") {
      setForm((p) => ({ ...p, coverImage: url }));
    } else {
      const sep = altOrFilename.includes("|carousel") ? "\n\n" : "\n";
      editorRef.current?.insertText(`![${altOrFilename}](${url})${sep}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="New Article">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
      </DashboardLayout>
    );
  }

  if (!hasPermission("create_articles")) {
    return (
      <DashboardLayout title="New Article">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">You need the "Create Articles" permission.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="New Article">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New Article</h2>
            <p className="text-sm text-gray-500">Will be saved as a draft</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. MCS Basketball Team Advances to Regionals"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={set("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">— Select a category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(1–2 sentence summary shown in listings)</span>
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={set("excerpt")}
              placeholder="A short summary of the article…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            {form.coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
                  <p className="flex-1 text-xs text-gray-500 truncate">{form.coverImage}</p>
                  <button
                    type="button"
                    onClick={openCoverPicker}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, coverImage: "" }))}
                    className="p-0.5 text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openCoverPicker}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ImagePlus size={15} />
                  Choose from uploads
                </button>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={set("coverImage")}
                  placeholder="or paste a URL…"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
              <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={set("tags")}
              placeholder="basketball, sports, championship"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              ref={editorRef}
              value={form.content}
              onChange={(v) => setForm((p) => ({ ...p, content: v }))}
              onImageInsert={openInlinePicker}
              error={errors.content}
              rows={20}
            />
          </div>

          {/* Featured */}
          {hasPermission("post_to_reader_side") && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 text-red-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Mark as featured article</span>
            </label>
          )}

          {saveError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
              <AlertCircle size={14} />
              {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push("/admin/articles")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>

      <MediaPickerModal
        token={token}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelect}
        configMode={pickerTarget === "inline"}
      />
    </DashboardLayout>
  );
}
