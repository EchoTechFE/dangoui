import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Popup, type PopupProps } from './popup'
import { Loading } from './loading'
import { cx, useControllable } from './internal'

export type PreviewImage = string | { src: string; alt?: string }
export interface ImagePreviewProps extends Omit<PopupProps, 'children'> {
  images: readonly PreviewImage[]
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}

interface Point {
  x: number
  y: number
}
interface Transform extends Point {
  scale: number
}
const initialTransform: Transform = { x: 0, y: 0, scale: 1 }
function PreviewSlide({
  image,
  onMove,
}: {
  image: PreviewImage
  onMove: (delta: number) => void
}) {
  const src = typeof image === 'string' ? image : image.src
  const alt = typeof image === 'string' ? '预览图片' : image.alt ?? '预览图片'
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )
  const [retry, setRetry] = useState(0)
  const [transform, setTransform] = useState(initialTransform)
  const latest = useRef(transform),
    viewport = useRef<HTMLDivElement>(null),
    picture = useRef<HTMLImageElement>(null)
  const points = useRef(new Map<number, Point>())
  const gesture = useRef<{
    origin: Transform
    center: Point
    distance: number
    swipe: boolean
  } | null>(null)
  function geometry() {
    const [a, b] = Array.from(points.current.values())
    return {
      center: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
      distance: b ? Math.hypot(a.x - b.x, a.y - b.y) : 0,
    }
  }
  function apply(next: Transform) {
    const box = viewport.current,
      img = picture.current
    const scale = Math.max(1, Math.min(5, next.scale))
    const boundX = Math.max(
      0,
      ((img?.clientWidth ?? 0) * scale - (box?.clientWidth ?? 0)) / 2,
    )
    const boundY = Math.max(
      0,
      ((img?.clientHeight ?? 0) * scale - (box?.clientHeight ?? 0)) / 2,
    )
    latest.current = {
      scale,
      x: Math.max(-boundX, Math.min(boundX, next.x)),
      y: Math.max(-boundY, Math.min(boundY, next.y)),
    }
    setTransform(latest.current)
  }
  function toggleZoom() {
    apply(
      latest.current.scale > 1
        ? initialTransform
        : {
            ...initialTransform,
            scale: Math.max(
              2,
              (picture.current?.naturalWidth ?? 0) /
                Math.max(1, picture.current?.clientWidth ?? 1),
            ),
          },
    )
  }
  function end(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (!points.current.has(event.pointerId)) return
    const start = gesture.current
    if (
      !cancelled &&
      points.current.size === 1 &&
      start?.swipe &&
      latest.current.scale === 1
    ) {
      const dx = event.clientX - start.center.x,
        dy = event.clientY - start.center.y
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
        onMove(dx > 0 ? -1 : 1)
    }
    points.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    gesture.current = points.current.size
      ? { origin: latest.current, ...geometry(), swipe: false }
      : null
  }
  useEffect(() => {
    const win = viewport.current?.ownerDocument.defaultView
    const resize = () => apply(latest.current)
    win?.addEventListener('resize', resize)
    return () => win?.removeEventListener('resize', resize)
  }, [])
  return (
    <div
      ref={viewport}
      className="du-react-preview__viewport"
      data-zoom={transform.scale > 1}
      data-scale={transform.scale}
      onPointerDown={(event) => {
        if (
          event.defaultPrevented ||
          (event.target as HTMLElement).closest('button') ||
          (event.pointerType === 'mouse' && event.button !== 0)
        )
          return
        points.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        })
        event.currentTarget.setPointerCapture?.(event.pointerId)
        gesture.current = {
          origin: latest.current,
          ...geometry(),
          swipe:
            points.current.size === 1 &&
            latest.current.scale === 1 &&
            event.pointerType === 'touch',
        }
      }}
      onPointerMove={(event) => {
        if (!points.current.has(event.pointerId) || !gesture.current) return
        event.preventDefault()
        points.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        })
        const { center, distance } = geometry(),
          start = gesture.current
        const scale =
          start.distance > 0
            ? Math.max(
                1,
                Math.min(5, (start.origin.scale * distance) / start.distance),
              )
            : start.origin.scale
        const rect = event.currentTarget.getBoundingClientRect()
        const anchor = {
          x: start.center.x - rect.left - rect.width / 2,
          y: start.center.y - rect.top - rect.height / 2,
        }
        const ratio = scale / start.origin.scale
        apply({
          scale,
          x:
            start.origin.x * ratio +
            anchor.x * (1 - ratio) +
            center.x -
            start.center.x,
          y:
            start.origin.y * ratio +
            anchor.y * (1 - ratio) +
            center.y -
            start.center.y,
        })
      }}
      onPointerUp={(event) => end(event)}
      onPointerCancel={(event) => end(event, true)}
      onLostPointerCapture={(event) => {
        if (event.target !== event.currentTarget) return
        if (points.current.has(event.pointerId)) end(event, true)
      }}
    >
      {status === 'loading' && <Loading label="图片加载中" />}
      {status === 'error' ? (
        <div role="alert">
          图片加载失败{' '}
          <button
            type="button"
            onClick={() => {
              setStatus('loading')
              setRetry((v) => v + 1)
            }}
          >
            重试
          </button>
        </div>
      ) : (
        <img
          ref={picture}
          key={retry}
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          onDoubleClick={toggleZoom}
        />
      )}
      {status === 'loaded' && (
        <button
          className="du-react-preview__zoom"
          type="button"
          onClick={toggleZoom}
        >
          {transform.scale > 1 ? '适应屏幕' : '查看原图'}
        </button>
      )}
    </div>
  )
}

export function ImagePreview({
  images,
  index,
  defaultIndex = 0,
  onIndexChange,
  open,
  onKeyDown,
  className,
  ...props
}: ImagePreviewProps) {
  const [selected, setSelected] = useControllable(
    index,
    defaultIndex,
    onIndexChange,
  )
  const current = Math.max(0, Math.min(selected, images.length - 1))
  const currentImage = images[current]
  function move(delta: number) {
    if (images.length > 1)
      setSelected((current + delta + images.length) % images.length)
  }
  return (
    <Popup
      {...props}
      open={open}
      aria-label="图片预览"
      className={cx('du-react-preview', className)}
      closeOnOverlay={false}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
        if (!event.defaultPrevented && event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        }
      }}
    >
      {currentImage ? (
        <PreviewSlide
          key={`${current}-${
            typeof currentImage === 'string' ? currentImage : currentImage.src
          }`}
          image={currentImage}
          onMove={move}
        />
      ) : (
        <p role="status">暂无图片</p>
      )}
      {images.length > 1 && (
        <div className="du-react-preview__navigation">
          <button type="button" aria-label="上一张" onClick={() => move(-1)}>
            ←
          </button>
          <span aria-live="polite">
            {current + 1} / {images.length}
          </span>
          <button type="button" aria-label="下一张" onClick={() => move(1)}>
            →
          </button>
        </div>
      )}
    </Popup>
  )
}
