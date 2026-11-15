import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DangoProvider, ImagePreview } from '../src'

async function preview() {
  const changed = vi.fn()
  render(
    <DangoProvider>
      <ImagePreview
        open
        images={['/one.png', '/two.png']}
        onIndexChange={changed}
      />
    </DangoProvider>,
  )
  const image = await screen.findByAltText('预览图片')
  fireEvent.load(image)
  const viewport = image.parentElement!
  for (const el of [image, viewport]) {
    Object.defineProperties(el, {
      clientWidth: { value: 300 },
      clientHeight: { value: 300 },
    })
  }
  return { image, viewport, changed }
}
const pointer = (pointerId: number, clientX: number, clientY = 150) => ({
  pointerId,
  clientX,
  clientY,
  pointerType: 'touch',
})

describe('ImagePreview pointer gestures', () => {
  it('zooms with two pointers, bounds the scale, pans and resets without changing the image', async () => {
    const { image, viewport, changed } = await preview()
    fireEvent.pointerDown(viewport, pointer(1, 100))
    fireEvent.pointerDown(viewport, pointer(2, 200))
    fireEvent.pointerMove(viewport, pointer(2, 300))
    expect(viewport.dataset.scale).toBe('2')
    fireEvent.pointerMove(viewport, pointer(2, 1000))
    expect(viewport.dataset.scale).toBe('5')
    fireEvent.pointerUp(viewport, pointer(2, 1000))
    fireEvent.pointerMove(viewport, pointer(1, 200))
    expect(image.style.transform).toContain('scale(5)')
    fireEvent.pointerUp(viewport, pointer(1, 200))
    expect(changed).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '适应屏幕' }))
    expect(viewport.dataset.scale).toBe('1')
    expect(image.style.transform).toBe('translate(0px, 0px) scale(1)')
  })
  it('navigates with a single horizontal swipe and ignores cancelled or vertical gestures', async () => {
    const { viewport, changed } = await preview()
    fireEvent.pointerDown(viewport, pointer(1, 200))
    fireEvent.pointerCancel(viewport, pointer(1, 50))
    fireEvent.pointerUp(viewport, pointer(1, 50))
    fireEvent.pointerDown(viewport, pointer(2, 200))
    fireEvent.pointerUp(viewport, pointer(2, 100, 400))
    expect(changed).not.toHaveBeenCalled()
    fireEvent.pointerDown(viewport, pointer(3, 200))
    fireEvent.pointerUp(viewport, pointer(3, 50))
    expect(changed).toHaveBeenCalledWith(1)
    expect(screen.getByText('2 / 2')).toBeTruthy()
  })
})
