import imageCompression from 'browser-image-compression'
import compressionWorkerAssetUrl from 'browser-image-compression/dist/browser-image-compression.js?url'
import type { PhotoDetails, PhotoResult } from '../types/photo'

export const PHOTO_CONSTRAINTS = {
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 15 * 1024 * 1024,
  maxOutputSizeMb: 1.5,
  maxDimension: 2560,
} as const

const compressionWorkerUrl = new URL(compressionWorkerAssetUrl, document.baseURI).href

export class PhotoValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PhotoValidationError'
  }
}

export function validatePhoto(file: File): void {
  if (
    !PHOTO_CONSTRAINTS.acceptedTypes.includes(
      file.type as (typeof PHOTO_CONSTRAINTS.acceptedTypes)[number],
    )
  ) {
    throw new PhotoValidationError('请选择 JPG、PNG 或 WebP 格式的照片。')
  }

  if (file.size > PHOTO_CONSTRAINTS.maxFileSize) {
    throw new PhotoValidationError('照片不能超过 15 MB，请选择更小的文件。')
  }
}

function readImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new PhotoValidationError('无法读取这张照片，请尝试其他文件。'))
    image.src = dataUrl
  })
}

export async function processPhoto(file: File, signal: AbortSignal): Promise<PhotoResult> {
  validatePhoto(file)

  const optimizedFile = await imageCompression(file, {
    maxSizeMB: PHOTO_CONSTRAINTS.maxOutputSizeMb,
    maxWidthOrHeight: PHOTO_CONSTRAINTS.maxDimension,
    useWebWorker: true,
    libURL: compressionWorkerUrl,
    preserveExif: false,
    initialQuality: 0.86,
    signal,
  })
  const dataUrl = await imageCompression.getDataUrlFromFile(optimizedFile)
  const { width, height } = await readImageDimensions(dataUrl)
  const details: PhotoDetails = {
    fileName: file.name,
    originalSize: file.size,
    optimizedSize: optimizedFile.size,
    width,
    height,
    mimeType: optimizedFile.type || file.type,
  }

  return { dataUrl, file: optimizedFile, details }
}
