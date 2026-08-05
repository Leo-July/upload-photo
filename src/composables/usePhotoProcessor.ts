import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { PhotoValidationError, processPhoto } from '../services/photoProcessor'
import type { PhotoDetails, PhotoResult, PhotoStatus } from '../types/photo'

const DEFAULT_ERROR = '照片处理失败，请重试或选择其他文件。'

export function usePhotoProcessor() {
  const status = shallowRef<PhotoStatus>('idle')
  const result = shallowRef<PhotoResult | null>(null)
  const errorMessage = shallowRef('')
  let activeController: AbortController | null = null
  let requestId = 0

  const previewUrl = computed(() => result.value?.dataUrl ?? '')
  const details = computed<PhotoDetails | null>(() => result.value?.details ?? null)

  async function selectPhoto(file: File): Promise<PhotoResult | null> {
    activeController?.abort()
    const controller = new AbortController()
    activeController = controller
    const currentRequest = ++requestId
    status.value = 'processing'
    errorMessage.value = ''

    try {
      const nextResult = await processPhoto(file, controller.signal)

      if (currentRequest !== requestId) {
        return null
      }

      result.value = nextResult
      status.value = 'ready'
      return nextResult
    } catch (error) {
      if (controller.signal.aborted || currentRequest !== requestId) {
        return null
      }

      status.value = 'error'
      errorMessage.value = error instanceof PhotoValidationError ? error.message : DEFAULT_ERROR
      return null
    } finally {
      if (currentRequest === requestId) {
        activeController = null
      }
    }
  }

  function clearPhoto(): void {
    activeController?.abort()
    activeController = null
    requestId += 1
    result.value = null
    errorMessage.value = ''
    status.value = 'idle'
  }

  function restorePreview(dataUrl: string): void {
    activeController?.abort()
    activeController = null
    requestId += 1
    errorMessage.value = ''

    if (!dataUrl) {
      result.value = null
      status.value = 'idle'
      return
    }

    result.value = {
      dataUrl,
      file: new File([], '已处理照片'),
      details: {
        fileName: '已处理照片',
        originalSize: 0,
        optimizedSize: 0,
        width: 0,
        height: 0,
        mimeType: dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/jpeg',
      },
    }
    status.value = 'ready'
  }

  onBeforeUnmount(() => {
    activeController?.abort()
  })

  return {
    status,
    result,
    previewUrl,
    details,
    errorMessage,
    selectPhoto,
    clearPhoto,
    restorePreview,
  }
}
