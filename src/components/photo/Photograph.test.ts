import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Photograph from './Photograph.vue'
import { PhotoValidationError, processPhoto } from '../../services/photoProcessor'
import type { PhotoResult } from '../../types/photo'

vi.mock('../../services/photoProcessor', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/photoProcessor')>()
  return {
    ...actual,
    processPhoto: vi.fn(),
  }
})

const processedPhoto: PhotoResult = {
  dataUrl: 'data:image/jpeg;base64,processed',
  file: new File(['optimized'], 'portrait.jpg', { type: 'image/jpeg' }),
  details: {
    fileName: 'portrait.jpg',
    originalSize: 2_048,
    optimizedSize: 1_024,
    width: 1200,
    height: 800,
    mimeType: 'image/jpeg',
  },
}

describe('Photograph', () => {
  beforeEach(() => {
    vi.mocked(processPhoto).mockResolvedValue(processedPhoto)
  })

  it('renders an accessible empty state', () => {
    const wrapper = mount(Photograph)

    expect(wrapper.text()).toContain('选择一张照片开始')
    expect(wrapper.get('input[type="file"]').attributes('accept')).toContain('image/webp')
    expect(wrapper.get('button').text()).toContain('选择照片')
    expect(wrapper.get('input').attributes('tabindex')).toBe('-1')
  })

  it('processes a selected photo and preserves the component contract', async () => {
    const wrapper = mount(Photograph)
    const input = wrapper.get<HTMLInputElement>('input[type="file"]')
    const photo = new File(['original'], 'portrait.jpg', { type: 'image/jpeg' })

    Object.defineProperty(input.element, 'files', { value: [photo], configurable: true })
    await input.trigger('change')
    await flushPromises()

    expect(processPhoto).toHaveBeenCalledWith(photo, expect.any(AbortSignal))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([processedPhoto.dataUrl])
    expect(wrapper.emitted('upload')?.[0]).toEqual([processedPhoto.dataUrl, processedPhoto])
    expect(wrapper.text()).toContain('处理完成')
    expect(wrapper.text()).toContain('portrait.jpg')
  })

  it('clears the selected photo and emits both contracts', async () => {
    const wrapper = mount(Photograph, {
      props: {
        modelValue: processedPhoto.dataUrl,
      },
    })

    const removeButton = wrapper.findAll('button').find((button) => button.text() === '移除')
    expect(removeButton).toBeDefined()
    await removeButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.text()).toContain('选择一张照片开始')
  })

  it('keeps the previous result visible when a replacement fails', async () => {
    const wrapper = mount(Photograph)
    const input = wrapper.get<HTMLInputElement>('input[type="file"]')
    const firstPhoto = new File(['original'], 'portrait.jpg', { type: 'image/jpeg' })

    Object.defineProperty(input.element, 'files', { value: [firstPhoto], configurable: true })
    await input.trigger('change')
    await flushPromises()

    vi.mocked(processPhoto).mockRejectedValueOnce(
      new PhotoValidationError('请选择 JPG、PNG 或 WebP 格式的照片。'),
    )
    const invalidReplacement = new File(['not-an-image'], 'notes.txt', { type: 'text/plain' })
    Object.defineProperty(input.element, 'files', {
      value: [invalidReplacement],
      configurable: true,
    })
    await input.trigger('change')
    await flushPromises()

    expect(wrapper.get('img').attributes('src')).toBe(processedPhoto.dataUrl)
    expect(wrapper.text()).toContain('这张照片暂时无法处理')
    expect(wrapper.text()).toContain('portrait.jpg')
  })
})
