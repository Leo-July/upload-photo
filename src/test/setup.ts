import { afterEach, vi } from 'vitest'
import { config } from '@vue/test-utils'

config.global.stubs = {
  transition: false,
  'transition-group': false,
}

afterEach(() => {
  vi.restoreAllMocks()
})
