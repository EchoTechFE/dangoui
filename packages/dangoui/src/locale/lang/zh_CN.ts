import type { Locale } from '../index'

const locale: Locale = {
  global: {
    close: '关闭',
    cancel: '取消',
    confirm: '确认',
    select: '请选择',
  },
  Calendar: {
    clear: '清除',
    selectDate: '请选择日期',
    selectDateRange: (maxRange: number) => `请选择日期(最多可选${maxRange}天)`,
    today: '今',
    startEnd: '开始/结束',
    start: '开始',
    end: '结束',
    startTime: '开始时间',
    endTime: '结束时间',
    hour: '时',
    minute: '分',
    selected: '已选',
    toBeSet: '待设置',
    startShouldBeforeEnd: '开始应早于结束',
    missingEndTime: '缺少结束时间',
    maxDays: (maxRange: number) => `最多选${maxRange}天`,
    selectedDates: (count: number) => `${count} 个日期`,
    weekdays: () => ['日', '一', '二', '三', '四', '五', '六'],
  },
  FormItem: {
    edited: '已修改',
  },
  TagsPanel: {
    fold: '收起',
    expand: '展开'
  },
  Upload: {
    uploading: '上传中...',
    image: '图片',
    video: '视频',
    maxCount: (maxCount: number) => `最多上传 ${maxCount} 个文件`,
  },
}

export default locale