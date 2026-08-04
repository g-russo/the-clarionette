"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Info,
  Users,
  ChevronDown,
  ChevronUp,
  Newspaper,
  Feather,
  Trophy,
  BookOpen,
  Globe,
  Check,
} from "lucide-react";
import type { ArticleCategory } from "@/types/article.types";
import type { RoleSection } from "@/types/permissions.types";
import { ROLE_SECTION_LABELS } from "@/types/permissions.types";

const SECTION_ARTICLE_CATEGORIES: Record<RoleSection, ArticleCategory[]> = {
  news: ["news"],
  features: ["features"],
  sports: ["sports"],
  literary: ["literary", "filipino"],
  media: ["news", "features", "sports", "literary", "filipino"],
  editorial: ["news", "features", "sports", "literary", "filipino"],
  management: ["news", "features", "sports", "literary", "filipino"],
};

type CategoryMeta = {
  label: string;
  description: string;
  publicUrl: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const CATEGORY_META: Record<ArticleCategory, CategoryMeta> = {
  news: {
    label: "News",
    description: "Hard news, breaking stories, campus updates, and timely reporting.",
    publicUrl: "/news",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Newspaper,
  },
  features: {
    label: "Features",
    description: "In-depth reporting, profiles, investigative stories, and long-form pieces.",
    publicUrl: "/features",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Feather,
  },
  sports: {
    label: "Sports",
    description: "Coverage of athletic events, team updates, and sports analysis.",
    publicUrl: "/sports",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: Trophy,
  },
  literary: {
    label: "Literary",
    description: "Creative writing, poetry, fiction, and literary criticism.",
    publicUrl: "/literary",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: BookOpen,
  },
  filipino: {
    label: "Filipino",
    description: "Articles written in Filipino covering all topics for Filipino-language readers.",
    publicUrl: "/filipino",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Globe,
  },
};

const CATEGORIES: ArticleCategory[] = ["news", "features", "sports", "literary", "filipino"];
const ROLE_SECTIONS: RoleSection[] = [
  "management",
  "editorial",
  "news",
  "features",
  "sports",
  "literary",
  "media",
];

function getSectionsForCategory(category: ArticleCategory): RoleSection[] {
  return ROLE_SECTIONS.filter((s) => SECTION_ARTICLE_CATEGORIES[s].includes(category));
}

function getOwnerSection(category: ArticleCategory): RoleSection | null {
  const owners: Partial<Record<ArticleCategory, RoleSection>> = {
    news: "news",
    features: "features",
    sports: "sports",
    literary: "literary",
    filipino: "literary",
  };
  return owners[category] ?? null;
}

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState<ArticleCategory | null>(null);

  return (
    <DashboardLayout title="Categories">
      <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info size={17} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-0.5">Categories are defined in code</p>
          <p className="text-blue-700">
            The five publication categories are fixed in the codebase. To add or remove a category,
            update{" "}
            <code className="bg-blue-100 rounded px-1 text-xs">types/article.types.ts</code> and{" "}
            <code className="bg-blue-100 rounded px-1 text-xs">lib/permissions.ts</code>.
          </p>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          const ownerSection = getOwnerSection(cat);
          const isExpanded = expanded === cat;

          return (
            <div
              key={cat}
              className={`bg-white border rounded-lg overflow-hidden transition-all ${
                isExpanded ? `${meta.borderColor} shadow-sm` : "border-gray-200"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.bgColor}`}
                  >
                    <Icon size={20} className={meta.textColor} />
                  </div>
                  <a
                    href={meta.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-gray-600 font-mono transition-colors"
                  >
                    {meta.publicUrl}
                  </a>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{meta.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{meta.description}</p>

                {ownerSection && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Users size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Primary section:{" "}
                      <span className="font-medium text-gray-700">
                        {ROLE_SECTION_LABELS[ownerSection]}
                      </span>
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setExpanded(isExpanded ? null : cat)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={14} /> Hide section access
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> Show section access
                    </>
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className={`px-5 pb-5 pt-0`}>
                  <div className={`border-t ${meta.borderColor} pt-4`}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Sections with write access
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {getSectionsForCategory(cat).map((s) => (
                        <span
                          key={s}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            s === "management"
                              ? "bg-orange-100 text-orange-700"
                              : s === "editorial"
                              ? "bg-gray-100 text-gray-600"
                              : s === "media"
                              ? "bg-gray-100 text-gray-600"
                              : `${meta.bgColor} ${meta.textColor}`
                          }`}
                        >
                          {ROLE_SECTION_LABELS[s]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section coverage matrix */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Section Coverage Matrix</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Which article categories each editorial section can act on
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Section
                </th>
                {CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const Icon = meta.icon;
                  return (
                    <th
                      key={cat}
                      className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Icon size={13} />
                        {meta.label}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ROLE_SECTIONS.map((section) => (
                <tr key={section} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {ROLE_SECTION_LABELS[section]}
                  </td>
                  {CATEGORIES.map((cat) => {
                    const covered = SECTION_ARTICLE_CATEGORIES[section].includes(cat);
                    const meta = CATEGORY_META[cat];
                    return (
                      <td key={cat} className="px-5 py-3 text-center">
                        {covered ? (
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${meta.bgColor}`}
                          >
                            <Check size={13} className={meta.textColor} />
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded-full bg-gray-100" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
