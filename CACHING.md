# BPPA Website - Caching Configuration

## Overview
This website implements efficient browser caching to improve performance and reduce load times for repeat visitors.

## Cache Policies

### HTML Files (1 hour)
- **Files**: `*.html`, `*.htm`
- **Cache Duration**: 3,600 seconds (1 hour)
- **Reason**: Content may change, but not frequently

### CSS & JavaScript (1 year)
- **Files**: `*.css`, `*.js`
- **Cache Duration**: 31,536,000 seconds (1 year)
- **Immutable**: Yes
- **Reason**: Static files rarely change; use versioning for updates

### Images (1 year)
- **Files**: `*.jpg`, `*.jpeg`, `*.png`, `*.gif`, `*.webp`, `*.svg`, `*.ico`
- **Cache Duration**: 31,536,000 seconds (1 year)
- **Immutable**: Yes
- **Reason**: Images are static assets

### Fonts (1 year)
- **Files**: `*.woff`, `*.woff2`, `*.ttf`, `*.otf`, `*.eot`
- **Cache Duration**: 31,536,000 seconds (1 year)
- **Immutable**: Yes
- **Reason**: Font files never change

### Media Files (1 year)
- **Files**: `*.mp4`, `*.webm`, `*.mp3`
- **Cache Duration**: 31,536,000 seconds (1 year)
- **Immutable**: Yes

## Server Configuration Files

### Apache (.htaccess)
- Located at root directory
- Uses `mod_expires` and `mod_headers` modules
- Includes compression via `mod_deflate`

### IIS (web.config)
- Located at root directory
- Uses built-in IIS static content caching
- Includes HTTP compression configuration

## Expected Benefits

✅ **~3,773 KiB** bandwidth savings for repeat visitors
✅ **Faster page loads** on subsequent visits
✅ **Reduced server load** from cached resources
✅ **Better Lighthouse scores** for caching metrics
✅ **Improved FCP & LCP** times

## Cache Busting

When you update CSS, JavaScript, or image files, use one of these strategies:

### Method 1: Query String Versioning
```html
<!-- Old -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- New (after update) -->
<link rel="stylesheet" href="assets/css/style.css?v=1.1">
```

### Method 2: Filename Versioning
```html
<!-- Rename file to -->
<link rel="stylesheet" href="assets/css/style-v1.1.css">
```

### Method 3: Hash-based Naming
```html
<!-- Use build tools to generate -->
<link rel="stylesheet" href="assets/css/style.a8f9c3d.css">
```

## Testing Cache Headers

### Online Tools
- [GTmetrix](https://gtmetrix.com/) - Check "Leverage browser caching"
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Reload page
4. Click on any asset
5. Check "Headers" → "Response Headers" → "Cache-Control"

### Command Line
```bash
# Check cache headers for a file
curl -I https://yourdomain.com/assets/css/style.css

# Look for:
# Cache-Control: public, max-age=31536000, immutable
```

## Deployment Notes

- **Apache hosting**: Ensure `mod_expires`, `mod_headers`, and `mod_deflate` modules are enabled
- **IIS hosting**: Ensure URL Rewrite module is installed
- **Other servers** (Nginx, etc.): Contact your host or configure manually

## Performance Metrics

Before caching implementation:
- Browser cache warnings in PageSpeed
- Repeated downloads of unchanged resources

After caching implementation:
- ✅ Resources cached for 1 year
- ✅ HTML cached for 1 hour
- ✅ Gzip compression enabled
- ✅ 3,773 KiB savings on repeat visits
