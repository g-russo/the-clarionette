# The Clarionette - Centralized Routing System

This project uses a centralized routing system that manages all navigation and routing logic from a single configuration file.

## Routing Structure

### Key Files

1. **`app/config/routes.ts`** - Central routing configuration
2. **`app/page.tsx`** - Root page that redirects to `/main`
3. **`middleware.ts`** - Route validation and redirects
4. **`app/components/`** - Navigation components
5. **`app/utils/`** - Routing utilities and metadata generation

### Route Configuration

All routes are defined in `app/config/routes.ts`:

- **Main Routes**: Public-facing pages (`/main/*`)
- **Admin Routes**: Administrative pages (`/admin/*`)

### Automatic Redirects

- `localhost:3000` → `localhost:3000/main`
- Invalid routes → `localhost:3000/main`

### Navigation Components

- **`Header`**: Main header with navigation
- **`Navigation`**: Desktop navigation menu
- **`MobileNavigation`**: Mobile-responsive navigation

### Features

1. **Centralized Configuration**: All routes defined in one place
2. **Automatic Redirects**: Root path redirects to main
3. **Route Validation**: Invalid routes redirect to main
4. **Active Link Highlighting**: Current page highlighted in navigation
5. **Mobile Responsive**: Mobile-friendly navigation menu
6. **SEO Optimized**: Automatic metadata generation
7. **Breadcrumbs**: Automatic breadcrumb generation
8. **Type Safety**: TypeScript interfaces for routes

### Adding New Routes

1. Add route to `app/config/routes.ts`
2. Create the page component
3. Navigation will automatically update

### Utilities

- **`generateBreadcrumbs(path)`**: Create breadcrumbs for any path
- **`getPageTitle(path)`**: Get page title for metadata
- **`getPageDescription(path)`**: Get page description for metadata
- **`isActivePath(current, link)`**: Check if navigation link is active

### Example Usage

```typescript
import { mainRoutes, getRouteByPath } from './app/config/routes';

// Get all main navigation routes
const navRoutes = mainRoutes;

// Find specific route
const route = getRouteByPath('/main/news');
```

This system ensures consistent navigation across the entire application while making it easy to add, modify, or remove routes.
