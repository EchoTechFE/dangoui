<template>
  <DuPopup
    :visible="visible"
    :title="calendarTitle"
    :extStyle="style"
    :extClass="className"
    type="bottom"
    @update:visible="handleClose"
  >
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
      <scroll-view :scroll-y="true" class="du-calendar__container">
        <div
          v-for="(month, index) in displayDates"
          :key="index"
          class="du-calendar__month-container"
        >
          <div class="du-calendar__month">
            {{ month[0].year() }}.{{ month[0].month() + 1 }}
          </div>
          <div class="du-calendar__dates">
            <div
              class="du-calendar__item"
              v-for="i in month[0].day() - weekStart"
              :key="i"
            ></div>
            <div
              class="du-calendar__item"
              v-for="date in month"
              :key="date.unix()"
              @click="changeSelectedDate(date)"
            >
              <div
                :class="[
                  'du-calendar__item-inner',
                  {
                    'du-calendar__item-inner--selected': isSelected(date),
                    'du-calendar__item-inner--disabled': isDisabled(date),
                  },
                ]"
              >
                <div
                  v-if="isToday(date)"
                  style="color: var(--du-calendar-active-text-color)"
                >
                  今
                </div>
                <template v-else>
                  {{ date.date() }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="du-calendar--button">
        <DuButton
          type="primary"
          size="large"
          full
          :disabled="!!buttonDisabled"
          @click="handleConfirm"
          :text="buttonConfirmText"
        />
      </div>
    </div>
  </DuPopup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuPopup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    extClass?: string | Array<string> | Record<string, string>
    extStyle?: string | Record<string, string>
    visible?: boolean
    type?: 'single' | 'multiple' | 'range'
    title?: string
    confirmText?: string
    selectedDate?: dayjs.Dayjs[]
    min?: dayjs.Dayjs
    max?: dayjs.Dayjs
    selectableCount?: number
    weekStart?: number
    ignoreDisable?: boolean
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
    max: () => dayjs().startOf('month').add(6, 'month').endOf('month'),
    selectableCount: 30,
    weekStart: 0,
    ignoreDisable: false,
  },
)

const emit = defineEmits<{
  (e: 'confirm', value: { value: dayjs.Dayjs[] }): void
  (e: 'close'): void
  (e: 'update:visible', visible: boolean): void
}>()

const innerSelected = ref<dayjs.Dayjs[]>([])

const className = computed(() => {
  const { extClass } = props
  return classNames(['du-calendar'], extClass)
})

const style = computed(() => {
  const { extStyle } = props
  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        ...extStyle,
      })
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

const buttonConfirmText = computed(() => {
  if (props.confirmText) {
    return props.confirmText
  } else {
    if (props.type === 'single') {
      return '确定'
    } else if (props.type === 'multiple') {
      return innerSelected.value.length > 0
        ? `确定(${innerSelected.value.length})`
        : '确定'
    } else {
      return '确定'
    }
  }
})

const buttonDisabled = computed(() => {
  return innerSelected.value.length <= 0
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
  const { min, max } = props
  const start = min.startOf('month')
  const end = max.endOf('month')

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
  return monthGroups
})

function isToday(d: dayjs.Dayjs) {
  return dayjs().isSame(d, 'day')
}

// 判断某项是否被选中
const isSelected = (d: dayjs.Dayjs) => {
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

// 动态判断是否被禁用
const isDisabled = (d: dayjs.Dayjs) => {
  if ((props.min.isBefore(d) && props.max.isAfter(d)) || props.ignoreDisable) {
    return false
  }

  return true
}

const changeSelectedDate = (d: dayjs.Dayjs) => {
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
    if (isPrevSelected) {
      return
    }

    const current = innerSelected.value[0]
    if (current.isAfter(d)) {
      innerSelected.value = [d, current]
    } else {
      innerSelected.value = [current, d]
    }
  }
}

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (innerSelected.value.length === 0) {
    return
  }

  emit('confirm', {
    value: innerSelected.value,
  })
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      innerSelected.value = props.selectedDate.map((d) => d.clone())
    }
  },
)
</script>
