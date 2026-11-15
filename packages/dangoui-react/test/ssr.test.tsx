// @vitest-environment node
import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'
import { Button, DangoProvider, Popup, createFeedback } from '../src'

it('renders without a document or DOM side effects', () => {
  const html = renderToString(
    <DangoProvider feedback={createFeedback()} theme="qd-dark">
      <Button>服务端按钮</Button>
      <Popup open title="等待 hydration">
        弹层内容
      </Popup>
    </DangoProvider>,
  )
  expect(html).toContain('服务端按钮')
  expect(html).toContain('du-theme-qd-dark')
  expect(html).not.toContain('弹层内容')
})
