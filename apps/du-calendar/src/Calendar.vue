<template>
  <DuPopup
    :visible="calendarVisible"
    :title="calendarTitle"
    :extStyle="style"
    :extClass="className"
    type="bottom"
    @update:visible="handleClose"
  >
    <div class="du-calendarendar--main">
      <div class="du-cal-flex du-calendarendar--week">
        <div v-for="(item, index) in weekList" :key="index" class="du-cal-flex-item">
          <div class="du-cal-flex-item__week">{{ item }}</div>
        </div>
      </div>
      <scroll-view
        scrollY
        class="du-calendarendar-cantainer"
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
      >
        <div v-for="(item, index) in calendarList" :key="index"  class="du-cal-list">
          <div class="du-cal-list__month">{{ item.year }}.{{transMonFilter(item.month)}}</div>
          <div class="du-cal-flex du-cal-list-day">
            <!-- 补齐日期空格 -->
            <div class="du-cal-flex-item" v-for="space in item.spaceDay" :key="space+'space'"></div>
            <!-- 遍历日期 -->
            <div class="du-cal-flex-item" v-for="(date, d) in item.day" :key="d">
              <div
                :class="[
                  'du-cal-flex-item__day',
                  {
                    'du-cal-list-day__disable': showDisable(item.year, item.month, date),
                    'du-cal-list-day-actived': !showDisable(item.year, item.month, date) && isSelected(item.year, item.month, date, selectedDateList),
                    'du-cal-list-day__undisable': !showDisable(item.year, item.month, date) && !isSelected(item.year, item.month, date, selectedDateList),
                  }
                ]"
                @click="changeSelectDate(item, date)"
              >
                <div
                  v-if="!showDisable(item.year, item.month, date) && isSelected(item.year, item.month, date, selectedDateList)"
                  class="du-cal-main-bg"
                ></div>
                <div class="actived-icon__bg">{{ date }}</div>
                <div
                  v-if="!showDisable(item.year, item.month, date) && isSelected(item.year, item.month, date, selectedDateList)"
                  class="actived__icon"
                >
                  <img src="https://cdn.qiandaoapp.com/admins/e4322e313bab92c19e287976ff80ffbd.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="du-calendarendar-button">
        <DuButton
          type="text"
          :extClass="['du-calendarendar-button__top']"
          @click="handleClose"
        >取消</DuButton>
        <DuButton
          :disabled="selectedDateList.length <= 0"
          :extClass="['du-calendarendar-button__confirm']"
          @click="handleConfirm"
        >{{ buttonConfirmText }}</DuButton>
      </div>
    </div>
  </DuPopup>
</template>

<script>
import { computed, toRefs, ref, onMounted, watch } from '@vue/composition-api';
import styleToCss from 'style-object-to-css-string';
import classNames from 'classnames';
import DuButton from '@echoingtech/du-button/src/Button.vue';
import DuPopup from '@echoingtech/du-popup/src/Popup.vue';

// 获取最大选择日期
const getMaxDate = (date, instance = 6) => {
  let year = Number(date.getFullYear());
  let month = Number(date.getMonth()) + instance;
  let initDate = Number(date.getDate());
  if (month > 11) {
    month = month -11;
    year = year + 1;
  }
  let dateDetail = Number(new Date(year, month + 1, 0).getDate());
  if (dateDetail > initDate) {
    dateDetail = initDate;
  }
  return {
    year,
    month,
    date: dateDetail,
  };
};

