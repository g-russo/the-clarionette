"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import { useAuth } from "../../../components/AuthContext";
import {
  ArrowLeft, Heading2, AlignLeft, Image, Play, Quote, Minus,
  ChevronUp, ChevronDown, Trash2, Pencil, Check, X,
  Shield, AlertCircle, Save, Send, Eye, EyeOff, Layers,
} from "lucide-react";
import type { Article, MediaItem, ArticleLayoutVariant } from "@/types";
import { ARTICLE_LAYOUT_VARIANTS } from "@/types/article.types";
import { getAdminArticle, saveArticleLayout, submitFinal } from "@/lib/api/articles";

export type LayoutBlockType = "heading" | "text" | "image" | "video" | "pull_quote" | "divider";

export interface LayoutBlock {
  id: string;
  type: LayoutBlockType;
  content?: string;
  mediaId?: string;
  mediaUrl?: string;
  caption?: string;
  alignment?: "left" | "center" | "right";
}

function nanoid() {
  return Math.random().toString(36).slice(2, 10);
}

const BLOCK_LABELS: Record<LayoutBlockType, string> = {
  heading: "Heading",
  text: "Text",
  image: "Image",
  video: "Video",
  pull_quote: "Pull Quote",
  divider: "Divider",
};

const BLOCK_COLORS: Record<LayoutBlockType, string> = {
  heading: "bg-blue-100 text-blue-700",
  text: "bg-gray-100 text-gray-700",
  image: "bg-green-100 text-green-700",
  video: "bg-purple-100 text-purple-700",
  pull_quote: "bg-amber-100 text-amber-700",
  divider: "bg-slate-100 text-slate-500",
};

const PALETTE_ITEMS: Array<{ type: LayoutBlockType; icon: React.ElementType; label: string }> = [
  { type: "heading", icon: Heading2, label: "Heading" },
  { type: "text", icon: AlignLeft, label: "Text" },
  { type: "image", icon: Image, label: "Image" },
  { type: "video", icon: Play, label: "Video" },
  { type: "pull_quote", icon: Quote, label: "Pull Quote" },
  { type: "divider", icon: Minus, label: "Divider" },
];

