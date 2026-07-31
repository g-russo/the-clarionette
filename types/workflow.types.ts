export type ArticleWorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'revision_requested'
  | 'approved_by_editor'
  | 'pending_media'
  | 'pending_layout'
  | 'layout_in_progress'
  | 'submitted_for_final_approval'
  | 'scheduled'
  | 'published'
  | 'archived';

export const WORKFLOW_STATUS_LABELS: Record<ArticleWorkflowStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  revision_requested: 'Revision Requested',
  approved_by_editor: 'Approved by Editor',
  pending_media: 'Pending Media',
  pending_layout: 'Pending Layout',
  layout_in_progress: 'Layout in Progress',
  submitted_for_final_approval: 'Pending Final Approval',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

export const WORKFLOW_STATUS_COLORS: Record<ArticleWorkflowStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  revision_requested: 'bg-orange-100 text-orange-700',
  approved_by_editor: 'bg-teal-100 text-teal-700',
  pending_media: 'bg-purple-100 text-purple-700',
  pending_layout: 'bg-indigo-100 text-indigo-700',
  layout_in_progress: 'bg-violet-100 text-violet-700',
  submitted_for_final_approval: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-cyan-100 text-cyan-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
};

export type WorkflowAction =
  | 'submit'
  | 'accept_review'
  | 'request_revision'
  | 'approve'
  | 'resubmit'
  | 'mark_needs_media'
  | 'skip_to_layout'
  | 'attach_media'
  | 'claim_layout'
  | 'submit_final'
  | 'publish'
  | 'schedule'
  | 'archive';

export const WORKFLOW_ACTION_LABELS: Record<WorkflowAction, string> = {
  submit: 'Submit to Editor',
  accept_review: 'Accept for Review',
  request_revision: 'Request Revision',
  approve: 'Approve',
  resubmit: 'Resubmit',
  mark_needs_media: 'Mark as Needs Media',
  skip_to_layout: 'Send to Layout (No Media)',
  attach_media: 'Attach Selected Media',
  claim_layout: 'Start Layout',
  submit_final: 'Submit for Final Approval',
  publish: 'Publish Now',
  schedule: 'Schedule Publish',
  archive: 'Archive',
};

export interface Annotation {
  _id: string;
  authorId: string;
  authorName: string;
  content: string;
  targetText?: string;
  resolved: boolean;
  createdAt: string;
}

export interface WorkflowHistoryEntry {
  fromStatus: ArticleWorkflowStatus;
  toStatus: ArticleWorkflowStatus;
  changedBy: string;
  changedByName: string;
  note?: string;
  timestamp: string;
}

export interface MediaEvent {
  _id: string;
  name: string;
  date: string;
  durationMinutes: number;
  description?: string;
  createdById: string;
  createdByName: string;
  mediaCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  type: 'photo' | 'cartoon' | 'video';
  event?: { _id: string; name: string; date: string };
  uploadedBy: string;
  uploadedByName: string;
  uploadedByAvatar?: string;
  uploadedByPosition?: string;
  uploadedByRoleName?: string;
  caption?: string;
  selectedForArticleId?: string;
  createdAt: string;
}

export interface UploadMediaInput {
  type: 'photo' | 'cartoon' | 'video';
  caption?: string;
  eventId?: string;
}

export interface ScheduleInput {
  scheduledPublishAt: string;
}
