export async function uploadFile(file: File, type: 'image' | 'model'): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { url: '', error: error.error || 'Upload failed' }
    }

    const data = await response.json()
    return { url: data.url }
  } catch (error) {
    console.error('Upload error:', error)
    return { url: '', error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function uploadMultipleFiles(files: File[], type: 'image' | 'model'): Promise<Array<{ url: string; error?: string }>> {
  return Promise.all(files.map(file => uploadFile(file, type)))
}
