# `@frontend/du-calendar`

## Calendar
![calendar example](https://cdn.qiandaoapp.com/admins/375749399347bfabd99998303d532214.png "组件示例图片")

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| type | string | false | single | 选择类型：<br>single-单选；multiple-多选；range-日期区间(暂不支持range) |
| visible | boolean | true | false | 是否展示日历 |
| title | string | false | 请选择日期 | 日历的标题<br>单选时：请选择日期；多选时：请选择日期（最大可选X天） |
| minDate | Date | false | 当前日期 | 可选择的最小日期 |
| maxDate | Date | false | 当前日期的六个月后 | 可选择的最大日期 |
| selectedDate | Date,Date[],null | false | 当前日期 | 默认选中的日期<br>type 为 multiple 或 range 时为数组，传入 null 表示默认不选择 |
| confirmText | string | false | 确定 | 确认按钮文案<br>单选时：确定；多选时：确定（X） |

### type为multiple Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| selectableCount | string, number | false | 30 | 最大可选日期天数 |

### emit 事件

| 成员 | 说明 | payload |
| --- | --- | --- |
| confirm | 点击确认按钮时触发(方法内部需使用者自己将visible的值改成false) | value: Date, Date[] |
| close | 点击关闭弹出层时触发(方法内部需使用者自己将visible的值改成false) | - |

## Example

```vue
  <template>
    <DuCalendar
      :visible="visible"
      type="multiple"
      :minDate="minSelectDate"
      :maxDate="maxSelectDate"
      :selectableCount="selectableCount"
      :selectedDate="selectedDate"
      @close="handleClose"
      @confirm="handleConfirm"
    />
</template>

<script>
  import { ref } from '@vue';
  export default {
    setup() {
      const visible = ref(true);
      const selectableCount = ref(30);
      const selectedDate = ref([
        new Date('2021-10-21'), new Date('2022-01-15'), new Date('2022-01-20'),
        new Date('2022-01-29'), new Date('2022-02-16'), new Date(),
        new Date('2022-03-20'), new Date('2022-04-20'),
      ]);
      const minSelectDate = ref(new Date('2021-10-21'));
      const maxSelectDate = ref(new Date('2022-04-20'));
      const handleClose = () => {
        visible.value = false;
      };
      const handleConfirm = (value) => {
        console.log('values:', value);
        selectedDate.value = [...value.value];
      };
      return {
        visible,
        selectableCount,
        selectedDate,
        minSelectDate,
        maxSelectDate,
        handleClose,
        handleConfirm,
      }
    }
  }
</script>
```
