import { createRef, useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  DangoProvider,
  Input,
  Textarea,
  InputNumber,
  Form,
  FormItem,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Search,
  Tabs,
  Tab,
  TabPane,
  Select,
  Picker,
  PickerView,
  Cascader,
  Calendar,
  Dropdown,
} from '../src'

describe('input and form contracts', () => {
  it('associates labels/errors, preserves IME and decimal intermediate text, and clears with focus', async () => {
    const changed = vi.fn(),
      confirmed = vi.fn(),
      ref = createRef<HTMLInputElement>()
    render(
      <Form>
        <FormItem label="数量" required error="请输入数量">
          <Input
            ref={ref}
            defaultValue="0."
            onValueChange={changed}
            onConfirm={confirmed}
            allowClear
          />
        </FormItem>
      </Form>,
    )
    const input = screen.getByRole('textbox', {
      name: '数量',
    }) as HTMLInputElement
    expect(input.value).toBe('0.')
    expect(input.required).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(
      document.getElementById(input.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('请输入数量')
    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: '中文' } })
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(confirmed).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input)
    expect(changed).toHaveBeenLastCalledWith('中文')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(confirmed).toHaveBeenCalledWith('中文')
    await userEvent.setup().click(screen.getByLabelText('清空'))
    expect(input.value).toBe('')
    expect(document.activeElement).toBe(ref.current)
  })
  it('retains controlled values until the parent updates and inherits disabled from Form', async () => {
    const change = vi.fn()
    const { rerender } = render(
      <Form>
        <Input aria-label="受控" value="原值" onValueChange={change} />
      </Form>,
    )
    fireEvent.change(screen.getByLabelText('受控'), {
      target: { value: '新值' },
    })
    expect(change).toHaveBeenCalledWith('新值')
    expect((screen.getByLabelText('受控') as HTMLInputElement).value).toBe(
      '原值',
    )
    rerender(
      <Form disabled>
        <Input aria-label="受控" value="回填" allowClear />
        <Textarea aria-label="说明" />
        <Switch label="开关" />
      </Form>,
    )
    expect((screen.getByLabelText('受控') as HTMLInputElement).disabled).toBe(
      true,
    )
    expect((screen.getByLabelText('受控') as HTMLInputElement).value).toBe(
      '回填',
    )
    expect(
      (screen.getByLabelText('说明') as HTMLTextAreaElement).disabled,
    ).toBe(true)
    expect((screen.getByRole('switch') as HTMLInputElement).disabled).toBe(true)
    expect(screen.queryByLabelText('清空')).toBeNull()
  })
  it('supports textarea count, external updates, maxLength, readOnly, and native focus ref', async () => {
    const change = vi.fn(),
      ref = createRef<HTMLTextAreaElement>()
    const { rerender } = render(
      <Textarea
        ref={ref}
        aria-label="简介"
        defaultValue="初始"
        showCount
        maxLength={6}
        autoSize
        onValueChange={change}
      />,
    )
    await userEvent.setup().type(screen.getByLabelText('简介'), '内容很长')
    expect(ref.current?.value).toBe('初始内容很长')
    expect(screen.getByText('6 / 6')).toBeTruthy()
    rerender(
      <Textarea
        ref={ref}
        aria-label="简介"
        defaultValue="初始"
        showCount
        maxLength={6}
        readOnly
      />,
    )
    expect(ref.current?.readOnly).toBe(true)
    expect(change).toHaveBeenCalled()
  })
  it('commits numeric text on blur, preserves intermediate decimals, and clamps precise steps', async () => {
    render(
      <InputNumber
        aria-label="价格"
        defaultValue={0.2}
        step={0.1}
        min={0}
        max={0.3}
      />,
    )
    const user = userEvent.setup(),
      input = screen.getByRole('spinbutton') as HTMLInputElement
    await user.click(screen.getByLabelText('增加'))
    expect(input.value).toBe('0.3')
    expect((screen.getByLabelText('增加') as HTMLButtonElement).disabled).toBe(
      true,
    )
    fireEvent.change(input, { target: { value: '0.' } })
    expect(input.value).toBe('0.')
    fireEvent.blur(input)
    expect(input.value).toBe('0')
    fireEvent.change(input, { target: { value: '无效' } })
    fireEvent.blur(input)
    expect(input.value).toBe('0')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('0.1')
  })
  it('dispatches Search only for a committed Enter', () => {
    const search = vi.fn()
    render(
      <Search aria-label="搜索商品" defaultValue="团子" onSearch={search} />,
    )
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(search).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(search).toHaveBeenCalledWith('团子')
  })
  it('keeps a controlled InputNumber at the parent value and forwards keyboard events', async () => {
    const changed = vi.fn(),
      key = vi.fn()
    render(<InputNumber value={2} onValueChange={changed} onKeyDown={key} />)
    await userEvent.setup().click(screen.getByLabelText('增加'))
    expect(changed).toHaveBeenCalledWith(3)
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('2')
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowUp' })
    expect(key).toHaveBeenCalledOnce()
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('2')
  })
  it('names a choice group and applies an individual FormItem disabled state', () => {
    render(
      <Form>
        <FormItem label="配送" disabled>
          <CheckboxGroup>
            <Checkbox value="a">快递</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>,
    )
    expect(screen.getByRole('group', { name: '配送' })).toBeTruthy()
    expect((screen.getByLabelText('快递') as HTMLInputElement).disabled).toBe(
      true,
    )
  })
})

