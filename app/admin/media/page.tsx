"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import {
  listMedia,
  bulkUploadMedia,
  deleteMedia as apiDeleteMedia,
} from "@/lib/api/media";
import { listEvents, createEvent } from "@/lib/api/events";
import type { MediaItem, MediaEvent } from "@/types/workflow.types";
import {
  Upload,
  Shield,
  Search,
  Trash2,
  X,
  Plus,
  Image,
  Video,
  Film,
  Play,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_CONFIG } from "@/lib/api/config";

const TYPE_LABELS: Record<string, string> = {
  photo: "Photo",
  cartoon: "Cartoon",
  video: "Video",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  photo: <Image size={12} />,
  cartoon: <Film size={12} />,
  video: <Video size={12} />,
};

const TYPE_COLORS: Record<string, string> = {
  photo: "bg-blue-100 text-blue-700",
  cartoon: "bg-purple-100 text-purple-700",
  video: "bg-amber-100 text-amber-700",
};

function MediaCard({
  item,
  canDelete,
  onDelete,
  onClick,
}: {
  item: MediaItem;
  canDelete: boolean;
  onDelete: (id: string) => void;
  onClick: (item: MediaItem) => void;
}) {
  const src = `${API_CONFIG.BASE_URL.replace("/api", "")}${item.url}`;
  const isVideo = item.type === "video";

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full aspect-square bg-gray-100 overflow-hidden block"
        onClick={() => onClick(item)}
      >
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
            <video src={src} className="w-full h-full object-cover opacity-60" muted />
            <Play size={32} className="absolute text-white drop-shadow" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={item.caption ?? item.filename} className="w-full h-full object-cover" />
        )}
      </button>

      <div className="p-2">
        <div className="flex items-center gap-1 mb-1">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[item.type]}`}>
            {TYPE_ICONS[item.type]}
            {TYPE_LABELS[item.type]}
          </span>
          {item.event && (
            <span className="inline-block px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600 truncate max-w-[80px]">
              {item.event.name}
            </span>
          )}
        </div>
        {item.caption && (
          <p className="text-xs text-gray-600 truncate">{item.caption}</p>
        )}
        <p className="text-xs text-gray-400 truncate">by {item.uploadedByName}</p>
      </div>

      {canDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
          className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

function PreviewModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const src = `${API_CONFIG.BASE_URL.replace("/api", "")}${item.url}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X size={16} />
        </button>
        <div className="bg-black flex items-center justify-center max-h-[70vh]">
          {item.type === "video" ? (
            <video src={src} controls autoPlay className="max-h-[70vh] w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={item.caption ?? item.filename} className="max-h-[70vh] w-full object-contain" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[item.type]}`}>
              {TYPE_ICONS[item.type]} {TYPE_LABELS[item.type]}
            </span>
            {item.event && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {item.event.name}
              </span>
            )}
          </div>
          {item.caption && <p className="mt-2 text-sm text-gray-700">{item.caption}</p>}
          <p className="mt-1 text-xs text-gray-400">
            Uploaded by {item.uploadedByName} &middot;{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function CreateEventInline({
  onCreated,
  onCancel,
}: {
  onCreated: (event: MediaEvent) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) { setError("Name and date are required"); return; }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const ev = await createEvent(token, { name: name.trim(), date, description: description.trim() || undefined });
      onCreated(ev);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
      <p className="text-xs font-semibold text-gray-600">New Event</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Event name" required
          className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
        />
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)} required
          className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
        />
      </div>
      <input
        type="text" value={description} onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
          {saving ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}

export default function MediaLibraryPage() {
  const { hasPermission, user: currentUser } = useAuth();
  const canUpload = hasPermission("upload_images");
  const canView = canUpload || hasPermission("select_images_for_posting");

  const [items, setItems] = useState<MediaItem[]>([]);
  const [events, setEvents] = useState<MediaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [mediaType, setMediaType] = useState<"photo" | "cartoon" | "video">("photo");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");

  // Preview
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const loadData = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError("");
    Promise.all([listMedia(token), listEvents(token)])
      .then(([mediaItems, evList]) => {
        setItems(mediaItems);
        setEvents(evList);
      })
      .catch(() => setFetchError("Could not load media. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleFilesDrop = (files: FileList | null) => {
    if (!files) return;
    setQueuedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleUpload = async () => {
    if (queuedFiles.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadErrors([]);

    const formData = new FormData();
    queuedFiles.forEach((f) => formData.append("files", f));
    formData.append("type", mediaType);
    if (caption.trim()) formData.append("caption", caption.trim());
    if (selectedEventId) formData.append("eventId", selectedEventId);

    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const result = await bulkUploadMedia(token, formData, setUploadProgress);
      setItems((prev) => [...result.mediaItems, ...prev]);
      if (result.errors?.length) setUploadErrors(result.errors);
      setQueuedFiles([]);
      setCaption("");
    } catch (err) {
      setUploadErrors([err instanceof Error ? err.message : "Upload failed"]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await apiDeleteMedia(token, id);
      setItems((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filteredItems = items.filter((m) => {
    const matchSearch =
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      (m.caption ?? "").toLowerCase().includes(search.toLowerCase()) ||
      m.uploadedByName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || m.type === filterType;
    const matchEvent =
      filterEvent === "all" ||
      (filterEvent === "none" ? !m.event : m.event?._id === filterEvent);
    return matchSearch && matchType && matchEvent;
  });

  if (!canView) {
    return (
      <DashboardLayout title="Media Library">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">
            You need upload or media selection permissions to access the media library.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Media Library">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading media…
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout title="Media Library">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <AlertCircle size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">{fetchError}</p>
          <button onClick={loadData} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Media Library">
      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {items.length} item{items.length !== 1 ? "s" : ""} &middot;{" "}
            {items.filter((m) => m.type === "photo").length} photos &middot;{" "}
            {items.filter((m) => m.type === "cartoon").length} cartoons &middot;{" "}
            {items.filter((m) => m.type === "video").length} videos
          </p>
          {canUpload && (
            <button
              onClick={() => setUploadOpen((v) => !v)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Upload size={15} />
              Upload Media
              {uploadOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {/* Upload Panel */}
        {canUpload && uploadOpen && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Bulk Upload</h3>

            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFilesDrop(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag & drop files here, or <span className="text-red-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Images (JPG, PNG, GIF, WebP) and short-form videos (MP4, MOV) — max 90s
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,video/quicktime,video/avi,video/webm"
                className="hidden"
                onChange={(e) => handleFilesDrop(e.target.files)}
              />
            </div>

            {/* Queued files */}
            {queuedFiles.length > 0 && (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {queuedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-1.5 rounded">
                    <span className="truncate flex-1 text-gray-700">{f.name}</span>
                    <span className="text-gray-400 ml-2 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                    <button
                      onClick={() => setQueuedFiles((p) => p.filter((_, j) => j !== i))}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    if (e.target.value === "__create__") {
                      setShowCreateEvent(true);
                    } else {
                      setSelectedEventId(e.target.value);
                      setShowCreateEvent(false);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                >
                  <option value="">— No event —</option>
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.name} ({new Date(ev.date).toLocaleDateString()})
                    </option>
                  ))}
                  <option value="__create__">+ Create new event…</option>
                </select>
                {showCreateEvent && (
                  <CreateEventInline
                    onCreated={(ev) => {
                      setEvents((prev) => [ev, ...prev]);
                      setSelectedEventId(ev._id);
                      setShowCreateEvent(false);
                    }}
                    onCancel={() => setShowCreateEvent(false)}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex gap-3 mt-1">
                  {(["photo", "cartoon", "video"] as const).map((t) => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mediaType"
                        value={t}
                        checked={mediaType === t}
                        onChange={() => setMediaType(t)}
                        className="accent-red-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption <span className="text-xs text-gray-400">(optional, applied to all files)</span>
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. UAAP Season 2024 opening ceremony"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Uploading & converting…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-red-700">Some files failed:</p>
                {uploadErrors.map((e, i) => (
                  <p key={i} className="text-xs text-red-600">{e}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setUploadOpen(false); setQueuedFiles([]); setUploadErrors([]); }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || queuedFiles.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload {queuedFiles.length > 0 ? `(${queuedFiles.length})` : ""}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, caption, or uploader…"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            <option value="photo">Photos</option>
            <option value="cartoon">Cartoons</option>
            <option value="video">Videos</option>
          </select>
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Events</option>
            <option value="none">No Event</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>{ev.name}</option>
            ))}
          </select>
        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Image size={40} className="mb-3 text-gray-300" />
            <p className="text-sm">No media found</p>
            {canUpload && (
              <button
                onClick={() => setUploadOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
              >
                <Plus size={14} /> Upload your first file
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredItems.map((item) => (
              <MediaCard
                key={item._id}
                item={item}
                canDelete={
                  item.uploadedBy === currentUser?._id ||
                  hasPermission("oversee_all")
                }
                onDelete={handleDelete}
                onClick={setPreview}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
