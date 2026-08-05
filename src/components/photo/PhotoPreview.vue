<script setup lang="ts">
import type { PhotoStatus } from '../../types/photo'

const props = defineProps<{
  previewUrl: string
  status: PhotoStatus
  errorMessage: string
  selectDescriptionIds: string
}>()

defineEmits<{
  select: []
  clear: []
}>()
</script>

<template>
  <div
    class="photo-preview"
    :class="{ 'photo-preview--filled': props.previewUrl }"
    :aria-busy="props.status === 'processing'"
  >
    <img
      v-if="props.previewUrl"
      class="photo-preview__image"
      :src="props.previewUrl"
      alt="当前照片预览"
    />

    <div v-if="props.status === 'processing'" class="photo-preview__state photo-preview__loading">
      <span class="photo-preview__spinner" aria-hidden="true"></span>
      <strong>正在优化照片</strong>
      <span>调整方向、尺寸与文件体积…</span>
    </div>

    <div v-else-if="props.status === 'error'" class="photo-preview__state photo-preview__error">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="19" />
        <path d="M24 14v12M24 33h.01" />
      </svg>
      <strong>这张照片暂时无法处理</strong>
      <span>{{ props.errorMessage }}</span>
      <button
        class="button button--primary"
        type="button"
        :aria-describedby="props.selectDescriptionIds"
        @click="$emit('select')"
      >
        重新选择
      </button>
    </div>

    <div v-else-if="!props.previewUrl" class="photo-preview__state photo-preview__empty">
      <svg class="photo-preview__icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="9" y="14" width="46" height="38" rx="5" />
        <circle cx="25" cy="28" r="5" />
        <path d="m14 47 12-11 9 8 6-6 9 9M32 7v12M26 13l6-6 6 6" />
      </svg>
      <strong>选择一张照片开始</strong>
      <span>也可以把照片拖放到这里</span>
      <button
        class="button button--primary"
        type="button"
        :aria-describedby="props.selectDescriptionIds"
        @click="$emit('select')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h4l2-2h4l2 2h4v12H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        选择照片
      </button>
    </div>

    <div v-else class="photo-preview__actions">
      <span class="photo-preview__success">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 12 4 4 8-9" />
        </svg>
        处理完成
      </span>
      <div class="photo-preview__buttons">
        <button
          class="button button--secondary"
          type="button"
          :aria-describedby="props.selectDescriptionIds"
          @click="$emit('select')"
        >
          更换照片
        </button>
        <button class="button button--ghost" type="button" @click="$emit('clear')">移除</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 18rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.photo-preview--filled {
  background: var(--color-preview);
  border-style: solid;
}

.photo-preview__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.photo-preview__state {
  width: min(100% - 2rem, 23rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.photo-preview__state strong {
  margin-block-start: var(--space-5);
  color: var(--color-ink);
  font-size: 1.05rem;
}

.photo-preview__state > span:not(.photo-preview__spinner) {
  margin-block-start: var(--space-2);
  color: var(--color-muted);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.photo-preview__icon {
  width: 4rem;
  color: var(--color-primary);
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.photo-preview__state .button {
  margin-block-start: var(--space-6);
}

.photo-preview__loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: auto;
  justify-content: center;
  color: var(--color-white);
  background: rgb(18 29 44 / 88%);
}

.photo-preview__loading strong,
.photo-preview__loading > span:not(.photo-preview__spinner) {
  color: var(--color-white);
}

.photo-preview__loading > span:not(.photo-preview__spinner) {
  opacity: 0.72;
}

.photo-preview__spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgb(255 255 255 / 28%);
  border-block-start-color: var(--color-white);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

.photo-preview__error svg {
  width: 3.5rem;
  fill: none;
  stroke: var(--color-error);
  stroke-width: 2;
  stroke-linecap: round;
}

.photo-preview__error {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: auto;
  padding: var(--space-6);
  justify-content: center;
  background: var(--color-surface);
}

.photo-preview__actions {
  position: absolute;
  inset-inline: var(--space-4);
  inset-block-end: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.photo-preview__success {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.75rem;
  padding-inline: var(--space-3);
  color: var(--color-success-dark);
  background: var(--color-success-soft);
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 750;
}

.photo-preview__success svg {
  width: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.photo-preview__buttons {
  display: flex;
  gap: var(--space-2);
}

.button {
  min-height: 2.75rem;
  padding-inline: var(--space-5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: inherit;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 100ms ease,
    color 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease;
}

.button:active {
  transform: scale(0.98);
}

.button svg {
  width: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.button--primary {
  color: var(--color-white);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.button--primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.button--secondary {
  color: var(--color-ink);
  background: rgb(255 255 255 / 94%);
  border-color: rgb(255 255 255 / 65%);
}

.button--secondary:hover {
  background: var(--color-white);
}

.button--ghost {
  color: var(--color-white);
  background: rgb(18 29 44 / 64%);
  border-color: rgb(255 255 255 / 35%);
}

.button--ghost:hover {
  background: rgb(18 29 44 / 88%);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 35rem) {
  .photo-preview {
    aspect-ratio: 1;
    min-height: 0;
  }

  .photo-preview__actions {
    align-items: flex-end;
  }

  .photo-preview__success {
    min-height: 2.25rem;
    padding-inline: var(--space-2);
  }

  .photo-preview__buttons {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .photo-preview,
  .button {
    transition: none;
  }

  .photo-preview__spinner {
    animation-duration: 1.8s;
  }
}
</style>