export default {
  components: { DuButton, DuPopup },
  props: {
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: 'font-size: 16rpx;',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'multiple',
    },
    title: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    selectedDate: {
      type: [Date, Array, null],
      default: () => { return [] },
    },
    minDate: {
      type: Date,
      default: () => { return new Date() },
    },
    maxDate: {
      type: Date,
      default: () => {
        const { year, month, date } = getMaxDate(new Date());
        return new Date(year, month, date);
      },
    },
    selectableCount: {
      type: [String, Number],
      default: 30,
    },
  },
  setup (props, { emit }) {
    const {
      type,
      title,
      confirmText,
      minDate,
      maxDate,
      selectedDate,
      selectableCount,
    } = toRefs(props);

    const calendarVisible = ref(props.visible);

    const className = computed(() => {
      const {
        extClass
      } = props;
      return classNames(
        ['du-calendarendar'],
        extClass,
      );
    });

    const style = computed(() => {
      const { extStyle } = props;
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
          ...extStyle
        });
    });

    const calendarTitle = computed(() => {
      if (title.value) {
        return title.value;
      } else {
        if (type.value === 'single') {
          return '请选择日期';
        } else if (type.value === 'multiple') {
          return `请选择日期(最大可选${selectableCount.value}天)`;
        }
      }
    });

    const buttonConfirmText = computed(() => {
      if (confirmText.value) {
        return confirmText.value;
      } else {
        if (type.value === 'single') {
          return '确定';
        } else if (type.value === 'multiple') {
          return selectedDateList.value.length > 0 ? `确定(${selectedDateList.value.length})` : '确定';
        }
      }
    });

    const minDateObj = computed(() => {
      const year = minDate.value.getFullYear();
      const month = minDate.value.getMonth();
      const date = minDate.value.getDate();
      return {
        year,
        month,
        date,
        timeStamp: dateToTimeStamp(year, month, date),
      };
    });

    const maxDateObj = computed(() => {
      const year = maxDate.value.getFullYear();
      const month = maxDate.value.getMonth();
      const date = maxDate.value.getDate();
      return {
        year,
        month,
        date,
        timeStamp: dateToTimeStamp(year, month, date),
      };
    });

    // 转换默认数组结构之后的数组对象
    const echoDefault = computed(() => {
      let list = [];
      const selectedList = selectedDate.value;
      if (Array.isArray(selectedList)) {
        // new Date('')和new Date(y, m, d)转换后的时间戳起始小时不同，所以统一格式。
        for (let i = 0; i < selectedList.length; i++) {
          list.push({
            year: selectedList[i].getFullYear(),
            month: selectedList[i].getMonth(),
            date: selectedList[i].getDate(),
          });
        }
      } else if (selectedList) {
        list.push({
          year: selectedList.getFullYear(),
          month: selectedList.getMonth(),
          date: selectedList.getDate(),
        });
      }
      return list;
    });

    const weekList = ref(['日', '一', '二', '三', '四', '五', '六']);
    let calendarList = ref([]);
    let selectedDateList = ref([...echoDefault.value]);

    /**
     * 获取更多的数据
     * @param {String} new 之后的月份
     * @param {String} old 之前的月份
     * @param {String} monthInstance 可选择的月间隔
     * @param {Object} startObj 起始日期
     * @returns {Array} 新的数据
     */
    const getNewDate = (
      type = 'new',
      startObj = { year: null, month: null },
      monthCount = 6,
    ) => {
      let year = startObj.year;
      let month = startObj.month;
      let list = [];
      for (let i = 0; i < monthCount; i++) {
        // 获得新的月份
        if (type === 'new') {
          list.push({
            year: Number(year),
            month: Number(month),
            day: new Date(year, month + 1, 0).getDate(),
            spaceDay: new Date(year, month, 1).getDay(),
          })
          if (Number(month) === 11) {
            year = year + 1;
            month = 0;
          } else {
            year = year;
            month = month + 1;
          }
        } else if (type === 'old') { // 获得之前的月份
          list.unshift({
            year: Number(year),
            month: Number(month),
            day: new Date(year, month + 1, 0).getDate(),
            spaceDay: new Date(year, month, 1).getDay(),
          })
          if (Number(month) === 0) {
            year = year - 1;
            month = 11;
          } else {
            year = year;
            month = month - 1;
          }
        }
      }
      return list;
    };

    // 初始化数据
    const getInitDateData = () => {
      const yearInstance = maxDateObj.value.year - minDateObj.value.year;
      let monthInstance = null;
      if (yearInstance === 0) {
        monthInstance = maxDateObj.value.month - minDateObj.value.month;
      } else {
        monthInstance = yearInstance * 12 - minDateObj.value.month + maxDateObj.value.month;
      }

      const list = getNewDate('new', { year: minDateObj.value.year, month: minDateObj.value.month }, monthInstance + 1);
      calendarList.value = [...list];
    };

    const transMonFilter = (month) => {
      return month < 9 ? `0${month + 1}` : month + 1;
    };

    // 精确到天
    const dateToTimeStamp = (year, month, date) => {
      const inti = new Date(year, month, date).getTime();
      const ms = Math.floor(inti / 1000);
      const s = Math.floor(ms / 60);
      const h = Math.floor(s / 60);
      const d = Math.floor(h / 24);
      return d;
    };

    // 判断某项是否被选中
    const isSelected = (year, month, date, array) => {
      const init = dateToTimeStamp(year, month, date);
      const flag = array.some(item => {
        const timeStamp = dateToTimeStamp(item.year, item.month, item.date);
        return init === timeStamp;
      });
      return flag;
    };

    // 动态判断是否被禁用
    const showDisable = (year, month, date) => {
      const itemTimeStamp = dateToTimeStamp(year, month, date);
      if (minDateObj.value.timeStamp <= itemTimeStamp
        && itemTimeStamp <= maxDateObj.value.timeStamp
      ) {
        return false;
      }
      return true;
    };

    const changeSelectDate = (item, date) => {
      if (selectedDateList.value.length === 0) {
        selectedDateList.value.push({
          year: item.year,
          month: item.month,
          date: date,
        });
        return;
      }
      // 遍历该数据在已选数据中是否已存在
      const saved = isSelected(item.year, item.month, date, selectedDateList.value);

      if (type.value === 'single') {
        if (saved) {
          selectedDateList.value = [];
        } else {
          selectedDateList.value = [{
            year: item.year,
            month: item.month,
            date: date,
          }];
        }
      } else if (type.value === 'multiple') {
        if (saved) {
          for (let i = 0; i < selectedDateList.value.length; i++) {
            if (
              item.year === selectedDateList.value[i].year
              && item.month === selectedDateList.value[i].month
              && date === selectedDateList.value[i].date
            ) {
              selectedDateList.value.splice(i, 1);
            }
          }
        } else {
          if (selectedDateList.value.length >= selectableCount.value) { return }
          selectedDateList.value.push({
            year: item.year,
            month: item.month,
            date: date,
          });
        }
      }
    };

    const handleClose = () => {
      emit('close');
    };

    const handleConfirm = () => {
      if (selectedDateList.value.length === 0) { return }
      let confirmDate = null;
      let confirmList = [];

      if (type.value === 'single') {
        confirmDate = selectedDateList.value[0];
        emit('confirm', { value: new Date(confirmDate.year, confirmDate.month, confirmDate.date) });
      } else if (type.value === 'multiple') {
        confirmList = selectedDateList.value.map(item => {
          return new Date(item.year, item.month, item.date);
        })
        emit('confirm', { value: confirmList });
      }
    };

    // 触底加载更多
    const scrolltolower = () => {
      const startDate = calendarList.value.length > 0 ? calendarList.value[calendarList.value.length -1] : null;
      if (!startDate) { return }
      let year = startDate.year;
      let month = startDate.month + 1;
      if (month > 11) {
        month = month -11;
        year = year + 1;
      }
      const topList = getNewDate('new', { year: year, month: month }, 3);
      calendarList.value = [...calendarList.value, ...topList];
    };

    // 上拉加载更多
    const scrolltoupper = () => {
      const startDate = calendarList.value.length > 0 ? calendarList.value[0] : null;
      if (!startDate) { return }
      let year = startDate.year;
      let month = startDate.month - 1;
      if (month < 0) {
        month = month + 1;
        year = year - 1;
      }
      const topList = getNewDate('old', { year: year, month: month }, 3);
      calendarList.value = [...topList, ...calendarList.value];
    };

    onMounted(() => {
      getInitDateData();
    });

    watch(
      () => props.visible,
      async (val) => {
        if (val) {
          selectedDateList.value = [...echoDefault.value];
          await getInitDateData();
          calendarVisible.value = true;
        } else {
          calendarVisible.value = false;
          calendarList.value = [];
        }
      }
    );

    return {
      calendarVisible,
      className,
      style,
      calendarTitle,
      weekList,
      calendarList,
      selectedDateList,
      buttonConfirmText,
      minDateObj,
      maxDateObj,
      handleClose,
      scrolltolower,
      scrolltoupper,
      transMonFilter,
      changeSelectDate,
      dateToTimeStamp,
      isSelected,
      handleConfirm,
      showDisable,
    }
  },
};
</script>

