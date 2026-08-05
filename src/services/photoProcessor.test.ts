import { describe, expect, it } from 'vitest'
import { PhotoValidationError, validatePhoto } from './photoProcessor'

function createFile(type: string, size = 16): File {
  return new File([new Uint8Array(size)], 'photo', { type })
}

describe('validatePhoto', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts %s photos', (type) => {
    expect(() => validatePhoto(createFile(type))).not.toThrow()
  })

  it('rejects unsupported files with an actionable message', () => {
    expect(() => validatePhoto(createFile('image/gif'))).toThrowError(
      new PhotoValidationError('请选择 JPG、PNG 或 WebP 格式的照片。'),
    )
  })

  it('rejects files larger than 15 MB', () => {
    const oversizedPhoto = createFile('image/jpeg', 15 * 1024 * 1024 + 1)

    expect(() => validatePhoto(oversizedPhoto)).toThrow('照片不能超过 15 MB')
  })
})
