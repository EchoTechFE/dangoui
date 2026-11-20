import { StrictMode, useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  Button,
  DangoProvider,
  Dialog,
  ImagePreview,
  Popup,
  createFeedback,
} from '../src'
import IconLogoIslands from '../src/icons/LogoIslands'
import IconClose from '../src/icons/close'

describe('Button and icons', () => {
  it('does not implicitly submit, blocks loading/disabled clicks, and supports explicit submit', async () => {
    const click = vi.fn()
    const submit = vi.fn((event) => event.preventDefault())
    render(
      <DangoProvider>
        <form onSubmit={submit}>
          <Button onClick={click}>普通</Button>
          <Button loading onClick={click}>
            等待
          </Button>
          <Button disabled onClick={click}>
            禁用
          </Button>
          <Button type="submit">提交</Button>
        </form>
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(screen.getByText('普通'))
    await user.click(screen.getByText('等待'))
    await user.click(screen.getByText('禁用'))
    expect(click).toHaveBeenCalledTimes(1)
    expect(submit).not.toHaveBeenCalled()
    await user.click(screen.getByText('提交'))
    expect(submit).toHaveBeenCalledTimes(1)
  })

  it('gives semantic icons a name, hides decorative icons, and makes definitions unique', () => {
    const { container } = render(
      <>
        <IconClose />
        <IconLogoIslands label="临界" />
        <IconLogoIslands label="临界" />
      </>,
    )
    expect(screen.getAllByRole('img', { name: '临界' })).toHaveLength(2)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const node of container.querySelectorAll('[clip-path]')) {
      const id = node.getAttribute('clip-path')!.slice(5, -1)
      expect(ids).toContain(id)
    }
  })
})

describe('Popup', () => {
  it('keeps position-specific transition state for Vue-compatible sheet motion', async () => {
    render(
      <DangoProvider>
        <Popup title="底部弹层" open position="bottom">
          内容
        </Popup>
      </DangoProvider>,
    )

    const dialog = await screen.findByRole('dialog', { name: '底部弹层' })
    const overlay = document.querySelector('.du-react-overlay')
    expect(dialog.classList.contains('du-react-popup--bottom')).toBe(true)
    expect(dialog.getAttribute('data-state')).toBe('open')
    expect(overlay?.getAttribute('data-state')).toBe('open')
  })

  it('preserves nested themes and token overrides across a custom portal', async () => {
    const target = document.createElement('div')
    document.body.append(target)
    const { unmount } = render(
      <DangoProvider theme="qd-dark" tokens={{ '--du-primary-color': 'red' }}>
        <DangoProvider
          theme="qdm"
          tokens={{ '--du-bg-3': 'pink' }}
          portalContainer={target}
        >
          <Popup title="自定义容器" description="用途说明" open>
            内容
          </Popup>
        </DangoProvider>
      </DangoProvider>,
    )
    const dialog = await screen.findByRole('dialog', { name: '自定义容器' })
    expect(target.contains(dialog)).toBe(true)
    expect(dialog.classList.contains('du-theme-qdm')).toBe(true)
    expect(dialog.style.getPropertyValue('--du-primary-color')).toBe('red')
    expect(dialog.style.getPropertyValue('--du-bg-3')).toBe('pink')
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('用途说明')
    unmount()
    target.remove()
  })

  it('keeps controlled state, reports the closing reason, and supports disabled dismissal', async () => {
    const change = vi.fn()
    const { rerender } = render(
      <DangoProvider>
        <Popup
          title="受控弹层"
          open
          onOpenChange={change}
          closeOnEscape={false}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    expect(change).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '关闭' }))
    expect(change).toHaveBeenLastCalledWith(false, 'close-button')
    expect(screen.getByRole('dialog')).toBeTruthy()
    rerender(
      <DangoProvider>
        <Popup title="受控弹层" open onOpenChange={change} />
      </DangoProvider>,
    )
    await user.keyboard('{Escape}')
    expect(change).toHaveBeenLastCalledWith(false, 'escape')
  })

  it('only dismisses the top nested popup and keeps scroll locked until all layers close', async () => {
    function Nested() {
      const [outer, setOuter] = useState(true)
      const [inner, setInner] = useState(true)
      return (
        <DangoProvider>
          <Popup title="外层" open={outer} onOpenChange={setOuter}>
            <Popup title="内层" open={inner} onOpenChange={setInner} />
          </Popup>
        </DangoProvider>
      )
    }
    const initialOverflow = document.body.style.overflow
    const { unmount } = render(
      <StrictMode>
        <Nested />
      </StrictMode>,
    )
    const user = userEvent.setup()
    await screen.findByRole('dialog', { name: '内层' })
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '内层' })).toBeNull(),
    )
    expect(screen.getByRole('dialog', { name: '外层' })).toBeTruthy()
    expect(document.body.hasAttribute('data-scroll-locked')).toBe(true)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    unmount()
    expect(document.body.style.overflow).toBe(initialOverflow)
    expect(document.body.hasAttribute('data-scroll-locked')).toBe(false)
  })

  it('restores focus to the opener after closing', async () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <DangoProvider>
          <Button onClick={() => setOpen(true)}>打开</Button>
          <Popup title="焦点" open={open} onOpenChange={setOpen}>
            <button>内容按钮</button>
          </Popup>
        </DangoProvider>
      )
    }
    render(<Demo />)
    const user = userEvent.setup()
    const opener = screen.getByText('打开')
    await user.click(opener)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('respects overlay dismissal and reports its reason', async () => {
    const changed = vi.fn()
    const { rerender } = render(
      <DangoProvider>
        <Popup
          open
          title="遮罩"
          closeOnOverlay={false}
          onOpenChange={changed}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(document.querySelector('.du-react-overlay')!)
    expect(changed).not.toHaveBeenCalled()
    rerender(
      <DangoProvider>
        <Popup open title="遮罩" onOpenChange={changed} />
      </DangoProvider>,
    )
    await user.click(document.querySelector('.du-react-overlay')!)
    expect(changed).toHaveBeenCalledWith(false, 'overlay')
  })

  it('cleans up after rapid open/close reversals in StrictMode', () => {
    const view = (open: boolean) => (
      <StrictMode>
        <DangoProvider>
          <Popup open={open} title="快速开关" />
        </DangoProvider>
      </StrictMode>
    )
    const { rerender, unmount } = render(view(false))
    rerender(view(true))
    rerender(view(false))
    rerender(view(true))
    expect(screen.getByRole('dialog', { name: '快速开关' })).toBeTruthy()
    unmount()
    expect(document.querySelector('.du-react-overlay')).toBeNull()
    expect(document.body.hasAttribute('data-scroll-locked')).toBe(false)
    expect(document.body.style.pointerEvents).not.toBe('none')
  })
})

