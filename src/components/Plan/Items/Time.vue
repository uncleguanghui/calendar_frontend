<template>
  <div>
    <a-checkbox v-model="checkedAllDay">全天</a-checkbox>
    <div>
      <div>
        <span :style="{ paddingRight: '10px', verticalAlign: 'bottom' }">
          开始
        </span>
        <a-date-picker
          v-model="startDate"
          size="small"
          :disabled-date="disabledStartDate"
          :style="{
            width: '120px'
          }"
          placeholder=""
          format="Y-MM-DD"
        />
        <a-time-picker
          v-if="!checkedAllDay"
          :style="{
            width: '120px',
            paddingLeft: '10px'
          }"
          placeholder=""
          size="small"
          use12-hours
          format="a h:mm"
          v-model="startTime"
        />
      </div>
      <div>
        <span :style="{ paddingRight: '10px', verticalAlign: 'bottom' }">
          结束
        </span>
        <a-date-picker
          v-model="endDate"
          size="small"
          :disabled-date="disabledEndDate"
          :style="{ width: '120px' }"
          format="Y-MM-DD"
          placeholder=""
          :open="endOpen"
        />
        <a-time-picker
          v-if="!checkedAllDay"
          :style="{
            width: '120px',
            paddingLeft: '10px'
          }"
          placeholder=""
          size="small"
          use12-hours
          format="a h:mm"
          v-model="endTime"
        />
      </div>
      <span :style="{ paddingRight: '10px', verticalAlign: 'bottom' }">
        持续
      </span>
      <a-dropdown>
        <a-menu
          slot="overlay"
          @click="durationText = $event.item.$el.innerText"
        >
          <a-menu-item key="0.5h" v-if="!checkedAllDay">30 分钟</a-menu-item>
          <a-menu-item key="1h" v-if="!checkedAllDay">60 分钟</a-menu-item>
          <a-menu-item key="1.5h" v-if="!checkedAllDay">90 分钟</a-menu-item>
          <a-menu-item key="2h" v-if="!checkedAllDay">2 小时</a-menu-item>
          <a-menu-item key="3h" v-if="!checkedAllDay">3 小时</a-menu-item>
          <a-menu-item key="6h" v-if="!checkedAllDay">6 小时</a-menu-item>
          <a-menu-item key="1d">1 天</a-menu-item>
          <a-menu-item key="2d" v-if="checkedAllDay">2 天</a-menu-item>
          <a-menu-item key="3d" v-if="checkedAllDay">3 天</a-menu-item>
          <a-menu-item key="7d" v-if="checkedAllDay">7 天</a-menu-item>
          <a-menu-item key="14d" v-if="checkedAllDay">14 天</a-menu-item>
        </a-menu>
        <a-button size="small">
          <div style="display: -webkit-inline-box; min-width: 60px ">
            {{ durationText }}
          </div>
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    start: String,
    end: String,
    checked: Boolean
  },
  data() {
    return {
      oneday: 86400, // 1天秒数
      endOpen: false,
      durationText: "2", // 持续时间
      // 日期时间选择
      checkedAllDay: this.checked, // 全天选择
      startDate: this.$moment(this.start),
      startTime: this.$moment(this.start),
      endDate: this.$moment(this.end),
      endTime: this.$moment(this.end)
    };
  },
  computed: {
    // 开始~结束的日期差（天）
    dateDelta() {
      return 1;
    },
    // 开始~结束的时间差（秒），不考虑天数
    timeDelta() {
      let deltaS = Math.ceil((this.targetEnd - this.targetStart) / 1000); // 时间差（毫秒））
      let deltaM = (deltaS % this.oneday) * 24 * 60; // 分钟
      return deltaM;
    }
  },
  watch: {
    start(to) {
      this.startDate = this.$moment(to);
      this.startTime = this.$moment(to);
    },
    end(to) {
      this.endDate = this.$moment(to);
      this.endTime = this.$moment(to);
    },
    checked(to) {
      this.checkedAllDay = to;
    }
  },
  methods: {
    disabledStartDate(startDate) {
      const endDate = this.endDate;
      if (!startDate || !endDate) {
        return false;
      }
      return startDate.valueOf() > endDate.valueOf();
    },
    disabledEndDate(endDate) {
      const startDate = this.startDate;
      if (!endDate || !startDate) {
        return false;
      }
      return startDate.valueOf() >= endDate.valueOf();
    }
    // // 开始日期的打开事件变化时
    // // @openChange="handleStartOpenChange"
    // handleStartOpenChange(open) {
    //   if (!open) {
    //     this.endOpen = true;
    //   }
    // },
    // // 开始时间的打开事件变化时
    // // @change="handleStartTimeChange"
    // handleStartTimeChange(time) {
    //   this.startTime = time;
    // },
  }
};
</script>

<style scoped></style>