describe('selection controls', () => {
  it.each(['Select', 'Cascader'] as const)(
    'isolates the internal %s search from its required business field',
    async (component) => {
      render(
        <DangoProvider>
          <Form>
            <FormItem label="品类" required error="请选择品类">
              {component === 'Select' ? (
                <Select
                  defaultOpen
                  filterable
                  options={[{ label: '选项', value: 'a' }]}
                />
              ) : (
                <Cascader
                  defaultOpen
                  showSearch
                  options={[{ label: '选项', value: 'a' }]}
                />
              )}
            </FormItem>
          </Form>
        </DangoProvider>,
      )
      const search = (await screen.findByRole('textbox')) as HTMLInputElement,
        trigger = document.querySelector<HTMLButtonElement>(
          '.du-react-form-field',
        )!
      expect(trigger.id).not.toBe(search.id)
      expect(document.querySelectorAll(`[id="${trigger.id}"]`).length).toBe(1)
      expect(trigger.labels?.[0]?.htmlFor).toBe(trigger.id)
      expect(trigger.getAttribute('aria-invalid')).toBe('true')
      expect(search.required).toBe(false)
      expect(search.getAttribute('aria-invalid')).toBeNull()
      expect(search.getAttribute('aria-describedby')).toBeNull()
    },
  )
  it.each(['Select', 'Picker', 'PickerView', 'Cascader'] as const)(
    'keeps an open %s disabled when its Form is disabled',
    async (component) => {
      const changed = vi.fn()
      const view = (disabled: boolean) => (
        <DangoProvider>
          <Form disabled={disabled}>
            {component === 'Select' ? (
              <Select
                open
                options={[{ label: '选项', value: 'a' }]}
                onValueChange={changed}
              />
            ) : component === 'Cascader' ? (
              <Cascader
                open
                options={[{ label: '选项', value: 'a' }]}
                onValueChange={changed}
              />
            ) : component === 'Picker' ? (
              <Picker
                open
                columns={[[{ label: '选项', value: 'a' }]]}
                onValueChange={changed}
              />
            ) : (
              <PickerView
                columns={[[{ label: '选项', value: 'a' }]]}
                onValueChange={changed}
              />
            )}
          </Form>
        </DangoProvider>
      )
      const { rerender } = render(view(false))
      const control =
        component === 'Select'
          ? await screen.findByRole('option', { name: '选项' })
          : component === 'Cascader'
            ? await screen.findByRole('button', { name: '选项' })
            : await screen.findByLabelText('第 1 列')
      expect((control as HTMLButtonElement | HTMLSelectElement).disabled).toBe(
        false,
      )
      rerender(view(true))
      expect((control as HTMLButtonElement | HTMLSelectElement).disabled).toBe(
        true,
      )
      await userEvent.setup().click(control)
      expect(changed).not.toHaveBeenCalled()
      if (component === 'Picker')
        expect(
          (screen.getByRole('button', { name: '确定' }) as HTMLButtonElement)
            .disabled,
        ).toBe(true)
    },
  )
  it('supports keyboard checkbox selection, array stability, disabled options, and max count', async () => {
    const change = vi.fn()
    render(
      <Form>
        <FormItem label="发货">
          <CheckboxGroup defaultValue={['a']} max={2} onValueChange={change}>
            <Checkbox value="a">快递</Checkbox>
            <Checkbox value="b">自提</Checkbox>
            <Checkbox value="c" disabled>
              同城
            </Checkbox>
            <Checkbox value="d">无需物流</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>,
    )
    const user = userEvent.setup(),
      inputs = screen.getAllByRole('checkbox') as HTMLInputElement[]
    expect(new Set(inputs.map((el) => el.id)).size).toBe(inputs.length)
    await user.click(screen.getByLabelText('自提'))
    expect(change).toHaveBeenLastCalledWith(['a', 'b'])
    await user.click(screen.getByLabelText('无需物流'))
    expect(change).toHaveBeenCalledTimes(1)
    await user.click(screen.getByLabelText('同城'))
    expect(change).toHaveBeenCalledTimes(1)
    inputs[0].focus()
    await user.keyboard(' ')
    expect(change).toHaveBeenLastCalledWith(['b'])
  })
  it('shares native radio name, isolates groups, and blocks readOnly switches', async () => {
    render(
      <>
        <RadioGroup defaultValue="a">
          <Radio value="a">普通</Radio>
          <Radio value="b">优先</Radio>
        </RadioGroup>
        <RadioGroup defaultValue="a">
          <Radio value="a">另一组</Radio>
        </RadioGroup>
        <Switch label="只读" defaultChecked readOnly />
      </>,
    )
    const user = userEvent.setup(),
      radios = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(radios[0].name).toBe(radios[1].name)
    expect(radios[0].name).not.toBe(radios[2].name)
    await user.click(screen.getByLabelText('优先'))
    expect(radios[0].checked).toBe(false)
    expect(radios[1].checked).toBe(true)
    expect(radios[2].checked).toBe(true)
    await user.click(screen.getByRole('switch'))
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true)
  })
  it('supports indeterminate and controlled checked callbacks without leaking semantic callbacks to DOM', async () => {
    const change = vi.fn()
    render(
      <Checkbox
        label="全选"
        checked={false}
        indeterminate
        onCheckedChange={change}
      />,
    )
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('mixed')
    await userEvent.setup().click(input)
    expect(change).toHaveBeenCalledWith(true)
    expect(input.checked).toBe(false)
  })
})

