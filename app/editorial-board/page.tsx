"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicStaff } from "@/lib/api/users";
import type { PublicStaffMember } from "@/lib/api/users";
import { Users, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";

const SECTION_ORDER = [
  "editorial", "news", "features", "sports",
  "literary", "media", "opinions", "filipino", "adviser",
];

const SECTION_LABELS: Record<string, string> = {
  editorial: "Editorial",
  news:      "News",
  features:  "Features",
  sports:    "Sports",
  literary:  "Literary & Filipino",
  media:     "Media",
  opinions:  "Opinions",
  filipino:  "Filipino",
  adviser:   "Technical Adviser",
};

// Only Super Admin stays fully hidden
const HIDDEN_SECTIONS = new Set(["management"]);

function editorialTier(roleName: string): number {
  const n = roleName.toLowerCase();
  if (n.includes("editor-in-chief") || n.includes("editor in chief")) return 0;
  if (n.includes("managing editor")) return 1;
  if (n.includes("associate editor")) return 2;
  return 3; // section editors
}

function displaySectionFor(member: PublicStaffMember): string | null {
  const n = member.roleName.toLowerCase();
  // Technical Adviser surfaces at the bottom regardless of DB section
  if (n.includes("technical adviser") || n.includes("technical advisor")) return "adviser";
  // All editor roles go to the editorial section (must be checked before management hidden-check)
  if (n.includes("editor")) return "editorial";
  if (HIDDEN_SECTIONS.has(member.roleSection)) return null;
  return member.roleSection;
}

function groupBySection(
  staff: PublicStaffMember[]
): { section: string; label: string; members: PublicStaffMember[] }[] {
  const map = new Map<string, PublicStaffMember[]>();
  for (const m of staff) {
    const section = displaySectionFor(m);
    if (!section) continue;
    if (!map.has(section)) map.set(section, []);
    map.get(section)!.push(m);
  }
  const known = SECTION_ORDER.filter((s) => map.has(s));
  const unknown = [...map.keys()].filter((s) => !SECTION_ORDER.includes(s)).sort();
  return [...known, ...unknown].map((section) => ({
    section,
    label: SECTION_LABELS[section] ?? section.charAt(0).toUpperCase() + section.slice(1),
    members: map.get(section)!,
  }));
}

function MemberCard({ member, large = false }: { member: PublicStaffMember; large?: boolean }) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/authors/${member._id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-red-200 transition-all block"
    >
      <div
        className={`${large ? "h-64" : "h-48"} bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center overflow-hidden relative`}
      >
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`${large ? "text-5xl" : "text-4xl"} font-bold text-white/80`}>
            {initials}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
          {member.name}
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </h3>
        <p className="text-red-600 font-semibold text-sm mb-1">
          {member.position || member.roleName}
        </p>
        {member.bio && (
          <p className="text-gray-500 text-sm leading-relaxed mt-2 line-clamp-3">{member.bio}</p>
        )}
      </div>
    </Link>
  );
}

const TIER_LABELS: Record<number, string> = {
  0: "Editor-in-Chief",
  1: "Managing Editor",
  2: "Associate Editor",
  3: "Section Editors",
};

function EditorialSection({ members }: { members: PublicStaffMember[] }) {
  const tiers = [0, 1, 2, 3]
    .map((t) => ({ tier: t, members: members.filter((m) => editorialTier(m.roleName) === t) }))
    .filter((t) => t.members.length > 0);

  return (
    <div className="space-y-10">
      {tiers.map(({ tier, members }) => (
        <div key={tier}>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">
            {TIER_LABELS[tier]}
          </p>
          <div
            className={
              tier === 0
                ? "flex justify-center"
                : tier <= 2
                ? "flex flex-wrap justify-center gap-5"
                : "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            }
          >
            {members.map((m) => (
              <div key={m._id} className={tier <= 2 ? "w-full max-w-xs" : undefined}>
                <MemberCard member={m} large={tier === 0} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EditorialBoardPage() {
  const [staff, setStaff] = useState<PublicStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicStaff()
      .then(setStaff)
      .catch(() => setError("Could not load the editorial board. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const groups = groupBySection(staff);

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Editorial Board
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team behind The Beacon, committed to delivering
            quality journalism and fostering student voices at Harrow Hill High School.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
            <span>Loading staff…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 mb-8">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && staff.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Users size={52} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">No staff members found</p>
            <p className="text-sm mt-1">
              Staff will appear here once accounts are created in the admin panel.
            </p>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="space-y-12 mb-14">
            {groups.map(({ section, label, members }) => (
              <section key={section}>
                {/* Dashed separator before Technical Adviser */}
                {section === "adviser" && (
                  <div className="border-t border-dashed border-gray-200 mb-12" />
                )}

                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{label}</h2>
                  <span className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {section === "editorial" ? (
                  <EditorialSection members={members} />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {members.map((m) => (
                      <MemberCard key={m._id} member={m} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Join Us */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 sm:p-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join Our Team</h2>
          <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed text-white/85">
            Interested in becoming part of The Beacon? We're always looking for
            passionate student writers, photographers, and editors.
          </p>
          <a
            href="mailto:thebeacon@harrowhill.edu"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Mail size={18} /> Contact Us
          </a>
        </div>
      </main>
    </PageLayout>
  );
}
