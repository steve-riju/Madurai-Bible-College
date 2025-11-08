# Production Build Guide - Madurai Bible College Landing Page

## 🚀 Building for Production

This guide explains how to build and deploy the landing page for production.

## Prerequisites

- Node.js (v16 or higher)
- npm or pnpm package manager

## Build Steps

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Build for Production

```bash
npm run build
# or
pnpm build
```

This will create a `dist/` folder with all optimized production files.

### 3. Preview Production Build

To test the production build locally:

```bash
npm run preview
# or
pnpm preview
```

This will start a local server to preview the built files at `http://localhost:4173`

## 📁 Production Build Structure

After building, your `dist/` folder will contain:

```
dist/
├── index.html          # Main HTML file
├── assets/            # All static assets
│   ├── mbc-icon.ico   # Favicon
│   ├── mbc-logo.png   # College logo
│   ├── hero-campus-golden-light.jpg
│   ├── students-studying-theology.jpg
│   ├── historic-college-building.jpg
│   ├── christian-symbol-watermark.png
│   └── [hashed files for cache busting]
└── ...
```

## 🌐 Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure your hosting service to serve from the `dist/` directory

### Option 2: Traditional Web Server (Apache, Nginx)

1. Build the project: `npm run build`
2. Copy the contents of `dist/` to your web server's document root
3. Configure your server to serve `index.html` for all routes (for SPA routing if needed)

### Option 3: CDN Deployment

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your CDN
3. Configure CDN settings for optimal caching

## ✅ Production Checklist

- [x] Favicon (`mbc-icon.ico`) configured
- [x] College logo (`mbc-logo.png`) used in navbar and footer
- [x] All image assets included in `public/assets/`
- [x] `.gitignore` configured for production builds
- [x] Build output optimized with Vite
- [x] Assets properly referenced with absolute paths
- [x] No external dependencies on local files (all assets in public folder)

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` is configured to:
- Copy all files from `public/` folder to `dist/` during build
- Preserve `.ico` file names (important for favicons)
- Hash other assets for cache busting
- Output optimized production files

### Asset Paths

All assets use absolute paths (`/assets/...`) which work correctly:
- In development: Served from `public/assets/`
- In production: Copied to `dist/assets/`

## 📝 Notes

1. **Favicon**: The favicon (`mbc-icon.ico`) is preserved with its original name in production for proper browser recognition.

2. **Logo**: The college logo (`mbc-logo.png`) is used in:
   - Navigation bar (header)
   - Footer section

3. **Images**: All images are optimized and hashed during build for better caching.

4. **Git Ignore**: The `.gitignore` file is configured to:
   - Ignore `node_modules/`
   - Ignore `dist/` (build output)
   - Ignore log files and temporary files
   - **Keep** `public/` and `assets/` folders (these should be committed)

## 🐛 Troubleshooting

### Images Not Loading in Production

- Verify that all images are in `public/assets/` folder
- Check that paths use `/assets/` (absolute paths)
- Ensure the build completed successfully

### Favicon Not Showing

- Verify `mbc-icon.ico` is in `public/assets/`
- Check browser cache (hard refresh: Ctrl+F5)
- Verify the HTML has the correct favicon links

### Build Errors

- Clear `node_modules/` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: Delete `dist/` folder and rebuild
- Check Node.js version: Should be v16 or higher

## 📧 Support

For issues or questions about the production build, please contact the development team.

---

**Madurai Bible College** - Equipping Servant-Leaders Since 1955


