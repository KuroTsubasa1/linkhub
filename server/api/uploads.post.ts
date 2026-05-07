import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { requireUser } from '../lib/session'

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'])
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const form = await readMultipartFormData(event)
  const fileEntry = form?.find((p) => p.name === 'file' && p.data?.length)
  if (!fileEntry?.data) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded under field "file"' })
  }
  if (fileEntry.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'File exceeds 5MB limit' })
  }

  const ext = fileEntry.filename ? extname(fileEntry.filename).toLowerCase() : ''
  if (!ALLOWED_EXTS.has(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }

  const filename = `${randomUUID()}${ext}`
  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  await writeFile(resolve(uploadsDir, filename), fileEntry.data)

  return { url: `/uploads/${filename}` }
})
