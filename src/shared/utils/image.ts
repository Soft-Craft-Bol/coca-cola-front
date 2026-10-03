export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
export const MAX_IMAGE_MB = 5

/** Valida tipo y tamaño antes de subir. Devuelve el mensaje de error o null si es válida. */
export function validateImage(file: File): string | null {
  if (!IMAGE_ACCEPT.split(',').includes(file.type)) return 'Formato no permitido: usa JPG, PNG, WEBP o GIF'
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `La imagen supera el máximo de ${MAX_IMAGE_MB} MB`
  return null
}

/** Pide a Cloudinary una versión recortada y optimizada (tamaño, calidad y formato automáticos). */
export function optimizeImage(url: string | null | undefined, width: number, height: number): string | undefined {
  if (!url) return undefined
  return url.replace('/upload/', `/upload/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/`)
}
