import { describe, expect, it } from 'vitest'
import { calculateReduction, formatBytes } from './files'

describe('formatBytes', () => {
  it('formats byte sizes with readable units', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1_536)).toBe('1.5 KB')
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 MB')
  })
})

describe('calculateReduction', () => {
  it('returns the rounded percentage saved', () => {
    expect(calculateReduction(1_000, 420)).toBe(58)
  })

  it('does not report negative savings', () => {
    expect(calculateReduction(1_000, 1_200)).toBe(0)
    expect(calculateReduction(0, 0)).toBe(0)
  })
})
