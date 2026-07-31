"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getArticleBySlug, getArticleComments, submitArticleComment, getPublicArticles } from "@/lib/api/articles";
import type { PublicComment } from "@/lib/api/articles";
import type { Article, ArticleStyle, ArticleListItem, ArticleCategory } from "@/types";
import {
  Clock, User, Tag, ArrowLeft, Calendar,
  Newspaper, Feather, Trophy, BookOpen, Globe,
  AlertCircle, Loader2, Eye, ChevronLeft, ChevronRight,
  MessageCircle, Send, CheckCircle, Camera, Palette, Video,
} from "lucide-react";
import type { MediaItem } from "@/types";

type CategoryMeta = {
  label: string;
  heroBg: string;
  accentBg: string;
  accentText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  news:     { label: "News",     heroBg: "from-blue-900 to-blue-700",     accentBg: "bg-blue-100",     accentText: "text-blue-700",   icon: Newspaper },
  features: { label: "Features", heroBg: "from-purple-900 to-purple-700", accentBg: "bg-purple-100",   accentText: "text-purple-700", icon: Feather   },
  sports:   { label: "Sports",   heroBg: "from-green-900 to-green-700",   accentBg: "bg-green-100",    accentText: "text-green-700",  icon: Trophy    },
  literary: { label: "Literary", heroBg: "from-amber-900 to-amber-700",   accentBg: "bg-amber-100",    accentText: "text-amber-700",  icon: BookOpen  },
  filipino: { label: "Filipino", heroBg: "from-red-900 to-red-700",       accentBg: "bg-red-100",      accentText: "text-red-700",    icon: Globe     },
};

const FALLBACK_META: CategoryMeta = {
  label: "Article", heroBg: "from-gray-800 to-gray-600",
  accentBg: "bg-gray-100", accentText: "text-gray-700", icon: Newspaper,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ─── Image helpers ────────────────────────────────────────────────────────────

type ImgMeta = { alt: string; mod: string; url: string };

function parseImg(para: string): ImgMeta | null {
  const m = para.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!m) return null;
  const pipe = m[1].lastIndexOf("|");
  if (pipe === -1) return { alt: m[1], mod: "", url: m[2] };
  return { alt: m[1].slice(0, pipe).trim(), mod: m[1].slice(pipe + 1).trim().toLowerCase(), url: m[2] };
}

type PNode =
  | { t: "p"; raw: string }
  | { t: "img"; alt: string; mod: string; url: string }
  | { t: "car"; imgs: { alt: string; url: string }[]; layout: string };

function buildNodes(paras: string[]): PNode[] {
  const out: PNode[] = [];
  for (const para of paras) {
    const img = parseImg(para);
    const isCarousel = img && (img.mod === "carousel" || img.mod.startsWith("carousel-"));
    if (isCarousel && img) {
      const layout = img.mod.slice(8).replace(/^-/, ""); // strip "carousel" + optional "-"
      const last = out[out.length - 1];
      if (last?.t === "car") last.imgs.push({ alt: img.alt, url: img.url });
      else out.push({ t: "car", imgs: [{ alt: img.alt, url: img.url }], layout });
    } else if (img) {
      out.push({ t: "img", ...img });
    } else {
      out.push({ t: "p", raw: para });
    }
  }
  return out;
}

// ─── Image layout component ───────────────────────────────────────────────────

function ImageFigure({ alt, mod, url }: ImgMeta) {
  const cap = alt ? <figcaption className="mt-1.5 text-center text-xs text-gray-400 leading-snug">{alt}</figcaption> : null;
  if (mod === "left") return (
    <figure className="mt-5 sm:float-left sm:mr-6 sm:mb-3 sm:mt-1 sm:w-[42%] sm:max-w-xs sm:clear-left">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover shadow-sm" />{cap}
    </figure>
  );
  if (mod === "right") return (
    <figure className="mt-5 sm:float-right sm:ml-6 sm:mb-3 sm:mt-1 sm:w-[42%] sm:max-w-xs sm:clear-right">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover shadow-sm" />{cap}
    </figure>
  );
  if (mod === "small") return (
    <figure className="mt-5 mx-auto w-2/3 sm:w-1/2 max-w-[240px]">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover shadow-sm" />{cap}
    </figure>
  );
  if (mod === "portrait") return (
    <figure className="mt-5 mx-auto w-1/2 sm:w-[36%] max-w-[200px]">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover aspect-[3/4] shadow-sm" />{cap}
    </figure>
  );
  if (mod === "wide") return (
    <figure className="mt-6 -mx-8 md:-mx-16">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover max-h-[40rem] shadow-md" />
      {alt ? <figcaption className="mt-1.5 text-center text-xs text-gray-400 mx-8 md:mx-16 leading-snug">{alt}</figcaption> : null}
    </figure>
  );
  return (
    <figure className="mt-6">
      <img src={url} alt={alt} className="rounded-xl w-full object-cover max-h-[32rem]" />{cap}
    </figure>
  );
}

