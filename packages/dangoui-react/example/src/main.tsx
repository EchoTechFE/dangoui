import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Button,
  DangoProvider,
  Popup,
  useFeedback,
  type ThemeName,
} from 'dangoui-react'
import IconArrowHeavyRight from 'dangoui-react/icons/arrow-heavy-right'
import IconCompleteCircle from 'dangoui-react/icons/complete-circle'
import 'dangoui-react/style.css'
import 'uno.css'
import './style.css'
import { Components } from './Components'

const receipt = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><rect width="600" height="900" fill="#f2f0ff"/><rect x="60" y="80" width="480" height="740" rx="20" fill="white"/><text x="100" y="160" font-family="sans-serif" font-size="30" fill="#7c66ff">DANGO · RECEIPT</text><path d="M100 220h400M100 300h300M100 350h250M100 500h400M100 700h400" stroke="#ddd" stroke-width="8"/><text x="100" y="760" font-family="sans-serif" font-size="24" fill="#666">DEMO / 2026-11-15</text></svg>',
)}`

function DepositDemo() {
  const feedback = useFeedback()
  const [address, setAddress] = useState(false)
  const [details, setDetails] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  async function submit() {
    const result = await feedback.showConfirmDialog({
      title: '确认提交寄仓',
      message: '请确认收货信息与商品明细。此示例使用模拟提交。',
      onConfirm: () => new Promise<void>((resolve) => setTimeout(resolve, 600)),
    }).result
    if (result.reason === 'confirm') {
      setSubmitted(true)
      feedback.showToast('寄仓申请已提交')
    }
  }
  return (
    <main className="demo-card">
      <p className="eyebrow">DANGO UI / REACT</p>
      <h1>让好物，安心抵达。</h1>
      <p className="subtitle">寄仓流程 · 基础与反馈组件示例</p>
      <section>
        <h2>寄仓信息</h2>
        <button className="address-row" onClick={() => setAddress(true)}>
          <span>
            <strong>千岛寄仓中心</strong>
            <small>查看收货信息与注意事项</small>
          </span>
          <IconArrowHeavyRight size={16} />
        </button>
      </section>
      <section>
        <div className="row">
          <h2>商品明细</h2>
          <span className="text-[var(--du-primary-color)]">共 3 件</span>
        </div>
        <div className="goods">
          <span className="goods-mark">团</span>
          <div>
            <strong>收藏好物寄仓</strong>
            <small>完成打包后，请保留物流凭证</small>
          </div>
          <span>× 3</span>
        </div>
      </section>
      <div className="demo-actions">
        <Button
          variant="outline"
          onClick={() =>
            feedback.showImagePreview({
              images: [
                { src: receipt, alt: '寄仓凭证' },
                { src: receipt, alt: '寄仓凭证背面' },
              ],
            })
          }
        >
          查看凭证
        </Button>
        <Button
          size="large"
          full
          onClick={submit}
          icon={submitted ? <IconCompleteCircle /> : undefined}
        >
          {submitted ? '再次提交' : '提交寄仓申请'}
        </Button>
      </div>
      <p className="footnote">React 19 · 共享色板 · UnoCSS · 编译后组件样式</p>
      <Popup
        open={address}
        onOpenChange={setAddress}
        position="bottom"
        title="寄仓收货信息"
        description="请以实际业务提供的地址为准。"
      >
        <p>千岛寄仓中心（示例地址）</p>
        <p>请妥善包装并附上商品清单。</p>
        <Button full onClick={() => setDetails(true)}>
          查看打包说明
        </Button>
        <Popup open={details} onOpenChange={setDetails} title="打包说明">
          <p>保护商品边角，避免运输挤压。</p>
          <p>这是嵌套弹层示例，Escape 只关闭最上层。</p>
        </Popup>
      </Popup>
    </main>
  )
}

function App() {
  const [theme, setTheme] = useState<ThemeName>('qd')
  return (
    <DangoProvider theme={theme} className="demo-page">
      <div className="theme-picker">
        <label htmlFor="theme">主题</label>
        <select
          id="theme"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemeName)}
        >
          <option value="qd">千岛</option>
          <option value="qd-dark">千岛暗色</option>
          <option value="qdm">商家版</option>
          <option value="qh">奇货</option>
          <option value="mihua">米花</option>
          <option value="linjie">临界</option>
        </select>
      </div>
      <DepositDemo />
      <Components />
    </DangoProvider>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
