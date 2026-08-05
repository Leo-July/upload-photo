<script setup lang="ts">
import { computed } from 'vue'
import type { PhotoDetails } from '../../types/photo'
import { calculateReduction, formatBytes } from '../../utils/files'

const props = defineProps<{
  details: PhotoDetails
}>()

const hasMeasuredFile = computed(() => props.details.originalSize > 0)
const reduction = computed(() =>
  calculateReduction(props.details.originalSize, props.details.optimizedSize),
)
const dimensions = computed(() =>
  props.details.width > 0 ? `${props.details.width} × ${props.details.height} px` : '已处理',
)
</script>

<template>
  <dl class="photo-details">
    <div class="photo-details__name">
      <dt>文件</dt>
      <dd :title="props.details.fileName">{{ props.details.fileName }}</dd>
    </div>
    <div>
      <dt>尺寸</dt>
      <dd>{{ dimensions }}</dd>
    </div>
    <div v-if="hasMeasuredFile">
      <dt>优化后</dt>
      <dd>{{ formatBytes(props.details.optimizedSize) }}</dd>
    </div>
    <div v-if="hasMeasuredFile">
      <dt>节省</dt>
      <dd class="photo-details__saving">{{ reduction }}%</dd>
    </div>
  </dl>
</template>

<style scoped>
.photo-details {
  margin: var(--space-4) 0 0;
  padding: var(--space-4) 0 0;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) repeat(3, minmax(max-content, 0.7fr));
  gap: var(--space-4);
  border-block-start: 1px solid var(--color-border);
}

.photo-details > div {
  min-width: 0;
}

.photo-details dt {
  color: var(--color-muted);
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.photo-details dd {
  margin: var(--space-1) 0 0;
  overflow: hidden;
  color: var(--color-ink);
  font-size: 0.8125rem;
  font-weight: 650;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-details .photo-details__saving {
  color: var(--color-success-dark);
}

@media (max-width: 35rem) {
  .photo-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .photo-details__name {
    grid-column: 1 / -1;
  }
}
</style>
