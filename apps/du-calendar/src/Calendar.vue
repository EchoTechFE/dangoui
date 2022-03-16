<template>
  <DuPopup
    :visible="innerVisible"
    :title="calendarTitle"
    :extStyle="style"
    :extClass="'pop-class'"
    type="bottom"
    @update:visible="handleClose"
  >
    <div
      :class="className"
      :style="style"
    >
      <div class="du-cal-flex du-cal-week">
        <div v-for="(item, index) in weekList" :key="index" class="du-cal-flex-item">
          <div class="du-cal-flex-item__week">{{ item }}</div>
        </div>
      </div>
      <scroll-view
        scrollX
        class="du-cal-cantainer"
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
      >
        <div v-for="(item, index) in calendarList" :key="index"  class="du-cal-list">
          <div class="du-cal-list__month">{{ item.year }}.{{transMonFilter(item.month)}}</div>
          <div class="du-cal-flex du-cal-list-day">
            <!-- 补齐日期空格 -->
            <div class="du-cal-flex-item" v-for="space in item.spaceDay" :key="space+'space'"></div>
            <!-- 遍历日期 -->
            <div class="du-cal-flex-item" v-for="(day, d) in item.day" :key="d">
              <!-- 禁用的日期 -->
              <!-- <div
                class="du-cal-flex-item__day du-cal-list-day__disable"
              >{{ day }}</div> -->
              <!-- 未禁用的日期 -->
              <div
                class="du-cal-flex-item__day du-cal-list-day__undisable"
                @click="changeSelectDate(item, day)"
              >{{ day }}</div>
              <!-- 选中的日期 -->
              <!-- <div class="du-cal-flex-item__day du-cal-list-day-actived">
                <div class="actived-icon__bg">{{ day }}</div>
                <div class="actived__icon">
                  <img src="https://cdn.qiandaoapp.com/admins/e4322e313bab92c19e287976ff80ffbd.png" />
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="du-cal-button">
        <DuButton type="text">取消</DuButton>
        <DuButton
          class="du-cal-button__confirm"
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
const getMaxDate = (date) => {
  let year = Number(date.getFullYear());
  let month = Number(date.getMonth());

  for (let i = 0; i < 6; i++) {
    if (month === 11) {
      month = 0;
      year = year + 1;
    } else {
      month = month + 1;
      year = year;
    }
  }

  return new Date(year, month, new Date(year, month + 1, 0).getDate());
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
      default: true,
    },
    type: {
      type: String,
      default: 'multiple',
    },
    title: {
      type: String,
      default: '请选择日期',
    },
    confirmText: {
      type: String,
      default: '',
    },
    defaultDate: {
      type: [Date, Array, null],
      default: () => { return [
        new Date('2021-11-23'), new Date('2021-12-31'), new Date('2022-01-15'), new Date('2022-01-20'),
        new Date('2022-01-29'), new Date('2022-02-16'), new Date('2022-02-20'), new Date(),
      ] },
    },
    minDate: {
      type: Date,
      default: () => { return new Date() },
    },
    maxDate: {
      type: Date,
      default: () => {
        return getMaxDate(new Date());
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
      defaultDate,
      selectableCount,
    } = toRefs(props);

    const innerVisible = ref(props.visible);

    const className = computed(() => {
      const {
        extClass
      } = props;
      return classNames(
        ['du-calendarendar', 'du-calendarendar--' + type.value],
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
      if (type.value === 'single') {
        return title.value;
      } else if (type.value === 'multiple') {
        return `${title.value}(最大可选${selectableCount.value}天)`;
      }
    });

    const buttonConfirmText = computed(() => {
      if (confirmText.value) {
        return confirmText.value;
      } else {
        if (type.value === 'single') {
          return '确定';
        } else if (type.value === 'multiple') {
          return selectedDates.value.length > 0 ? `确定(${selectableCount.value})` : '确定';
        }
      }
    });

    const minDateObj = computed(() => {
      return {
        year: Number(minDate.value.getFullYear()),
        month: Number(minDate.value.getMonth()),
        day: Number(minDate.value.getDate()),
      };
    });

    const maxDateObj = computed(() => {
      return {
        year: Number(maxDate.value.getFullYear()),
        month: Number(maxDate.value.getMonth()),
        day: Number(maxDate.value.getDate()),
      };
    });

    const unDisClassNames = computed(() => {
      let className = '';
      return ['du-cal-flex-item__day', className];
    });

    const weekList = ref(['日', '一', '二', '三', '四', '五', '六']);
    let calendarList = ref([]);
    let selectedDates = ref([]);

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
      monthInstance = 6,
    ) => {
      let year = startObj.year;
      let month = startObj.month;
      let list = [];
      for (let i = 0; i < monthInstance; i++) {
        // 获得新的月份
        if (type === 'new') {
          list.push({
            year: Number(year),
            month: Number(month),
            day: Number(new Date(year, month + 1, 0).getDate()),
            spaceDay: Number(new Date(year, month, 1).getDay()),
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
            day: Number(new Date(year, month + 1, 0).getDate()),
            spaceDay: Number(new Date(year, month, 1).getDay()),
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

      let list = getNewDate('new', { year: minDateObj.value.year, month: minDateObj.value.month }, monthInstance);
      calendarList.value = [...list];
    };

    const transMonFilter = (month) => {
      return month < 9 ? `0${month + 1}` : month + 1;
    };

    // 是否展示禁用样式
    const showDisable = (item) => {
      if (item.year < minDateObj.value.year) {
        return true;
      } else if (item.year === minDateObj.value.year && item.year === maxDateObj.value.year) {
        if (item.month < minDateObj.value.month) { return true }
        if (item.month = minDateObj.value.month && item.day < minDateObj.value.day) { return true}
        if (item.month = maxDateObj.value.month && item.day > maxDateObj.value.day) { return true }
        if (item.month > maxDateObj.value.month) { return true }
      } else if (item.year > maxDateObj.value.year) { return true }

      return false;
    };

    const handleClose = () => {
      // innerVisible.value = false;
      emit('close');
    };

    const changeSelectDate = (item, day) => {
      console.log('year:', item.year);
      console.log('month:', item.month);
      console.log('day:', day);
      if (selectedDates.value.length === 0) {
        selectedDates.value.push({
          year: item.year,
          month: item.month,
          day: day,
        });
        return;
      }
      // 遍历该数据在已选数据中是否已存在
      const haved = selectedDates.value.filter(element => {
        if (
          item.year === element.year
          && item.month === element.month
          && day === element.day
        ) {
          return true;
        } else { return false }
      });

      if (type.value === 'single') {
        if (haved.length > 0) {
          selectedDates.value = [];
        } else {
          selectedDates.value = [{
            year: item.year,
            month: item.month,
            day: day,
          }];
        }
      } else if (type.value === 'multiple') {
        if (haved.length > 0) {
          for (let i = 0; i < selectedDates.value.length; i++) {
            if (
              item.year === selectedDates.value[i].year
              && item.month === selectedDates.value[i].month
              && day === selectedDates.value[i].day
            ) {
              selectedDates.value.splice(i, 1);
            }
          }
        } else {
          selectedDates.value.push({
            year: item.year,
            month: item.month,
            day: day,
          });
        }
      }
    };

    const scrolltolower = () => {};

    const scrolltoupper = () => {};

    onMounted(() => {
      getInitDateData();
    });

    return {
      innerVisible,
      className,
      style,
      calendarTitle,
      weekList,
      calendarList,
      buttonConfirmText,
      minDateObj,
      maxDateObj,
      unDisClassNames,
      handleClose,
      scrolltolower,
      scrolltoupper,
      transMonFilter,
      showDisable,
      changeSelectDate,
    }
  },
};
</script>

<style lang="scss">
.pop-class {
  font-size: 28rpx;
}

.du-calendarendar {
  position: relative;

  .du-cal-week {
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

  .du-cal-cantainer {
    width: auto;
    overflow: auto;
    height: 854rpx;
    background: rgba(32, 36, 38, 0.06);
    .du-cal-list {
      &__month {
        font-size: 32rpx;
        color: #202426;
        padding: 10rpx 30rpx;
      }
      .du-cal-list-day {
        font-size: 32rpx;
        background: #fff;
        padding: 30rpx 30rpx 0 30rpx;

        &__disable {
          color: rgba(32, 36, 38, 0.2);
        }

        &__undisable {
          background: rgba(32, 36, 38, 0.06);
          border-radius: 8rpx;
        }

        .du-cal-list-day-actived {
          position: relative;
          background: rgba(92, 58, 135, 0.2);
          border-radius: 8rpx;
          box-shadow: 0 0 0 1px #5C3A87;
          overflow: hidden;

          .actived-icon__bg {
            position: absolute;
            z-index: 0;
          }

          .actived__icon {
            position: absolute;
            z-index: 10;
            bottom: 0;
            right: 0;
            width: 24rpx;
            height: 18rpx;
            background: #5C3A87;
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
  }

  .du-cal-button {
    padding-left: 30rpx;
    padding-right: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(0rpx + env(safe-area-inset-bottom));

    &__confirm {
      width: 604rpx;
    }
  }
}
</style>
