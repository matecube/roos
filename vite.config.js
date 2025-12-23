import { defineConfig } from "vite";
import { glob } from "glob";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import prettier from "prettier";
import posthtmlPlugin from "./vite-plugin-posthtml.js";
import optimizeImagesPlugin from "./vite-plugin-optimize-images.js";
import copyFontsPlugin from "./vite-plugin-copy-fonts.js";

// Plugin to prettify HTML files after build and fix relative paths
function prettifyHtmlPlugin() {
  return {
    name: "prettify-html",
    async closeBundle() {
      const distPath = resolve(process.cwd(), "dist");
      const htmlFiles = glob.sync("*.html", { cwd: distPath });

      for (const file of htmlFiles) {
        const filePath = resolve(distPath, file);
        let html = readFileSync(filePath, "utf-8");

        // Fix absolute paths to relative paths
        html = html.replace(/src="\/assets\//g, 'src="./assets/');
        html = html.replace(/href="\/assets\//g, 'href="./assets/');

        // Remove type="module" and crossorigin for file:// protocol compatibility
        html = html.replace(/type="module"/g, "");
        html = html.replace(/crossorigin="?"/g, "");
        html = html.replace(/crossorigin/g, "");

        try {
          const prettified = await prettier.format(html, {
            parser: "html",
            printWidth: 120,
            tabWidth: 2,
            useTabs: false,
            htmlWhitespaceSensitivity: "css",
            endOfLine: "lf",
          });

          writeFileSync(filePath, prettified, "utf-8");
        } catch (error) {
          console.warn(`Failed to prettify ${file}:`, error.message);
        }
      }
    },
  };
}

export default defineConfig({
  root: "src",
  base: "./",
  server: {
    watch: {
      // Enable polling to catch file changes on filesystems that miss native events
      usePolling: true,
      interval: 300,
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync("src/*.html").map((file) => [
          // Get the filename without extension as the key
          file.slice(file.lastIndexOf("/") + 1, file.lastIndexOf(".")),
          // Get the absolute path
          resolve(process.cwd(), file),
        ])
      ),
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            // Remove hash from images for cleaner filenames (optional - you can add [hash] back if needed)
            return `assets/images/[name][extname]`;
          }
          if (/woff|woff2|ttf|otf|eot/i.test(ext)) {
            // Font files go to assets/fonts/ (keep original filename)
            return `assets/fonts/[name][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/main[extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: "assets/js/main.js",
        chunkFileNames: "assets/js/main.js",
        format: "iife",
      },
    },
    cssCodeSplit: false,
    minify: "esbuild",
  },
  plugins: [
    posthtmlPlugin(),
    optimizeImagesPlugin(),
    copyFontsPlugin(),
    prettifyHtmlPlugin(),
  ],
});
