export type CommentStatus = 'pending' | 'approved' | 'rejected';

export const COMMENT_STATUS_LABELS: Record<CommentStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const COMMENT_STATUS_COLORS: Record<CommentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export interface Comment {
  _id: string;
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}
