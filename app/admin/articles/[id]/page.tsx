"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../components/AuthContext";
import RichTextEditor, { type RichTextEditorHandle } from "../../components/RichTextEditor";
import MediaPickerModal from "../../components/MediaPickerModal";
import {
  ArrowLeft, Edit2, Save, X, LayoutTemplate, AlertCircle,
  Clock, Eye, Tag, CheckCircle, ChevronRight, MessageSquare, ImagePlus,
} from "lucide-react";
import {
  WORKFLOW_STATUS_LABELS,
  WORKFLOW_STATUS_COLORS,
  WORKFLOW_ACTION_LABELS,
} from "@/types/workflow.types";
import type { Article, ArticleWorkflowStatus, WorkflowAction, Annotation, ArticleStyle, ArticleCardSize } from "@/types";
import {
  ARTICLE_STYLE_LABELS,
  ARTICLE_STYLE_DESCRIPTIONS,
  ARTICLE_CARD_SIZE_LABELS,
  ARTICLE_CARD_SIZE_DESCRIPTIONS,
} from "@/types/article.types";
import { getAvailableWorkflowActions } from "@/lib/permissions";
import {
  getAdminArticle, updateArticle,
  submitArticle, acceptReview, approveArticle, rejectArticle,
  markNeedsMedia, skipToLayout, claimLayout, submitFinal,
  publishArticle, scheduleArticle, archiveArticle,
  addAnnotation, resolveAnnotation,
} from "@/lib/api/articles";
import type { AuthUser } from "../../components/AuthContext";

const ACTION_COLORS: Record<string, string> = {
  submit: "bg-blue-600 hover:bg-blue-700",
  accept_review: "bg-teal-600 hover:bg-teal-700",
  approve: "bg-green-600 hover:bg-green-700",
  request_revision: "bg-orange-500 hover:bg-orange-600",
  resubmit: "bg-blue-600 hover:bg-blue-700",
  mark_needs_media: "bg-purple-600 hover:bg-purple-700",
  skip_to_layout: "bg-indigo-600 hover:bg-indigo-700",
  attach_media: "bg-purple-600 hover:bg-purple-700",
  claim_layout: "bg-violet-600 hover:bg-violet-700",
  submit_final: "bg-amber-500 hover:bg-amber-600",
  publish: "bg-green-600 hover:bg-green-700",
  schedule: "bg-cyan-600 hover:bg-cyan-700",
  archive: "bg-red-600 hover:bg-red-700",
};

const ACTIONS_NEEDING_NOTE: WorkflowAction[] = ["request_revision"];

