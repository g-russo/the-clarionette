"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { getPublicEvents } from "@/lib/api/events";
import type { MediaEvent } from "@/types/workflow.types";
import { Calendar, Clock, AlertCircle, Loader2, CalendarDays, History } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const today = new Date();
  return d.getFullYear() === today.getFullYear()
    && d.getMonth() === today.getMonth()
    && d.getDate() === today.getDate();
}

function isTomorrow(dateStr: string): boolean {
  const d = new Date(dateStr);
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return d.getFullYear() === tom.getFullYear()
    && d.getMonth() === tom.getMonth()
    && d.getDate() === tom.getDate();
}

type MonthGroup = { key: string; label: string; events: MediaEvent[] };

function groupByMonth(events: MediaEvent[]): MonthGroup[] {
  const map = new Map<string, MediaEvent[]>();
  for (const e of events) {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return Array.from(map.entries()).map(([key, evts]) => {
    const d = new Date(evts[0].date);
    return { key, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, events: evts };
  });
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, past }: { event: MediaEvent; past: boolean }) {
  const d = new Date(event.date);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()].slice(0, 3).toUpperCase();
  const today = isToday(event.date);
  const tomorrow = isTomorrow(event.date);

  return (
    <div className={`flex gap-5 p-5 rounded-xl border transition-shadow hover:shadow-sm ${
      past ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"
    }`}>
      {/* Date badge */}
      <div className={`shrink-0 w-14 flex flex-col items-center justify-center rounded-lg py-2.5 ${
        today ? "bg-red-600 text-white"
        : past ? "bg-gray-200 text-gray-500"
        : "bg-red-50 text-red-700"
      }`}>
        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{month}</span>
        <span className="text-2xl font-bold leading-tight">{day}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className={`font-semibold text-base leading-snug ${past ? "text-gray-500" : "text-gray-900"}`}>
            {event.name}
          </h3>
          {today && (
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Today</span>
          )}
          {tomorrow && (
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Tomorrow</span>
          )}
          {past && (
            <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full border border-gray-200">Past</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-gray-400" />
            {formatTime(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-gray-400" />
            {formatDuration(event.durationMinutes)}
          </span>
        </div>

        {event.description && (
          <p className={`text-sm leading-relaxed ${past ? "text-gray-400" : "text-gray-600"}`}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "upcoming" | "all";

export default function EventsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [events, setEvents] = useState<MediaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicEvents(tab === "upcoming")
      .then(setEvents)
      .catch(() => setError("Could not load events. Please try again later."))
      .finally(() => setLoading(false));
  }, [tab]);

  const now = new Date();
  const groups = groupByMonth(events);
  const hasEvents = events.length > 0;

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <CalendarDays size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Events</h1>
              <p className="text-white/60 text-sm mt-0.5">
                What's happening at The Beacon
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setTab("upcoming")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === "upcoming"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <CalendarDays size={14} /> Upcoming
            </button>
            <button
              onClick={() => setTab("all")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === "all"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <History size={14} /> All events
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading events…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !hasEvents && (
          <div className="text-center py-20 text-gray-400">
            <CalendarDays size={52} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">
              {tab === "upcoming" ? "No upcoming events" : "No events yet"}
            </p>
            <p className="text-sm mt-1">
              {tab === "upcoming"
                ? "Check back soon — new events will appear here."
                : "Events will appear here once they are added."}
            </p>
            {tab === "upcoming" && (
              <button
                onClick={() => setTab("all")}
                className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                View all past events →
              </button>
            )}
          </div>
        )}

        {!loading && !error && hasEvents && (
          <div className="space-y-10">
            {groups.map((group) => {
              const isPastMonth =
                new Date(group.events[0].date) < new Date(now.getFullYear(), now.getMonth(), 1);
              return (
                <section key={group.key}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <span>{group.label}</span>
                    <span className="flex-1 h-px bg-gray-200" />
                  </h2>
                  <div className="space-y-3">
                    {group.events.map((e) => (
                      <EventCard
                        key={e._id}
                        event={e}
                        past={new Date(e.date) < now}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
