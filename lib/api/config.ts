export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Articles
  ARTICLES: '/articles',
  ARTICLE_BY_SLUG: (slug: string) => `/articles/${slug}`,
  ARTICLES_BY_CATEGORY: (category: string) => `/articles/category/${category}`,
  FEATURED_ARTICLES: '/articles/featured',

  // Article workflow actions
  ARTICLE_SUBMIT: (id: string) => `/articles/${id}/submit`,
  ARTICLE_ACCEPT_REVIEW: (id: string) => `/articles/${id}/accept-review`,
  ARTICLE_APPROVE: (id: string) => `/articles/${id}/approve`,
  ARTICLE_REJECT: (id: string) => `/articles/${id}/reject`,
  ARTICLE_RESUBMIT: (id: string) => `/articles/${id}/resubmit`,
  ARTICLE_MARK_NEEDS_MEDIA: (id: string) => `/articles/${id}/mark-needs-media`,
  ARTICLE_SKIP_TO_LAYOUT: (id: string) => `/articles/${id}/skip-to-layout`,
  ARTICLE_CLAIM_LAYOUT: (id: string) => `/articles/${id}/claim-layout`,
  ARTICLE_SUBMIT_FINAL: (id: string) => `/articles/${id}/submit-final`,
  ARTICLE_PUBLISH: (id: string) => `/articles/${id}/publish`,
  ARTICLE_SCHEDULE: (id: string) => `/articles/${id}/schedule`,
  ARTICLE_ARCHIVE: (id: string) => `/articles/${id}/archive`,

  // Article annotations
  ARTICLE_ANNOTATIONS: (id: string) => `/articles/${id}/annotations`,
  ARTICLE_ANNOTATION_BY_ID: (articleId: string, annotationId: string) =>
    `/articles/${articleId}/annotations/${annotationId}`,
  ARTICLE_ANNOTATION_RESOLVE: (articleId: string, annotationId: string) =>
    `/articles/${articleId}/annotations/${annotationId}/resolve`,

  // Roles
  ROLES: '/roles',
  ROLE_BY_ID: (id: string) => `/roles/${id}`,
  ROLE_DEACTIVATE: (id: string) => `/roles/${id}/deactivate`,
  ROLE_ACTIVATE: (id: string) => `/roles/${id}/activate`,

  // Users / Auth
  AUTHORS: '/authors',
  AUTHOR_BY_ID: (id: string) => `/authors/${id}`,
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_PUBLIC_PROFILE: (id: string) => `/users/${id}/public`,
  USER_DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  USER_REACTIVATE: (id: string) => `/users/${id}/reactivate`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',

  // Media
  MEDIA_UPLOAD: '/media/upload',
  MEDIA_BULK_UPLOAD: '/media/upload/bulk',
  MEDIA_LIST: '/media',
  MEDIA_BY_ID: (id: string) => `/media/${id}`,
  MEDIA_DELETE: (id: string) => `/media/${id}`,
  MEDIA_SELECT: (id: string) => `/media/${id}/select`,
  MEDIA_DESELECT: (id: string) => `/media/${id}/deselect`,

  // Events
  EVENTS: '/events',
  EVENT_BY_ID: (id: string) => `/events/${id}`,

  // Comments (admin)
  COMMENTS: '/comments',
  COMMENT_APPROVE: (id: string) => `/comments/${id}/approve`,
  COMMENT_REJECT: (id: string) => `/comments/${id}/reject`,
  COMMENT_DELETE: (id: string) => `/comments/${id}`,

  // Article layout
  ARTICLE_BY_ID: (id: string) => `/articles/${id}`,
  ARTICLE_SAVE_LAYOUT: (id: string) => `/articles/${id}/layout`,
  ARTICLE_SUBMIT_COMMENT: (articleId: string) => `/articles/${articleId}/comments`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_MARK_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATIONS_MARK_ALL_READ: '/notifications/read-all',

  // Site settings
  SETTINGS_PUBLIC: '/settings/public',
  SETTINGS: '/settings',

  // Analytics
  ANALYTICS_OVERVIEW:     '/analytics/overview',
  ANALYTICS_BY_CATEGORY:  '/analytics/by-category',
  ANALYTICS_TOP_ARTICLES: '/analytics/top-articles',
};
