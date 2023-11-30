du-calendar
du-checkbox
du-empty
du-form
du-group-cell
du-icon
du-input
du-input-number
du-modal 写了，没在用
du-popup
du-radio
du-rate 写了没在用，暂时不放
du-segmented-control 写了，没在用
du-snackbar
du-sort-tab 写了，没在用
du-steps
du-top-tab 写了，没在用

checkbox group 非兼容更新：
value 只能是 string 数组
下面的 checkbox 需要传 name，原来有歧义
去掉自带的 padding: 4px 0;

Input: 要看一下 uniapp 有没有弥合差异，event 事件是什么样子的
Icon: 去掉了 --du-icon-fz

Input: 结构更改

FormItem：提示偏移问题
增加 Layout horizontal vertical 替代 nextSlotLine

Form
增加 layout horizontal


vue tyep 如果同时是 string | boolean 好像短写法不行

Radio
去掉 labelKey 的用，去掉 value 支持传对象（还是支持吧，使用 valueKey）
去掉 cancel
判定值不使用 label，使用 value
Radio 事件变更 { checked, value }
去掉自带的 padding: 4px 0;

Calendar
整体变成数组的方式，confirm
minDate -> min
maxDate -> max

再抽象出 DatePicker

Snackbar
content -> slot
去掉 revert color

待做：

原则：属性名统一，比如 visible、show 怎么选取？