"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { listMedia } from "@/lib/api/media";
import type { MediaItem } from "@/types/workflow.types";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Play,
  X,
  Image,
  Video,
  Film,
  Loader2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { API_CONFIG } from "@/lib/api/config";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  photo: <Image size={11} />,
  cartoon: <Film size={11} />,
  video: <Video size={11} />,
};

const TYPE_COLORS: Record<string, string> = {
  photo: "bg-blue-100 text-blue-700",
  cartoon: "bg-purple-100 text-purple-700",
  video: "bg-amber-100 text-amber-700",
};

function GalleryCard({
  item,
  onClick,
}: {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}) {
  const src = `${API_CONFIG.BASE_URL.replace("/api", "")}${item.url}`;
  const isVideo = item.type === "video";

  return (
    <button
      onClick={() => onClick(item)}
      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all text-left w-full"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {isVideo ? (
          <>
            <video src={src} className="w-full h-full object-cover opacity-70" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-black/80 transition-colors">
                <Play size={18} className="text-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.caption ?? item.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <span className={`absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[item.type]}`}>
          {TYPE_ICONS[item.type]}
          <span className="capitalize">{item.type}</span>
        </span>
      </div>
      <div className="p-2">
        {item.caption && (
          <p className="text-xs text-gray-700 truncate font-medium">{item.caption}</p>
        )}
        <p className="text-xs text-gray-400 truncate">
          {item.uploadedByName} &middot; {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}

function PreviewModal({
  item,
  allItems,
  onClose,
  onNavigate,
}: {
  item: MediaItem;
  allItems: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
}) {
  const src = `${API_CONFIG.BASE_URL.replace("/api", "")}${item.url}`;
  const isVideo = item.type === "video";
  const currentIdx = allItems.findIndex((m) => m._id === item._id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < allItems.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(allItems[currentIdx - 1]);
      if (e.key === "ArrowRight" && hasNext) onNavigate(allItems[currentIdx + 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, hasPrev, hasNext, allItems, currentIdx]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X size={16} />
        </button>

        {/* Nav arrows */}
        {hasPrev && (
          <button
            onClick={() => onNavigate(allItems[currentIdx - 1])}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate(allItems[currentIdx + 1])}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            ›
          </button>
        )}

        <div className="bg-black flex items-center justify-center max-h-[70vh]">
          {isVideo ? (
            <video src={src} controls autoPlay className="max-h-[70vh] w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={item.caption ?? item.filename}
              className="max-h-[70vh] w-full object-contain"
            />
          )}
        </div>
        <div className="p-4 flex items-start justify-between gap-4">
          <div>
            {item.caption && (
              <p className="text-sm font-medium text-gray-900">{item.caption}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">
              Uploaded by <span className="font-medium">{item.uploadedByName}</span>{" "}
              &middot; {new Date(item.createdAt).toLocaleDateString()}
            </p>
            {item.event && (
              <p className="text-xs text-gray-400 mt-0.5">Event: {item.event.name}</p>
            )}
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[item.type]}`}>
            {TYPE_ICONS[item.type]}
            <span className="capitalize">{item.type}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

interface EventGroup {
  key: string;
  label: string;
  date?: string;
  items: MediaItem[];
}

function EventSection({
  group,
  onItemClick,
}: {
  group: EventGroup;
  onItemClick: (item: MediaItem) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FolderOpen size={18} className="text-gray-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{group.label}</p>
            {group.date && (
              <p className="text-xs text-gray-400">
                {new Date(group.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full font-medium">
            {group.items.length} {group.items.length === 1 ? "item" : "items"}
          </span>
          {collapsed ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronUp size={16} className="text-gray-500" />}
        </div>
      </button>

      {!collapsed && (
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {group.items.map((item) => (
              <GalleryCard key={item._id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const loadData = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError("");
    listMedia(token)
      .then(setItems)
      .catch(() => setFetchError("Could not load gallery. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = items.filter((m) => {
    const matchType = filterType === "all" || m.type === filterType;
    const matchSearch =
      search === "" ||
      (m.event?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.caption ?? "").toLowerCase().includes(search.toLowerCase()) ||
      m.uploadedByName.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Group by event; ungrouped last
  const groups: EventGroup[] = [];
  const grouped = new Map<string, EventGroup>();
  const ungrouped: MediaItem[] = [];

  for (const item of filtered) {
    if (item.event) {
      const key = item.event._id;
      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          label: item.event.name,
          date: item.event.date,
          items: [],
        });
        groups.push(grouped.get(key)!);
      }
      grouped.get(key)!.items.push(item);
    } else {
      ungrouped.push(item);
    }
  }

  if (ungrouped.length > 0) {
    groups.push({ key: "__ungrouped__", label: "Uncategorised", items: ungrouped });
  }

  if (loading) {
    return (
      <DashboardLayout title="Gallery">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading gallery…
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout title="Gallery">
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
    <DashboardLayout title="Gallery">
      {preview && (
        <PreviewModal
          item={preview}
          allItems={filtered}
          onClose={() => setPreview(null)}
          onNavigate={setPreview}
        />
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">{filtered.length} items across {groups.length} group{groups.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event, caption, or uploader…"
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
        </div>

        {/* Groups */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Image size={40} className="mb-3 text-gray-300" />
            <p className="text-sm">No media in the gallery yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <EventSection key={group.key} group={group} onItemClick={setPreview} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
