<script setup lang="ts">
import { computed, shallowRef, useId, watch } from 'vue'
import { usePhotoProcessor } from '../../composables/usePhotoProcessor'
import type { PhotoResult } from '../../types/photo'
import PhotoDetails from './PhotoDetails.vue'
import PhotoPreview from './PhotoPreview.vue'

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{
  upload: [dataUrl: string, result: PhotoResult]
  clear: []
}>()

const instanceId = `photo-${useId().replaceAll(':', '')}`
const inputId = `${instanceId}-input`
const descriptionIds = `${instanceId}-requirements ${instanceId}-privacy`
const fileInput = shallowRef<HTMLInputElement | null>(null)
const isDragging = shallowRef(false)
let dragDepth = 0

const { status, previewUrl, details, errorMessage, selectPhoto, clearPhoto, restorePreview } =
  usePhotoProcessor()

const workspaceClasses = computed(() => ({
  'photo-tool': true,
  'photo-tool--dragging': isDragging.value,
  'photo-tool--processing': status.value === 'processing',
}))

watch(
  model,
  (value) => {
    if (value !== previewUrl.value) {
      restorePreview(value)
    }
  },
  { immediate: true },
)

async function handleFile(file?: File): Promise<void> {
  if (!file) return

  const nextResult = await selectPhoto(file)
  if (!nextResult) return

  model.value = nextResult.dataUrl
  emit('upload', nextResult.dataUrl, nextResult)
}

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement
  void handleFile(input.files?.[0])
  input.value = ''
}

function openFilePicker(): void {
  fileInput.value?.click()
}

function handleDragEnter(): void {
  dragDepth += 1
  isDragging.value = true
}

function handleDragLeave(): void {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDragging.value = false
}

function handleDrop(event: DragEvent): void {
  dragDepth = 0
  isDragging.value = false
  void handleFile(event.dataTransfer?.files[0])
}

function handleClear(): void {
  clearPhoto()
  model.value = ''
  if (fileInput.value) fileInput.value.value = ''
  emit('clear')
}
</script>

<template>
  <div
    :class="workspaceClasses"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      :id="inputId"
      ref="fileInput"
      class="sr-only"
      type="file"
      tabindex="-1"
      accept="image/jpeg,image/png,image/webp"
      :disabled="status === 'processing'"
      aria-hidden="true"
      @change="handleInput"
    />

    <PhotoPreview
      :preview-url="previewUrl"
      :status="status"
      :error-message="errorMessage"
      :select-description-ids="descriptionIds"
      @select="openFilePicker"
      @clear="handleClear"
    />

    <PhotoDetails v-if="details" :details="details" />

    <div class="photo-tool__notes">
      <p :id="`${instanceId}-requirements`">支持 JPG、PNG、WebP，最大 15 MB</p>
      <p :id="`${instanceId}-privacy`" class="photo-tool__privacy">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6z" />
          <path d="M12 14v2" />
        </svg>
        照片仅在你的浏览器中处理
      </p>
    </div>

    <p class="sr-only" aria-live="polite" aria-atomic="true">
      <template v-if="status === 'processing'">正在处理照片，请稍候。</template>
      <template v-else-if="status === 'ready'">照片处理完成。</template>
      <template v-else-if="status === 'error'">{{ errorMessage }}</template>
    </p>
  </div>
</template>

<style scoped>
.photo-tool {
  min-width: 0;
}

.photo-tool__notes {
  margin-block-start: var(--space-4);
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  color: var(--color-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}

.photo-tool__notes p {
  margin: 0;
}

.photo-tool__privacy {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  text-align: end;
}

.photo-tool__privacy svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--color-success);
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.photo-tool--dragging :deep(.photo-preview) {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  box-shadow: 0 0 0 4px var(--color-focus-soft);
}

@media (max-width: 35rem) {
  .photo-tool__notes {
    flex-direction: column;
    gap: var(--space-2);
  }

  .photo-tool__privacy {
    justify-content: flex-start;
    text-align: start;
  }
}
</style>
