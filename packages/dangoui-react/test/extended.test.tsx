import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DangoProvider,
  ActionSheet,
  NoticeBar,
  Snackbar,
  Tooltip,
  Swiper,
  SwiperItem,
  Rate,
  Card,
  Tag,
  TagsPanel,
  Badge,
  Image,
  AvatarGroup,
  Steps,
  Skeleton,
  Transition,
  NavigationBar,
} from '../src'

afterEach(() => {
  vi.useRealTimers()
})
describe('feedback and display interactions', () => {
  it('skips disabled actions and reports selection and close independently', async () => {
    const select = vi.fn(),
      close = vi.fn()
    render(
      <DangoProvider>
        <ActionSheet
          open
          items={[{ label: '分享' }, { label: '禁用', disabled: true }]}
          onSelect={select}
          onOpenChange={close}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(await screen.findByText('禁用'))
    expect(select).not.toHaveBeenCalled()
    await user.click(screen.getByText('分享'))
    expect(select).toHaveBeenCalledWith({ label: '分享' }, 0)
    expect(close).toHaveBeenCalledWith(false, 'confirm')
  })
  it('closes notifications, calls link actions and expires a Snackbar', async () => {
    const link = vi.fn(),
      close = vi.fn()
    render(
      <DangoProvider>
        <NoticeBar text="通知内容" linkText="查看详情" onLink={link} closable />
        <Snackbar duration={100} onOpenChange={close}>
          提示内容
        </Snackbar>
      </DangoProvider>,
    )
    await userEvent.setup().click(screen.getByText('查看详情'))
    expect(link).toHaveBeenCalledOnce()
    await userEvent.setup().click(screen.getByLabelText('关闭通知'))
    expect(screen.queryByText('通知内容')).toBeNull()
    await waitFor(() => expect(close).toHaveBeenCalledWith(false))
  })
  it('supports collapse cards, removable tags and expanding a tag panel', async () => {
    const remove = vi.fn()
    render(
      <>
        <Card title="详情" mode="collapse" defaultOpen={false}>
          折叠内容
        </Card>
        <Tag closable onClose={() => remove('a')}>
          标签
        </Tag>
        <TagsPanel
          tags={[
            { text: '一', value: 1 },
            { text: '二', value: 2 },
          ]}
          canToggle
          collapseCount={1}
          onRemove={remove}
        />
      </>,
    )
    const user = userEvent.setup()
    expect(screen.getByText('折叠内容').closest('[hidden]')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '详情' }))
    expect(screen.getByText('折叠内容').closest('[hidden]')).toBeNull()
    await user.click(screen.getAllByLabelText('移除标签')[0])
    expect(remove).toHaveBeenCalledWith('a')
    expect(screen.queryByText('二')).toBeNull()
    await user.click(screen.getByText('展开 1 项'))
    expect(screen.getByText('二')).toBeTruthy()
  })
  it('renders badge overflow, avatar limits and current step accessibly', () => {
    render(
      <>
        <Badge value={100} max={99}>
          <span>消息</span>
        </Badge>
        <AvatarGroup avatars={['/1.png', '/2.png', '/3.png']} limit={2} />
        <Steps
          steps={[{ title: '已提交' }, { title: '寄仓中' }]}
          activeIndex={1}
        />
      </>,
    )
    expect(screen.getByLabelText('100').textContent).toBe('99+')
    expect(screen.getByText('+1')).toBeTruthy()
    expect(
      screen.getByText('寄仓中').closest('li')?.getAttribute('aria-current'),
    ).toBe('step')
  })
  it('recovers from image failure when src changes and replaces skeleton content', () => {
    const { rerender } = render(
      <>
        <Image src="/bad" alt="商品图" />
        <Skeleton loading>业务内容</Skeleton>
      </>,
    )
    fireEvent.error(screen.getByAltText('商品图'))
    expect(screen.getByLabelText('商品图')).toBeTruthy()
    expect(screen.queryByText('业务内容')).toBeNull()
    rerender(
      <>
        <Image src="/good" alt="商品图" />
        <Skeleton loading={false}>业务内容</Skeleton>
      </>,
    )
    expect((screen.getByAltText('商品图') as HTMLImageElement).src).toContain(
      '/good',
    )
    expect(screen.getByText('业务内容')).toBeTruthy()
  })
})
describe('web interactions', () => {
  it('selects half ratings and prevents readOnly changes', async () => {
    const change = vi.fn(),
      user = userEvent.setup()
    const { rerender } = render(
      <Rate half defaultValue={1} onValueChange={change} withText />,
    )
    await user.click(screen.getByRole('radio', { name: '2.5 分' }))
    expect(change).toHaveBeenCalledWith(2.5)
    expect(screen.getByText('2.5 分')).toBeTruthy()
    rerender(<Rate half defaultValue={1} onValueChange={change} readOnly />)
    await user.click(screen.getByRole('radio', { name: '3 分' }))
    expect(change).toHaveBeenCalledTimes(1)
  })
  it('uses Tooltip focus and Escape with a themed Portal', async () => {
    render(
      <DangoProvider theme="qd-dark">
        <Tooltip content="用途说明" delay={0}>
          焦点目标
        </Tooltip>
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.tab()
    const tip = await screen.findByRole('tooltip')
    expect(tip.textContent).toBe('用途说明')
    expect(tip.classList.contains('du-theme-qd-dark')).toBe(true)
    expect(screen.getByText('焦点目标').getAttribute('aria-describedby')).toBe(
      tip.id,
    )
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
  it('navigates a Swiper by keyboard and wraps only when loop is enabled', async () => {
    const { rerender } = render(
      <Swiper loop={false}>
        <SwiperItem>第一屏</SwiperItem>
        <SwiperItem>第二屏</SwiperItem>
      </Swiper>,
    )
    const user = userEvent.setup()
    expect(
      (screen.getByLabelText('上一页') as HTMLButtonElement).disabled,
    ).toBe(true)
    await user.click(screen.getByLabelText('下一页'))
    expect(
      screen.getByText('第一屏').closest('[aria-hidden="true"]'),
    ).toBeTruthy()
    expect(
      (screen.getByLabelText('下一页') as HTMLButtonElement).disabled,
    ).toBe(true)
    rerender(
      <Swiper loop>
        <SwiperItem>第一屏</SwiperItem>
        <SwiperItem>第二屏</SwiperItem>
      </Swiper>,
    )
    await user.click(screen.getByLabelText('下一页'))
    expect(
      screen.getByText('第一屏').closest('[aria-hidden="true"]'),
    ).toBeNull()
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' })
    expect(
      screen.getByText('第二屏').closest('[aria-hidden="true"]'),
    ).toBeNull()
  })
  it('cleans autoplay and transition timers and preserves rapid transition reversals', async () => {
    vi.useFakeTimers()
    const afterLeave = vi.fn(),
      changed = vi.fn()
    const { rerender, unmount } = render(
      <>
        <Swiper autoplay interval={200} onValueChange={changed}>
          <div>A</div>
          <div>B</div>
        </Swiper>
        <Transition duration={100} show onAfterLeave={afterLeave}>
          动画内容
        </Transition>
      </>,
    )
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    expect(changed).toHaveBeenCalledWith(1)
    rerender(
      <Transition duration={100} show={false} onAfterLeave={afterLeave}>
        动画内容
      </Transition>,
    )
    rerender(
      <Transition duration={100} show onAfterLeave={afterLeave}>
        动画内容
      </Transition>,
    )
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    expect(afterLeave).not.toHaveBeenCalled()
    expect(screen.getByText('动画内容')).toBeTruthy()
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('keeps host navigation explicit and never performs a browser back implicitly', async () => {
    const back = vi.fn(),
      share = vi.fn()
    render(
      <NavigationBar title="页面" onBack={back} share onShare={share} fixed />,
    )
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('返回'))
    await user.click(screen.getByLabelText('分享'))
    expect(back).toHaveBeenCalledOnce()
    expect(share).toHaveBeenCalledOnce()
  })
})

describe('review regressions: lifecycle and H5 interactions', () => {
  it('pauses autoplay during a touch interaction and resumes after cancellation', async () => {
    vi.useFakeTimers()
    const changed = vi.fn()
    render(
      <Swiper autoplay interval={200} onValueChange={changed}>
        <div>A</div>
        <div>B</div>
      </Swiper>,
    )
    fireEvent.pointerDown(screen.getByRole('group', { name: '1 / 2' }), {
      pointerType: 'touch',
      pointerId: 1,
      clientX: 200,
      clientY: 100,
    })
    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    expect(changed).not.toHaveBeenCalled()
    fireEvent.pointerCancel(screen.getByRole('region'), { pointerId: 1 })
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    expect(changed).toHaveBeenCalledWith(1)
  })
  it('does not emit a leave callback when initially hidden', async () => {
    vi.useFakeTimers()
    const leave = vi.fn(),
      enter = vi.fn()
    const view = (show: boolean) => (
      <Transition
        show={show}
        duration={100}
        onAfterLeave={leave}
        onAfterEnter={enter}
      >
        内容
      </Transition>
    )
    const { rerender } = render(view(false))
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    expect(leave).not.toHaveBeenCalled()
    rerender(view(true))
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    expect(enter).toHaveBeenCalledOnce()
    rerender(view(false))
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    expect(leave).toHaveBeenCalledOnce()
  })
  it('does not use the first rating label for zero stars', () => {
    render(
      <Rate
        defaultValue={0}
        withText
        textList={['很差', '不好', '一般', '不错', '很好']}
      />,
    )
    expect(screen.getByText('0 分')).toBeTruthy()
    expect(screen.queryByText('很差')).toBeNull()
  })
  it('tracks a container scroll source and cleans up its listener', () => {
    const { unmount } = render(
      <DangoProvider theme="qd-dark">
        <div
          data-testid="scroll"
          style={{ overflowY: 'auto', height: 200 }}
          ref={(node) => {
            if (node)
              Object.defineProperties(node, {
                clientHeight: { configurable: true, value: 200 },
                scrollHeight: { configurable: true, value: 600 },
              })
          }}
        >
          <NavigationBar title="商家" transparent appearThreshold={100} />
        </div>
      </DangoProvider>,
    )
    const source = screen.getByTestId('scroll'),
      nav = screen.getByRole('navigation'),
      remove = vi.spyOn(window, 'removeEventListener')
    source.scrollTop = 50
    fireEvent.scroll(source)
    expect(nav.style.getPropertyValue('--du-nav-opacity')).toBe('0.5')
    expect(nav.style.background).not.toContain('255')
    source.scrollTop = 150
    fireEvent.scroll(source)
    expect(nav.style.getPropertyValue('--du-nav-opacity')).toBe('1')
    unmount()
    expect(remove.mock.calls.some(([name]) => name === 'scroll')).toBe(true)
    remove.mockRestore()
  })
  it('ignores non-scrolling overflow ancestors and follows window scrolling', () => {
    const style = vi.spyOn(window, 'getComputedStyle').mockImplementation(
      (node) =>
        ({
          overflowY:
            node.getAttribute('data-testid') === 'app' ? 'auto' : 'visible',
        }) as CSSStyleDeclaration,
    )
    const owner = document.defaultView!
    const original = Object.getOwnPropertyDescriptor(owner, 'scrollY')
    try {
      render(
        <div data-testid="app" style={{ overflowX: 'hidden' }}>
          <NavigationBar transparent />
        </div>,
      )
      Object.defineProperty(owner, 'scrollY', {
        configurable: true,
        value: 75,
      })
      fireEvent.scroll(owner)
      expect(
        screen
          .getByRole('navigation')
          .style.getPropertyValue('--du-nav-opacity'),
      ).toBe('0.75')
    } finally {
      style.mockRestore()
      if (original) Object.defineProperty(owner, 'scrollY', original)
      else Reflect.deleteProperty(owner, 'scrollY')
    }
  })
  it('discovers an ancestor that becomes scrollable after content loads', () => {
    render(
      <div data-testid="scroll" style={{ overflowY: 'auto' }}>
        <NavigationBar transparent />
      </div>,
    )
    const source = screen.getByTestId('scroll')
    Object.defineProperties(source, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 600 },
    })
    source.scrollTop = 50
    fireEvent.scroll(source)
    expect(
      screen.getByRole('navigation').style.getPropertyValue('--du-nav-opacity'),
    ).toBe('0.5')
  })
  it('supports an explicit scroll target outside the ancestor tree', () => {
    const source = document.createElement('div')
    render(
      <NavigationBar
        title="页面"
        transparent
        scrollTarget={source}
        appearThreshold={20}
      />,
    )
    source.scrollTop = 10
    fireEvent.scroll(source)
    expect(
      screen.getByRole('navigation').style.getPropertyValue('--du-nav-opacity'),
    ).toBe('0.5')
  })
  it('drags Swiper horizontally, ignores vertical/cancelled gestures, and keeps inactive content inert', () => {
    render(
      <Swiper loop={false}>
        <SwiperItem>
          <button>第一屏</button>
        </SwiperItem>
        <SwiperItem>
          <button>第二屏</button>
        </SwiperItem>
      </Swiper>,
    )
    const first = screen.getByRole('group', { name: '1 / 2' }),
      region = screen.getByRole('region')
    const pointer = (clientX: number, clientY = 100) => ({
      pointerType: 'touch',
      pointerId: 1,
      clientX,
      clientY,
    })
    fireEvent.pointerDown(first, pointer(200))
    fireEvent.pointerMove(region, pointer(120))
    expect(first.style.transform).toContain('-80px')
    expect(first.style.transitionDuration).toBe('0ms')
    fireEvent.lostPointerCapture(first, pointer(120))
    fireEvent.pointerUp(region, pointer(100))
    expect(first.getAttribute('aria-hidden')).toBe('true')
    expect(first.hasAttribute('inert')).toBe(true)
    expect(first.style.transform).toContain('-100%')
    expect(first.style.transitionDuration).toBe('250ms')
    const second = screen.getByRole('group', { name: '2 / 2' })
    fireEvent.pointerDown(second, pointer(100))
    fireEvent.pointerMove(region, pointer(200, 300))
    fireEvent.pointerUp(region, pointer(200, 300))
    expect(second.getAttribute('aria-hidden')).toBe('false')
    fireEvent.pointerDown(second, pointer(100))
    fireEvent.pointerCancel(region, pointer(200))
    fireEvent.pointerUp(region, pointer(200))
    expect(second.getAttribute('aria-hidden')).toBe('false')
  })
  it('wraps autoplay from the last slide to its immediate next neighbour', async () => {
    vi.useFakeTimers()
    const { container, rerender } = render(
      <Swiper defaultValue={3} autoplay interval={500}>
        {['A', 'B', 'C', 'D'].map((text) => (
          <SwiperItem key={text}>
            <input aria-label={text} defaultValue={text} />
          </SwiperItem>
        ))}
      </Swiper>,
    )
    const slides = container.querySelectorAll<HTMLElement>(
      '.du-react-swiper__slide',
    )
    expect(slides[0].style.transform).toContain('100%')
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    expect(slides[3].style.transform).toContain('-100%')
    expect(slides[0].style.transform).toContain('0%')
    expect(slides[1].style.transform).toContain('100%')
    expect(slides[2].style.transform).toContain('-200%')
    expect(container.querySelectorAll('input').length).toBe(4)
    expect(slides[3].hasAttribute('inert')).toBe(true)
    expect(slides[0].hasAttribute('inert')).toBe(false)
    rerender(
      <Swiper duration={500}>
        {['A', 'B', 'C', 'D'].map((text) => (
          <SwiperItem key={text}>
            <input aria-label={text} defaultValue={text} />
          </SwiperItem>
        ))}
      </Swiper>,
    )
    expect(slides[2].style.transform).toContain('-200%')
  })
  it.each([2, 4])(
    'keeps the previous neighbour under a rightward edge drag with %s slides',
    (count) => {
      const { container } = render(
        <Swiper>
          {Array.from({ length: count }, (_, i) => (
            <SwiperItem key={i}>第 {i + 1} 屏</SwiperItem>
          ))}
        </Swiper>,
      )
      const slides = container.querySelectorAll<HTMLElement>(
          '.du-react-swiper__slide',
        ),
        region = screen.getByRole('region'),
        pointer = (clientX: number) => ({
          pointerType: 'touch',
          pointerId: 1,
          clientX,
          clientY: 100,
        })
      fireEvent.pointerDown(slides[0], pointer(100))
      fireEvent.pointerMove(region, pointer(180))
      expect(slides[count - 1].style.transform).toContain('-100% + 80px')
      fireEvent.pointerUp(region, pointer(180))
      expect(slides[0].style.transform).toContain('100%')
      expect(slides[count - 1].style.transform).toContain('0%')
      expect(slides[count - 1].getAttribute('aria-hidden')).toBe('false')
    },
  )
  it('preserves field state across two-slide wrapping in both directions and controlled updates', () => {
    const view = (value?: number) => (
      <Swiper value={value}>
        <SwiperItem>
          <input aria-label="草稿" defaultValue="旧值" />
        </SwiperItem>
        <SwiperItem>B</SwiperItem>
      </Swiper>
    )
    const { container, rerender } = render(view())
    fireEvent.change(screen.getByLabelText('草稿'), {
      target: { value: '保留' },
    })
    fireEvent.click(screen.getByLabelText('上一页'))
    let slides = container.querySelectorAll<HTMLElement>(
      '.du-react-swiper__slide',
    )
    expect(slides[0].style.transform).toContain('100%')
    expect(slides[1].style.transform).toContain('0%')
    fireEvent.click(screen.getByLabelText('下一页'))
    expect((screen.getByLabelText('草稿') as HTMLInputElement).value).toBe(
      '保留',
    )
    expect(slides[1].style.transform).toContain('-100%')
    // A separate controlled instance can also cross the seam without a navigation event.
    rerender(
      <Swiper key="controlled" value={0}>
        {['A', 'B', 'C', 'D']}
      </Swiper>,
    )
    rerender(
      <Swiper key="controlled" value={3}>
        {['A', 'B', 'C', 'D']}
      </Swiper>,
    )
    slides = container.querySelectorAll<HTMLElement>('.du-react-swiper__slide')
    expect(slides[0].style.transform).toContain('100%')
    expect(slides[3].style.transform).toContain('0%')
  })
})