function toAuthUser(user: AuthUser): Parameters<typeof getAvailableWorkflowActions>[0] {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    roleName: user.roleName,
    roleSlug: user.roleSlug,
    roleSection: user.roleSection,
    permissions: user.permissions,
    isActive: user.isActive,
    createdAt: "",
    updatedAt: "",
  };
}

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, hasPermission } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", excerpt: "", content: "", coverImage: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();

  // Workflow actions
  const [actionLoading, setActionLoading] = useState<WorkflowAction | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [noteAction, setNoteAction] = useState<WorkflowAction | null>(null);
  const [noteText, setNoteText] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  // Annotations
  const [annotationText, setAnnotationText] = useState("");
  const [annotationLoading, setAnnotationLoading] = useState(false);
  const [annotationError, setAnnotationError] = useState<string | undefined>();

  // Media picker (edit mode)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"cover" | "inline">("cover");
  const editorRef = useRef<RichTextEditorHandle>(null);

  const handleMediaSelect = (url: string, altOrFilename: string) => {
    if (pickerTarget === "cover") {
      setEditForm((p) => ({ ...p, coverImage: url }));
    } else {
      const sep = altOrFilename.includes("|carousel") ? "\n\n" : "\n";
      editorRef.current?.insertText(`![${altOrFilename}](${url})${sep}`);
    }
  };

  // Display options (publishers / layout managers)
  const [articleStyle, setArticleStyle] = useState<ArticleStyle>("standard");
  const [cardSize, setCardSize] = useState<ArticleCardSize>("auto");
  const [displaySaving, setDisplaySaving] = useState(false);
  const [displaySaved, setDisplaySaved] = useState(false);

  const load = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError(undefined);
    getAdminArticle(token, params.id)
      .then(setArticle)
      .catch(() => setFetchError("Article not found or server unreachable."))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (article) {
      setEditForm({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage ?? "",
        tags: article.tags.join(", "),
      });
      setArticleStyle(article.articleStyle ?? "standard");
      setCardSize(article.cardSize ?? "auto");
    }
  }, [article]);

  const canEdit = article && user && (
    (article.author._id === user._id && ["draft", "revision_requested"].includes(article.workflowStatus)) ||
    hasPermission("edit_articles")
  );

  const handleSaveEdit = async () => {
    if (!article) return;
    setSaving(true);
    setSaveError(undefined);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const updated = await updateArticle(article._id, {
        title: editForm.title.trim(),
        excerpt: editForm.excerpt.trim(),
        content: editForm.content.trim(),
        coverImage: editForm.coverImage.trim() || undefined,
        tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }, token);
      setArticle(updated);
      setEditMode(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const dispatchWorkflowAction = async (action: WorkflowAction, note?: string, scheduledAt?: string) => {
    if (!article) return;
    setActionLoading(action);
    setActionError(undefined);
    const token = localStorage.getItem("adminToken") ?? "";
    try {
      const id = article._id;
      switch (action) {
        case "submit": await submitArticle(token, id); break;
        case "accept_review": await acceptReview(token, id); break;
        case "approve": await approveArticle(token, id, note); break;
        case "request_revision": await rejectArticle(token, id, note ?? ""); break;
        case "resubmit": await submitArticle(token, id); break;
        case "mark_needs_media": await markNeedsMedia(token, id); break;
        case "skip_to_layout": await skipToLayout(token, id); break;
        case "claim_layout": await claimLayout(token, id); break;
        case "submit_final": await submitFinal(token, id, note); break;
        case "publish": await publishArticle(token, id); break;
        case "schedule": await scheduleArticle(token, id, scheduledAt ?? ""); break;
        case "archive": await archiveArticle(token, id); break;
      }
      setNoteAction(null);
      setNoteText("");
      setScheduleDate("");
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleActionClick = (action: WorkflowAction) => {
    if (ACTIONS_NEEDING_NOTE.includes(action)) {
      setNoteAction(action);
      return;
    }
    if (action === "schedule") {
      setNoteAction(action);
      return;
    }
    dispatchWorkflowAction(action);
  };

  const handleAddAnnotation = async () => {
    if (!article || !annotationText.trim()) return;
    setAnnotationLoading(true);
    setAnnotationError(undefined);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await addAnnotation(token, article._id, annotationText.trim());
      setAnnotationText("");
      load();
    } catch (err) {
      setAnnotationError(err instanceof Error ? err.message : "Failed to add annotation.");
    } finally {
      setAnnotationLoading(false);
    }
  };

  const handleResolveAnnotation = async (annotationId: string) => {
    if (!article) return;
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await resolveAnnotation(token, article._id, annotationId);
      load();
    } catch {
      // silent — non-critical
    }
  };

  const handleSaveDisplayOptions = async () => {
    if (!article) return;
    setDisplaySaving(true);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const updated = await updateArticle(article._id, { articleStyle, cardSize }, token);
      setArticle(updated);
      setDisplaySaved(true);
      setTimeout(() => setDisplaySaved(false), 3000);
    } catch {
      // non-critical — silent fail
    } finally {
      setDisplaySaving(false);
    }
  };

  const availableActions = article && user
    ? getAvailableWorkflowActions(toAuthUser(user) as any, article as any)
    : [];

  if (loading) {
    return (
      <DashboardLayout title="Article">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
      </DashboardLayout>
    );
  }

  if (fetchError || !article) {
    return (
      <DashboardLayout title="Article">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <AlertCircle size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">{fetchError ?? "Article not found."}</p>
          <button onClick={() => router.push("/admin/articles")} className="text-sm text-red-600 hover:underline">
            ← Back to Articles
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const status = article.workflowStatus as ArticleWorkflowStatus;

  return (
    <DashboardLayout title={article.title}>
      <div className="space-y-4">
        {/* Back + header */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push("/admin/articles")}
            className="mt-0.5 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${WORKFLOW_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
                {WORKFLOW_STATUS_LABELS[status] ?? status}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                <Tag size={10} /> {article.category}
              </span>
            </div>
            {!editMode ? (
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{article.title}</h1>
            ) : (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full text-xl font-bold border-b-2 border-red-500 focus:outline-none bg-transparent"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              by {article.author.name} · {article.author.roleSlug} ·{" "}
              {new Date(article.updatedAt).toLocaleDateString()}
              {article.publishedAt && ` · Published ${new Date(article.publishedAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {status === "layout_in_progress" && hasPermission("layout_page") && (
              <button
                onClick={() => router.push(`/admin/articles/${article._id}/layout`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              >
                <LayoutTemplate size={13} />
                Edit Layout
              </button>
            )}
            {canEdit && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit2 size={13} /> Edit
              </button>
            )}
            {editMode && (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save size={13} /> {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => { setEditMode(false); setSaveError(undefined); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X size={13} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {saveError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            <AlertCircle size={14} /> {saveError}
          </div>
        )}

        {/* Revision note banner */}
        {status === "revision_requested" && article.rejectionNote && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Revision Requested</p>
            <p className="text-sm text-orange-800">{article.rejectionNote}</p>
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Excerpt */}
            {!editMode ? (
              <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">{article.excerpt}</p>
            ) : (
              <textarea
                rows={2}
                value={editForm.excerpt}
                onChange={(e) => setEditForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Excerpt…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm italic text-gray-500 focus:ring-2 focus:ring-red-500 resize-none"
              />
            )}

            {/* Cover image */}
            {!editMode && article.coverImage && (
              <img src={article.coverImage} alt="Cover" className="rounded-lg w-full max-h-64 object-cover" />
            )}
            {editMode && (
              editForm.coverImage ? (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img src={editForm.coverImage} alt="Cover preview"
                    className="w-full max-h-48 object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")} />
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-100">
                    <p className="flex-1 text-xs text-gray-400 truncate">{editForm.coverImage}</p>
                    <button type="button"
                      onClick={() => { setPickerTarget("cover"); setPickerOpen(true); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0">Change</button>
                    <button type="button"
                      onClick={() => setEditForm((p) => ({ ...p, coverImage: "" }))}
                      className="p-0.5 text-gray-400 hover:text-red-500 shrink-0"><X size={13} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => { setPickerTarget("cover"); setPickerOpen(true); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <ImagePlus size={14} /> Choose from uploads
                  </button>
                  <input type="text" value={editForm.coverImage}
                    onChange={(e) => setEditForm((p) => ({ ...p, coverImage: e.target.value }))}
                    placeholder="or paste a URL…"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                </div>
              )
            )}

            {/* Content */}
            {!editMode ? (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{article.content}</pre>
              </div>
            ) : (
              <RichTextEditor
                ref={editorRef}
                value={editForm.content}
                onChange={(v) => setEditForm((p) => ({ ...p, content: v }))}
                onImageInsert={() => { setPickerTarget("inline"); setPickerOpen(true); }}
                rows={20}
              />
            )}

            {/* Tags + meta */}
            {!editMode && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} min read</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {article.views} views</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            )}
            {editMode && (
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="Tags (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:w-80 space-y-4 shrink-0">
            {/* Workflow Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workflow Actions</h3>
              {availableActions.length === 0 ? (
                <p className="text-xs text-gray-400">No actions available for your role at this stage.</p>
              ) : (
                <div className="space-y-2">
                  {availableActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleActionClick(action)}
                      disabled={!!actionLoading}
                      className={`w-full text-sm text-white py-2 px-3 rounded-lg transition-colors disabled:opacity-50 text-left flex items-center justify-between ${ACTION_COLORS[action] ?? "bg-gray-600 hover:bg-gray-700"}`}
                    >
                      <span>{WORKFLOW_ACTION_LABELS[action]}</span>
                      {actionLoading === action ? (
                        <span className="text-xs opacity-75">…</span>
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Note input for actions requiring a note */}
              {noteAction && ACTIONS_NEEDING_NOTE.includes(noteAction) && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={noteAction === "request_revision" ? "Describe what needs to be revised…" : "Optional note…"}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatchWorkflowAction(noteAction, noteText)}
                      disabled={!noteText.trim() || !!actionLoading}
                      className="flex-1 text-sm bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => { setNoteAction(null); setNoteText(""); }}
                      className="px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Schedule picker */}
              {noteAction === "schedule" && (
                <div className="mt-3 space-y-2">
                  <label className="block text-xs text-gray-600 font-medium">Schedule publish date & time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-cyan-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatchWorkflowAction("schedule", undefined, new Date(scheduleDate).toISOString())}
                      disabled={!scheduleDate || !!actionLoading}
                      className="flex-1 text-sm bg-cyan-600 text-white py-1.5 rounded-lg hover:bg-cyan-700 disabled:opacity-50"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => { setNoteAction(null); setScheduleDate(""); }}
                      className="px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {actionError && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {actionError}
                </p>
              )}
            </div>

            {/* Display Options — publishers and layout managers only */}
            {(hasPermission("layout_page") || hasPermission("post_to_reader_side")) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Display Options
                </h3>

                {/* Article Style */}
                <p className="text-xs font-medium text-gray-600 mb-1.5">Article Style</p>
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {(["standard", "photo_essay", "opinion", "interview"] as ArticleStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setArticleStyle(style)}
                      className={`text-left border rounded-md px-2.5 py-2 text-xs transition-all ${
                        articleStyle === style
                          ? "border-violet-500 bg-violet-50 ring-1 ring-violet-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-medium text-gray-800">{ARTICLE_STYLE_LABELS[style]}</span>
                      <span className="block text-gray-400 leading-snug mt-0.5">{ARTICLE_STYLE_DESCRIPTIONS[style]}</span>
                    </button>
                  ))}
                </div>

                {/* Card Size */}
                <p className="text-xs font-medium text-gray-600 mb-1.5">Card in Listings</p>
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {(["auto", "feature", "standard", "compact"] as ArticleCardSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCardSize(size)}
                      className={`text-left border rounded-md px-2.5 py-2 text-xs transition-all ${
                        cardSize === size
                          ? "border-violet-500 bg-violet-50 ring-1 ring-violet-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-medium text-gray-800">{ARTICLE_CARD_SIZE_LABELS[size]}</span>
                      <span className="block text-gray-400 leading-snug mt-0.5">{ARTICLE_CARD_SIZE_DESCRIPTIONS[size]}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSaveDisplayOptions}
                  disabled={displaySaving}
                  className={`w-full text-xs py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                    displaySaved
                      ? "bg-green-600 text-white"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  {displaySaved ? "✓ Saved" : displaySaving ? "Saving…" : "Save Display Options"}
                </button>
              </div>
            )}

            {/* Annotations */}
            {(hasPermission("annotate_articles") || hasPermission("suggest_edits")) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <MessageSquare size={12} /> Annotations
                </h3>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {(article.annotations ?? []).length === 0 && (
                    <p className="text-xs text-gray-400">No annotations yet.</p>
                  )}
                  {(article.annotations ?? []).map((ann: Annotation) => (
                    <div key={ann._id} className={`text-xs rounded-lg p-2 border ${ann.resolved ? "bg-gray-50 border-gray-100 opacity-60" : "bg-yellow-50 border-yellow-200"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700">{ann.authorName}</span>
                        {!ann.resolved && hasPermission("edit_articles") && (
                          <button
                            onClick={() => handleResolveAnnotation(ann._id)}
                            className="text-green-600 hover:text-green-700"
                            title="Mark resolved"
                          >
                            <CheckCircle size={12} />
                          </button>
                        )}
                      </div>
                      {ann.targetText && (
                        <p className="text-gray-400 line-clamp-1 italic mb-0.5">"{ann.targetText}"</p>
                      )}
                      <p className="text-gray-700">{ann.content}</p>
                      {ann.resolved && <span className="text-gray-400">✓ Resolved</span>}
                    </div>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="Add an annotation…"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-red-400 resize-none"
                />
                {annotationError && <p className="text-xs text-red-500 mt-1">{annotationError}</p>}
                <button
                  onClick={handleAddAnnotation}
                  disabled={!annotationText.trim() || annotationLoading}
                  className="mt-2 w-full text-xs bg-gray-800 text-white py-1.5 rounded hover:bg-gray-900 disabled:opacity-50"
                >
                  {annotationLoading ? "Adding…" : "Add Annotation"}
                </button>
              </div>
            )}

            {/* Workflow History */}
            {(article.workflowHistory ?? []).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">History</h3>
                <ol className="space-y-3">
                  {[...(article.workflowHistory ?? [])].reverse().map((h, i) => (
                    <li key={i} className="flex gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-gray-500">{WORKFLOW_STATUS_LABELS[h.fromStatus as ArticleWorkflowStatus] ?? h.fromStatus}</span>
                        {" → "}
                        <span className="font-medium text-gray-800">{WORKFLOW_STATUS_LABELS[h.toStatus as ArticleWorkflowStatus] ?? h.toStatus}</span>
                        <p className="text-gray-400">{h.changedByName} · {new Date(h.timestamp).toLocaleDateString()}</p>
                        {h.note && <p className="text-gray-500 mt-0.5 italic">"{h.note}"</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {editMode && (
        <MediaPickerModal
          token={typeof window !== "undefined" ? (localStorage.getItem("adminToken") ?? "") : ""}
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleMediaSelect}
          configMode={pickerTarget === "inline"}
        />
      )}
    </DashboardLayout>
  );
}
