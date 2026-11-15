import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Textarea,
  InputNumber,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Tabs,
  Tab,
  TabPane,
  Select,
  Picker,
  Cascader,
  Calendar,
  Upload,
  Tag,
  Empty,
  Steps,
  Rate,
  Tooltip,
  Swiper,
  SwiperItem,
  NoticeBar,
  ActionSheet,
  Dropdown,
  Skeleton,
  Avatar,
  Badge,
  NavigationBar,
  Popup,
  type UploadFile,
} from 'dangoui-react'
import IconClose from 'dangoui-react/icons/close'

const shipping = [
  { label: '快递', value: 'express' },
  { label: '自提', value: 'pickup' },
]
export function Components() {
  const [name, setName] = useState('收藏好物'),
    [enabled, setEnabled] = useState(true)
  const [sheet, setSheet] = useState(false),
    [filters, setFilters] = useState(false)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [mobileForm, setMobileForm] = useState(false),
    [notes, setNotes] = useState('')
  const [preview, setPreview] = useState(false),
    [previewHost, setPreviewHost] = useState<HTMLDivElement | null>(null)
  return (
    <div className="component-gallery">
      <h1>组件交互示例</h1>
      <NoticeBar text="所有数据均为本地模拟，不连接业务接口。" closable />
      <Card title="商品表单">
        <Form layout="vertical" onSubmit={(event) => event.preventDefault()}>
          <FormItem
            label="商品名称"
            required
            tips="保留原生输入、中文输入法与表单语义。"
          >
            <Input value={name} onValueChange={setName} allowClear bordered />
          </FormItem>
          <FormItem label="商品简介">
            <Textarea
              defaultValue="给喜欢收藏的你。"
              bordered
              autoSize
              showCount
              maxLength={120}
            />
          </FormItem>
          <FormItem label="库存">
            <InputNumber defaultValue={3} max={10} />
          </FormItem>
          <FormItem label="配送方式">
            <CheckboxGroup defaultValue={['express']}>
              <Checkbox value="express">快递</Checkbox>
              <Checkbox value="pickup">自提</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="售卖模式">
            <RadioGroup defaultValue="normal">
              <Radio value="normal">普通</Radio>
              <Radio value="crowd">众筹</Radio>
            </RadioGroup>
          </FormItem>
          <Switch
            label="允许购买"
            checked={enabled}
            onCheckedChange={setEnabled}
            position="right"
          />
          <FormItem label="默认配送">
            <Select options={shipping} filterable />
          </FormItem>
          <FormItem label="规格">
            <Picker
              columns={[
                [
                  { label: '标准', value: 'normal' },
                  { label: '加大', value: 'large' },
                ],
              ]}
            />
          </FormItem>
          <FormItem label="区域">
            <Cascader
              options={[
                {
                  label: '上海',
                  value: 'sh',
                  children: [
                    { label: '徐汇区', value: 'xh' },
                    { label: '黄浦区', value: 'hp' },
                  ],
                },
              ]}
              showSearch
            />
          </FormItem>
          <FormItem label="日期">
            <Calendar min="2026-11-01" max="2027-01-31" type="range" />
          </FormItem>
          <FormItem label="预约时间">
            <Calendar min="2026-11-01" max="2027-01-31" showTimePicker />
          </FormItem>
        </Form>
        <Upload
          value={files}
          onValueChange={setFiles}
          maxCount={3}
          upload={async (file, { signal, onProgress }) => {
            onProgress(50)
            await new Promise<void>((resolve, reject) => {
              const timer = setTimeout(resolve, 350)
              signal.addEventListener(
                'abort',
                () => {
                  clearTimeout(timer)
                  reject(new DOMException('已取消', 'AbortError'))
                },
                { once: true },
              )
            })
            return { url: file.thumbUrl ?? '/demo.png' }
          }}
          onPreview={(file) => window.alert(file.name)}
        />
      </Card>
      <Card title="展示与反馈">
        <Steps
          steps={[{ title: '编辑' }, { title: '确认' }, { title: '完成' }]}
          activeIndex={1}
        />
        <Tabs defaultValue="details" aria-label="商品详情">
          <Tab name="details">详情</Tab>
          <Tab name="review">评价</Tab>
          <TabPane name="details">
            <FormItem label="页内输入">
              <Input
                value={notes}
                onValueChange={setNotes}
                placeholder="输入时标签栏不会拉动页面"
              />
            </FormItem>
            <Tag>现货</Tag>{' '}
            <Badge value={2}>
              <Avatar alt="团子" color="primary" />
            </Badge>
          </TabPane>
          <TabPane name="review">
            <Rate half defaultValue={4.5} withText />
          </TabPane>
        </Tabs>
        <Swiper label="商品轮播">
          <SwiperItem>
            <Empty text="第一张商品卡" />
          </SwiperItem>
          <SwiperItem>
            <Empty text="第二张商品卡" />
          </SwiperItem>
          <SwiperItem>
            <Empty text="第三张商品卡" />
          </SwiperItem>
          <SwiperItem>
            <Empty text="第四张商品卡" />
          </SwiperItem>
        </Swiper>
        <Tooltip content="表单状态由 React 管理">
          <Button variant="text">交互说明</Button>
        </Tooltip>
        <div className="gallery-actions">
          <Button variant="outline" onClick={() => setSheet(true)}>
            操作菜单
          </Button>
          <Button variant="outline" onClick={() => setFilters(true)}>
            分组筛选
          </Button>
        </div>
        <Skeleton />
      </Card>
      <Card title="H5 容器与移动表单">
        <div className="gallery-actions">
          {(['mini', 'small', 'normal', 'medium', 'large'] as const).map(
            (size) => (
              <Button key={size} size={size} icon={<IconClose />}>
                {size}
              </Button>
            ),
          )}
        </div>
        <div className="h5-scroll-demo" aria-label="容器滚动示例">
          <NavigationBar
            title="容器内导航"
            back={false}
            transparent
            style={{ position: 'sticky', top: 0 }}
          />
          <div style={{ height: 500, padding: 16 }}>
            在此区域内滚动，导航背景随主题渐显。
          </div>
        </div>
        <Button onClick={() => setMobileForm(true)}>打开 H5 表单</Button>
        <div
          ref={setPreviewHost}
          aria-label="手机外框预览"
          style={{
            width: '100%',
            maxWidth: 320,
            height: 480,
            transform: 'translateZ(0)',
            overflow: 'hidden',
            border: '1px solid var(--du-border-1)',
            marginTop: 16,
          }}
        >
          <Button onClick={() => setPreview(true)}>打开预览内弹层</Button>
          <Popup
            open={preview}
            onOpenChange={setPreview}
            container={previewHost}
            position="bottom"
            title="预览表单"
          >
            <FormItem label="预览姓名">
              <Input />
            </FormItem>
            <Button full onClick={() => setPreview(false)}>
              完成预览
            </Button>
          </Popup>
        </div>
      </Card>
      <Popup
        open={mobileForm}
        onOpenChange={setMobileForm}
        position="bottom"
        title="H5 输入表单"
      >
        <Form layout="vertical" onSubmit={(event) => event.preventDefault()}>
          <FormItem label="收货人">
            <Input autoComplete="name" enterKeyHint="next" />
          </FormItem>
          <div style={{ height: 200 }} />
          <FormItem label="手机号码">
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="done"
            />
          </FormItem>
          <Button full onClick={() => setMobileForm(false)}>
            完成
          </Button>
        </Form>
      </Popup>
      <ActionSheet
        open={sheet}
        onOpenChange={setSheet}
        title="商品操作"
        items={[{ label: '分享' }, { label: '删除', danger: true }]}
      />
      <Dropdown
        open={filters}
        onOpenChange={setFilters}
        options={[
          {
            label: '配送方式',
            value: 'shipping',
            multiple: true,
            options: shipping,
          },
        ]}
      />
    </div>
  )
}