// ─── Carousel component ───────────────────────────────────────────────────────

const CAROUSEL_FIGURE_CLASS: Record<string, string> = {
  wide:    "mt-6 -mx-8 md:-mx-16 select-none",
  small:   "mt-6 mx-auto w-2/3 sm:w-1/2 max-w-lg select-none",
  left:    "mt-5 sm:float-left sm:mr-6 sm:mb-3 sm:mt-1 sm:w-[55%] sm:clear-left select-none",
  right:   "mt-5 sm:float-right sm:ml-6 sm:mb-3 sm:mt-1 sm:w-[55%] sm:clear-right select-none",
  portrait:"mt-6 mx-auto w-1/2 sm:w-[36%] max-w-[200px] select-none",
};

function ImageCarousel({ imgs, layout = "" }: { imgs: { alt: string; url: string }[]; layout?: string }) {
  const [cur, setCur] = useState(0);
  if (imgs.length === 1) return <ImageFigure alt={imgs[0].alt} mod={layout} url={imgs[0].url} />;
  const prev = () => setCur(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setCur(i => (i + 1) % imgs.length);
  const figClass = CAROUSEL_FIGURE_CLASS[layout] ?? "mt-6 select-none";
  return (
    <figure className={figClass} role="region" aria-label="Image gallery">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 group">
        <div className="relative aspect-[16/10]">
          {imgs.map((img, i) => (
            <img key={i} src={img.url} alt={img.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === cur ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
          ))}
        </div>
        <button onClick={prev} aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
          <ChevronRight size={18} />
        </button>
        <span className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
          {cur + 1} / {imgs.length}
        </span>
      </div>
      <div className="flex justify-center items-center gap-1.5 mt-3">
        {imgs.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} aria-label={`Image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === cur ? "w-5 bg-gray-700" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`} />
        ))}
      </div>
      {imgs[cur].alt && <figcaption className="mt-1 text-center text-xs text-gray-400">{imgs[cur].alt}</figcaption>}
    </figure>
  );
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function ArticleBody({ content, style }: { content: string; style: ArticleStyle }) {
  const nodes = buildNodes(content.split(/\n{2,}/));

  const bodyClass =
    style === "photo_essay" ? "text-lg text-gray-700 leading-loose"
    : style === "opinion"   ? "text-gray-800 leading-relaxed"
    :                         "text-gray-700 leading-relaxed";

  const renderText = (para: string, key: number) => {
    if (style === "interview") {
      const isQ = para.trimStart().startsWith("Q:") || para.trimStart().startsWith("Q.");
      if (para.startsWith("#")) return <h2 key={key} className="text-xl font-bold text-gray-900 mt-8 mb-2">{para.replace(/^#+\s*/, "")}</h2>;
      if (isQ) return (
        <div key={key} className="bg-gray-50 border-l-4 border-gray-400 pl-4 py-2 rounded-r-lg mt-4">
          <p className="text-sm font-semibold text-gray-600 whitespace-pre-wrap">{para}</p>
        </div>
      );
      return <div key={key} className="pl-4 mt-4"><p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{para}</p></div>;
    }
    if (para.startsWith("# "))   return <h1 key={key} className="text-3xl font-bold text-gray-900 mt-10 mb-2">{para.slice(2)}</h1>;
    if (para.startsWith("## "))  return <h2 key={key} className="text-2xl font-bold text-gray-900 mt-8 mb-2">{para.slice(3)}</h2>;
    if (para.startsWith("### ")) return <h3 key={key} className="text-xl font-semibold text-gray-900 mt-6 mb-1">{para.slice(4)}</h3>;
    if (para.startsWith("> "))   return <blockquote key={key} className="border-l-4 border-red-400 pl-5 py-1 my-6 text-lg italic text-gray-600">{para.slice(2)}</blockquote>;
    if (para.trim() === "---" || para.trim() === "***") return <hr key={key} className="border-gray-200 my-8" />;
    return <p key={key} className={`mt-5 ${bodyClass} whitespace-pre-wrap`}>{para}</p>;
  };

  return (
    <div>
      {nodes.map((node, i) => {
        if (node.t === "car") return <ImageCarousel key={i} imgs={node.imgs} layout={node.layout} />;
        if (node.t === "img") return <ImageFigure key={i} alt={node.alt} mod={node.mod} url={node.url} />;
        return renderText(node.raw, i);
      })}
      <div className="clear-both" />
    </div>
  );
}

// ─── Style-specific article wrappers ─────────────────────────────────────────

function OpinionAuthorBlock({ article }: { article: Article }) {
  return (
    <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
      <Link href={`/authors/${article.author._id}`} className="shrink-0">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xl overflow-hidden hover:ring-2 hover:ring-red-400 transition-all">
          {article.author.avatar
            ? <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
            : article.author.name[0].toUpperCase()}
        </div>
      </Link>
      <div>
        <Link href={`/authors/${article.author._id}`} className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
          {article.author.name}
        </Link>
        <p className="text-sm text-gray-500">{article.author.roleName}</p>
        <p className="text-xs text-gray-400 mt-1">Opinion · {formatDate(article.publishedAt ?? article.createdAt)}</p>
      </div>
    </div>
  );
}

// ─── Credits section ──────────────────────────────────────────────────────────

const CREDIT_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  photo:   { label: "Photo",   Icon: Camera  },
  cartoon: { label: "Cartoon", Icon: Palette },
  video:   { label: "Video",   Icon: Video   },
};

function CreditsSection({ media }: { media: MediaItem[] }) {
  if (!media || media.length === 0) return null;

  // Group media by contributor, collecting their types
  const byContributor = new Map<string, { name: string; avatar?: string; position?: string; roleName?: string; types: string[] }>();
  for (const m of media) {
    const key = m.uploadedBy;
    if (!byContributor.has(key)) {
      byContributor.set(key, {
        name: m.uploadedByName,
        avatar: m.uploadedByAvatar,
        position: m.uploadedByPosition,
        roleName: m.uploadedByRoleName,
        types: [],
      });
    }
    const entry = byContributor.get(key)!;
    if (!entry.types.includes(m.type)) entry.types.push(m.type);
  }

  const contributors = Array.from(byContributor.entries());

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Credits</h3>
      <div className="flex flex-wrap gap-3">
        {contributors.map(([id, c]) => {
          const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <Link
              key={id}
              href={`/authors/${id}`}
              className="flex items-center gap-3 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl px-4 py-3 transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
                {c.avatar
                  ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{c.name}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  {c.types.map((type) => {
                    const m = CREDIT_META[type] ?? CREDIT_META.photo;
                    return (
                      <span key={type} className="flex items-center gap-1 text-xs text-gray-400">
                        <m.Icon size={10} /> {m.label}
                      </span>
                    );
                  })}
                  {(c.position || c.roleName) && (
                    <span className="text-xs text-gray-400">· {c.position ?? c.roleName}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Comment section ─────────────────────────────────────────────────────────

function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"approved" | "pending" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getArticleComments(articleId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [articleId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    try {
      const res = await submitArticleComment(articleId, {
        authorName: name.trim(),
        authorEmail: email.trim() || undefined,
        content: body.trim(),
      });
      if (res.autoApproved) {
        setComments(prev => [...prev, res.comment]);
        setSubmitResult("approved");
      } else {
        setSubmitResult("pending");
      }
      setName("");
      setEmail("");
      setBody("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
        <MessageCircle size={20} className="text-red-500" />
        Comments
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-400">({comments.length})</span>
        )}
      </h2>

      {loadingComments ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Loader2 size={16} className="animate-spin" /> Loading comments…
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-5 mb-8">
          {comments.map(c => (
            <li key={c._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {c.authorName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{c.authorName}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Leave a comment</h3>

        {submitResult === "approved" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
            <CheckCircle size={16} className="shrink-0" />
            Your comment has been published!
          </div>
        )}
        {submitResult === "pending" && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <MessageCircle size={16} className="shrink-0" />
            Your comment is under review and will appear once approved.
          </div>
        )}
        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle size={16} className="shrink-0" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email <span className="text-gray-400 font-normal">(optional, not published)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your thoughts…"
              required
              rows={4}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !name.trim() || !body.trim()}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {submitting ? "Submitting…" : "Post comment"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ─── You May Also Like sidebar ────────────────────────────────────────────────

function YouMayAlsoLike({ category, currentSlug }: { category: ArticleCategory; currentSlug: string }) {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicArticles({ category, limit: 6 })
      .then(res => setArticles(res.articles.filter(a => a.slug !== currentSlug).slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, currentSlug]);

  const meta = CATEGORY_META[category] ?? FALLBACK_META;

  if (!loading && articles.length === 0) return null;

  return (
    <div className="sticky top-6">
      <div className="mb-5 pb-3 border-b-2 border-red-600">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900">You May Also Like</h2>
      </div>
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-20 h-16 shrink-0 bg-gray-100 rounded" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
                <div className="h-2 bg-gray-100 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {articles.map(a => (
            <Link key={a._id} href={`/articles/${a.slug}`} className="group flex gap-3 py-4 first:pt-0">
              <div className="w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-100">
                {a.coverImage
                  ? <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className={`w-full h-full bg-gradient-to-br ${meta.heroBg}`} />}
              </div>
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                  {a.title}
                </h3>
                {a.publishedAt && (
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(a.publishedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ArticleReaderPage() {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    getArticleBySlug(params.slug)
      .then(setArticle)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (!article) return;
    document.title = `Beacon — ${article.title}`;
    return () => { document.title = "The Beacon"; };
  }, [article]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
          <span>Loading article…</span>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !article) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <AlertCircle size={52} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-6">This article may have been removed or the link is incorrect.</p>
          <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </PageLayout>
    );
  }

  const meta    = CATEGORY_META[article.category] ?? FALLBACK_META;
  const Icon    = meta.icon;
  const style   = article.articleStyle ?? "standard";
  const isPhotoEssay = style === "photo_essay";

  return (
    <PageLayout>
      {/* Hero */}
      {article.coverImage ? (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${meta.accentBg} ${meta.accentText} mb-3`}>
              <Icon size={12} /> {meta.label}
            </span>
            <h1 className={`font-bold text-white leading-tight ${isPhotoEssay ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"}`}>
              {article.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-r ${meta.heroBg} py-14 md:py-20`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/20 text-white`}>
                <Icon size={12} /> {meta.label}
              </span>
              {article.featured && (
                <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>
            <h1 className={`font-bold text-white leading-tight ${isPhotoEssay ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-white/75 text-lg leading-relaxed max-w-2xl">{article.excerpt}</p>
            )}
          </div>
        </div>
      )}

      {/* Article body + sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <main className="lg:col-span-8 min-w-0">
        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-gray-400" />
            <Link href={`/authors/${article.author._id}`} className="font-medium text-gray-700 hover:text-red-600 transition-colors">
              {article.author.name}
            </Link>
            {article.author.roleName && (
              <span className="text-gray-400">· {article.author.roleName}</span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            {formatDate(article.publishedAt ?? article.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            {article.readTime} min read
          </span>
          {article.views != null && (
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-gray-400" />
              {article.views.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Opinion author block */}
        {style === "opinion" && <OpinionAuthorBlock article={article} />}

        {/* Excerpt lead (non-opinion, non-photo-essay) */}
        {article.excerpt && style !== "opinion" && !article.coverImage && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-red-500 pl-5">
            {article.excerpt}
          </p>
        )}

        {/* Body */}
        <div className={`prose-container ${isPhotoEssay ? "max-w-none" : "max-w-2xl"}`}>
          <ArticleBody content={article.content} style={style} />
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-gray-200">
            <Tag size={14} className="text-gray-400 shrink-0" />
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Credits */}
        {article.attachedMedia && article.attachedMedia.length > 0 && (
          <CreditsSection media={article.attachedMedia} />
        )}

        {/* Comments */}
        <CommentSection articleId={article._id} />

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link
            href={`/${article.category}`}
            className={`inline-flex items-center gap-2 text-sm font-medium ${meta.accentText} hover:opacity-80 transition-opacity`}
          >
            <ArrowLeft size={15} />
            Back to {meta.label}
          </Link>
        </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <YouMayAlsoLike category={article.category} currentSlug={article.slug} />
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