function BlockCard({
  block,
  index,
  total,
  isEditing,
  attachedMedia,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
  onCancelEdit,
  onSave,
}: {
  block: LayoutBlock;
  index: number;
  total: number;
  isEditing: boolean;
  attachedMedia: MediaItem[];
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updated: Partial<LayoutBlock>) => void;
}) {
  const [draft, setDraft] = useState<Partial<LayoutBlock>>({
    content: block.content,
    mediaId: block.mediaId,
    mediaUrl: block.mediaUrl,
    caption: block.caption,
    alignment: block.alignment ?? "center",
  });

  useEffect(() => {
    setDraft({
      content: block.content,
      mediaId: block.mediaId,
      mediaUrl: block.mediaUrl,
      caption: block.caption,
      alignment: block.alignment ?? "center",
    });
  }, [block, isEditing]);

  const handleMediaSelect = (mediaId: string) => {
    const item = attachedMedia.find((m) => m._id === mediaId);
    setDraft((p) => ({ ...p, mediaId, mediaUrl: item?.url ?? "" }));
  };

  return (
    <div className={`rounded-lg border ${isEditing ? "border-red-300 shadow-sm" : "border-gray-200"} bg-white overflow-hidden`}>
      {/* Block header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BLOCK_COLORS[block.type]}`}>
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={index === 0} title="Move up" className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
            <ChevronUp size={14} />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} title="Move down" className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
            <ChevronDown size={14} />
          </button>
          {!isEditing && (
            <button onClick={onEdit} title="Edit block" className="p-1 text-gray-400 hover:text-blue-600">
              <Pencil size={14} />
            </button>
          )}
          {isEditing && (
            <>
              <button onClick={() => onSave(draft)} title="Save block" className="p-1 text-green-600 hover:text-green-700">
                <Check size={14} />
              </button>
              <button onClick={onCancelEdit} title="Cancel" className="p-1 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </>
          )}
          <button onClick={onDelete} title="Delete block" className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Block content */}
      <div className="p-3">
        {block.type === "divider" && !isEditing && (
          <hr className="border-gray-300" />
        )}
        {block.type === "divider" && isEditing && (
          <p className="text-xs text-gray-400 text-center">Horizontal divider — no fields to edit</p>
        )}

        {(block.type === "heading" || block.type === "text" || block.type === "pull_quote") && !isEditing && (
          <p className={`text-sm text-gray-700 ${block.type === "heading" ? "font-bold text-base" : ""} ${block.type === "pull_quote" ? "italic text-gray-500 border-l-4 border-amber-400 pl-3" : ""}`}>
            {block.content || <span className="text-gray-300">Empty {BLOCK_LABELS[block.type].toLowerCase()}</span>}
          </p>
        )}
        {(block.type === "heading" || block.type === "text" || block.type === "pull_quote") && isEditing && (
          <textarea
            rows={block.type === "text" ? 4 : 2}
            value={draft.content ?? ""}
            onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
            placeholder={`Enter ${BLOCK_LABELS[block.type].toLowerCase()}…`}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-400 resize-none"
          />
        )}

        {(block.type === "image" || block.type === "video") && !isEditing && (
          <div className={`flex flex-col ${block.alignment === "center" ? "items-center" : block.alignment === "right" ? "items-end" : "items-start"}`}>
            {block.mediaUrl ? (
              block.type === "image" ? (
                <img src={block.mediaUrl} alt={block.caption ?? ""} className="max-h-40 rounded object-cover" />
              ) : (
                <video src={block.mediaUrl} className="max-h-40 rounded" controls />
              )
            ) : (
              <div className="h-24 w-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                No media selected
              </div>
            )}
            {block.caption && <p className="text-xs text-gray-500 mt-1">{block.caption}</p>}
          </div>
        )}
        {(block.type === "image" || block.type === "video") && isEditing && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select from attached media</label>
              {attachedMedia.filter((m) => block.type === "video" ? m.type === "video" : m.type !== "video").length === 0 ? (
                <p className="text-xs text-gray-400">No {block.type === "video" ? "video" : "image"} media attached to this article.</p>
              ) : (
                <select
                  value={draft.mediaId ?? ""}
                  onChange={(e) => handleMediaSelect(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="">— Select media —</option>
                  {attachedMedia
                    .filter((m) => block.type === "video" ? m.type === "video" : m.type !== "video")
                    .map((m) => (
                      <option key={m._id} value={m._id}>{m.filename}</option>
                    ))}
                </select>
              )}
            </div>
            {draft.mediaUrl && (
              <div>
                {block.type === "image" ? (
                  <img src={draft.mediaUrl} alt="" className="max-h-24 rounded object-cover" />
                ) : (
                  <video src={draft.mediaUrl} className="max-h-24 rounded" />
                )}
              </div>
            )}
            <input
              type="text"
              value={draft.caption ?? ""}
              onChange={(e) => setDraft((p) => ({ ...p, caption: e.target.value }))}
              placeholder="Caption (optional)"
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
            {block.type === "image" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, alignment: a }))}
                      className={`flex-1 text-xs py-1 rounded border transition-colors ${draft.alignment === a ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 hover:bg-gray-50"}`}
                    >
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: LayoutBlock }) {
  if (block.type === "divider") return <hr className="my-3 border-gray-200" />;
  if (block.type === "heading") return <h2 className="text-lg font-bold text-gray-900 mt-4 mb-1">{block.content}</h2>;
  if (block.type === "text") return <p className="text-sm text-gray-700 leading-relaxed">{block.content}</p>;
  if (block.type === "pull_quote") return (
    <blockquote className="border-l-4 border-amber-400 pl-4 my-3 italic text-gray-600">{block.content}</blockquote>
  );
  if (block.type === "image" && block.mediaUrl) return (
    <figure className={`my-3 flex flex-col ${block.alignment === "center" ? "items-center" : block.alignment === "right" ? "items-end" : "items-start"}`}>
      <img src={block.mediaUrl} alt={block.caption ?? ""} className="max-h-48 rounded" />
      {block.caption && <figcaption className="text-xs text-gray-500 mt-1">{block.caption}</figcaption>}
    </figure>
  );
  if (block.type === "video" && block.mediaUrl) return (
    <div className="my-3">
      <video src={block.mediaUrl} controls className="w-full max-h-48 rounded" />
      {block.caption && <p className="text-xs text-gray-500 mt-1">{block.caption}</p>}
    </div>
  );
  return null;
}

