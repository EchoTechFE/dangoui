import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filePath = query.path as string // e.g. "pages/demos/business/island-detail/snippet1.vue"

  if (!filePath) {
    throw createError({ statusCode: 400, message: 'path is required' })
  }

  // 安全的文件读取：只允许读取 pages/demos/ 下的 .vue 文件
  if (!filePath.startsWith('pages/demos/') || !filePath.endsWith('.vue')) {
    throw createError({ statusCode: 403, message: 'Invalid path' })
  }

  const fullPath = resolve(process.cwd(), filePath)

  try {
    const content = await readFile(fullPath, 'utf-8')
    return content
  } catch (e: any) {
    throw createError({ statusCode: 404, message: `File not found: ${filePath}` })
  }
})
