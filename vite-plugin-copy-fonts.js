import { resolve } from 'path'
import { readdirSync, statSync, existsSync, mkdirSync, copyFileSync } from 'fs'

// Plugin to copy fonts to dist during build (no optimization, just copy)
export default function copyFontsPlugin() {
  return {
    name: 'copy-fonts',
    async closeBundle() {
      const srcPath = resolve(process.cwd(), 'src', 'fonts')
      const distPath = resolve(process.cwd(), 'dist', 'assets', 'fonts')
      
      // Ensure dist fonts directory exists
      if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true })
      }
      
      // Check if source fonts directory exists
      if (!existsSync(srcPath)) {
        return
      }
      
      // Get all font files
      const fontFiles = readdirSync(srcPath).filter(file => {
        const filePath = resolve(srcPath, file)
        const stats = statSync(filePath)
        return stats.isFile() && /\.(woff|woff2|ttf|otf|eot|svg)$/i.test(file)
      })
      
      // Copy each font file as-is (no optimization)
      for (const file of fontFiles) {
        const srcFilePath = resolve(srcPath, file)
        const distFilePath = resolve(distPath, file)
        
        try {
          copyFileSync(srcFilePath, distFilePath)
        } catch (error) {
          console.error(`Failed to copy font ${file}:`, error.message)
        }
      }
    }
  }
}

