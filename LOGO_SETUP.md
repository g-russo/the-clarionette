# 🎨 How to Add Your Custom Logo

Your website is ready to use a custom logo! Here's how to add it:

## Quick Steps:
1. **Prepare your logo file:**
   - Name it exactly: `logo-main.webp` (RECOMMENDED) or `logo-main.png`
   - Recommended size: 200x60px (or similar aspect ratio)
   - Use transparent background for PNG/WebP files

2. **Place the file:**
   - Put it in: `/public/images/logos/`
   - Full path: `/public/images/logos/logo-main.webp`

3. **That's it!**
   - Refresh your website and your logo will appear automatically
   - The text "C" logo will be replaced with your image

## File Naming (Important):
✅ **Best:** `logo-main.webp` (25-50% smaller, faster loading)
✅ **Good:** `logo-main.png`, `logo-main.svg`, `logo-main.jpg`  
❌ **Wrong:** `my-logo.webp`, `logo.jpg`, `company-logo.png`

## Supported Formats (in priority order):
- **WebP** (RECOMMENDED - best compression & quality) - `logo-main.webp`
- **SVG** (perfect scalability) - `logo-main.svg`  
- **PNG** (good quality, supports transparency) - `logo-main.png`  
- **JPG** (smaller file size, no transparency) - `logo-main.jpg`

## Tips:
- **WebP files are highly recommended** for best web performance
- SVG files are preferred for crisp scaling at any size
- PNG files should have transparent backgrounds
- Test your logo at different screen sizes
- Make sure it's readable when small (mobile devices)
- WebP provides 25-50% smaller file sizes than PNG/JPG

## WebP Benefits:
- 🚀 **Faster loading** - smaller file sizes
- 📱 **Better mobile experience** - less data usage  
- 🔍 **Improved SEO** - Google favors fast-loading images
- 🎨 **Transparency support** - like PNG but more efficient
- 🌐 **Wide browser support** - 95%+ modern browser compatibility

## Fallback:
If no logo file is found, the website automatically shows the text "C" logo as a fallback.

---
📁 **Current image folder structure:**
```
public/
  images/
    logos/          ← Put your logo here!
    articles/       ← Article featured images
    banners/        ← Hero banners and promotional images  
    gallery/        ← Photo galleries and event images
    team/           ← Editorial board and staff photos
    icons/          ← Custom icons and graphics
```
