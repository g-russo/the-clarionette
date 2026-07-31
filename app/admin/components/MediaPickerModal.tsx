"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Search, Loader2, Image as ImageIcon, AlertCircle,
  ChevronLeft, LayoutGrid, Plus,
} from "lucide-react";
import { listMedia } from "@/lib/api/media";
import { API_CONFIG } from "@/lib/api/config";
import type { MediaItem } from "@/types/workflow.types";

export interface Props {
  token: string;
  open: boolean;
  onClose: () => void;
  /** second param is raw filename (cover mode) or "alt|modifier" string (config mode) */
  onSelect: (url: string, altOrFilename: string) => void;
  /** when true: shows caption + layout step for single images, and carousel multi-select */
  configMode?: boolean;
}

const MEDIA_BASE = API_CONFIG.BASE_URL.replace("/api", "");
const fullUrl = (item: MediaItem) => `${MEDIA_BASE}${item.url}`;
const toCaption = (filename: string) =>
  filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

type FilterType = "all" | "photo" | "cartoon";
interface CarouselItem { id: string; url: string; caption: string; }

// ── Layout picker options ──────────────────────────────────────────────────────

interface IconProps { active: boolean; }

const LAYOUTS: { id: string; label: string; hint: string; Icon: (p: IconProps) => React.ReactElement }[] = [
  {
    id: "", label: "Default", hint: "Full column width",
    Icon: ({ active }) => (
      <div className="w-full px-0.5">
        <div className={`h-2 w-full rounded ${active ? "bg-red-500" : "bg-gray-300"}`} />
      </div>
    ),
  },
  {
    id: "wide", label: "Wide", hint: "Bleeds past text column",
    Icon: ({ active }) => (
      <div className="w-full overflow-hidden">
        <div className={`h-2 rounded`}
          style={{ width: "120%", marginLeft: "-10%", background: active ? "rgb(239 68 68)" : "rgb(209 213 219)" }} />
      </div>
    ),
  },
  {
    id: "left", label: "Float Left", hint: "Text wraps to the right",
    Icon: ({ active }) => (
      <div className="flex gap-1 items-start w-full h-4">
        <div className={`w-5 h-full rounded shrink-0 ${active ? "bg-red-500" : "bg-gray-300"}`} />
        <div className="flex-1 flex flex-col justify-around">
          {[1, 0.75, 0.5].map((w, i) => (
            <div key={i} className={`h-[2px] rounded-full ${active ? "bg-red-300" : "bg-gray-200"}`}
              style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "right", label: "Float Right", hint: "Text wraps to the left",
    Icon: ({ active }) => (
      <div className="flex gap-1 items-start w-full h-4">
        <div className="flex-1 flex flex-col justify-around">
          {[1, 0.75, 0.5].map((w, i) => (
            <div key={i} className={`h-[2px] rounded-full ${active ? "bg-red-300" : "bg-gray-200"}`}
              style={{ width: `${w * 100}%` }} />
          ))}
        </div>
        <div className={`w-5 h-full rounded shrink-0 ${active ? "bg-red-500" : "bg-gray-300"}`} />
      </div>
    ),
  },
  {
    id: "small", label: "Small", hint: "Centered, ~50% width",
    Icon: ({ active }) => (
      <div className="flex justify-center w-full">
        <div className={`h-2 w-1/2 rounded ${active ? "bg-red-500" : "bg-gray-300"}`} />
      </div>
    ),
  },
  {
    id: "portrait", label: "Portrait", hint: "Tall & centered (3:4)",
    Icon: ({ active }) => (
      <div className="flex justify-center w-full">
        <div className={`h-4 w-[20%] rounded ${active ? "bg-red-500" : "bg-gray-300"}`} />
      </div>
    ),
  },
];

// ── Shared layout picker ──────────────────────────────────────────────────────

function LayoutPicker({ value, onChange, compact = false }: {
  value: string;
  onChange: (id: string) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex gap-1.5 flex-wrap">
        {LAYOUTS.map(({ id, label, hint }) => {
          const active = value === id;
          return (
            <button key={id} type="button" title={hint}
              onClick={() => onChange(active ? "" : id)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                active
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {LAYOUTS.map(({ id, label, hint, Icon }) => {
        const active = value === id;
        return (
          <button key={id} type="button" title={hint}
            onClick={() => onChange(active ? "" : id)}
            className={`flex flex-col items-center gap-2 px-2 pt-2.5 pb-2 rounded-xl border-2
                        transition-all focus:outline-none ${
              active ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="w-full h-5 flex items-center">
              <Icon active={active} />
            </div>
            <span className={`text-[10.5px] font-semibold leading-none ${active ? "text-red-600" : "text-gray-500"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function MediaPickerModal({
  token, open, onClose, onSelect, configMode = false,
}: Props) {
  const [items, setItems]           = useState<MediaItem[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [query, setQuery]           = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  // non-config (cover image) selection
  const [selected, setSelected] = useState<string | null>(null);

  // config mode state
  const [carouselMode, setCarouselMode]     = useState(false);
  const [staged, setStaged]               = useState<{ url: string; filename: string } | null>(null);
  const [caption, setCaption]             = useState("");
  const [modifier, setModifier]           = useState("");
  const [carouselLayout, setCarouselLayout] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  const hasLoaded  = useRef(false);
  const captionRef = useRef<HTMLInputElement>(null);

  // Lazy-load media on first open
  useEffect(() => {
    if (!open || hasLoaded.current) return;
    hasLoaded.current = true;
    setLoading(true);
    setError(null);
    listMedia(token, { type: undefined })
      .then(data => setItems(data.filter(m => m.type === "photo" || m.type === "cartoon")))
      .catch(() => setError("Failed to load media. Check your connection."))
      .finally(() => setLoading(false));
  }, [open, token]);

  // Reset transient state on close
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setStaged(null);
      setCaption("");
      setModifier("");
      setCarouselLayout("");
      setCarouselItems([]);
      setCarouselMode(false);
    }
  }, [open]);

  // Focus caption input when staged
  useEffect(() => {
    if (staged) setTimeout(() => captionRef.current?.focus(), 60);
  }, [staged]);

  if (!open) return null;

  const filtered = items.filter(item => {
    const matchType  = typeFilter === "all" || item.type === typeFilter;
    const matchQuery = !query || item.filename.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleGridClick = (item: MediaItem) => {
    const url = fullUrl(item);

    if (!configMode) {
      setSelected(prev => prev === item._id ? null : item._id);
      return;
    }
    if (carouselMode) {
      setCarouselItems(prev =>
        prev.find(i => i.url === url)
          ? prev.filter(i => i.url !== url)
          : [...prev, { id: `${item._id}-${Date.now()}`, url, caption: toCaption(item.filename) }]
      );
      return;
    }
    setStaged({ url, filename: item.filename });
    setCaption(toCaption(item.filename));
    setModifier("");
  };

  const handleInsertSingle = () => {
    if (!staged) return;
    const altWithMod = modifier ? `${caption}|${modifier}` : caption;
    onSelect(staged.url, altWithMod);
    onClose();
  };

  const handleInsertCarousel = () => {
    const mod = carouselLayout ? `carousel-${carouselLayout}` : "carousel";
    carouselItems.forEach(ci => onSelect(ci.url, `${ci.caption}|${mod}`));
    onClose();
  };

  const handleCoverConfirm = () => {
    const item = items.find(m => m._id === selected);
    if (!item) return;
    onSelect(fullUrl(item), item.filename);
    onClose();
  };

  const isInCarousel = (item: MediaItem) =>
    carouselItems.some(i => i.url === fullUrl(item));

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            {staged && configMode ? (
              <>
                <button type="button" onClick={() => setStaged(null)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  <ChevronLeft size={15} /> Back
                </button>
                <span className="text-gray-300">·</span>
                <span className="text-sm font-semibold text-gray-900">Image Options</span>
              </>
            ) : (
              <>
                <ImageIcon size={17} className="text-red-500 shrink-0" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {carouselMode ? "Carousel Mode" : "Choose from Uploads"}
                </h2>
              </>
            )}

            {/* Carousel toggle — only in config mode, not staged */}
            {configMode && !staged && (
              <button type="button"
                onClick={() => { setCarouselMode(m => !m); setCarouselItems([]); setCarouselLayout(""); }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  carouselMode
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                }`}
              >
                <LayoutGrid size={11} />
                Carousel
              </button>
            )}
          </div>

          <button type="button" onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* ── Config Step (single image staged) ── */}
        {staged && configMode && (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col sm:flex-row min-h-0">
              {/* Preview panel */}
              <div className="sm:w-52 shrink-0 bg-gray-50 flex items-center justify-center p-5
                              border-b sm:border-b-0 sm:border-r border-gray-200">
                <img src={staged.url} alt="Preview"
                  className="rounded-xl object-cover w-full max-h-40 sm:max-h-none sm:max-h-[320px]" />
              </div>

              {/* Config fields */}
              <div className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto">
                {/* Caption */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Caption / Alt Text
                  </label>
                  <input
                    ref={captionRef}
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleInsertSingle(); }}
                    placeholder="Describe the image…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Displayed as a caption and used for screen readers. Press Enter to insert.
                  </p>
                </div>

                {/* Layout picker */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Layout
                  </label>
                  <LayoutPicker value={modifier} onChange={setModifier} />
                  {modifier && (
                    <p className="mt-2 text-xs text-gray-400">
                      {LAYOUTS.find(l => l.id === modifier)?.hint}
                    </p>
                  )}
                </div>

                {/* Insert button */}
                <button type="button" onClick={handleInsertSingle}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold
                             rounded-xl transition-colors mt-auto">
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Grid View ── */}
        {!staged && (
          <>
            {/* Filter bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
              <div className="flex gap-1">
                {(["all", "photo", "cartoon"] as FilterType[]).map(t => (
                  <button key={t} type="button" onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      typeFilter === t
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Image grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
                  <Loader2 size={26} className="animate-spin" />
                  <span className="text-sm">Loading uploads…</span>
                </div>
              )}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <AlertCircle size={26} className="text-red-400" />
                  <span className="text-sm text-red-500">{error}</span>
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                  <ImageIcon size={34} className="text-gray-300" />
                  <span className="text-sm">No images found.</span>
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {filtered.map(item => {
                    const url            = fullUrl(item);
                    const isSelSingle    = !configMode && selected === item._id;
                    const isSelCarousel  = configMode && carouselMode && isInCarousel(item);
                    const carouselIdx    = carouselMode ? carouselItems.findIndex(i => i.url === url) : -1;

                    return (
                      <button key={item._id} type="button" onClick={() => handleGridClick(item)}
                        className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all
                                    focus:outline-none ${
                          isSelSingle || isSelCarousel
                            ? "border-red-500 ring-2 ring-red-200 shadow-md"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img src={url} alt={item.filename} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 transition-colors ${
                          isSelSingle || isSelCarousel ? "bg-red-500/10" : "group-hover:bg-black/5"
                        }`} />

                        {/* Single select checkmark */}
                        {isSelSingle && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full
                                          flex items-center justify-center shadow-sm">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}

                        {/* Carousel order number */}
                        {isSelCarousel && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full
                                          flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                            {carouselIdx + 1}
                          </div>
                        )}

                        {/* "+" hint in carousel mode for unselected items */}
                        {configMode && carouselMode && !isSelCarousel && (
                          <div className="absolute inset-0 flex items-center justify-center
                                          opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-7 h-7 rounded-full bg-white/90 flex items-center
                                            justify-center shadow-sm">
                              <Plus size={14} className="text-gray-600" />
                            </div>
                          </div>
                        )}

                        {/* Filename on hover */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1.5 py-1
                                        opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{item.filename}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Carousel items panel */}
            {configMode && carouselMode && carouselItems.length > 0 && (
              <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    {carouselItems.length} image{carouselItems.length !== 1 ? "s" : ""} in carousel
                  </span>
                  <button type="button" onClick={handleInsertCarousel}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold
                               rounded-lg transition-colors">
                    Insert Carousel
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Layout
                  </span>
                  <LayoutPicker value={carouselLayout} onChange={setCarouselLayout} compact />
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {carouselItems.map((ci, idx) => (
                    <div key={ci.id} className="shrink-0 w-28 flex flex-col gap-1.5">
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={ci.url} alt={ci.caption} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 w-4 h-4 bg-black/60 rounded text-white
                                        text-[9px] font-bold flex items-center justify-center pointer-events-none">
                          {idx + 1}
                        </div>
                        <button type="button"
                          onClick={() => setCarouselItems(prev => prev.filter(i => i.id !== ci.id))}
                          className="absolute top-1 right-1 w-4 h-4 bg-black/60 hover:bg-red-500
                                     rounded flex items-center justify-center text-white transition-colors">
                          <X size={9} />
                        </button>
                      </div>
                      <input type="text" value={ci.caption}
                        onChange={e => setCarouselItems(prev =>
                          prev.map(i => i.id === ci.id ? { ...i, caption: e.target.value } : i)
                        )}
                        placeholder="Caption…"
                        className="w-full text-[11px] px-2 py-1 border border-gray-200 rounded-md
                                   focus:outline-none focus:ring-1 focus:ring-red-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer for cover image (non-config) mode */}
            {!configMode && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200
                              bg-gray-50 shrink-0">
                <span className="text-xs text-gray-400">
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                  {selected ? " · 1 selected" : ""}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg
                               hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleCoverConfirm} disabled={!selected}
                    className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg
                               disabled:opacity-40 hover:bg-red-700 disabled:cursor-not-allowed
                               transition-colors">
                    Use Image
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
