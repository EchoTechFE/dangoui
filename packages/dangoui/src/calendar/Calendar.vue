<template>
  <DuPopup
    :visible="visible"
    :header-visible="false"
    :extStyle="style"
    :extClass="className"
    type="bottom"
    @update:visible="handleClose"
  >
    <div class="du-calendar__header">
      <div class="du-calendar__clear" @click="handleClear">清除</div>
      <div class="du-calendar__title">{{ calendarTitle }}</div>
      <div class="du-calendar__close" @click="handleClose">
        <DuIcon name="close" />
      </div>
    </div>
    <div class="du-calendar__main">
      <div class="du-calendar__week">
        <div
          v-for="(item, index) in weekList"
          :key="index"
          :class="[
            'du-calendar__week-item',
            { 'du-calendar__week-item--highlight': item.highlight },
          ]"
        >
          {{ item.name }}
        </div>
      </div>
      <scroll-view
        :scroll-y="true"
        :class="[
          'du-calendar__container',
          showTimePicker && type === 'range'
            ? 'du-calendar__container--range-picker'
            : '',
          showTimePicker && type !== 'range'
            ? 'du-calendar__container--picker'
            : '',
        ]"
        :scroll-into-view="todayMonthId"
        scroll-with-animation
      >
        <div
          v-for="(month, index) in displayDates"
          :key="index"
          class="du-calendar__month-container"
          :id="`du-calendar-${instanceId}-${month.first.format('YYYY-MM')}`"
        >
          <div class="du-calendar__month">
            {{ month.first.year() }}.{{ month.first.month() + 1 }}
          </div>
          <div class="du-calendar__dates">
            <div
              v-for="(row, idx) in month.rows"
              :class="[
                'du-calendar__dates-row',
                idx === month.rows.length - 1 && 'du-calendar__dates-row--last',
              ]"
              :key="idx"
            >
              <div
                v-for="(date, idx) in row"
                :key="date ? date.unix() : idx"
                :class="getCalendarItemClassName(date, idx)"
                @click="changeSelectedDate(date)"
              >
                <div v-if="!date">
                  <div class="du-calendar__item-inner" />
                </div>
                <div v-else :class="getCalendarItemInnerClassName(date, idx)">
                  <div
                    v-if="isToday(date)"
                    :style="{
                      color: isSelected(date)
                        ? 'inherit'
                        : 'var(--du-primary-color)',
                    }"
                  >
                    今
                  </div>
                  <template v-else>
                    {{ date.date() }}
                  </template>
                  <div
                    v-if="isStart(date) && isEnd(date)"
                    class="du-calendar__sub"
                  >
                    开始/结束
                  </div>
                  <div v-else-if="isStart(date)" class="du-calendar__sub">
                    开始
                  </div>
                  <div v-else-if="isEnd(date)" class="du-calendar__sub">
                    结束
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="du-calendar__time" v-if="type === 'range' && showTimePicker">
        <div class="du-calendar__time-header">
          <div class="du-calendar__time-title">开始时间</div>
          <DuIcon name="arrow-right-line" :size="12" color="#D4D0DA" />
          <div class="du-calendar__time-title">结束时间</div>
        </div>
        <div style="display: flex">
          <div style="flex: 1">
            <DuPickerView
              :columns="timePickerColumns"
              v-model:value="startTime"
              :style="{ '--du-picker-view-height': '106px' }"
            />
          </div>
          <div style="flex: 1">
            <DuPickerView
              :columns="timePickerColumns"
              v-model:value="endTime"
              :style="{ '--du-picker-view-height': '106px' }"
            />
          </div>
        </div>
      </div>
      <div class="du-calendar__time" v-else-if="showTimePicker">
        <DuPickerView
          :columns="timePickerColumns"
          v-model:value="startTime"
          :style="{ '--du-picker-view-height': '106px' }"
        />
      </div>
      <div class="du-calendar--button">
        <div v-if="type === 'range'">
          <div class="du-calendar__disp">
            <div class="du-calendar__disp-title">开始</div>
            <div class="du-calendar__disp-none" v-if="innerSelected.length < 1">
              待设置
            </div>
            <div v-else>
              {{ formattedRangeStart }}
            </div>
          </div>
          <div class="du-calendar__disp">
            <div class="du-calendar__disp-title">结束</div>
            <div class="du-calendar__disp-none" v-if="innerSelected.length < 2">
              待设置
            </div>
            <div v-else>
              {{ formattedRangeEnd }}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="du-calendar__disp">
            <div class="du-calendar__disp-title">已选</div>
            <div class="du-calendar__disp-none" v-if="innerSelected.length < 1">
              待设置
            </div>
            <div v-else>
              {{ formattedRangeStart }}
            </div>
          </div>
        </div>
        <div class="du-calendar--button-right">
          <DuButton
            type="primary"
            size="large"
            full
            disabled-type="temp"
            :disabled="!!buttonDisabled"
            @click="handleConfirm"
            :text="buttonConfirmText"
          />
        </div>
      </div>
    </div>
  </DuPopup>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  normalizeStyle,
  normalizeClass,
} from 'vue'
import DuPopup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import { getInstanceId } from './helpers'
import dayjs from 'dayjs'
import DuPickerView from '../picker-view/PickerView.vue'
import DuIcon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    extClass?: string | Array<string> | Record<string, string>
    extStyle?:
      | string
      | {
          [x: string]: string | number
        }
    visible?: boolean
    type?: 'single' | 'multiple' | 'range'
    title?: string
    confirmText?: string
    selectedDate?: dayjs.Dayjs | dayjs.Dayjs[]
    min?: dayjs.Dayjs | number
    max?: dayjs.Dayjs | number
    selectableCount?: number
    weekStart?: number
    showTimePicker?: boolean
    timeStep: 5 | 10
  }>(),
  {
    extClass: '',
    extStyle: '',
    visible: false,
    type: 'multiple',
    title: '',
    confirmText: '',
    selectedDate: () => [],
    min: () => dayjs().startOf('month'),
    max: () => dayjs().startOf('month').add(12, 'month').endOf('month'),
    selectableCount: 30,
    weekStart: 0,
    showTimePicker: false,
    timeStep: 5,
  },
)

