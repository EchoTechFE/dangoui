<template>
  <DuPopup
    :visible="calendarVisible"
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
        scrollY
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
            <div class="du-cal-flex-item" v-for="(date, d) in item.day" :key="d">
              <!-- 禁用的日期 -->
              <div
                v-show="dateToTimeStamp(item.year, item.month, date) < dateToTimeStamp(minDateObj.year, minDateObj.month, minDateObj.date)
                || dateToTimeStamp(item.year, item.month, date) > dateToTimeStamp(maxDateObj.year, maxDateObj.month, maxDateObj.date)"
                class="du-cal-flex-item__day du-cal-list-day__disable"
              >{{ date }}</div>
              <!-- 未禁用的日期 -->
              <div
                v-show="dateToTimeStamp(minDateObj.year, minDateObj.month, minDateObj.date) <= dateToTimeStamp(item.year, item.month, date)
                && dateToTimeStamp(item.year, item.month, date) <= dateToTimeStamp(maxDateObj.year, maxDateObj.month, maxDateObj.date)"
                :class="showUnDisClassNames(item.year, item.month, date, selectedDates)"
                @click="changeSelectDate(item, date)"
              >
                <div class="actived-icon__bg">{{ date }}</div>
                <!-- 选中的样式 -->
                <div v-show="isSelected(item.year, item.month, date, selectedDates)" class="actived__icon">
                  <img src="https://cdn.qiandaoapp.com/admins/e4322e313bab92c19e287976ff80ffbd.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="du-cal-button">
        <DuButton type="text" @click="handleClose">取消</DuButton>
        <DuButton
          :disabled="selectedDates.length <= 0"
          class="du-cal-button__confirm"
          @click="handleConfirm"
        >{{ buttonConfirmText }}</DuButton>
      </div>
    </div>
  </DuPopup>
</template>

<script>
import { computed, toRefs, ref, onMounted, watch, reactive } from '@vue/composition-api';
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
      default: '请选择日期',
    },
    confirmText: {
      type: String,
      default: '',
    },
    defaultDate: {
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
      defaultDate,
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
          return selectedDates.value.length > 0 ? `确定(${selectedDates.value.length})` : '确定';
        }
      }
    });

    const minDateObj = computed(() => {
      return {
        year: Number(minDate.value.getFullYear()),
        month: Number(minDate.value.getMonth()),
        date: Number(minDate.value.getDate()),
      };
    });

    const maxDateObj = computed(() => {
      return {
        year: Number(maxDate.value.getFullYear()),
        month: Number(maxDate.value.getMonth()),
        date: Number(maxDate.value.getDate()),
      };
    });

    // 转换默认数组结构之后的数组对象
    const echoDefault = computed(() => {
      let list = [];
      if (Array.isArray(defaultDate.value)) {
        // new Date('')和new Date(y, m, d)转换后的时间戳起始小时不同，所以统一格式。
        for (let i = 0; i < defaultDate.value.length; i++) {
          list.push({
            year: Number(defaultDate.value[i].getFullYear()),
            month: Number(defaultDate.value[i].getMonth()),
            date: Number(defaultDate.value[i].getDate()),
          });
        }
      } else if (defaultDate.value) {
        list.push({
          year: Number(defaultDate.value.getFullYear()),
          month: Number(defaultDate.value.getMonth()),
          date: Number(defaultDate.value.getDate()),
        });
      }
      return list;
    });

    const weekList = ref(['日', '一', '二', '三', '四', '五', '六']);
    let calendarList = ref([]);
    let selectedDates = ref([...echoDefault.value]);

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
    const getInitDateData = async () => {
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

    // 根据是否被选中显示不同的样式
    const showUnDisClassNames = (year, month, date, array) => {
      const haved = isSelected(year, month, date, array);
      if (haved) {
        return classNames(['du-cal-flex-item__day', 'du-cal-list-day-actived'])
      } else {
        return classNames(['du-cal-flex-item__day', 'du-cal-list-day__undisable']);
      }
    };

    // 获取数组中的最小/最大日期(max/min)
    const getLimitValue = (type = 'min', array) => {
      const max = new Date(Math.max.apply(null, array));
      const min = new Date(Math.min.apply(null, array));
      return type === 'max' ? max : min;
    };

    const changeSelectDate = (item, date) => {
      if (selectedDates.value.length === 0) {
        selectedDates.value.push({
          year: Number(item.year),
          month: Number(item.month),
          date: Number(date),
        });
        return;
      }
      // 遍历该数据在已选数据中是否已存在
      const haved = isSelected(item.year, item.month, date, selectedDates.value);

      if (type.value === 'single') {
        if (haved) {
          selectedDates.value = [];
        } else {
          selectedDates.value = [{
            year: Number(item.year),
            month: Number(item.month),
            date: Number(date),
          }];
        }
      } else if (type.value === 'multiple') {
        if (haved) {
          for (let i = 0; i < selectedDates.value.length; i++) {
            if (
              item.year === selectedDates.value[i].year
              && item.month === selectedDates.value[i].month
              && date === selectedDates.value[i].date
            ) {
              selectedDates.value.splice(i, 1);
            }
          }
        } else {
          if (selectedDates.value.length >= selectableCount.value) { return }
          selectedDates.value.push({
            year: Number(item.year),
            month: Number(item.month),
            date: Number(date),
          });
        }
      }
    };

    const handleClose = () => {
      emit('close');
    };

    const handleConfirm = () => {
      if (selectedDates.value.length === 0) { return }
      let confirmDate = null;
      let confirmMap = [];

      if (type.value === 'single') {
        confirmDate = selectedDates.value[0];
        emit('confirm', { value: new Date(confirmDate.year, confirmDate.month, confirmDate.date) });
      } else if (type.value === 'multiple') {
        confirmMap = selectedDates.value.map(item => {
          return new Date(item.year, item.month, item.date);
        })
        emit('confirm', { value: confirmMap });
      }
    };

    // 触底加载更多
    const scrolltolower = () => {
      console.log('startDate - bottom:', startDate);
      const startDate = calendarList.value.length > 0 ? calendarList.value[calendarList.value.length -1] : null;
      if (!startDate) { return }
      let year = startDate.year;
      let month = startDate.month + 1;
      if (month > 11) {
        month = month -11;
        year = year + 1;
      }
      const topList = getNewDate('new', { year: year, month: month }, 3);
      console.log('topList:', topList);
      calendarList.value = [...calendarList.value, ...topList];
    };

    // 上拉加载更多
    const scrolltoupper = () => {
      console.log('startDate - top:', startDate);
      const startDate = calendarList.value.length > 0 ? calendarList.value[0] : null;
      if (!startDate) { return }
      let year = startDate.year;
      let month = startDate.month - 1;
      if (month < 0) {
        month = month + 1;
        year = year - 1;
      }
      const topList = getNewDate('old', { year: year, month: month }, 3);
      console.log('topList:', topList);
      calendarList.value = [...topList, ...calendarList.value];
    };

    onMounted(() => {
      getInitDateData();
    });

    watch(
      () => props.visible,
      async (val) => {
        if (val) {
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
      selectedDates,
      buttonConfirmText,
      minDateObj,
      maxDateObj,
      handleClose,
      scrolltolower,
      scrolltoupper,
      transMonFilter,
      changeSelectDate,
      dateToTimeStamp,
      showUnDisClassNames,
      isSelected,
      handleConfirm,
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
