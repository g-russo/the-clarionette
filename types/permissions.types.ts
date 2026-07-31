export type Permission =
  | 'post_to_reader_side'
  | 'edit_articles'
  | 'create_articles'
  | 'upload_images'
  | 'select_images_for_posting'
  | 'layout_page'
  | 'suggest_edits'
  | 'annotate_articles'
  | 'schedule_posts'
  | 'oversee_all'
  | 'manage_roles'
  | 'manage_users';

export type RoleSection =
  | 'management'
  | 'editorial'
  | 'news'
  | 'features'
  | 'sports'
  | 'literary'
  | 'media';

export const PERMISSION_LABELS: Record<Permission, string> = {
  post_to_reader_side: 'Post to Reader Side',
  edit_articles: 'Edit Articles',
  create_articles: 'Create Articles',
  upload_images: 'Upload Images',
  select_images_for_posting: 'Select Images for Posting',
  layout_page: 'Layout Page',
  suggest_edits: 'Suggest Edits',
  annotate_articles: 'Annotate Articles',
  schedule_posts: 'Schedule Posts',
  oversee_all: 'Oversee All',
  manage_roles: 'Manage Roles',
  manage_users: 'Manage Users',
};

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  post_to_reader_side: 'Publish articles live to the public-facing website',
  edit_articles: 'Make direct edits to article content',
  create_articles: 'Author and submit new articles',
  upload_images: 'Upload photos or cartoons to the media library',
  select_images_for_posting: 'Choose which uploaded media is attached to articles',
  layout_page: 'Arrange and edit page layout before publishing',
  suggest_edits: 'Leave tracked-change suggestions on articles (non-authoritative)',
  annotate_articles: 'Leave editorial annotations while reviewing or editing articles',
  schedule_posts: 'Set a future publish date for approved articles',
  oversee_all: 'View all articles at every stage of the workflow',
  manage_roles: 'Create, edit, and configure role permissions',
  manage_users: 'Create users, assign roles, and deactivate accounts',
};

export const ALL_PERMISSIONS: Permission[] = [
  'post_to_reader_side',
  'edit_articles',
  'create_articles',
  'upload_images',
  'select_images_for_posting',
  'layout_page',
  'suggest_edits',
  'annotate_articles',
  'schedule_posts',
  'oversee_all',
  'manage_roles',
  'manage_users',
];

export interface Role {
  _id: string;
  name: string;
  slug: string;
  section: RoleSection;
  permissions: Permission[];
  isDefault: boolean;
  isActive: boolean;
  createdBy?: string;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  name: string;
  slug: string;
  section: RoleSection;
  permissions: Permission[];
}

export interface UpdateRoleInput {
  name?: string;
  section?: RoleSection;
  permissions?: Permission[];
  isActive?: boolean;
}

export const ROLE_SECTION_LABELS: Record<RoleSection, string> = {
  management: 'Management',
  editorial: 'Editorial',
  news: 'News',
  features: 'Features',
  sports: 'Sports',
  literary: 'Literary',
  media: 'Media',
};

/**
 * Seeded default roles with their default permission sets.
 * These are loaded into the DB on first run. Super Admin / Technical Adviser
 * can edit permissions after seeding.
 */
export const SEEDED_ROLES: Omit<Role, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Super Admin',
    slug: 'super_admin',
    section: 'management',
    isDefault: true,
    isActive: true,
    permissions: [...ALL_PERMISSIONS],
  },
  {
    name: 'Technical Adviser',
    slug: 'technical_adviser',
    section: 'management',
    isDefault: true,
    isActive: true,
    permissions: [
      'post_to_reader_side',
      'edit_articles',
      'select_images_for_posting',
      'layout_page',
      'suggest_edits',
      'annotate_articles',
      'schedule_posts',
      'oversee_all',
      'manage_roles',
      'manage_users',
    ],
  },
  {
    name: 'Editor-in-Chief',
    slug: 'editor_in_chief',
    section: 'management',
    isDefault: true,
    isActive: true,
    permissions: [
      'post_to_reader_side',
      'edit_articles',
      'select_images_for_posting',
      'layout_page',
      'suggest_edits',
      'annotate_articles',
      'schedule_posts',
      'oversee_all',
    ],
  },
  {
    name: 'Managing Editor',
    slug: 'managing_editor',
    section: 'management',
    isDefault: true,
    isActive: true,
    permissions: [
      'post_to_reader_side',
      'edit_articles',
      'select_images_for_posting',
      'layout_page',
      'suggest_edits',
      'annotate_articles',
      'schedule_posts',
      'oversee_all',
    ],
  },
  {
    name: 'Edit Page Editor',
    slug: 'edit_page_editor',
    section: 'editorial',
    isDefault: true,
    isActive: true,
    permissions: [
      'edit_articles',
      'select_images_for_posting',
      'layout_page',
      'suggest_edits',
      'annotate_articles',
    ],
  },
  {
    name: 'Assistant Edit Page Editor',
    slug: 'asst_edit_page_editor',
    section: 'editorial',
    isDefault: true,
    isActive: true,
    permissions: [
      'edit_articles',
      'select_images_for_posting',
      'layout_page',
      'suggest_edits',
      'annotate_articles',
    ],
  },
  {
    name: 'News Editor',
    slug: 'news_editor',
    section: 'news',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Assistant News Editor',
    slug: 'asst_news_editor',
    section: 'news',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'News Writer',
    slug: 'news_writer',
    section: 'news',
    isDefault: true,
    isActive: true,
    permissions: ['create_articles', 'suggest_edits'],
  },
  {
    name: 'Feature Editor',
    slug: 'feature_editor',
    section: 'features',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Assistant Feature Editor',
    slug: 'asst_feature_editor',
    section: 'features',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Feature Writer',
    slug: 'feature_writer',
    section: 'features',
    isDefault: true,
    isActive: true,
    permissions: ['create_articles', 'suggest_edits'],
  },
  {
    name: 'Photography Editor',
    slug: 'photography_editor',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images', 'select_images_for_posting'],
  },
  {
    name: 'Assistant Photography Editor',
    slug: 'asst_photography_editor',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images', 'select_images_for_posting'],
  },
  {
    name: 'Photojournalist',
    slug: 'photojournalist',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images'],
  },
  {
    name: 'Cartoon Editor',
    slug: 'cartoon_editor',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images', 'select_images_for_posting'],
  },
  {
    name: 'Assistant Cartoon Editor',
    slug: 'asst_cartoon_editor',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images', 'select_images_for_posting'],
  },
  {
    name: 'Cartoonist',
    slug: 'cartoonist',
    section: 'media',
    isDefault: true,
    isActive: true,
    permissions: ['upload_images'],
  },
  {
    name: 'Literary Editor',
    slug: 'literary_editor',
    section: 'literary',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Assistant Literary Editor',
    slug: 'asst_literary_editor',
    section: 'literary',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Literary Writer',
    slug: 'literary_writer',
    section: 'literary',
    isDefault: true,
    isActive: true,
    permissions: ['create_articles', 'suggest_edits'],
  },
  {
    name: 'Sports Editor',
    slug: 'sports_editor',
    section: 'sports',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Assistant Sports Editor',
    slug: 'asst_sports_editor',
    section: 'sports',
    isDefault: true,
    isActive: true,
    permissions: ['edit_articles', 'select_images_for_posting', 'suggest_edits', 'annotate_articles'],
  },
  {
    name: 'Sports Writer',
    slug: 'sports_writer',
    section: 'sports',
    isDefault: true,
    isActive: true,
    permissions: ['create_articles', 'suggest_edits'],
  },
];