const emit = defineEmits<{
  (
    e: 'confirm',
    value: {
      value: dayjs.Dayjs | dayjs.Dayjs[]
      dates: dayjs.Dayjs[]
      date: dayjs.Dayjs
    },
  ): void
  (e: 'close'): void
  (e: 'update:visible', visible: boolean): void
  (e: 'clear'): void
}>()

const timePickerColumns = computed(() => {
  const hours: { label: string; value: string }[] = []
  const minutes: { label: string; value: string }[] = []
  for (let i = 0; i < 24; i++) {
    hours.push({
      label: i.toString().padStart(2, '0') + '时',
      value: '' + i,
    })
  }
  for (let i = 0; i < 60; i += props.timeStep) {
    minutes.push({
      label: i.toString().padStart(2, '0') + '分',
      value: '' + i,
    })
  }
  return [hours, minutes]
})

const resolvedMin = computed(() => {
  if (typeof props.min === 'number') {
    return dayjs(props.min)
  } else {
    return props.min
  }
})

const resolvedMax = computed(() => {
  if (typeof props.max === 'number') {
    return dayjs(props.max)
  } else {
    return props.max
  }
})

const innerSelected = ref<dayjs.Dayjs[]>([])

const startTime = ref<string[]>(['8', '0'])

const endTime = ref<string[]>(['20', '0'])

const instanceId = getInstanceId()

const todayMonthId = ref('')

function setMonthId() {
  setTimeout(() => {
    todayMonthId.value = `du-calendar-${instanceId}-${dayjs().format(
      'YYYY-MM',
    )}`
  }, 500)
}

onMounted(() => {
  if (props.visible) {
    setMonthId()
  }
})

