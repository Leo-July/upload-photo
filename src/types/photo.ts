export type PhotoStatus = 'idle' | 'processing' | 'ready' | 'error'

export interface PhotoDetails {
  fileName: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
  mimeType: string
}

export interface PhotoResult {
  dataUrl: string
  file: File
  details: PhotoDetails
}
