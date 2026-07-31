"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import { listEvents, createEvent, updateEvent, deleteEvent } from "@/lib/api/events";
import type { MediaEvent } from "@/types/workflow.types";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
  Image,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return isoDateStr(new Date());
}

// HH:MM from a Date
function timeStr(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function formatDisplayDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// 288 options: 12:00 AM → 11:55 PM in 5-min steps
const TIME_OPTIONS = Array.from({ length: 288 }, (_, i) => {
  const totalMins = i * 5;
  const h24 = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const h12 = h24 % 12 || 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  return {
    value: `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    label: `${h12}:${String(m).padStart(2, "0")} ${ampm}`,
  };
});

// 96 options: 5 min → 8 hours in 5-min steps
const DURATION_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const mins = (i + 1) * 5;
  return { value: mins, label: formatDuration(mins) };
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  date: string;
  time: string;
  durationMinutes: number;
  description: string;
}

const BLANK_FORM: FormState = {
  name: "",
  date: todayStr(),
  time: "08:00",
  durationMinutes: 60,
  description: "",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventChip({
  event,
  canManage,
  onEdit,
  onDelete,
}: {
  event: MediaEvent;
  canManage: boolean;
  onEdit: (e: MediaEvent) => void;
  onDelete: (id: string) => void;
}) {
  const d = new Date(event.date);
  const time = formatTime12(timeStr(d));

  return (
    <div className="group relative rounded px-1.5 py-0.5 bg-red-100 border border-red-200 text-red-800 text-xs leading-tight cursor-default mb-0.5">
      <p className="font-medium truncate">{event.name}</p>
      <p className="text-red-600 opacity-80">{time} · {formatDuration(event.durationMinutes)}</p>
      {canManage && (
        <div className="absolute top-0.5 right-0.5 hidden group-hover:flex gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(event); }}
            className="p-0.5 rounded bg-white/80 hover:bg-blue-100 text-blue-600"
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(event._id); }}
            className="p-0.5 rounded bg-white/80 hover:bg-red-100 text-red-600"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { user } = useAuth();
  const canManage =
    user?.roleSection === "management" || user?.roleSection === "editorial";

  const [events, setEvents] = useState<MediaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Calendar state
  const now = new Date();
  const [displayYear, setDisplayYear] = useState(now.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(now.getMonth()); // 0-indexed

  // Form state
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadEvents = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError("");
    listEvents(token)
      .then(setEvents)
      .catch(() => setFetchError("Could not load events. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // ── Upcoming events (future only) ────────────────────────────────────────────

  const today = startOfToday();
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // ── Calendar helpers ─────────────────────────────────────────────────────────

  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  // Events keyed by YYYY-MM-DD
  const eventsByDay = new Map<string, MediaEvent[]>();
  for (const ev of upcomingEvents) {
    const key = isoDateStr(new Date(ev.date));
    if (!eventsByDay.has(key)) eventsByDay.set(key, []);
    eventsByDay.get(key)!.push(ev);
  }

  const canGoBack =
    displayYear > now.getFullYear() ||
    (displayYear === now.getFullYear() && displayMonth > now.getMonth());

  function prevMonth() {
    if (!canGoBack) return;
    if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear((y) => y - 1); }
    else setDisplayMonth((m) => m - 1);
  }
  function nextMonth() {
    if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear((y) => y + 1); }
    else setDisplayMonth((m) => m + 1);
  }

  // ── Form helpers ─────────────────────────────────────────────────────────────

  function openCreate(dateStr?: string) {
    setFormMode("create");
    setEditingId(null);
    setForm({ ...BLANK_FORM, date: dateStr ?? todayStr() });
    setFormError("");
  }

  function openEdit(ev: MediaEvent) {
    const d = new Date(ev.date);
    setFormMode("edit");
    setEditingId(ev._id);
    setForm({
      name: ev.name,
      date: isoDateStr(d),
      time: timeStr(d),
      durationMinutes: ev.durationMinutes,
      description: ev.description ?? "",
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setFormMode("create");
    setEditingId(null);
    setForm(BLANK_FORM);
    setFormError("");
  }

  // Combine date + time into ISO string
  function buildDatetime(): string {
    return `${form.date}T${form.time}:00`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Event name is required"); return; }
    setSaving(true);
    setFormError("");
    const token = localStorage.getItem("adminToken") ?? "";
    const payload = {
      name: form.name.trim(),
      date: buildDatetime(),
      durationMinutes: form.durationMinutes,
      description: form.description.trim() || undefined,
    };
    try {
      if (formMode === "create") {
        const ev = await createEvent(token, payload);
        setEvents((prev) => [...prev, ev]);
        setForm(BLANK_FORM);
      } else {
        const ev = await updateEvent(token, editingId!, payload);
        setEvents((prev) => prev.map((x) => (x._id === ev._id ? ev : x)));
        cancelForm();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("adminToken") ?? "";
    try {
      await deleteEvent(token, id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      if (editingId === id) cancelForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteConfirmId(null);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <DashboardLayout title="Events">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading events…
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout title="Events">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <AlertCircle size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">{fetchError}</p>
          <button onClick={loadEvents} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Events">
      {/* Delete confirm dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-600 mb-5">
              This will remove the event from the calendar. Media files already uploaded for this event will not be deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left: Calendar ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Month header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <button
                onClick={prevMonth}
                disabled={!canGoBack}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-base font-semibold text-gray-900">
                {MONTHS[displayMonth]} {displayYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {/* Leading empty cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] border-r border-b border-gray-100 bg-gray-50/50" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(displayYear, displayMonth, day);
                const cellStr = isoDateStr(cellDate);
                const isToday = cellStr === todayStr();
                const isPast = cellDate < today;
                const dayEvents = eventsByDay.get(cellStr) ?? [];
                const isLastCol = (firstDayOfMonth + i) % 7 === 6;

                return (
                  <div
                    key={day}
                    onClick={() => {
                      if (!isPast && canManage) openCreate(cellStr);
                    }}
                    className={`min-h-[80px] border-b border-gray-100 p-1.5 flex flex-col
                      ${isLastCol ? "" : "border-r"}
                      ${isPast ? "bg-gray-50/70" : canManage ? "hover:bg-red-50/40 cursor-pointer" : ""}
                      transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
                          ${isToday ? "bg-red-600 text-white" : isPast ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {day}
                      </span>
                      {!isPast && canManage && (
                        <Plus size={11} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                    {dayEvents.map((ev) => (
                      <EventChip
                        key={ev._id}
                        event={ev}
                        canManage={canManage}
                        onEdit={openEdit}
                        onDelete={(id) => setDeleteConfirmId(id)}
                      />
                    ))}
                  </div>
                );
              })}

              {/* Trailing empty cells to complete the last row */}
              {(() => {
                const total = firstDayOfMonth + daysInMonth;
                const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
                return Array.from({ length: trailing }).map((_, i) => (
                  <div key={`trail-${i}`} className="min-h-[80px] border-r border-b border-gray-100 bg-gray-50/50" />
                ));
              })()}
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-8 h-3 rounded bg-red-100 border border-red-200 inline-block" />
                Event
              </span>
              {canManage && (
                <span className="text-gray-400">Click a future day to add an event</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Form + Upcoming list ──────────────────────────────────── */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">

          {/* Create / Edit Form */}
          {canManage && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {formMode === "edit" ? "Edit Event" : "Add Event"}
                </h3>
                {formMode === "edit" && (
                  <button onClick={cancelForm} className="p-1 rounded hover:bg-gray-100">
                    <X size={14} className="text-gray-500" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Intramurals Opening Ceremony"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={todayStr()}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Time + Duration side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <select
                      value={form.durationMinutes}
                      onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the event…"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  ) : formMode === "edit" ? (
                    <><Pencil size={14} /> Save Changes</>
                  ) : (
                    <><Plus size={14} /> Add Event</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Upcoming Events List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Upcoming Events</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {upcomingEvents.length}
              </span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Calendar size={32} className="mb-2 text-gray-200" />
                <p className="text-sm">No upcoming events</p>
                {canManage && (
                  <p className="text-xs mt-1 text-gray-300">
                    Click a future day on the calendar to add one
                  </p>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                {upcomingEvents.map((ev) => {
                  const d = new Date(ev.date);
                  const time = formatTime12(timeStr(d));
                  const isEditing = editingId === ev._id;
                  return (
                    <li
                      key={ev._id}
                      className={`px-5 py-3.5 hover:bg-gray-50 transition-colors ${isEditing ? "bg-red-50 border-l-2 border-red-500" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{ev.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={10} />
                              {formatDisplayDate(isoDateStr(d))}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={10} />
                              {time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700 font-medium">
                              {formatDuration(ev.durationMinutes)}
                            </span>
                            {ev.mediaCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Image size={10} />
                                {ev.mediaCount}
                              </span>
                            )}
                          </div>
                          {ev.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ev.description}</p>
                          )}
                        </div>
                        {canManage && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openEdit(ev)}
                              title="Edit"
                              className="p-1.5 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(ev._id)}
                              title="Delete"
                              className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