describe('feedback and Dialog', () => {
  it('isolates handles, resolves confirm/cancel explicitly, and cleans up on unmount', async () => {
    const feedback = createFeedback()
    const { unmount } = render(
      <DangoProvider feedback={feedback}>应用</DangoProvider>,
    )
    let loading!: ReturnType<typeof feedback.showLoadingToast>
    let toast!: ReturnType<typeof feedback.showToast>
    act(() => {
      loading = feedback.showLoadingToast('保存中')
      toast = feedback.showToast({ message: '提示', duration: 0 })
    })
    act(() => loading.close())
    expect(screen.queryByText('保存中')).toBeNull()
    expect(screen.getByText('提示')).toBeTruthy()
    await expect(loading.result).resolves.toEqual({ reason: 'close' })
    let dialog!: ReturnType<typeof feedback.showConfirmDialog>
    act(() => {
      dialog = feedback.showConfirmDialog({
        title: '确认操作',
        message: '确定提交？',
      })
    })
    await userEvent.setup().click(screen.getByRole('button', { name: '取消' }))
    await expect(dialog.result).resolves.toEqual({ reason: 'cancel' })
    act(() => {
      dialog = feedback.showConfirmDialog({ title: '第二次确认' })
    })
    await userEvent.setup().click(screen.getByRole('button', { name: '确定' }))
    await expect(dialog.result).resolves.toEqual({ reason: 'confirm' })
    unmount()
    await expect(toast.result).resolves.toEqual({ reason: 'unmount' })
    await expect(feedback.showToast('已卸载的应用').result).resolves.toEqual({
      reason: 'unmount',
    })
  })

  it('expires a toast without closing a loading toast', async () => {
    const feedback = createFeedback()
    render(<DangoProvider feedback={feedback}>应用</DangoProvider>)
    let handle!: ReturnType<typeof feedback.showToast>
    vi.useFakeTimers()
    try {
      act(() => {
        handle = feedback.showToast({ message: '短提示', duration: 100 })
        feedback.showLoadingToast('长期加载')
      })
      await act(async () => {
        vi.advanceTimersByTime(100)
      })
      await expect(handle.result).resolves.toEqual({ reason: 'timeout' })
      expect(screen.queryByText('短提示')).toBeNull()
      expect(screen.getByText('长期加载')).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('prevents duplicate asynchronous confirms, keeps failures open, and allows retry', async () => {
    let finish!: () => void
    const confirm = vi
      .fn()
      .mockRejectedValueOnce(new Error('网络失败'))
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finish = resolve
          }),
      )
    const changed = vi.fn()
    render(
      <DangoProvider>
        <Dialog
          title="异步提交"
          open
          showCancel
          onConfirm={confirm}
          onOpenChange={changed}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(screen.getByText('确定'))
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      '操作失败，请重试',
    )
    expect(changed).not.toHaveBeenCalled()
    await user.click(screen.getByText('确定'))
    await user.click(screen.getByText('确定'))
    await user.keyboard('{Escape}')
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(changed).not.toHaveBeenCalled()
    await act(async () => {
      finish()
    })
    expect(changed).toHaveBeenCalledWith(false, 'confirm')
  })

  it('ignores async completion after unmount', async () => {
    let finish!: () => void
    const confirmed = vi.fn()
    const { unmount } = render(
      <DangoProvider>
        <Dialog
          open
          title="即将卸载"
          onConfirm={() =>
            new Promise<void>((resolve) => {
              finish = resolve
            })
          }
          onConfirmed={confirmed}
        />
      </DangoProvider>,
    )
    await userEvent.setup().click(screen.getByText('确定'))
    unmount()
    await act(async () => {
      finish()
    })
    expect(confirmed).not.toHaveBeenCalled()
  })

  it('supports independent React roots and StrictMode reattachment', async () => {
    const a = createFeedback(),
      b = createFeedback()
    const first = render(
      <StrictMode>
        <DangoProvider feedback={a}>A</DangoProvider>
      </StrictMode>,
    )
    const second = render(<DangoProvider feedback={b}>B</DangoProvider>)
    act(() => {
      a.showToast({ message: 'A 消息', duration: 0 })
      b.showToast({ message: 'B 消息', duration: 0 })
    })
    first.unmount()
    await act(async () => {})
    expect(screen.queryByText('A 消息')).toBeNull()
    expect(screen.getByText('B 消息')).toBeTruthy()
    second.unmount()
  })
})

