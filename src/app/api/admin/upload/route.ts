import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

export const runtime = 'nodejs'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

const sanitizeFilename = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are supported.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum allowed size is 10MB.' },
        { status: 400 }
      )
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = `${now.getMonth() + 1}`.padStart(2, '0')
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'admin', `${year}-${month}`)
    await mkdir(uploadDir, { recursive: true })

    const original = sanitizeFilename(file.name)
    const extension = extname(original) || '.jpg'
    const base = original.replace(extension, '')
    const uniqueName = `${base}-${Date.now()}${extension}`
    const destination = join(uploadDir, uniqueName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(destination, buffer)

    const publicUrl = `/uploads/admin/${year}-${month}/${uniqueName}`
    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: uniqueName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
  }
}
