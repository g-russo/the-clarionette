"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import { CheckCircle, Save, Info, Shield } from "lucide-react";

type PageType =
  | "homepage"
  | "news"
  | "features"
  | "sports"
  | "literary"
  | "filipino"
  | "opinions"
  | "article";

type LayoutVariant =
  | "full_grid"
  | "featured_hero"
  | "magazine"
  | "editorial_list"
  | "single_column";

interface PageDef {
  id: PageType;
  label: string;
  description: string;
  availableLayouts: LayoutVariant[];
}

interface LayoutDef {
  id: LayoutVariant;
  label: string;
  description: string;
  preview: React.ReactNode;
}

const PAGES: PageDef[] = [
  {
    id: "homepage",
    label: "Homepage",
    description: "The public-facing landing page",
    availableLayouts: ["featured_hero", "magazine", "full_grid", "editorial_list"],
  },
  {
    id: "news",
    label: "News",
    description: "/news category page",
    availableLayouts: ["full_grid", "featured_hero", "editorial_list"],
  },
  {
    id: "features",
    label: "Features",
    description: "/features category page",
    availableLayouts: ["full_grid", "featured_hero", "magazine", "editorial_list"],
  },
  {
    id: "sports",
    label: "Sports",
    description: "/sports category page",
    availableLayouts: ["full_grid", "featured_hero", "editorial_list"],
  },
  {
    id: "literary",
    label: "Literary",
    description: "/literary category page",
    availableLayouts: ["full_grid", "single_column", "editorial_list"],
  },
  {
    id: "filipino",
    label: "Filipino",
    description: "/filipino category page",
    availableLayouts: ["full_grid", "featured_hero", "editorial_list"],
  },
  {
    id: "opinions",
    label: "Opinions",
    description: "/opinions reader page",
    availableLayouts: ["editorial_list", "featured_hero", "full_grid", "single_column"],
  },
  {
    id: "article",
    label: "Article Detail",
    description: "Individual article reader page",
    availableLayouts: ["single_column", "magazine"],
  },
];

// Visual preview components — small box diagrams using divs

function FullGridPreview() {
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-3 gap-1.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-300 rounded h-10" />
        ))}
      </div>
    </div>
  );
}

function FeaturedHeroPreview() {
  return (
    <div className="space-y-1.5">
      <div className="bg-gray-400 rounded h-14 w-full" />
      <div className="grid grid-cols-3 gap-1.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-300 rounded h-10" />
        ))}
      </div>
    </div>
  );
}

function MagazinePreview() {
  return (
    <div className="flex gap-1.5">
      <div className="flex-1 space-y-1.5">
        <div className="bg-gray-400 rounded h-[5.5rem]" />
      </div>
      <div className="w-1/3 space-y-1.5">
        <div className="bg-gray-300 rounded h-[1.6rem]" />
        <div className="bg-gray-300 rounded h-[1.6rem]" />
        <div className="bg-gray-300 rounded h-[1.6rem]" />
      </div>
    </div>
  );
}

