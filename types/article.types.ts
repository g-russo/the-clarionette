import type { ArticleWorkflowStatus, Annotation, WorkflowHistoryEntry, MediaItem } from './workflow.types';

export type { ArticleWorkflowStatus };

export type ArticleCategory = 'news' | 'features' | 'sports' | 'literary' | 'filipino';

export type ArticleLayoutVariant =
  | 'standard'
  | 'full_width_feature'
  | 'two_column'
  | 'editorial_spread'
  | 'photo_story'
  | 'interview'
  | 'opinion';

export const ARTICLE_LAYOUT_VARIANTS: {
  id: ArticleLayoutVariant;
  label: string;
  description: string;
}[] = [
  { id: 'standard',           label: 'Standard',            description: 'Header image, title, then body text.' },
  { id: 'full_width_feature', label: 'Full-Width Feature',  description: 'Full-bleed hero image with an overlay title and a wide reading column.' },
  { id: 'two_column',         label: 'Two Column',          description: 'Content split into two equal columns for denser reading.' },
  { id: 'editorial_spread',   label: 'Editorial Spread',    description: 'Magazine-style: large lead image beside body text with pull quotes.' },
  { id: 'photo_story',        label: 'Photo Story',         description: 'Image-heavy layout where photos and captions drive the narrative.' },
  { id: 'interview',          label: 'Interview',           description: 'Q&A-formatted dialogue with styled interviewer/interviewee lines.' },
  { id: 'opinion',            label: 'Opinion',             description: 'Minimal layout with a prominent author byline and clean reading column.' },
];

export type ArticleStyle = 'standard' | 'photo_essay' | 'opinion' | 'interview';

export type ArticleCardSize = 'auto' | 'feature' | 'standard' | 'compact';

export const ARTICLE_STYLE_LABELS: Record<ArticleStyle, string> = {
  standard: 'Standard',
  photo_essay: 'Photo Essay',
  opinion: 'Opinion',
  interview: 'Interview',
};

export const ARTICLE_STYLE_DESCRIPTIONS: Record<ArticleStyle, string> = {
  standard: 'Regular article with text and inline images.',
  photo_essay: 'Image-heavy layout with prominent captions.',
  opinion: 'Editorial piece with author block and pull quotes.',
  interview: 'Q&A format with alternating question/answer styling.',
};

export const ARTICLE_CARD_SIZE_LABELS: Record<ArticleCardSize, string> = {
  auto: 'Auto',
  feature: 'Feature',
  standard: 'Standard',
  compact: 'Compact',
};

export const ARTICLE_CARD_SIZE_DESCRIPTIONS: Record<ArticleCardSize, string> = {
  auto: 'Follows the page layout setting.',
  feature: 'Always displays as a large featured card.',
  standard: 'Normal card size.',
  compact: 'Minimal row with headline only.',
};

export interface Author {
  _id: string;
  name: string;
  email: string;
  roleSlug: string;
  roleName: string;
  avatar?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  workflowStatus: ArticleWorkflowStatus;
  featured: boolean;
  author: Author;
  coverImage?: string;
  tags: string[];
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledPublishAt?: string;

  // Workflow fields
  assignedEditorId?: string;
  assignedEditorName?: string;
  rejectionNote?: string;
  annotations?: Annotation[];
  workflowHistory?: WorkflowHistoryEntry[];
  attachedMedia?: MediaItem[];
  layoutBlocks?: unknown[];
  layoutVariant?: ArticleLayoutVariant;
  articleStyle?: ArticleStyle;
  cardSize?: ArticleCardSize;
}

export interface ArticleListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: ArticleCategory;
  workflowStatus: ArticleWorkflowStatus;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  readTime: number;
  views?: number;
  createdAt: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
}

export interface ArticlesResponse {
  articles: ArticleListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt: string;
  category: ArticleCategory;
  tags?: string[];
  coverImage?: string;
  featured?: boolean;
  articleStyle?: ArticleStyle;
  cardSize?: ArticleCardSize;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  slug?: string;
}