describe('ImagePreview', () => {
  it('switches images by keyboard, reports errors and retries, and supports original-size viewing', async () => {
    render(
      <DangoProvider>
        <ImagePreview
          open
          images={[
            { src: '/one.png', alt: '凭证一' },
            { src: '/two.png', alt: '凭证二' },
          ]}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    const first = await screen.findByAltText('凭证一')
    fireEvent.load(first)
    await user.click(screen.getByText('查看原图'))
    expect(first.parentElement?.getAttribute('data-zoom')).toBe('true')
    await user.keyboard('{ArrowRight}')
    const second = screen.getByAltText('凭证二')
    fireEvent.error(second)
    expect(screen.getByRole('alert').textContent).toContain('图片加载失败')
    await user.click(screen.getByText('重试'))
    expect(screen.getByAltText('凭证二')).toBeTruthy()
    await user.click(screen.getByLabelText('下一张'))
    expect(screen.getByAltText('凭证一')).toBeTruthy()
  })
})

describe('review regressions: safe errors and mobile viewport', () => {
  it.each(['container', 'provider'] as const)(
    'keeps a transformed %s portal within its own containing block',
    async (mode) => {
      const original = Object.getOwnPropertyDescriptor(window, 'visualViewport')
      const viewport = Object.assign(new EventTarget(), {
        width: 1200,
        height: 800,
        offsetTop: 30,
        offsetLeft: 10,
        scale: 1,
      })
      Object.defineProperty(window, 'visualViewport', {
        configurable: true,
        value: viewport,
      })
      const host = document.createElement('div')
      host.style.cssText =
        'transform:translateZ(0);width:320px;height:480px;overflow:hidden'
      document.body.append(host)
      const listen = vi.spyOn(viewport, 'addEventListener')
      try {
        const { unmount } = render(
          <DangoProvider
            portalContainer={mode === 'provider' ? host : undefined}
          >
            <Popup
              open
              container={mode === 'container' ? host : undefined}
              position="bottom"
              title="容器内表单"
            >
              <input aria-label="姓名" />
            </Popup>
          </DangoProvider>,
        )
        const dialog = await screen.findByRole('dialog'),
          layer = dialog.parentElement!
        expect(host.contains(layer)).toBe(true)
        expect(layer.style.height).toBe('')
        expect(layer.style.width).toBe('')
        expect(layer.style.top).toBe('')
        expect(layer.style.getPropertyValue('--du-viewport-height')).toBe('')
        await act(async () => {
          viewport.height = 360
          viewport.dispatchEvent(new Event('resize'))
        })
        expect(layer.style.height).toBe('')
        expect(listen).not.toHaveBeenCalled()
        unmount()
      } finally {
        host.remove()
        if (original) Object.defineProperty(window, 'visualViewport', original)
        else Reflect.deleteProperty(window, 'visualViewport')
        listen.mockRestore()
      }
    },
  )
  it('clears window viewport dimensions when moving a body portal to a custom container', async () => {
    const original = Object.getOwnPropertyDescriptor(window, 'visualViewport'),
      viewport = Object.assign(new EventTarget(), {
        width: 390,
        height: 844,
        offsetTop: 0,
        offsetLeft: 0,
        scale: 1,
      }),
      host = document.createElement('div')
    document.body.append(host)
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    })
    const view = (container?: HTMLElement) => (
      <DangoProvider>
        <Popup open container={container} title="移动弹层">
          内容
        </Popup>
      </DangoProvider>
    )
    try {
      const { rerender, unmount } = render(view())
      await waitFor(() =>
        expect(screen.getByRole('dialog').parentElement!.style.height).toBe(
          '844px',
        ),
      )
      rerender(view(host))
      await waitFor(() =>
        expect(host.querySelector('[role="dialog"]')).toBeTruthy(),
      )
      expect(
        host.querySelector('[role="dialog"]')!.parentElement!.style.height,
      ).toBe('')
      unmount()
    } finally {
      host.remove()
      if (original) Object.defineProperty(window, 'visualViewport', original)
      else Reflect.deleteProperty(window, 'visualViewport')
    }
  })
  it('uses explicit safe dialog errors while forwarding raw errors to the callback', async () => {
    const error = new Error('internal credentials endpoint failure'),
      report = vi.fn()
    render(
      <DangoProvider>
        <Dialog
          open
          title="保存"
          onConfirm={() => {
            throw error
          }}
          onConfirmError={report}
          confirmErrorMessage="保存失败，请稍后重试"
        />
      </DangoProvider>,
    )
    await userEvent
      .setup()
      .click(await screen.findByRole('button', { name: '确定' }))
    expect(screen.getByRole('alert').textContent).toBe('保存失败，请稍后重试')
    expect(screen.queryByText(error.message)).toBeNull()
    expect(report).toHaveBeenCalledWith(error)
  })
  it('fits the visual viewport after keyboard resize and removes subscriptions on unmount', async () => {
    const original = Object.getOwnPropertyDescriptor(window, 'visualViewport')
    const viewport = Object.assign(new EventTarget(), {
      width: 390,
      height: 844,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
    })
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    })
    const remove = vi.spyOn(viewport, 'removeEventListener')
    try {
      const { unmount } = render(
        <DangoProvider>
          <Popup open position="bottom" title="移动表单">
            <input aria-label="姓名" />
          </Popup>
        </DangoProvider>,
      )
      const dialog = await screen.findByRole('dialog'),
        layer = dialog.parentElement!
      await waitFor(() => expect(layer.style.height).toBe('844px'))
      const input = screen.getByLabelText('姓名')
      input.getBoundingClientRect = () => ({ top: 500, bottom: 540 }) as DOMRect
      dialog.getBoundingClientRect = () => ({ top: 0, bottom: 640 }) as DOMRect
      input.focus()
      await act(async () => {
        viewport.height = 360
        viewport.offsetTop = 40
        viewport.dispatchEvent(new Event('resize'))
      })
      expect(layer.style.height).toBe('360px')
      expect(layer.style.top).toBe('40px')
      expect(layer.style.getPropertyValue('--du-viewport-height')).toBe('360px')
      expect(dialog.scrollTop).toBeGreaterThan(0)
      unmount()
      expect(remove.mock.calls.map(([name]) => name)).toEqual(
        expect.arrayContaining(['resize', 'scroll']),
      )
    } finally {
      if (original) Object.defineProperty(window, 'visualViewport', original)
      else Reflect.deleteProperty(window, 'visualViewport')
      remove.mockRestore()
    }
  })
})