function EditorialListPreview() {
  return (
    <div className="space-y-1.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-1.5 items-center">
          <div className="bg-gray-300 rounded w-12 h-8 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="bg-gray-400 rounded h-2.5" />
            <div className="bg-gray-200 rounded h-2 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleColumnPreview() {
  return (
    <div className="flex justify-center">
      <div className="w-3/4 space-y-1.5">
        <div className="bg-gray-400 rounded h-12" />
        <div className="space-y-1">
          <div className="bg-gray-200 rounded h-2" />
          <div className="bg-gray-200 rounded h-2" />
          <div className="bg-gray-200 rounded h-2 w-5/6" />
        </div>
        <div className="bg-gray-300 rounded h-14" />
        <div className="space-y-1">
          <div className="bg-gray-200 rounded h-2" />
          <div className="bg-gray-200 rounded h-2" />
        </div>
      </div>
    </div>
  );
}

const LAYOUTS: LayoutDef[] = [
  {
    id: "full_grid",
    label: "Full Grid",
    description: "Equal-size article cards arranged in a responsive grid.",
    preview: <FullGridPreview />,
  },
  {
    id: "featured_hero",
    label: "Featured Hero",
    description: "One large featured article at the top, followed by a card grid.",
    preview: <FeaturedHeroPreview />,
  },
  {
    id: "magazine",
    label: "Magazine",
    description: "A large lead story with a sidebar of smaller articles beside it.",
    preview: <MagazinePreview />,
  },
  {
    id: "editorial_list",
    label: "Editorial List",
    description: "Text-focused horizontal rows with thumbnails — good for quick scanning.",
    preview: <EditorialListPreview />,
  },
  {
    id: "single_column",
    label: "Single Column",
    description: "Centered single-column layout — ideal for literary or long-form reads.",
    preview: <SingleColumnPreview />,
  },
];

const LAYOUT_MAP: Record<LayoutVariant, LayoutDef> = Object.fromEntries(
  LAYOUTS.map((l) => [l.id, l])
) as Record<LayoutVariant, LayoutDef>;

type Selections = Partial<Record<PageType, LayoutVariant>>;

const DEFAULTS: Selections = {
  homepage: "featured_hero",
  news: "full_grid",
  features: "magazine",
  sports: "full_grid",
  literary: "single_column",
  filipino: "full_grid",
  opinions: "editorial_list",
  article: "single_column",
};

function SavedBanner({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg mb-6">
      <CheckCircle size={16} />
      Layout preferences saved.
    </div>
  );
}

export default function PageLayoutsPage() {
  const { hasPermission } = useAuth();
  const [selections, setSelections] = useState<Selections>(DEFAULTS);
  const [activePage, setActivePage] = useState<PageType>("homepage");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/layout-settings")
      .then((r) => r.json())
      .then((data) => setSelections({ ...DEFAULTS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!hasPermission("layout_page")) {
    return (
      <DashboardLayout title="Page Layouts">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Shield size={48} className="text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Access Restricted</h3>
          <p className="text-sm text-gray-500 mt-1">
            Only layout managers can configure page layouts.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Page Layouts">
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
      </DashboardLayout>
    );
  }

  const currentPage = PAGES.find((p) => p.id === activePage)!;
  const currentSelection = selections[activePage];

  function select(variant: LayoutVariant) {
    setSelections((prev) => ({ ...prev, [activePage]: variant }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/layout-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selections),
      });
      setSaved(true);
    } catch {
      // silent — show no error for now
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Page Layouts">
      <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info size={17} className="text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Choose a layout variety for each public-facing page. Selections are saved as layout
          preferences. Your frontend templates must read these settings to render the chosen layout.
        </p>
      </div>

      {saved && <SavedBanner onDismiss={() => setSaved(false)} />}

      <div className="flex gap-6 items-start">
        {/* Page selector */}
        <div className="w-52 shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pages</p>
          </div>
          <ul className="py-1">
            {PAGES.map((page) => {
              const sel = selections[page.id];
              const isActive = activePage === page.id;
              return (
                <li key={page.id}>
                  <button
                    onClick={() => setActivePage(page.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block">{page.label}</span>
                    {sel && (
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {LAYOUT_MAP[sel]?.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Layout variant picker */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900">{currentPage.label}</h2>
            <p className="text-sm text-gray-500">{currentPage.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentPage.availableLayouts.map((variantId) => {
              const layout = LAYOUT_MAP[variantId];
              const isSelected = currentSelection === variantId;

              return (
                <button
                  key={variantId}
                  onClick={() => select(variantId)}
                  className={`text-left border rounded-lg p-4 transition-all ${
                    isSelected
                      ? "border-red-500 ring-2 ring-red-200 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Visual preview */}
                  <div
                    className={`rounded-md p-3 mb-3 ${
                      isSelected ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {layout.preview}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{layout.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{layout.description}</p>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        <CheckCircle size={11} />
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current selection summary */}
          {currentSelection && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{currentPage.label}</span> will use the{" "}
                <span className="font-medium text-gray-900">
                  {LAYOUT_MAP[currentSelection]?.label}
                </span>{" "}
                layout.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All-pages summary + save */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Layout Summary</h2>
            <p className="text-sm text-gray-500 mt-0.5">Current selections across all pages</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Saving…" : "Save All Layouts"}
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {PAGES.map((page) => {
            const sel = selections[page.id];
            const layout = sel ? LAYOUT_MAP[sel] : null;
            return (
              <div
                key={page.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
              >
                <div>
                  <span className="text-sm font-medium text-gray-800">{page.label}</span>
                  <span className="ml-2 text-xs text-gray-400">{page.description}</span>
                </div>
                {layout ? (
                  <span className="text-sm font-medium text-gray-700">{layout.label}</span>
                ) : (
                  <span className="text-xs text-gray-400 italic">Not set</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
