// Central routing configuration for The Clarionette
export interface RouteConfig {
  path: string;
  label: string;
  description?: string;
}

export interface RouteSection {
  title: string;
  routes: RouteConfig[];
}

// Main navigation routes
export const mainRoutes: RouteConfig[] = [
  {
    path: "/main",
    label: "Home",
    description: "Main homepage with latest news and featured articles"
  },
  {
    path: "/main/news",
    label: "News",
    description: "Latest news and current events"
  },
  {
    path: "/main/features",
    label: "Features",
    description: "In-depth feature articles and analysis"
  },
  {
    path: "/main/sports",
    label: "Sports",
    description: "Sports news and coverage"
  },
  {
    path: "/main/literary",
    label: "Literary",
    description: "Literary works and creative writing"
  },
  {
    path: "/main/filipino",
    label: "Filipino",
    description: "Filipino language content and cultural articles"
  },
  {
    path: "/main/editorial-board",
    label: "Editorial Board",
    description: "Meet our editorial team"
  }
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
  // Return all main routes except the home route for navigation
  return mainRoutes.filter(route => route.path !== "/main");
};

export const isMainRoute = (path: string): boolean => {
  return mainRoutes.some(route => route.path === path);
};

export const isAdminRoute = (path: string): boolean => {
  return adminRoutes.some(route => route.path === path);
};

// Route validation
export const isValidRoute = (path: string): boolean => {
  return getRouteByPath(path) !== undefined;
};

// Default redirect paths
export const DEFAULT_MAIN_ROUTE = "/main";
export const DEFAULT_ADMIN_ROUTE = "/admin/dashboard";
