import { resolve } from 'path'
import posthtml from 'posthtml'
import include from 'posthtml-include'

export default function posthtmlPlugin() {
  const srcRoot = resolve(process.cwd(), 'src')
  
  return {
    name: 'posthtml',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const htmlPath = context.path || resolve(srcRoot, 'index.html')
        
        return posthtml([
          include({
            root: srcRoot
          })
        ])
          .process(html, {
            from: htmlPath,
            root: srcRoot
          })
          .then(result => result.html)
      }
    }
  }
}

