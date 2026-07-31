"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicAuthorProfile, type PublicAuthorProfile, type PublicAuthorArticle, type PublicMediaContribution } from "@/lib/api/users";
import {
  Loader2, AlertCircle, ArrowLeft, Calendar, Clock,
  FileText, Eye, Camera, Palette, Video, Image as ImageIcon,
} from "lucide-react";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  news:     { label: "News",     color: "bg-blue-100 text-blue-700"    },
  features: { label: "Features", color: "bg-purple-100 text-purple-700" },
  sports:   { label: "Sports",   color: "bg-green-100 text-green-700"  },
  literary: { label: "Literary", color: "bg-amber-100 text-amber-700"  },
  filipino: { label: "Filipino", color: "bg-red-100 text-red-700"      },
};

const SECTION_LABEL: Record<string, string> = {
  editorial:  "Editorial",
  news:       "News",
  features:   "Features",
  sports:     "Sports",
  literary:   "Literary",
  media:      "Media",
  management: "Management",
};

const MEDIA_TYPE_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  photo:   { label: "Photo",   Icon: Camera  },
  cartoon: { label: "Cartoon", Icon: Palette },
  video:   { label: "Video",   Icon: Video   },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function ArticleCard({ article }: { article: PublicAuthorArticle }) {
  const cat = CATEGORY_META[article.category];
  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group">
      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {cat && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
          )}
          {article.featured && (
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-red-600 transition-colors line-clamp-2">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {article.publishedAt && (
            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(article.publishedAt)}</span>
          )}
          <span className="flex items-center gap-1"><Clock size={11} />{article.readTime} min</span>
          <span className="flex items-center gap-1 ml-auto"><Eye size={11} />{article.views.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}

function MediaContributionCard({ item }: { item: PublicMediaContribution }) {
  const cat = CATEGORY_META[item.article.category];
  const typeMeta = MEDIA_TYPE_META[item.type] ?? MEDIA_TYPE_META.photo;
  const Icon = typeMeta.Icon;
  return (
    <Link
      href={`/articles/${item.article.slug}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all block"
    >
      <div className="relative h-36 bg-gray-100 overflow-hidden">
        {item.url ? (
          item.type === "video"
            ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Video size={32} className="text-white/60" />
              </div>
            )
            : <img src={item.url} alt={item.caption ?? item.article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-300" />
          </div>
        )}
        <span className="absolute top-2 left-2 flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full">
          <Icon size={10} /> {typeMeta.label}
        </span>
      </div>
      <div className="p-3">
        {cat && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${cat.color} mb-1.5 inline-block`}>
            {cat.label}
          </span>
        )}
        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
          {item.article.title}
        </p>
        {item.caption && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">"{item.caption}"</p>
        )}
        {item.article.publishedAt && (
          <p className="text-xs text-gray-400 mt-1.5">{formatDate(item.article.publishedAt)}</p>
        )}
      </div>
    </Link>
  );
}

export default function AuthorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<PublicAuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "media">("articles");

  useEffect(() => {
    if (!id) return;
    getPublicAuthorProfile(id)
      .then((data) => {
        setAuthor(data);
        // Default to media tab if they have no articles but have media contributions
        if (data.articles.length === 0 && data.mediaContributions.length > 0) {
          setActiveTab("media");
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
          <span>Loading profile…</span>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !author) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Author not found</h1>
          <p className="text-gray-500 mb-6">This profile doesn't exist or is no longer active.</p>
          <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </PageLayout>
    );
  }

  const initials = author.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const totalViews = author.articles.reduce((sum, a) => sum + a.views, 0);
  const hasMedia = author.mediaContributions.length > 0;
  const hasArticles = author.articles.length > 0;
  const totalWorks = author.articles.length + author.mediaContributions.length;

  // Tally media by type
  const mediaTally: Record<string, number> = {};
  for (const m of author.mediaContributions) {
    mediaTally[m.type] = (mediaTally[m.type] ?? 0) + 1;
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-red-600 flex items-center justify-center text-3xl font-bold text-white shrink-0 overflow-hidden shadow-xl">
              {author.avatar
                ? <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                : initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
                  {SECTION_LABEL[author.roleSection] ?? author.roleSection}
                </span>
                <span className="text-white/30">·</span>
                <span className="text-xs text-white/50">{author.roleName}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{author.name}</h1>
              {author.position && (
                <p className="text-white/60 text-sm">{author.position}</p>
              )}
              {/* Bio inline in hero for quick read */}
              {author.bio && (
                <p className="text-white/50 text-sm mt-3 max-w-xl leading-relaxed line-clamp-3">{author.bio}</p>
              )}
            </div>
          </div>

          {/* Stats bar */}
          {totalWorks > 0 && (
            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-white">{totalWorks}</p>
                <p className="text-xs text-white/50 mt-0.5">Total work{totalWorks !== 1 ? "s" : ""}</p>
              </div>
              {hasArticles && (
                <div>
                  <p className="text-2xl font-bold text-white">{author.articles.length}</p>
                  <p className="text-xs text-white/50 mt-0.5">Article{author.articles.length !== 1 ? "s" : ""} written</p>
                </div>
              )}
              {hasMedia && Object.entries(mediaTally).map(([type, count]) => {
                const m = MEDIA_TYPE_META[type] ?? MEDIA_TYPE_META.photo;
                const Icon = m.Icon;
                return (
                  <div key={type}>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
                      <Icon size={10} /> {m.label}{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
              {totalViews > 0 && (
                <div>
                  <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
                  <p className="text-xs text-white/50 mt-0.5">Article views</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Full bio */}
        {author.bio && (
          <section className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl text-base">{author.bio}</p>
          </section>
        )}

        {/* Tabs — only show if both sections have content */}
        {hasArticles && hasMedia && (
          <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "articles"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Articles
              <span className="ml-2 text-xs font-normal text-gray-400">{author.articles.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "media"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Contributions
              <span className="ml-2 text-xs font-normal text-gray-400">{author.mediaContributions.length}</span>
            </button>
          </div>
        )}

        {/* Content — articles or media based on tab/availability */}
        {hasArticles && hasMedia ? (
          /* Both exist → render the active tab */
          activeTab === "articles" ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                {author.articles.length} Published Article{author.articles.length !== 1 ? "s" : ""}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {author.articles.map((a) => <ArticleCard key={a._id} article={a} />)}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                {author.mediaContributions.length} Media Contribution{author.mediaContributions.length !== 1 ? "s" : ""}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {author.mediaContributions.map((m) => <MediaContributionCard key={m._id} item={m} />)}
              </div>
            </section>
          )
        ) : hasArticles ? (
          /* Articles only */
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              {author.articles.length} Published Article{author.articles.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {author.articles.map((a) => <ArticleCard key={a._id} article={a} />)}
            </div>
          </section>
        ) : hasMedia ? (
          /* Media contributions only */
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              {author.mediaContributions.length} Media Contribution{author.mediaContributions.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {author.mediaContributions.map((m) => <MediaContributionCard key={m._id} item={m} />)}
            </div>
          </section>
        ) : (
          /* Nothing yet */
          <div className="text-center py-16 text-gray-400">
            <FileText size={44} className="mx-auto mb-4 opacity-20" />
            <p className="text-gray-500">No published works yet</p>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
