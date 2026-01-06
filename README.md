# HTML + SCSS + JS Project with Vite

🌐 **Live Demo:** [https://matecube.github.io/roos/](https://matecube.github.io/roos/)

A modern build setup for HTML projects with SCSS compilation, autoprefixer, and image optimization.

## Features

- ✅ Auto-scanning HTML pages (no manual config needed)
- ✅ SCSS compilation with autoprefixer
- ✅ Fast HMR (Hot Module Replacement) in development
- ✅ Production build with minification
- ✅ HTML partials support (posthtml-include)
- ✅ Tailwind-like utility classes

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Start the development server with auto-reload:

```bash
npm run dev
```

The server will start at `http://localhost:5173` (or the next available port).

### Production Build

Build optimized files for production:

```bash
npm run build
```

Output will be in the `dist/` directory at the root level (same directory as `src/`).

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── *.html          # All HTML pages (auto-discovered)
├── scss/
│   ├── main.scss   # Main stylesheet
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _utilities.scss
├── js/
│   └── main.js     # Main JavaScript file
├── images/         # Image files
└── partials/       # HTML partials (head, header, footer, etc.)
```

## Adding New Pages

Simply add a new `.html` file in the `src/` directory. It will be automatically discovered and included in the build.

## Images

### How to Add Images

1. **Place images in `src/images/` directory:**

   ```
   src/
   └── images/
       ├── photo.jpg
       ├── logo.png
       └── banner.webp
   ```

2. **Reference images in your HTML:**

```html
<img src="./images/photo.jpg" alt="Photo" />
```

### Image Processing

- **During Build**: Images are copied to `dist/assets/images/` maintaining the same directory structure
- **Directory Structure**: `src/images/` → `dist/assets/images/`
- **Filenames**: Images keep their original names (no hashes)

### Build Output

After building, images are placed in:

```
dist/
└── assets/
    └── images/
        ├── photo.jpg
        ├── banner.png
        └── logo.webp
```

## SCSS Features

- Variables and mixins
- Nested selectors
- Autoprefixer (vendor prefixes added automatically)
- Source maps in development
- Tailwind-like utility classes for spacing, colors, and more

## HTML Partials

Use HTML partials for reusable components:

```html
<include src="partials/head.html"></include>
<include src="partials/header.html"></include>
```

Partials are located in `src/partials/` and are processed during build.
