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
        <div class="du-cal-list">
          <div class="du-cal-list__month">2022.02</div>
          <div class="du-cal-flex du-cal-list-day">
            <!-- 补齐日期空格 -->
            <div class="du-cal-flex-item" v-for="item in 2" :key="item"></div>
            <!-- 遍历日期 -->
            <div class="du-cal-flex-item" v-for="item in 10" :key="item">
              <!-- 禁用的日期 -->
              <!-- <div class="du-cal-flex-item__day du-cal-list-day__disable">{{ item }}</div> -->
              <!-- 未禁用的日期 -->
              <!-- <div class="du-cal-flex-item__day du-cal-list-day__undisable">{{ item }}</div> -->
              <!-- 选中的日期 -->
              <div class="du-cal-flex-item__day du-cal-list-day-actived">
                <div class="actived-icon__bg">{{ item }}</div>
                <div class="actived__icon">
                  <img src="https://cdn.qiandaoapp.com/admins/e4322e313bab92c19e287976ff80ffbd.png" />
                </div>
              </div>
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
import { computed, toRefs, ref, reactive } from '@vue/composition-api';
import styleToCss from 'style-object-to-css-string';
import classNames from 'classnames';
import DuButton from '@echoingtech/du-button/src/Button.vue';
import DuPopup from '@echoingtech/du-popup/src/Popup.vue';

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
      default: '确定',
    },
    minDate: {
      type: Date,
      default: () => { return new Date() },
    },
    maxDate: {
      type: Date,
      default: () => { return new Date() },
    },
    defaultDate: {
      type: [Date, Array, null],
      default: () => { return new Date() },
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

    let checkedDates = ref([]);

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
      if (type.value === 'single') {
        return confirmText.value;
      } else if (type.value === 'multiple') {
        return checkedDates.value.length > 0 ? `${confirmText.value}(${selectableCount.value})` : confirmText.value;
      }
    });

    const weekList = ref(['日', '一', '二', '三', '四', '五', '六']);
    const monthDay = ref([31, '', 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
    let date = new Date('2022-03-16');
    console.log('date----:', date);

    const handleClose = () => {
      // innerVisible.value = false;
      emit('close');
    };
    const scrolltolower = () => {};
    const scrolltoupper = () => {};
    return {
      innerVisible,
      className,
      style,
      calendarTitle,
      weekList,
      buttonConfirmText,
      handleClose,
      scrolltolower,
      scrolltoupper,
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