const className = computed(() => {
  const { extClass } = props
  return normalizeClass(['du-calendar', extClass])
})

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
})

const calendarTitle = computed(() => {
  if (props.title) {
    return props.title
  } else {
    if (props.type === 'multiple') {
      return `请选择日期(最多可选${props.selectableCount}天)`
    }
    return '请选择日期'
  }
})

const isInvalidDateRange = computed(() => {
  if (
    props.type === 'range' &&
    props.showTimePicker &&
    innerSelected.value.length === 2
  ) {
    if (innerSelected.value[0].isSame(innerSelected.value[1], 'day')) {
      if (
        +startTime.value[0] * 60 + +startTime.value[1] >=
        +endTime.value[0] * 60 + +endTime.value[1]
      ) {
        return true
      }
    }
  }

  return false
})

const buttonConfirmText = computed(() => {
  if (
    props.type === 'range' &&
    props.showTimePicker &&
    innerSelected.value.length === 2
  ) {
    if (isInvalidDateRange.value) {
      return '开始应早于结束'
    }
  }

  return props.confirmText || '确定'
})

const buttonDisabled = computed(() => {
  return isInvalidDateRange.value || innerSelected.value.length <= 0
})

const weekList = computed(() => {
  const { weekStart } = props
  const initList = [
    { name: '日', highlight: true },
    { name: '一', highlight: false },
    { name: '二', highlight: false },
    { name: '三', highlight: false },
    { name: '四', highlight: false },
    { name: '五', highlight: false },
    { name: '六', highlight: true },
  ]

  const list = initList.map((l, index) => {
    return {
      ...l,
      index: (index + (7 - weekStart)) % 7,
    }
  })

  return [...list].sort((a, b) => a.index - b.index)
})

const displayDates = computed(() => {
  const start = resolvedMin.value.startOf('month')
  const end = resolvedMax.value.endOf('month')

  const monthGroups: dayjs.Dayjs[][] = []
  let currentMonth = start
  while (currentMonth.isBefore(end)) {
    const dates: dayjs.Dayjs[] = []
    let currentDay = currentMonth
    while (currentDay.isSame(currentMonth, 'month')) {
      dates.push(currentDay)
      currentDay = currentDay.add(1, 'day')
    }
    monthGroups.push(dates)
    currentMonth = currentMonth.add(1, 'month')
  }
  const renderDates = monthGroups.map((month) => {
    const rows: Array<Array<dayjs.Dayjs | null>> = []
    const diff = month[0].day() - props.weekStart
    const monthCopy: Array<dayjs.Dayjs | null> = [...month]
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        monthCopy.unshift(null)
      }
    }
    while (monthCopy.length) {
      rows.push(monthCopy.splice(0, 7))
    }
    return {
      first: month[0],
      rows,
    }
  })
  return renderDates
})

function isToday(d: dayjs.Dayjs | null) {
  if (!d) {
    return false
  }
  return dayjs().isSame(d, 'day')
}

// 判断某项是否被选中
const isSelected = (d: dayjs.Dayjs | null) => {
  if (!d) {
    return false
  }

  if (innerSelected.value.some((item) => item.isSame(d, 'day'))) {
    return true
  }

  if (props.type === 'range') {
    if (innerSelected.value.length === 2) {
      const start = innerSelected.value[0].startOf('day')
      const end = innerSelected.value[1].endOf('day')

      return d.isAfter(start) && d.isBefore(end)
    }
  }

  return false
}

function formatDate(d: dayjs.Dayjs) {
  if (props.showTimePicker) {
    return d.format('YYYY-MM-DD dddd HH:mm')
  }
  return d.format('YYYY-MM-DD dddd')
}

const formattedRangeStart = computed(() => {
  if (innerSelected.value.length > 0) {
    if (props.type === 'multiple' && innerSelected.value.length >= 2) {
      return `${innerSelected.value.length} 个日期`
    }
    return formatDate(
      innerSelected.value[0]
        .add(+startTime.value[0], 'hour')
        .add(+startTime.value[1], 'minute'),
    )
  }
  return ''
})