<style lang="scss">
.du-calendarendar {
  font-size: 28rpx;

  &--main {
    position: relative;
  }

  &--week {
    padding: 0 30rpx;
  }

  .du-cal-flex {
    display: flex;
    flex-wrap: wrap;
    font-size: 28rpx;

    .du-cal-flex-item {
      width: 14.2%;
      margin-bottom: 24rpx;
      &__week {
        margin: 0 auto;
        width: 78rpx;
        height: 44rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__day {
        margin: 0 auto;
        width: 78rpx;
        height: 78rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .du-calendarendar-cantainer {
    width: auto;
    overflow: auto;
    height: 854rpx;
    background: var(--du-calendar-container-bg-color);
    .du-cal-list {
      &__month {
        font-size: 32rpx;
        color: va(--du-calendar-normal-text-color);
        padding: 10rpx 30rpx;
      }
      .du-cal-list-day {
        font-size: 32rpx;
        background: var(--du-calendar-main-container-bg-color);
        padding: 30rpx 30rpx 0 30rpx;

        &__disable {
          color: var(--du-calendar-disabled-text-color);
        }

        &__undisable {
          background: var(--du-calendar-normal-bg-color);
          border-radius: 8rpx;
          color: va(--du-calendar-normal-text-color);
        }
      }
      .du-cal-list-day-actived {
        position: relative;
        border-radius: 8rpx;
        box-shadow: 0 0 0 1px var(--du-calendar-primary);
        overflow: hidden;
        color: var(--du-calendar-active-text-color);

        .du-cal-main-bg {
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          background-color: var(--du-calendar-primary);
          opacity: 0.2;
        }

        .actived-icon__bg {
          position: absolute;
          z-index: 20;
        }

        .actived__icon {
          position: absolute;
          z-index: 50;
          bottom: 0;
          right: 0;
          width: 24rpx;
          height: 18rpx;
          background-color: var(--du-calendar-primary);
          border-radius: 8rpx 0 0 0;
          line-height: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 14rpx;
            height: 10rpx;
          }
        }
      }
    }
  }

  .du-calendarendar-button {
    padding-left: 30rpx;
    padding-right: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0rpx;
    padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(0rpx + env(safe-area-inset-bottom));

    &__top {
      margin-top: 10rpx;
    }

    &__confirm {
      margin-top: 10rpx;
      width: 604rpx;
      background-color: var(--du-calendar-primary);
    }
  }
}
</style>
