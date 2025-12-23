import { resolve } from 'path'
import { readdirSync, statSync, existsSync, mkdirSync, copyFileSync } from 'fs'
import sharp from 'sharp'

// Plugin to optimize images during build (compression only, no format conversion)
export default function optimizeImagesPlugin() {
  return {
    name: 'optimize-images',
    async closeBundle() {
      const srcPath = resolve(process.cwd(), 'src', 'images')
      const distPath = resolve(process.cwd(), 'dist', 'assets', 'images')
      
      // Ensure dist images directory exists
      if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true })
      }
      
      // Check if source images directory exists
      if (!existsSync(srcPath)) {
        return
      }
      
      // Get all image files
      const imageFiles = readdirSync(srcPath).filter(file => {
        const filePath = resolve(srcPath, file)
        const stats = statSync(filePath)
        return stats.isFile() && /\.(png|jpg|jpeg|webp|gif|svg|bmp|tiff|ico)$/i.test(file)
      })
      
      // Process each image
      for (const file of imageFiles) {
        const srcFilePath = resolve(srcPath, file)
        const distFilePath = resolve(distPath, file)
        const ext = file.split('.').pop().toLowerCase()
        
        try {
          // Optimize based on format (compression only, keep original format)
          if (ext === 'png') {
            await sharp(srcFilePath)
              .png({ compressionLevel: 9, quality: 80 })
              .toFile(distFilePath)
          } else if (ext === 'jpg' || ext === 'jpeg') {
            await sharp(srcFilePath)
              .jpeg({ quality: 85, mozjpeg: true })
              .toFile(distFilePath)
          } else if (ext === 'webp') {
            await sharp(srcFilePath)
              .webp({ quality: 85 })
              .toFile(distFilePath)
          } else if (ext === 'gif') {
            // GIFs are copied as-is (sharp doesn't optimize GIFs well)
            copyFileSync(srcFilePath, distFilePath)
          } else if (ext === 'svg') {
            // SVGs are copied as-is (optimization would require svgo)
            copyFileSync(srcFilePath, distFilePath)
          } else {
            // For other formats, copy as-is
            copyFileSync(srcFilePath, distFilePath)
          }
        } catch (error) {
          console.warn(`Failed to optimize image ${file}:`, error.message)
          // Fallback: copy file as-is
          try {
            copyFileSync(srcFilePath, distFilePath)
          } catch (copyError) {
            console.error(`Failed to copy image ${file}:`, copyError.message)
          }
        }
      }
    }
  }
}