export default function LayoutEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, hasPermission, isLoading } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [blocks, setBlocks] = useState<LayoutBlock[]>([]);
  const [layoutVariant, setLayoutVariant] = useState<ArticleLayoutVariant>("standard");
  const [showVariantPanel, setShowVariantPanel] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [saveBanner, setSaveBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const load = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    getAdminArticle(token, params.id)
      .then((a) => {
        setArticle(a);
        if (Array.isArray(a.layoutBlocks)) {
          setBlocks(a.layoutBlocks as LayoutBlock[]);
        }
        if (a.layoutVariant) setLayoutVariant(a.layoutVariant);
      })
      .catch(() => setFetchError("Could not load article."))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!isLoading && !hasPermission("layout_page")) {
      router.replace(`/admin/articles/${params.id}`);
    }
  }, [isLoading, hasPermission, router, params.id]);

  useEffect(() => {
    if (!isLoading && article && article.workflowStatus !== "layout_in_progress") {
      router.replace(`/admin/articles/${params.id}`);
    }
  }, [isLoading, article, router, params.id]);

  const addBlock = (type: LayoutBlockType) => {
    const newBlock: LayoutBlock = { id: nanoid(), type, alignment: "center" };
    setBlocks((prev) => [...prev, newBlock]);
    setEditingBlockId(newBlock.id);
  };

  const insertMediaBlock = (media: MediaItem) => {
    const type = media.type === "video" ? "video" : "image";
    const newBlock: LayoutBlock = {
      id: nanoid(), type, mediaId: media._id, mediaUrl: media.url, alignment: "center",
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const saveBlockEdit = (id: string, patch: Partial<LayoutBlock>) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, ...patch } : b));
    setEditingBlockId(null);
  };

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);
    setSaveError(undefined);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await saveArticleLayout(token, article._id, blocks, layoutVariant);
      setSaveBanner(true);
      setTimeout(() => setSaveBanner(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!article || !confirm("Submit this article for final approval?")) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await saveArticleLayout(token, article._id, blocks, layoutVariant);
      await submitFinal(token, article._id);
      router.push(`/admin/articles/${article._id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Submit failed.");
      setSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <DashboardLayout title="Layout Editor">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
      </DashboardLayout>
    );
  }

  if (!hasPermission("layout_page")) {
    return (
      <DashboardLayout title="Layout Editor">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">You need the "Layout Page" permission.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError || !article) {
    return (
      <DashboardLayout title="Layout Editor">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <AlertCircle size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">{fetchError ?? "Article not found."}</p>
        </div>
      </DashboardLayout>
    );
  }

  const attachedMedia = (article.attachedMedia ?? []) as MediaItem[];

  return (
    <DashboardLayout title={`Layout — ${article.title}`}>
      <div className="space-y-4">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/admin/articles/${article._id}`)} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1">{article.title}</h2>
              <p className="text-xs text-gray-400">Layout Editor · {blocks.length} block{blocks.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Save size={13} /> {saving ? "Saving…" : "Save Layout"}
            </button>
            <button
              onClick={handleSubmitFinal}
              disabled={submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              <Send size={13} /> {submitting ? "Submitting…" : "Submit for Approval"}
            </button>
          </div>
        </div>

        {saveBanner && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
            <Check size={14} /> Layout saved successfully.
          </div>
        )}
        {saveError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            <AlertCircle size={14} /> {saveError}
          </div>
        )}

        {showPreview ? (
          /* Preview */
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                <Layers size={11} />
                {ARTICLE_LAYOUT_VARIANTS.find((v) => v.id === layoutVariant)?.label ?? "Standard"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h1>
            <p className="text-gray-500 italic text-sm mb-4">{article.excerpt}</p>
            <hr className="border-gray-200 mb-4" />
            {blocks.map((block) => (
              <BlockPreview key={block.id} block={block} />
            ))}
            {blocks.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No blocks added yet.</p>
            )}
          </div>
        ) : (
          /* Editor */
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left — Palette + Media + Variant */}
            <div className="lg:w-60 shrink-0 space-y-4">
              {/* Layout Style */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowVariantPanel((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Layout Style</p>
                  </div>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${showVariantPanel ? "rotate-180" : ""}`} />
                </button>
                {!showVariantPanel && (
                  <div className="px-3 pb-2.5">
                    <span className="text-xs font-medium text-gray-700">
                      {ARTICLE_LAYOUT_VARIANTS.find((v) => v.id === layoutVariant)?.label ?? "Standard"}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ARTICLE_LAYOUT_VARIANTS.find((v) => v.id === layoutVariant)?.description}
                    </p>
                  </div>
                )}
                {showVariantPanel && (
                  <div className="border-t border-gray-100 max-h-72 overflow-y-auto">
                    {ARTICLE_LAYOUT_VARIANTS.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => { setLayoutVariant(variant.id); setShowVariantPanel(false); }}
                        className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors ${
                          layoutVariant === variant.id ? "bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-medium ${layoutVariant === variant.id ? "text-red-700" : "text-gray-800"}`}>
                            {variant.label}
                          </span>
                          {layoutVariant === variant.id && (
                            <Check size={12} className="text-red-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{variant.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add Block</p>
                <div className="grid grid-cols-2 gap-2">
                  {PALETTE_ITEMS.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Icon size={18} />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {attachedMedia.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Attached Media</p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
                    {attachedMedia.map((m) => (
                      <button
                        key={m._id}
                        onClick={() => insertMediaBlock(m)}
                        title={`Insert ${m.filename}`}
                        className="relative rounded overflow-hidden border border-gray-200 hover:border-red-400 aspect-square"
                      >
                        {m.type === "video" ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Play size={20} className="text-gray-500" />
                          </div>
                        ) : (
                          <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] px-1 py-0.5 truncate">
                          {m.filename}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Canvas */}
            <div className="flex-1 space-y-2">
              {blocks.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-48 text-sm text-gray-400">
                  No blocks yet — click a block type on the left to start
                </div>
              )}
              {blocks.map((block, index) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  index={index}
                  total={blocks.length}
                  isEditing={editingBlockId === block.id}
                  attachedMedia={attachedMedia}
                  onMoveUp={() => moveBlock(index, "up")}
                  onMoveDown={() => moveBlock(index, "down")}
                  onDelete={() => deleteBlock(block.id)}
                  onEdit={() => setEditingBlockId(block.id)}
                  onCancelEdit={() => setEditingBlockId(null)}
                  onSave={(patch) => saveBlockEdit(block.id, patch)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