const formattedRangeEnd = computed(() => {
  if (innerSelected.value.length > 1) {
    return formatDate(
      innerSelected.value[1]
        .add(+endTime.value[0], 'hour')
        .add(+endTime.value[1], 'minute'),
    )
  }
  return ''
})

function isStart(d: dayjs.Dayjs | null) {
  return (
    d &&
    props.type === 'range' &&
    innerSelected.value.length > 0 &&
    innerSelected.value[0].isSame(d, 'day')
  )
}

function isEnd(d: dayjs.Dayjs | null) {
  return (
    d &&
    props.type === 'range' &&
    innerSelected.value.length > 1 &&
    innerSelected.value[1].isSame(d, 'day')
  )
}

function isRangeFirst(d: dayjs.Dayjs | null) {
  return (
    d &&
    props.type === 'range' &&
    innerSelected.value.length === 2 &&
    innerSelected.value[0].isSame(d, 'day')
  )
}

function isRangeLast(d: dayjs.Dayjs | null) {
  return (
    d &&
    props.type === 'range' &&
    innerSelected.value.length === 2 &&
    innerSelected.value[1].isSame(d, 'day')
  )
}

function getCalendarItemClassName(date: dayjs.Dayjs | null, idx: number) {
  const classNames = ['du-calendar__item']

  if (idx === 6) {
    classNames.push('du-calendar__item--last')
  }

  if (!date) {
    return classNames.join(' ')
  }

  if (props.type === 'range') {
    if (innerSelected.value.length === 2) {
      // 这种情况下才可能有背景
      if (isSelected(date)) {
        const isStart = isRangeFirst(date)
        const isEnd = isRangeLast(date)
        if (isStart && isEnd) {
          // 如果是开始和结束是同一天，那么不显示背景
        } else if (isStart) {
          if (date.date() === date.daysInMonth() || idx === 6) {
            // 如果是最后一个，那么不用有背景
          } else {
            classNames.push('du-calendar__item--bl')
            if (date.add(1, 'day').isSame(innerSelected.value[1], 'day')) {
              // 如果就选了两天
              classNames.push('du-calendar__item--range-solid')
            }
          }
        } else if (isEnd) {
        } else {
          classNames.push('du-calendar__item--range')

          if (date.date() === date.daysInMonth() || idx === 6) {
            // 如果是该月最后一个或者一行最后一个，显示背景，右侧圆角
            classNames.push('du-calendar__item--br')
          }
          if (date.date() === 1 || idx === 0) {
            // 如果是第一个，显示背景，左侧圆角
            classNames.push('du-calendar__item--bl')
          }
        }
      } else {
        // 没有选择的情况下，不用管
      }
    } else {
      // 这种情况下不会有背景
    }
  }

  return classNames.join(' ')
}

function getCalendarItemInnerClassName(date: dayjs.Dayjs, idx: number) {
  const classNames = ['du-calendar__item-inner']

  if (isDisabled(date)) {
    classNames.push('du-calendar__item-inner--disabled')
    return classNames.join(' ')
  }

  if (isSelected(date)) {
    if (props.type === 'range') {
      if (innerSelected.value.length === 2) {
        const isStart = isRangeFirst(date)
        const isEnd = isRangeLast(date)
        if (isStart && isEnd) {
          classNames.push('du-calendar__item-inner--selected')
        } else if (isStart) {
          if (date.date() === date.daysInMonth() || idx === 6) {
            // 如果是最后一个，那么是圆角
            classNames.push('du-calendar__item-inner--selected')
          } else {
            // 否则只有左侧有圆角
            classNames.push('du-calendar__item-inner--range-bl')
          }
        } else if (isEnd) {
          if (date.date() === 1 || idx === 0) {
            // 如果是第一个，那么是圆角
            classNames.push('du-calendar__item-inner--selected')
          } else {
            // 否则只有右侧是圆角
            classNames.push('du-calendar__item-inner--range-br')
          }
        } else {
          classNames.push('du-calendar__item-inner--range-selected')
        }
      } else {
        classNames.push('du-calendar__item-inner--selected')
      }
    } else {
      classNames.push('du-calendar__item-inner--selected')
    }
  }

  return classNames.join(' ')
}

