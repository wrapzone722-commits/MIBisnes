/** Сжимает изображение до миниатюры (data URL) для хранения в localStorage */
const MAX_SIZE = 280
const JPEG_QUALITY = 0.75

export function fileToThumbDataUrl(file) {
  if (!file || !file.type.startsWith('image/')) return Promise.resolve(null)
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      let w = width
      let h = height
      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w > h) {
          h = Math.round((h * MAX_SIZE) / w)
          w = MAX_SIZE
        } else {
          w = Math.round((w * MAX_SIZE) / h)
          h = MAX_SIZE
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      try {
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      } catch (e) {
        resolve(null)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}
