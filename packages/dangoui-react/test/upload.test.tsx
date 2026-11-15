import { StrictMode, createRef, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Form,
  FormItem,
  Upload,
  type UploadFile,
  type UploadHandle,
  type UploadResult,
} from '../src'

function deferred<T>() {
  let resolve!: (v: T) => void, reject!: (error: Error) => void
  const promise = new Promise<T>((a, b) => {
    resolve = a
    reject = b
  })
  return { promise, resolve, reject }
}
function file(name = 'a.png') {
  return new File(['data'], name, { type: 'image/png' })
}
afterEach(() => {
  vi.restoreAllMocks()
})

describe('Upload form integration', () => {
  it('inherits Form and FormItem disabled state for selection and removal', async () => {
    const choose = vi.fn().mockResolvedValue([file()]),
      changed = vi.fn(),
      ref = createRef<UploadHandle>()
    const view = (formDisabled: boolean, itemDisabled?: boolean) => (
      <Form disabled={formDisabled}>
        <FormItem label="图片" disabled={itemDisabled}>
          <Upload
            ref={ref}
            chooseFiles={choose}
            onValueChange={changed}
            defaultValue={[
              {
                uid: 'old',
                name: 'old.png',
                status: 'success',
                url: '/old.png',
              },
            ]}
          />
        </FormItem>
      </Form>
    )
    const { rerender } = render(view(true))
    expect(
      (screen.getByLabelText('图片', { selector: 'input' }) as HTMLInputElement)
        .disabled,
    ).toBe(true)
    expect(
      (screen.getByRole('button', { name: '上传' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    expect(screen.queryByLabelText('删除 old.png')).toBeNull()
    await userEvent.setup().click(screen.getByRole('button', { name: '上传' }))
    act(() => ref.current?.addFiles([file()]))
    expect(choose).not.toHaveBeenCalled()
    expect(changed).not.toHaveBeenCalled()
    rerender(view(false, true))
    expect(
      (screen.getByLabelText('图片', { selector: 'input' }) as HTMLInputElement)
        .disabled,
    ).toBe(true)
    rerender(view(false))
    expect(
      (screen.getByLabelText('图片', { selector: 'input' }) as HTMLInputElement)
        .disabled,
    ).toBe(false)
    expect(screen.getByLabelText('删除 old.png')).toBeTruthy()
  })
  it('associates the label and error, validates required files, and uses the custom picker from the label', async () => {
    const choose = vi.fn().mockResolvedValue([file()])
    render(
      <Form>
        <FormItem label="商品图片" required error="请上传图片">
          <Upload chooseFiles={choose} />
        </FormItem>
      </Form>,
    )
    const input = screen.getByLabelText(/商品图片/, {
        selector: 'input',
      }) as HTMLInputElement,
      group = screen.getByRole('group', { name: '商品图片' })
    expect(input.labels?.[0]?.htmlFor).toBe(input.id)
    expect(input.required).toBe(true)
    expect(input.checkValidity()).toBe(false)
    expect(input.hidden).toBe(false)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(
      document.getElementById(input.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('请上传图片')
    await userEvent.setup().click(input.labels![0])
    expect(choose).toHaveBeenCalledOnce()
    expect(screen.getByLabelText('删除 a.png')).toBeTruthy()
    expect(input.required).toBe(false)
    expect(input.getAttribute('aria-required')).toBe('true')
    expect(input.checkValidity()).toBe(true)
    await userEvent.setup().click(screen.getByLabelText('删除 a.png'))
    expect(input.required).toBe(true)
    expect(input.checkValidity()).toBe(false)
  })
  it.each(['disabled', 'readOnly'] as const)(
    'rejects a custom picker result after %s changes',
    async (property) => {
      const picked = deferred<readonly File[]>(),
        upload = vi.fn(),
        changed = vi.fn()
      const view = (inactive: boolean) => (
        <Upload
          {...{ [property]: inactive }}
          chooseFiles={() => picked.promise}
          upload={upload}
          onValueChange={changed}
        />
      )
      const { rerender } = render(view(false))
      await userEvent
        .setup()
        .click(screen.getByRole('button', { name: '上传' }))
      rerender(view(true))
      await act(async () => picked.resolve([file()]))
      expect(upload).not.toHaveBeenCalled()
      expect(changed).not.toHaveBeenCalled()
      expect(screen.queryByLabelText('删除 a.png')).toBeNull()
    },
  )
  it('uses the latest limits when a custom picker finishes', async () => {
    const picked = deferred<readonly File[]>(),
      error = vi.fn(),
      upload = vi.fn()
    const view = (maxCount: number) => (
      <Upload
        maxCount={maxCount}
        chooseFiles={() => picked.promise}
        upload={upload}
        onUploadError={error}
      />
    )
    const { rerender } = render(view(2))
    await userEvent.setup().click(screen.getByRole('button', { name: '上传' }))
    rerender(view(1))
    await act(async () => picked.resolve([file(), file('b.png')]))
    expect(upload).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledOnce()
    expect(error.mock.calls[0][0].message).toBe('最多上传 1 个文件')
  })
})

describe('Upload asynchronous ownership', () => {
  it('invalidates a native picker opened from the field label after changing session', async () => {
    const upload = vi.fn()
    const view = (sessionKey: string) => (
      <FormItem label="图片">
        <Upload sessionKey={sessionKey} upload={upload} />
      </FormItem>
    )
    const { rerender } = render(view('shop-a'))
    const input = screen.getByLabelText('图片', {
      selector: 'input',
    }) as HTMLInputElement
    await userEvent.setup().click(input.labels![0])
    rerender(view('shop-b'))
    fireEvent.change(input, { target: { files: [file()] } })
    expect(upload).not.toHaveBeenCalled()
    expect(screen.queryByLabelText('删除 a.png')).toBeNull()
  })
  it('ignores a native file picker result opened before switching session', async () => {
    const upload = vi.fn(),
      changed = vi.fn()
    const view = (sessionKey: string) => (
      <Upload sessionKey={sessionKey} upload={upload} onValueChange={changed} />
    )
    const { rerender } = render(view('shop-a'))
    await userEvent.setup().click(screen.getByRole('button', { name: '上传' }))
    rerender(view('shop-b'))
    fireEvent.change(screen.getByLabelText('选择上传文件'), {
      target: { files: [file()] },
    })
    expect(upload).not.toHaveBeenCalled()
    expect(screen.queryByLabelText('删除 a.png')).toBeNull()
  })
  it('tracks parallel uploads by stable UID even when results arrive out of order', async () => {
    const a = deferred<UploadResult>(),
      b = deferred<UploadResult>()
    const change = vi.fn(),
      upload = vi.fn((item: UploadFile) =>
        item.name === 'a.png' ? a.promise : b.promise,
      )
    render(<Upload upload={upload} onValueChange={change} />)
    await userEvent
      .setup()
      .upload(screen.getByLabelText('选择上传文件'), [file(), file('b.png')])
    expect(upload).toHaveBeenCalledTimes(2)
    await act(async () => b.resolve({ url: '/b.png' }))
    await act(async () => a.resolve({ url: '/a.png' }))
    const result = change.mock.calls[
      change.mock.calls.length - 1
    ][0] as UploadFile[]
    expect(result.map((item) => [item.name, item.url, item.status])).toEqual([
      ['a.png', '/a.png', 'success'],
      ['b.png', '/b.png', 'success'],
    ])
    expect(new Set(result.map((item) => item.uid)).size).toBe(2)
  })
  it('aborts removal, prevents stale callbacks from restoring the file, and ignores progress', async () => {
    const pending = deferred<UploadResult>(),
      changed = vi.fn()
    let signal!: AbortSignal, progress!: (percent: number) => void
    render(
      <Upload
        upload={(_item, context) => {
          signal = context.signal
          progress = context.onProgress
          return pending.promise
        }}
        onValueChange={changed}
      />,
    )
    const user = userEvent.setup()
    await user.upload(screen.getByLabelText('选择上传文件'), file())
    await user.click(screen.getByLabelText('删除 a.png'))
    expect(signal.aborted).toBe(true)
    const calls = changed.mock.calls.length
    await act(async () => {
      progress(50)
      pending.resolve({ url: '/late.png' })
    })
    expect(changed).toHaveBeenCalledTimes(calls)
    expect(changed).toHaveBeenLastCalledWith([])
    expect(screen.queryByLabelText('预览 a.png')).toBeNull()
  })
  it('retries failures under the same UID, suppresses cancelled results and bounds progress', async () => {
    const change = vi.fn(),
      retry = deferred<UploadResult>(),
      upload = vi
        .fn()
        .mockRejectedValueOnce(new Error('网络失败'))
        .mockImplementationOnce((_item, { onProgress }) => {
          onProgress(150)
          return retry.promise
        })
    render(<Upload upload={upload} onValueChange={change} />)
    const user = userEvent.setup()
    await user.upload(screen.getByLabelText('选择上传文件'), file())
    await screen.findByText('网络失败')
    const uid = (change.mock.calls[0][0] as UploadFile[])[0].uid
    await user.click(screen.getByLabelText('重试 a.png'))
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '100',
    )
    expect(screen.getByRole('status').textContent).not.toContain('%')
    await user.click(screen.getByLabelText('取消 a.png'))
    expect(screen.getByText('已取消')).toBeTruthy()
    await act(async () => retry.resolve({ url: '/cancelled.png' }))
    const latest = (
      change.mock.calls[change.mock.calls.length - 1][0] as UploadFile[]
    )[0]
    expect(latest.uid).toBe(uid)
    expect(latest.status).toBe('cancelled')
    expect(latest.url).toBeUndefined()
  })
  it('invalidates choose and upload operations after changing shop scope or unmounting', async () => {
    const picked = deferred<readonly File[]>(),
      pending = deferred<UploadResult>(),
      changed = vi.fn()
    const upload = vi.fn(() => pending.promise),
      choose = vi.fn(() => picked.promise)
    const view = (key: string) => (
      <StrictMode>
        <Upload
          sessionKey={key}
          chooseFiles={choose}
          upload={upload}
          onValueChange={changed}
        />
      </StrictMode>
    )
    const { rerender, unmount } = render(view('shop-a'))
    await userEvent.setup().click(screen.getByText('上传'))
    rerender(view('shop-b'))
    await act(async () => picked.resolve([file()]))
    expect(upload).not.toHaveBeenCalled()
    rerender(
      <Upload sessionKey="shop-b" upload={upload} onValueChange={changed} />,
    )
    await userEvent
      .setup()
      .upload(screen.getByLabelText('选择上传文件'), file())
    unmount()
    const calls = changed.mock.calls.length
    await act(async () => pending.resolve({ url: '/late.png' }))
    expect(changed).toHaveBeenCalledTimes(calls)
  })
  it('aborts a controlled file removed by the parent and revokes only owned object URLs', async () => {
    const urls = new Set<string>()
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      const url = `blob:owned-${urls.size}`
      urls.add(url)
      return url
    })
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const pending = deferred<UploadResult>(),
      ref = createRef<UploadHandle>()
    function Demo() {
      const [items, setItems] = useState<UploadFile[]>([
        {
          uid: 'remote',
          name: 'remote',
          status: 'success',
          url: '/remote.png',
          thumbUrl: '/remote.png',
        },
      ])
      return (
        <>
          <Upload
            ref={ref}
            value={items}
            onValueChange={setItems}
            upload={() => pending.promise}
          />
          <button type="button" onClick={() => setItems([])}>
            外部清空
          </button>
        </>
      )
    }
    render(<Demo />)
    const user = userEvent.setup()
    await user.upload(screen.getByLabelText('选择上传文件'), file())
    await user.click(screen.getByText('外部清空'))
    expect(revoke).toHaveBeenCalledWith('blob:owned-0')
    expect(revoke).not.toHaveBeenCalledWith('/remote.png')
    await act(async () => pending.resolve({ url: '/late.png' }))
    expect(screen.queryByLabelText('预览 a.png')).toBeNull()
  })
  it('treats choosing cancellation as normal and enforces limits before uploading', async () => {
    const error = vi.fn(),
      upload = vi.fn(),
      choose = vi.fn().mockResolvedValue(null)
    const { rerender } = render(
      <Upload chooseFiles={choose} upload={upload} onUploadError={error} />,
    )
    await userEvent.setup().click(screen.getByText('上传'))
    expect(error).not.toHaveBeenCalled()
    expect(upload).not.toHaveBeenCalled()
    rerender(
      <Upload upload={upload} maxCount={1} maxSize={1} onUploadError={error} />,
    )
    fireEvent.change(screen.getByLabelText('选择上传文件'), {
      target: { files: [file(), file('b.png')] },
    })
    expect(error).toHaveBeenCalledTimes(1)
    fireEvent.change(screen.getByLabelText('选择上传文件'), {
      target: { files: [file()] },
    })
    expect(error).toHaveBeenCalledTimes(2)
    expect(upload).not.toHaveBeenCalled()
  })
  it('handles beforeUpload rejection and cancellation without starting the adapter', async () => {
    const upload = vi.fn(),
      error = vi.fn()
    const { rerender } = render(
      <Upload
        beforeUpload={async () => false}
        upload={upload}
        onUploadError={error}
      />,
    )
    await userEvent
      .setup()
      .upload(screen.getByLabelText('选择上传文件'), file())
    await screen.findByText('已取消')
    expect(upload).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    rerender(
      <Upload
        beforeUpload={async () => {
          throw new Error('文件校验失败')
        }}
        upload={upload}
        onUploadError={error}
      />,
    )
    await userEvent
      .setup()
      .upload(screen.getByLabelText('选择上传文件'), file('b.png'))
    await screen.findByText('文件校验失败')
    expect(error).toHaveBeenCalledTimes(1)
  })
})
