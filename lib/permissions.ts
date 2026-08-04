import type { Permission, RoleSection } from '@/types/permissions.types';
import type { User } from '@/types/user.types';
import type { Article } from '@/types/article.types';
import type { ArticleWorkflowStatus, WorkflowAction } from '@/types/workflow.types';

export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

export function getPermissions(user: User): Permission[] {
  return user.permissions;
}

const SECTION_ARTICLE_CATEGORIES: Record<RoleSection, string[]> = {
  news: ['news'],
  features: ['features'],
  sports: ['sports'],
  literary: ['literary', 'filipino'],
  media: ['news', 'features', 'sports', 'literary', 'filipino'],
  editorial: ['news', 'features', 'sports', 'literary', 'filipino'],
  management: ['news', 'features', 'sports', 'literary', 'filipino'],
};

/**
 * Returns true when a user is authorized to act on the given article's category.
 * Management and editorial roles can act across all sections.
 * Section editors/writers only cover their own section.
 * Media roles can see all (they work cross-section on photos/cartoons).
 */
export function canActOnArticle(user: User, article: Article): boolean {
  const allowed = SECTION_ARTICLE_CATEGORIES[user.roleSection] ?? [];
  return allowed.includes(article.category);
}

const EDITOR_SECTIONS: RoleSection[] = ['news', 'features', 'sports', 'literary'];
const MANAGEMENT_SECTIONS: RoleSection[] = ['management'];
const EDITORIAL_SECTION: RoleSection[] = ['editorial'];
const MEDIA_SECTION: RoleSection[] = ['media'];

function isSectionEditor(user: User): boolean {
  return (
    EDITOR_SECTIONS.includes(user.roleSection) &&
    user.permissions.includes('edit_articles') &&
    !user.permissions.includes('create_articles')
  );
}

function isWriter(user: User): boolean {
  return (
    EDITOR_SECTIONS.includes(user.roleSection) &&
    user.permissions.includes('create_articles')
  );
}

function isManagement(user: User): boolean {
  return MANAGEMENT_SECTIONS.includes(user.roleSection);
}

function isEditPageEditor(user: User): boolean {
  return (
    EDITORIAL_SECTION.includes(user.roleSection) &&
    user.permissions.includes('layout_page')
  );
}

function isMediaEditor(user: User): boolean {
  return (
    MEDIA_SECTION.includes(user.roleSection) &&
    user.permissions.includes('select_images_for_posting')
  );
}

/**
 * Returns the list of workflow actions the user can perform on the article
 * based on the article's current status, the user's role/section, and ownership.
 */
export function getAvailableWorkflowActions(
  user: User,
  article: Article
): WorkflowAction[] {
  const actions: WorkflowAction[] = [];
  const status: ArticleWorkflowStatus = article.workflowStatus;
  const isAuthor = article.author._id === user._id;
  const isOverseer =
    isManagement(user) || user.permissions.includes('oversee_all');
  const sectionMatch = canActOnArticle(user, article);

  switch (status) {
    case 'draft':
      if (isAuthor && (isWriter(user) || isOverseer)) actions.push('submit');
      break;

    case 'submitted':
      if (isOverseer || ((isSectionEditor(user) || isManagement(user)) && sectionMatch))
        actions.push('accept_review');
      break;

    case 'under_review':
      if (isOverseer || ((isSectionEditor(user) || isManagement(user)) && sectionMatch)) {
        actions.push('approve');
        actions.push('request_revision');
      }
      break;

    case 'revision_requested':
      if (isAuthor && (isWriter(user) || isOverseer)) actions.push('resubmit');
      break;

    case 'approved_by_editor':
      if (
        isOverseer ||
        ((isSectionEditor(user) || isEditPageEditor(user) || isManagement(user)) && sectionMatch)
      ) {
        actions.push('mark_needs_media');
        actions.push('skip_to_layout');
      }
      break;

    case 'pending_media':
      if (isMediaEditor(user) || isManagement(user))
        actions.push('attach_media');
      break;

    case 'pending_layout':
      if (isEditPageEditor(user) || isManagement(user))
        actions.push('claim_layout');
      break;

    case 'layout_in_progress':
      if (isEditPageEditor(user) || isManagement(user))
        actions.push('submit_final');
      break;

    case 'submitted_for_final_approval':
      if (isManagement(user) && user.permissions.includes('post_to_reader_side')) {
        actions.push('publish');
        if (user.permissions.includes('schedule_posts')) actions.push('schedule');
      }
      break;

    case 'published':
      if (isOverseer) actions.push('archive');
      break;

    default:
      break;
  }

  return actions;
}