describe('tabs, picker and selection overlays', () => {
  it('navigates Tabs while skipping disabled items, associates panels, and honors manual activation', async () => {
    const view = (activation: 'manual' | 'automatic') => (
      <Tabs defaultValue="a" activation={activation} aria-label="发布类型">
        <Tab name="a">普通</Tab>
        <Tab name="b" disabled>
          禁用
        </Tab>
        <Tab name="c">众筹</Tab>
        <TabPane name="a">普通表单</TabPane>
        <TabPane name="c">众筹表单</TabPane>
      </Tabs>
    )
    const { rerender } = render(view('manual')),
      user = userEvent.setup()
    const first = screen.getByRole('tab', { name: '普通' }),
      last = screen.getByRole('tab', { name: '众筹' })
    first.focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(last)
    expect(first.getAttribute('aria-selected')).toBe('true')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('tabpanel').textContent).toBe('众筹表单')
    expect(
      document
        .getElementById(last.getAttribute('aria-controls')!)
        ?.getAttribute('aria-labelledby'),
    ).toBe(last.id)
    expect(
      screen.getByRole('tablist').contains(screen.getByRole('tabpanel')),
    ).toBe(false)
    rerender(view('automatic'))
    last.focus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tabpanel').textContent).toBe('普通表单')
  })
  it('initializes the first enabled Tab when no value is supplied', async () => {
    render(
      <Tabs>
        <Tab name="a" disabled>
          禁用
        </Tab>
        <Tab name="b">首选</Tab>
        <TabPane name="b">内容</TabPane>
      </Tabs>,
    )
    await waitFor(() =>
      expect(
        screen.getByRole('tab', { name: '首选' }).getAttribute('aria-selected'),
      ).toBe('true'),
    )
  })
  it('keeps Select draft isolated until confirm, filters, and preserves number values', async () => {
    const change = vi.fn()
    const { rerender } = render(
      <DangoProvider>
        <Select
          defaultOpen
          mode="multiple"
          defaultValue={[1]}
          options={[
            { value: 1, label: '一' },
            { value: 2, label: '二' },
            { value: 3, label: '禁用', disabled: true },
          ]}
          withConfirm
          filterable
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(await screen.findByRole('option', { name: '二' }))
    expect(change).not.toHaveBeenCalled()
    await user.type(screen.getByLabelText('输入关键词搜索'), '二')
    expect(screen.queryByRole('option', { name: '一' })).toBeNull()
    await user.click(screen.getByRole('button', { name: '确认' }))
    expect(change).toHaveBeenCalledWith([1, 2])
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('cancels Picker drafts and uses native per-column keyboard selection', async () => {
    const change = vi.fn(),
      columns = [
        [
          { label: '一', value: '1' },
          { label: '二', value: '2' },
        ],
        [{ label: '甲', value: 'a' }],
      ]
    const { rerender } = render(
      <DangoProvider>
        <Picker
          defaultOpen
          columns={columns}
          defaultValue={['1', 'a']}
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.selectOptions(await screen.findByLabelText('第 1 列'), '2')
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(change).not.toHaveBeenCalled()
    rerender(
      <DangoProvider>
        <PickerView
          columns={columns}
          defaultValue={['1', 'a']}
          onValueChange={change}
        />
      </DangoProvider>,
    )
    await user.selectOptions(screen.getByLabelText('第 1 列'), '2')
    expect(change).toHaveBeenCalledWith(['2', 'a'])
  })
  it('navigates Cascader and propagates disabled ancestors into searchable leaves', async () => {
    const change = vi.fn(),
      options = [
        { value: 'a', label: '省', children: [{ value: 'b', label: '市' }] },
        {
          value: 'x',
          label: '禁用省',
          disabled: true,
          children: [{ value: 'y', label: '禁用市' }],
        },
      ]
    const { rerender } = render(
      <DangoProvider>
        <Cascader
          defaultOpen
          options={options}
          showSearch
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.type(await screen.findByLabelText('搜索选项'), '禁用市')
    expect(
      (
        screen.getByRole('button', {
          name: '禁用省 / 禁用市',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true)
    await user.clear(screen.getByLabelText('搜索选项'))
    await user.click(screen.getByRole('button', { name: '省 ›' }))
    await user.click(screen.getByRole('button', { name: '市' }))
    expect(change).toHaveBeenCalledWith(['a', 'b'])
  })
  it('applies Dropdown drafts on confirm only and preserves other group selections', async () => {
    const change = vi.fn()
    render(
      <DangoProvider>
        <Dropdown
          open
          options={[
            {
              label: '物流',
              value: 'logistics',
              multiple: true,
              groups: [
                { label: '一组', options: [{ label: '快递', value: 1 }] },
                { label: '二组', options: [{ label: '自提', value: 2 }] },
              ],
            },
          ]}
          defaultValue={{ logistics: [1] }}
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(await screen.findByLabelText('自提'))
    expect(change).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '确定' }))
    expect(change).toHaveBeenCalledWith({ logistics: [1, 2] })
  })
})

describe('Calendar', () => {
  it('enforces disabled dates and max range length, confirms date strings, and focuses next month using keys', async () => {
    const change = vi.fn()
    render(
      <DangoProvider>
        <Calendar
          key="immediate"
          defaultOpen
          type="range"
          min="2026-11-01"
          max="2026-12-31"
          selectableCount={3}
          disabledDate={(d) => d === '2026-11-04'}
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(await screen.findByLabelText('2026-11-01'))
    await user.click(screen.getByLabelText('2026-11-05'))
    expect(
      (
        screen.getByRole('button', {
          name: '所选范围包含不可选日期',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true)
    await user.click(screen.getByLabelText('2026-11-03'))
    await user.click(screen.getByRole('button', { name: '确定' }))
    expect(change).toHaveBeenCalledWith(['2026-11-01', '2026-11-03'])
  })
  it('handles cross-month focus without retaining a synthetic event after dispatch', async () => {
    render(
      <DangoProvider>
        <Calendar defaultOpen min="2026-11-01" max="2026-12-31" />
      </DangoProvider>,
    )
    const day = await screen.findByLabelText('2026-11-30')
    day.focus()
    await userEvent.setup().keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('data-date')).toBe(
        '2026-12-01',
      ),
    )
  })
  it('supports single date with time and cancels without changing the value', async () => {
    const change = vi.fn()
    render(
      <DangoProvider>
        <Calendar
          defaultOpen
          type="single"
          min="2026-11-01"
          max="2026-11-30"
          showTimePicker
          onValueChange={change}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(await screen.findByLabelText('2026-11-15'))
    fireEvent.change(screen.getByLabelText('时间'), {
      target: { value: '12:30' },
    })
    await user.click(screen.getByRole('button', { name: '确定' }))
    expect(change).toHaveBeenCalledWith('2026-11-15T12:30')
  })
  it('supports optional clear and immediate actions without changing CalendarValue output', async () => {
    const changed = vi.fn(),
      clear = vi.fn(),
      immediate = vi.fn()
    const { rerender } = render(
      <DangoProvider>
        <Calendar
          defaultOpen
          value="2026-11-15T12:30"
          min="2026-11-01"
          max="2026-11-30"
          showTimePicker
          onValueChange={changed}
          onClear={clear}
          onImmediate={immediate}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '清除' }))
    expect(clear).toHaveBeenCalledOnce()
    expect(changed).not.toHaveBeenCalled()
    rerender(
      <DangoProvider>
        <Calendar
          key="immediate"
          defaultOpen
          value="2026-11-15T12:30"
          min="2026-11-01"
          max="2026-11-30"
          showTimePicker
          onValueChange={changed}
          onImmediate={immediate}
        />
      </DangoProvider>,
    )
    await user.click(screen.getByRole('button', { name: '立即开始' }))
    expect(immediate).toHaveBeenCalledOnce()
  })
})

describe('review regressions: opening sessions and form contracts', () => {
  it('never scrolls the page while typing inside a TabPane', async () => {
    function View() {
      const [text, setText] = useState('')
      return (
        <Tabs defaultValue="a">
          <Tab name="a">表单</Tab>
          <TabPane name="a">
            <Input aria-label="商品名" value={text} onValueChange={setText} />
          </TabPane>
        </Tabs>
      )
    }
    render(<View />)
    const tab = screen.getByRole('tab'),
      scroll = vi.fn()
    tab.scrollIntoView = scroll
    await userEvent.setup().type(screen.getByRole('textbox'), 'abc')
    expect(scroll).not.toHaveBeenCalled()
  })
  it('only adjusts the tab strip horizontally when the selection changes', () => {
    const view = (value: string) => (
      <Tabs value={value}>
        <Tab name="a">A</Tab>
        <Tab name="b">B</Tab>
      </Tabs>
    )
    const { rerender } = render(view('a')),
      list = screen.getByRole('tablist')
    list.getBoundingClientRect = () => ({ left: 0, right: 100 }) as DOMRect
    screen.getByRole('tab', { name: 'B' }).getBoundingClientRect = () =>
      ({ left: 120, right: 160 }) as DOMRect
    rerender(view('b'))
    expect(list.scrollLeft).toBe(60)
    rerender(view('b'))
    expect(list.scrollLeft).toBe(60)
  })
  it('preserves a Picker draft across inline props and refreshes on the next opening', async () => {
    const changed = vi.fn(),
      view = (open = true, selected = 'x') => (
        <DangoProvider>
          <Picker
            open={open}
            value={[selected]}
            columns={[
              [
                { label: 'X', value: 'x' },
                { label: 'Y', value: 'y' },
              ],
            ]}
            onValueChange={changed}
          />
        </DangoProvider>
      )
    const { rerender } = render(view()),
      user = userEvent.setup()
    await user.selectOptions(await screen.findByLabelText('第 1 列'), 'y')
    rerender(view())
    expect((screen.getByLabelText('第 1 列') as HTMLSelectElement).value).toBe(
      'y',
    )
    await user.click(screen.getByRole('button', { name: '确定' }))
    expect(changed).toHaveBeenCalledWith(['y'])
    rerender(view(false))
    rerender(view(true, 'x'))
    expect(
      ((await screen.findByLabelText('第 1 列')) as HTMLSelectElement).value,
    ).toBe('x')
  })
  it('preserves Select confirmation drafts and search across inline values', async () => {
    const changed = vi.fn(),
      view = () => (
        <DangoProvider>
          <Select
            open
            mode="multiple"
            withConfirm
            filterable
            value={[]}
            options={[
              { label: 'Apple', value: 'a' },
              { label: 'Apricot', value: 'b' },
            ]}
            onValueChange={changed}
          />
        </DangoProvider>
      )
    const { rerender } = render(view()),
      user = userEvent.setup()
    await user.type(await screen.findByRole('textbox'), 'Ap')
    await user.click(screen.getByRole('option', { name: 'Apple' }))
    rerender(view())
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Ap')
    expect(
      screen
        .getByRole('option', { name: 'Apple' })
        .getAttribute('aria-selected'),
    ).toBe('true')
    await user.click(screen.getByRole('button', { name: '确认' }))
    expect(changed).toHaveBeenCalledWith(['a'])
  })
  it('retains multi-select search after immediate controlled updates', async () => {
    function View() {
      const [values, setValues] = useState<readonly (string | number)[]>([])
      return (
        <DangoProvider>
          <Select
            open
            filterable
            mode="multiple"
            value={[...values]}
            onValueChange={(next) => setValues(next as typeof values)}
            options={[
              { label: 'Apple', value: 'a' },
              { label: 'Apricot', value: 'b' },
            ]}
          />
        </DangoProvider>
      )
    }
    render(<View />)
    const user = userEvent.setup()
    await user.type(await screen.findByRole('textbox'), 'Ap')
    await user.click(screen.getByRole('option', { name: 'Apple' }))
    await user.click(screen.getByRole('option', { name: 'Apricot' }))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Ap')
    expect(
      screen
        .getAllByRole('option')
        .every((node) => node.getAttribute('aria-selected') === 'true'),
    ).toBe(true)
  })
  it('preserves Cascader navigation and search across unrelated parent renders', async () => {
    const view = () => (
      <DangoProvider>
        <Cascader
          open
          value={[]}
          showSearch
          options={[
            {
              label: '省',
              value: 'p',
              children: [{ label: '市', value: 'c' }],
            },
          ]}
        />
      </DangoProvider>
    )
    const { rerender } = render(view()),
      user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: '省 ›' }))
    rerender(view())
    expect(screen.getByRole('group', { name: '第 2 级' })).toBeTruthy()
    await user.type(screen.getByRole('textbox'), '市')
    rerender(view())
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('市')
  })
  it('preserves Calendar dates and browsed month across inline values', async () => {
    const view = () => (
      <DangoProvider>
        <Calendar
          open
          value={[]}
          type="multiple"
          min="2026-11-01"
          max="2026-12-31"
        />
      </DangoProvider>
    )
    const { rerender } = render(view()),
      user = userEvent.setup()
    await user.click(await screen.findByLabelText('2026-11-15'))
    await user.click(screen.getByRole('button', { name: '下个月' }))
    rerender(view())
    expect(screen.getByText('2026年12月')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '上个月' }))
    expect(
      screen.getByLabelText('2026-11-15').getAttribute('aria-pressed'),
    ).toBe('true')
  })
  it('preserves Dropdown drafts across inline field mappings', async () => {
    const changed = vi.fn(),
      view = () => (
        <DangoProvider>
          <Dropdown
            open
            value={{ delivery: [] }}
            onValueChange={changed}
            options={[
              {
                label: '物流',
                value: 'delivery',
                multiple: true,
                options: [{ label: '快递', value: 'a' }],
              },
            ]}
          />
        </DangoProvider>
      )
    const { rerender } = render(view()),
      user = userEvent.setup()
    await user.click(await screen.findByLabelText('快递'))
    rerender(view())
    expect(
      (screen.getByRole('checkbox', { name: '快递' }) as HTMLInputElement)
        .checked,
    ).toBe(true)
    await user.click(screen.getByRole('button', { name: '确定' }))
    expect(changed).toHaveBeenCalledWith({ delivery: ['a'] })
  })
  it('associates Calendar labels/errors and inherits Form disabled', async () => {
    render(
      <DangoProvider>
        <Form disabled>
          <FormItem label="日期" error="请选择日期">
            <Calendar />
          </FormItem>
        </Form>
      </DangoProvider>,
    )
    const button = screen.getByRole('button', {
      name: '日期',
    }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.getAttribute('aria-invalid')).toBe('true')
    expect(
      document.getElementById(button.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('请选择日期')
    await userEvent.setup().click(screen.getByText('日期'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('does not notify onCheckedChange for a max-rejected checkbox', async () => {
    const changed = vi.fn()
    render(
      <CheckboxGroup max={1} defaultValue={['a']}>
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b" onCheckedChange={changed}>
          B
        </Checkbox>
      </CheckboxGroup>,
    )
    await userEvent.setup().click(screen.getByLabelText('B'))
    expect((screen.getByLabelText('B') as HTMLInputElement).checked).toBe(false)
    expect(changed).not.toHaveBeenCalled()
  })
  it('treats empty Enter like blur and forwards FormItem required to InputNumber', () => {
    const changed = vi.fn()
    render(
      <Form>
        <FormItem label="数量" required>
          <InputNumber defaultValue={8} onValueChange={changed} />
        </FormItem>
      </Form>,
    )
    const input = screen.getByRole('spinbutton', {
      name: '数量',
    }) as HTMLInputElement
    expect(input.required).toBe(true)
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(input.value).toBe('8')
    fireEvent.change(input, { target: { value: '  ' } })
    fireEvent.blur(input)
    expect(input.value).toBe('8')
    expect(changed).not.toHaveBeenCalled()
  })
  it('reports range length limits, recovers on selection, and skips disabled dates with arrows', async () => {
    render(
      <DangoProvider>
        <Calendar
          open
          type="range"
          min="2026-11-01"
          max="2026-11-30"
          selectableCount={3}
          disabledDate={(date) => date === '2026-11-02'}
        />
      </DangoProvider>,
    )
    const user = userEvent.setup(),
      first = await screen.findByLabelText('2026-11-03')
    await user.click(first)
    await user.click(screen.getByLabelText('2026-11-07'))
    expect(
      (screen.getByRole('button', { name: '最多 3 天' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    await user.click(screen.getByLabelText('2026-11-05'))
    expect(
      (screen.getByRole('button', { name: '确定' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false)
    first.focus()
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-01')
  })
})
