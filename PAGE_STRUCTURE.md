# Page Structure Documentation

## Overview

The Clarionette website now follows a proper three-section layout pattern that separates content into **Header**, **Body**, and **Footer** components for better organization and maintainability.

## Architecture

### 🏗️ **Component Structure**

```
PageLayout
├── Header (Navigation)
├── Body (Main Content)
└── Footer (Site Information)
```

### 📁 **File Organization**

```
app/
├── components/
│   ├── Header.tsx          # Top navigation bar
│   ├── Navigation.tsx      # Desktop navigation menu
│   ├── MobileNavigation.tsx # Mobile hamburger menu
│   ├── MainContent.tsx     # Homepage body content
│   ├── Footer.tsx          # Site footer
│   └── PageLayout.tsx      # Wrapper component
├── main/
│   ├── page.tsx           # Homepage using PageLayout
│   ├── news/page.tsx      # News page using PageLayout
│   ├── sports/page.tsx    # Sports page using PageLayout
│   └── [other pages...]   # All using PageLayout
└── config/
    └── routes.ts          # Centralized routing configuration
```

## 📋 **Component Breakdown**

### 1. **Header Section** (`components/Header.tsx`)
- **Purpose**: Site navigation and branding
- **Contains**:
  - Site title/logo ("The Clarionette")
  - Desktop navigation menu
  - Mobile navigation (hamburger menu)
  - Sticky positioning for better UX

### 2. **Body Section** (Page-specific content)
- **Purpose**: Main content area
- **Examples**:
  - `MainContent.tsx` - Homepage content
  - Individual page content (news, sports, etc.)
- **Structure**: 
  - Hero sections
  - Article grids
  - Feature highlights
  - Page-specific content

### 3. **Footer Section** (`components/Footer.tsx`)
- **Purpose**: Site information and secondary navigation
- **Contains**:
  - Site description
  - Quick links to sections
  - Contact information
  - Social media links
  - Copyright information

## 🎯 **PageLayout Component**

The `PageLayout` component is a wrapper that provides the consistent structure:

```tsx
<PageLayout>
  {/* Your page content goes here */}
</PageLayout>
```

**Benefits**:
- Consistent header/footer across all pages
- Proper flexbox layout ensuring footer stays at bottom
- Centralized styling and behavior
- Easy maintenance and updates

## 🚀 **Usage Examples**

### Homepage
```tsx
import PageLayout from "../components/PageLayout";
import MainContent from "../components/MainContent";

export default function Home() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
}
```

### Section Pages (News, Sports, etc.)
```tsx
import PageLayout from "../../components/PageLayout";

export default function NewsPage() {
  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page-specific content */}
      </main>
    </PageLayout>
  );
}
```

## ✨ **Features**

1. **Responsive Design**: All sections adapt to different screen sizes
2. **Dark Mode Support**: Complete dark/light theme support
3. **Accessibility**: Proper semantic HTML and ARIA labels
4. **SEO Friendly**: Structured content for better search indexing
5. **Performance**: Optimized component loading and rendering

## 🔧 **Customization**

### Adding New Sections
1. Create your content component
2. Wrap it with `PageLayout`
3. Add route to `config/routes.ts`

### Modifying Header/Footer
- Edit `components/Header.tsx` for navigation changes
- Edit `components/Footer.tsx` for footer updates
- Changes apply automatically to all pages

## 📱 **Responsive Behavior**

- **Desktop**: Full navigation menu in header
- **Tablet**: Condensed navigation
- **Mobile**: Hamburger menu with slide-out navigation

## 🎨 **Styling**

- Uses Tailwind CSS for consistent styling
- Dark mode classes throughout
- Hover effects and transitions
- Mobile-first responsive approach

This structure ensures a professional, maintainable, and scalable website architecture for The Clarionette student publication.
