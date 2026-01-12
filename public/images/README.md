# Image Assets Structure

This folder contains all image assets for The Clarionette website, organized by purpose and usage.

## 📁 Folder Structure

### `/logos/`
**🔄 USER REPLACEABLE - Your Custom Logo Goes Here!**
Contains logo variations for the publication:
- `logo-main.webp` - **PRIMARY LOGO** (RECOMMENDED - best web optimization)
- `logo-main.png` - Primary logo fallback (recommended: 200x60px, transparent background) 
  - **These files replace the default "C" text logo automatically**
  - Place your logo here and refresh the website
- `logo-main.svg` - Primary logo in SVG format (perfect for scalability)
- `logo-small.webp` - Small version for mobile/favicon (48x48px)
- `logo-white.webp` - White version for dark backgrounds
- `logo-horizontal.webp` - Horizontal layout version
- `favicon.ico` - Website favicon (32x32px)

**📋 Quick Setup:** Add your `logo-main.webp` (best) or `logo-main.png` file to `/public/images/logos/` and it will automatically replace the text logo!

**🚀 WebP Recommended:** WebP format provides 25-50% smaller file sizes with excellent quality - perfect for fast loading!

### `/articles/`
Article featured images and thumbnails:
- `/featured/` - Large featured article images (1200x630px recommended)
- `/thumbnails/` - Article thumbnail images (400x300px recommended)
- Naming convention: `article-{id}-{size}.{ext}`

### `/banners/`
Hero banners and promotional images:
- `hero-main.jpg` - Main homepage hero banner (1920x800px)
- `section-banners/` - Section-specific banners
  - `news-banner.jpg`
  - `sports-banner.jpg`
  - `literary-banner.jpg`
  - `filipino-banner.jpg`

### `/gallery/`
Photo galleries and event images:
- `/events/` - School events and activities
- `/achievements/` - Awards and recognitions
- `/campus/` - Campus photos
- Naming convention: `event-{name}-{date}-{number}.{ext}`

### `/team/`
Editorial board and staff photos:
- `editor-{name}.jpg` - Individual headshots (300x300px, square)
- `team-group.jpg` - Group photos
- Naming convention: `{role}-{firstname}-{lastname}.jpg`

### `/icons/`
Custom icons and graphics:
- Category icons (if not using Lucide)
- Custom social media icons
- Award/achievement icons

## 📐 Image Guidelines

### **Recommended Specifications:**

1. **Logo Images:**
   - Format: PNG or SVG (SVG preferred)
   - Background: Transparent
   - Resolution: High resolution for retina displays
   - Colors: Should work on both light and dark backgrounds

2. **Article Images:**
   - Format: **WebP (preferred)**, JPEG, or PNG
   - Aspect Ratio: 16:9 for featured images, 4:3 for thumbnails
   - Resolution: At least 1200px wide for featured images
   - Optimization: Use WebP for 25-50% smaller files with same quality

3. **Hero Banners:**
   - Format: **WebP (preferred)** or JPEG
   - Resolution: 1920x800px minimum
   - File size: Under 300KB with WebP, under 500KB with JPEG

4. **Team Photos:**
   - Format: JPEG or PNG
   - Aspect Ratio: 1:1 (square)
   - Resolution: 300x300px minimum
   - Background: Professional, consistent style

### **Image Optimization:**

- **Use WebP format as first choice** for 25-50% better compression
- Provide fallback formats (PNG/JPEG) for older browsers
- Provide multiple sizes for responsive images
- Use lazy loading for better performance
- Include alt text for accessibility
- Consider using Next.js Image component for automatic optimization

### **Naming Conventions:**

- Use lowercase letters
- Use hyphens instead of spaces
- Include size indicators when applicable
- Use descriptive names
- Example: `clarionette-logo-main-200x60.png`

## 🔧 Usage in Code

Images can be referenced in components using Next.js Image component:

```jsx
import Image from 'next/image';

// Logo usage
<Image
  src="/images/logos/logo-main.svg"
  alt="The Clarionette Logo"
  width={200}
  height={60}
  priority // for above-the-fold images
/>

// Article image usage
<Image
  src="/images/articles/featured/article-1-featured.jpg"
  alt="Article title"
  width={1200}
  height={630}
  className="rounded-lg"
/>
```

## 📝 Notes

- All images should be optimized for web before uploading
- Maintain consistent visual style across all images
- Ensure images are properly licensed for publication use
- Regular backup of image assets is recommended
- Consider creating different sizes for responsive design
