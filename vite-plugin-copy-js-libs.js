import { resolve } from "path";
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";

export default function copyJsLibsPlugin() {
  return {
    name: "copy-js-libs",
    async closeBundle() {
      const srcJsPath = resolve(process.cwd(), "src", "js");
      const distPath = resolve(process.cwd(), "dist", "assets", "js");

      if (!existsSync(srcJsPath)) {
        return;
      }

      if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true });
      }

      try {
        const files = readdirSync(srcJsPath);
        const jsFiles = files.filter((file) => {
          const filePath = resolve(srcJsPath, file);
          const stats = statSync(filePath);
          return stats.isFile() && file.endsWith(".js") && file !== "main.js";
        });

        if (jsFiles.length === 0) {
          return;
        }

        jsFiles.forEach((file) => {
          const srcFilePath = resolve(srcJsPath, file);
          const distFilePath = resolve(distPath, file);
          try {
            copyFileSync(srcFilePath, distFilePath);
            console.log(`✓ Copied ${file} to dist/assets/js/`);
          } catch (error) {
            console.error(`Failed to copy ${file}:`, error.message);
          }
        });
      } catch (error) {
        console.error("Failed to read src/js directory:", error.message);
      }
    },
  };
}
