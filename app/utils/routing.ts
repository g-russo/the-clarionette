import { RouteConfig, mainRoutes, adminRoutes } from "../config/routes";

// Generate breadcrumbs for the current path
export function generateBreadcrumbs(path: string): { label: string; href: string }[] {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];
  
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Find the route configuration
    const route = [...mainRoutes, ...adminRoutes].find(r => r.path === currentPath);
    
    if (route) {
      breadcrumbs.push({
        label: route.label,
        href: currentPath
      });
    } else {
      // Fallback for segments without specific route config
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: currentPath
      });
    }
  });
  
  return breadcrumbs;
}

// Get page title based on route
export function getPageTitle(path: string): string {
  const route = [...mainRoutes, ...adminRoutes].find(r => r.path === path);
  
  if (route) {
    return `${route.label} | The Clarionette`;
  }
  
  return "The Clarionette";
}

// Get page description based on route
export function getPageDescription(path: string): string {
  const route = [...mainRoutes, ...adminRoutes].find(r => r.path === path);
  
  if (route && route.description) {
    return route.description;
  }
  
  return "Malate Catholic School's Official Student Publication";
}

// Check if current path is active (for navigation highlighting)
export function isActivePath(currentPath: string, linkPath: string): boolean {
  if (linkPath === "/main" && currentPath === "/main") {
    return true;
  }
  
  if (linkPath !== "/main" && currentPath.startsWith(linkPath)) {
    return true;
  }
  
  return false;
}

// Get related routes (same section)
export function getRelatedRoutes(currentPath: string): RouteConfig[] {
  if (currentPath.startsWith("/main")) {
    return mainRoutes.filter(route => route.path !== currentPath);
  }
  
  if (currentPath.startsWith("/admin")) {
    return adminRoutes.filter(route => route.path !== currentPath);
  }
  
  return [];
}

// Route type detection
export function getRouteType(path: string): "main" | "admin" | "unknown" {
  if (mainRoutes.some(route => route.path === path)) {
    return "main";
  }
  
  if (adminRoutes.some(route => route.path === path)) {
    return "admin";
  }
  
  return "unknown";
}
