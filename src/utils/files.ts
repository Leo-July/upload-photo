const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1)
  const value = bytes / 1024 ** unitIndex
  const precision = unitIndex === 0 || value >= 10 ? 0 : 1

  return `${value.toFixed(precision)} ${SIZE_UNITS[unitIndex]}`
}

export function calculateReduction(originalSize: number, optimizedSize: number): number {
  if (originalSize <= 0 || optimizedSize >= originalSize) {
    return 0
  }

  return Math.round(((originalSize - optimizedSize) / originalSize) * 100)
}
