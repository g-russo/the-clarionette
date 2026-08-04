// Central routing configuration for The Beacon
export interface RouteConfig {
  path: string;
  label: string;
  description?: string;
  hideFromNav?: boolean;
}

export interface RouteSection {
  title: string;
  routes: RouteConfig[];
}

// Main navigation routes
export const mainRoutes: RouteConfig[] = [
  {
    path: "/",
    label: "Home",
    description: "Main homepage with latest news and featured articles"
  },
  {
    path: "/news",
    label: "News",
    description: "Latest news and current events"
  },
  {
    path: "/features",
    label: "Features",
    description: "In-depth feature articles and analysis"
  },
  {
    path: "/sports",
    label: "Sports",
    description: "Sports news and coverage"
  },
  {
    path: "/literary",
    label: "Literary",
    description: "Literary works and creative writing"
  },
  {
    path: "/filipino",
    label: "Filipino",
    description: "Filipino language content and cultural articles"
  },
  {
    path: "/opinions",
    label: "Opinions",
    description: "Opinion pieces and editorials from our staff"
  },
  {
    path: "/events",
    label: "Events",
    description: "Upcoming and past school events"
  },
  {
    path: "/about",
    label: "About",
    description: "History, mission, and contact info"
  },
  {
    path: "/editorial-board",
    label: "Editorial Board",
    description: "Meet our editorial team"
  },
  {
    path: "/articles",
    label: "Article",
    description: "Individual article detail pages",
    hideFromNav: true,
  },
  {
    path: "/search",
    label: "Search",
    description: "Article search results",
    hideFromNav: true,
  },
  {
    path: "/authors",
    label: "Author",
    description: "Individual author profile pages",
    hideFromNav: true,
  },
  {
    path: "/tags",
    label: "Tag",
    description: "Articles filtered by tag",
    hideFromNav: true,
  },
  {
    path: "/privacy-policy",
    label: "Privacy Policy",
    description: "Privacy policy and data handling",
    hideFromNav: true,
  },
  {
    path: "/terms",
    label: "Terms of Service",
    description: "Terms and conditions for using this site",
    hideFromNav: true,
  },
  {
    path: "/accessibility",
    label: "Accessibility",
    description: "Accessibility statement and features",
    hideFromNav: true,
  },
  {
    path: "/sitemap",
    label: "Sitemap",
    description: "Complete map of site pages",
    hideFromNav: true,
  },
  {
    path: "/submit",
    label: "Submit a Story",
    description: "Submit a story tip or contribution",
    hideFromNav: true,
  },
];

// Admin routes
export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    label: "Admin Login",
    description: "Administrative login page"
  },
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    description: "Administrative dashboard"
  },
  {
    path: "/admin/analytics",
    label: "Analytics",
    description: "Site analytics and statistics"
  },
  {
    path: "/admin/articles",
    label: "Articles",
    description: "Article management"
  }
];

// All routes organized by section
export const routeSections: RouteSection[] = [
  {
    title: "Main",
    routes: mainRoutes
  },
  {
    title: "Admin",
    routes: adminRoutes
  }
];

// Helper functions for routing
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const allRoutes = [...mainRoutes, ...adminRoutes];
  return allRoutes.find(route => route.path === path);
};

export const getMainNavigationRoutes = (): RouteConfig[] => {
  return mainRoutes.filter(route => route.path !== "/" && !route.hideFromNav);
};

export const isMainRoute = (path: string): boolean => {
  return mainRoutes.some(route => route.path === path);
};

export const isAdminRoute = (path: string): boolean => {
  return adminRoutes.some(route => route.path === path);
};

// Route validation
export const isValidRoute = (path: string): boolean => {
  const allRoutes = [...mainRoutes, ...adminRoutes];
  return allRoutes.some(route => 
    path === route.path || path.startsWith(route.path + "/")
  ) || path === "/";
};

// Default redirect paths
export const DEFAULT_MAIN_ROUTE = "/";
export const DEFAULT_ADMIN_ROUTE = "/admin/dashboard";