// 动态判断是否被禁用
const isDisabled = (d: dayjs.Dayjs | null) => {
  if (!d) {
    return false
  }
  if (
    (resolvedMin.value.isBefore(d) || resolvedMin.value.isSame(d, 'day')) &&
    (resolvedMax.value.isAfter(d) || resolvedMax.value.isSame(d, 'day'))
  ) {
    return false
  }

  return true
}

const changeSelectedDate = (d: dayjs.Dayjs | null) => {
  if (!d) {
    return
  }

  const disabled = isDisabled(d)
  if (disabled) {
    return
  }

  if (innerSelected.value.length === 2 && props.type === 'range') {
    innerSelected.value = []
  }

  if (innerSelected.value.length === 0) {
    innerSelected.value.push(d)
    return
  }

  // 遍历该数据在已选数据中是否已存在
  const isPrevSelected = isSelected(d)

  if (props.type === 'single') {
    if (isPrevSelected) {
      innerSelected.value = []
    } else {
      innerSelected.value = [d]
    }
  } else if (props.type === 'multiple') {
    if (isPrevSelected) {
      for (const [idx, item] of innerSelected.value.entries()) {
        if (d.isSame(item, 'day')) {
          innerSelected.value.splice(idx, 1)
        }
      }
    } else {
      if (innerSelected.value.length >= props.selectableCount) {
        return
      }
      innerSelected.value.push(d)
    }
  } else if (props.type === 'range') {
    const current = innerSelected.value[0]
    if (current.isAfter(d)) {
      innerSelected.value = [d]
    } else {
      innerSelected.value = [current, d]
    }
  }
}

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

function handleClear() {
  innerSelected.value = []
  startTime.value = ['8', '0']
  endTime.value = ['20', '0']
  emit('clear')
}

const handleConfirm = () => {
  if (innerSelected.value.length === 0) {
    return
  }

  let selected = [...innerSelected.value]

  if (props.showTimePicker) {
    if (props.type === 'range') {
      selected[0] = selected[0]
        .add(+startTime.value[0], 'hour')
        .add(+startTime.value[1], 'minute')
      selected[1] = selected[1]
        .add(+endTime.value[0], 'hour')
        .add(+endTime.value[1], 'minute')
    } else {
      selected = selected.map((d) =>
        d.add(+startTime.value[0], 'hour').add(+startTime.value[1], 'minute'),
      )
    }
  }

  if (props.type === 'single') {
    emit('confirm', {
      value: selected[0],
      date: selected[0],
      dates: selected,
    })
  } else {
    emit('confirm', {
      value: selected,
      date: selected[0],
      dates: selected,
    })
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      setMonthId()
      if (!props.selectedDate) {
        innerSelected.value = []
      } else {
        const dates = Array.isArray(props.selectedDate)
          ? props.selectedDate
          : [props.selectedDate]

        if (props.showTimePicker) {
          function toStepMinite(m: number) {
            return `${Math.floor(m / props.timeStep) * props.timeStep}`
          }

          if (props.type === 'range') {
            if (dates[0]) {
              startTime.value = [
                '' + dates[0].hour(),
                toStepMinite(dates[0].minute()),
              ]
            }
            if (dates[1]) {
              endTime.value = [
                '' + dates[1].hour(),
                toStepMinite(dates[1].minute()),
              ]
            }
          } else {
            if (dates[0]) {
              startTime.value = [
                '' + dates[0].hour(),
                toStepMinite(dates[0].minute()),
              ]
            }
          }
        }

        innerSelected.value = dates.map((d) => d.clone().startOf('day'))
      }
    } else {
      todayMonthId.value = ''
    }
  },
)
</script>
