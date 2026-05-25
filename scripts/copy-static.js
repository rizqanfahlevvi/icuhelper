// Post-build: copy vanilla JS, data files, and images to dist/
// These are plain global scripts that Vite can't bundle (no type="module")
import { cpSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(fileURLToPath(import.meta.url), '../../')
const dist = resolve(root, 'dist')

const copies = [
  { src: 'assets/js',   dest: 'assets/js' },
  { src: 'assets/data', dest: 'assets/data' },
  { src: 'assets/img',  dest: 'assets/img' },
]

for (const { src, dest } of copies) {
  const from = resolve(root, src)
  const to   = resolve(dist, dest)
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true, force: true })
    console.log(`✓ copied ${src} → dist/${dest}`)
  }
}
