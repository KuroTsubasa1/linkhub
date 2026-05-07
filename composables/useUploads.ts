export function useUploads() {
  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const { url } = await $fetch<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: fd,
    })
    return url
  }
  return { uploadFile }
}
