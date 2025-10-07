import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name)
    const filename = `${randomUUID()}${ext}`
    const folder = type === 'image' ? 'images' : 'models'
    const filepath = path.join(process.cwd(), 'public', 'uploads', folder, filename)

    await writeFile(filepath, buffer)

    const url = `/uploads/${folder}/${filename}`

    return NextResponse.json({ url, path: filepath })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
