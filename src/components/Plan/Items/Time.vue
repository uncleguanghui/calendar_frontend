<template>
  <a-dropdown :trigger="['click']" v-model="visible">
    <span style="cursor:pointer">
      <span v-if="showIcon">
        <a-tooltip title="设置时间" trigger="hover" placement="top">
          <a-icon type="clock-circle" v-if="timeString" style="color:#00bcbc" />
          <a-icon type="clock-circle" v-else />
        </a-tooltip>
      </span>
      <span v-else>
        <span v-if="timeString" class="time-string">
          {{ timeString }}
        </span>
        <span v-else style="color:#b3b3b3">设置时间</span>
      </span>
    </span>
    <div slot="overlay" class="container">
      <div>
        <div>
          <span
            :class="
              startDate && startDate._isValid ? 'span-data' : 'span-empty'
            "
          >
            开始
          </span>
          <a-date-picker
            v-model="startDate"
            size="small"
            :disabled-date="disabledStartDate"
            style="width: 120px"
            placeholder=""
            format="Y-MM-DD"
          />
          <a-time-picker
            v-if="allDay === false"
            style=" width: 120px; padding-left: 10px"
            placeholder=""
            size="small"
            use12-hours
            format="a h:mm"
            v-model="startDate"
            :open.sync="startOpen"
          >
            <!-- 时间选择组件中的自定义按钮 -->
            <div style="height:40px" slot="addon">
              <a-button
                size="small"
                type="primary"
                style="right: 10px; position: absolute"
                @click="startOpen = false"
              >
                确定
              </a-button>
            </div>
          </a-time-picker>
        </div>
        <div>
          <span
            :class="endDate && endDate._isValid ? 'span-data' : 'span-empty'"
          >
            结束
          </span>
          <a-date-picker
            v-model="endDate"
            size="small"
            :disabled-date="disabledEndDate"
            style="width: 120px"
            format="Y-MM-DD"
            placeholder=""
          />
          <a-time-picker
            v-if="allDay === false"
            style=" width: 120px; padding-left: 10px"
            placeholder=""
            size="small"
            use12-hours
            format="a h:mm"
            v-model="endDate"
            :open.sync="endOpen"
          >
            <!-- 时间选择组件中的自定义按钮 -->
            <div style="height:40px" slot="addon">
              <a-button
                size="small"
                type="primary"
                style="right: 10px; position: absolute"
                @click="endOpen = false"
              >
                确定
              </a-button>
            </div>
          </a-time-picker>
        </div>
        <div>
          <span :class="durationText ? 'span-data' : 'span-empty'">
            持续
          </span>
          <a-dropdown>
            <a-button size="small">
              <div style="display: -webkit-inline-box; min-width: 60px ">
                {{ durationText }}
              </div>
              <a-icon type="down" />
            </a-button>
            <a-menu
              slot="overlay"
              v-model="durationKey"
              selectable
              @select="handleSelect"
            >
              <a-menu-item
                :key="item.key"
                v-for="item in durations.filter(i => i.show)"
              >
                {{ item.content }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <a-divider style="margin: 12px 0 0 0" />
        <a-row>
          <a-col :span="9">
            全天：
            <a-switch v-model="allDay">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </a-col>
          <a-col :span="5">
            <a-button size="small" @click="visible = false">
              取消
            </a-button>
          </a-col>
          <a-col :span="5">
            <a-button type="danger" size="small" @click="handleClear">
              清除
            </a-button>
          </a-col>
          <a-col :span="5">
            <a-button size="small" type="primary" @click="handleUpdate">
              确定
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-dropdown>
</template>

<script>
export default {
  props: {
    value: String,
    showIcon: {
      type: Boolean,
      default: false // 是显示文字还是显示icon，默认显示文字
    }
  },
  data() {
    // 这里 value 值的含义，可以看 src/utils/planObj.js 里的 obj.time 部分
    let res = this.value.split("__");
    let allDay = res.length > 1 ? res[0] === "true" : null;
    let start = res.length > 1 ? res[1] : "";
    let end = res.length > 2 ? res[2] : "";
    let startDate = this.$moment(start)._isValid ? this.$moment(start) : null;
    let endDate = this.$moment(end)._isValid ? this.$moment(end) : null;

    return {
      allDay: allDay, // 是否全天
      startDate: startDate, // 开始日期
      endDate: endDate, // 结束日期

      visible: false,
      durationKey: [], // 持续时间
      startOpen: false,
      endOpen: false
    };
  },
  computed: {
    // 要显示的计划时间
    timeString() {
      let startString = "";
      let endString = "";
      if (this.startDate && this.startDate._isValid) {
        startString = this.startDate.format(
          this.allDay ? "Y年M月D日" : "Y年M月D日 HH:mm"
        );
        if (this.endDate && this.endDate._isValid) {
          endString = this.endDate.format(
            this.allDay ? "Y年M月D日" : "Y年M月D日 HH:mm"
          );
        }
      }
      // 当开始时间和结束时间一样，或者没有结束时间时，只显示开始时间
      if (startString === endString || !endString) {
        return startString;
      } else {
        return startString + " ~ " + endString;
      }
    },
    input() {
      let s = "";
      if (this.allDay !== null && this.startDate && this.startDate._isValid) {
        s += this.allDay + "__" + this.startDate.format("Y-MM-DD HH:mm:ss");
        if (this.endDate && this.endDate._isValid) {
          s += "__" + this.endDate.format("Y-MM-DD HH:mm:ss");
        }
      }
      return s;
    },
    // 持续时间
    durations() {
      return [
        { key: "0.5 hours", content: "30 分钟", show: this.allDay === false },
        { key: "1 hours", content: "60 分钟", show: this.allDay === false },
        { key: "1.5 hours", content: "90 分钟", show: this.allDay === false },
        { key: "2 hours", content: "2 小时", show: this.allDay === false },
        { key: "3 hours", content: "3 小时", show: this.allDay === false },
        { key: "4 hours", content: "4 小时", show: this.allDay === false },
        { key: "5 hours", content: "5 小时", show: this.allDay === false },
        { key: "6 hours", content: "6 小时", show: this.allDay === false },
        { key: "0 days", content: "仅当天", show: this.allDay === true },
        { key: "1 days", content: "1 天", show: true },
        { key: "2 days", content: "2 天", show: this.allDay === true },
        { key: "3 days", content: "3 天", show: this.allDay === true },
        { key: "4 days", content: "4 天", show: this.allDay === true },
        { key: "5 days", content: "5 天", show: this.allDay === true },
        { key: "6 days", content: "6 天", show: this.allDay === true },
        { key: "1 weeks", content: "1 周", show: this.allDay === true },
        { key: "2 weeks", content: "2 周", show: this.allDay === true },
        { key: "1 months", content: "1 月", show: this.allDay === true }
      ];
    },
    // 持续时间上要显示的文字
    durationText() {
      let durations = this.durations;
      let res = [];
      if (
        this.startDate &&
        this.startDate._isValid &&
        this.endDate &&
        this.endDate._isValid &&
        this.endDate - this.startDate > 0
      ) {
        // 都转成浮点数
        let diffHours =
          this.endDate.diff(this.startDate, "hours", true) + " hours";
        let diffDays =
          this.endDate.diff(this.startDate, "days", true) + " days";
        let diffWeeks =
          this.endDate.diff(this.startDate, "weeks", true) + " weeks";
        let diffMonth =
          this.endDate.diff(this.startDate, "months", true) + " months";
        res = durations.filter(
          i =>
            i.key === diffHours ||
            i.key === diffDays ||
            i.key === diffWeeks ||
            i.key === diffMonth
        );
      }
      if (res.length === 1) {
        return res[0].content;
      } else {
        return "";
      }
    }
  },
  watch: {
    value(to) {
      let res = to.split("__");
      this.allDay = res.length > 1 ? res[0] === "true" : null;
      let start = res.length > 1 ? res[1] : "";
      let end = res.length > 2 ? res[2] : "";

      this.startDate = this.$moment(start)._isValid
        ? this.$moment(start)
        : null;
      this.endDate = this.$moment(end)._isValid ? this.$moment(end) : null;
    },
    visible(to) {
      if (to) {
        // 打开下拉框时，如果没设置过相关参数，则给予默认值
        if (!this.input) {
          console.log("打开下拉框，给予默认值时间");
          this.allDay = true;
          this.startDate = this.$moment().startOf("hour");
          this.endDate = null;
        }
      } else {
        // 关闭下拉框时，如果用户还没有保存，则重置
        console.log("关闭下拉框，重置时间");
        let res = this.value.split("__");
        this.allDay = res.length > 1 ? res[0] === "true" : null;
        let start = res.length > 1 ? res[1] : "";
        let end = res.length > 2 ? res[2] : "";

        this.startDate = this.$moment(start)._isValid
          ? this.$moment(start)
          : null;
        this.endDate = this.$moment(end)._isValid ? this.$moment(end) : null;
      }
    }
  },
  methods: {
    // 向后台提交数据更新
    emitInput() {
      this.$emit("input", this.input);
    },
    disabledStartDate(startDate) {
      const endDate = this.endDate;
      if (!startDate || !endDate) {
        return false;
      }
      if (this.allDay) {
        return (
          startDate.startOf("day").valueOf() > endDate.startOf("day").valueOf()
        );
      } else {
        return startDate.valueOf() > endDate.valueOf();
      }
    },
    disabledEndDate(endDate) {
      const startDate = this.startDate;
      if (!endDate || !startDate) {
        return false;
      }
      return startDate.valueOf() > endDate.valueOf();
    },
    // 确认修改
    handleUpdate() {
      if (this.value !== this.input) {
        if (
          this.endDate &&
          this.endDate._isValid &&
          this.startDate &&
          this.startDate._isValid &&
          this.endDate < this.startDate
        ) {
          this.$message.error("结束时间不能比开始时间早");
          return;
        }
        console.log("确认修改时间");
        this.emitInput();
      } else {
        console.log("时间没有变化");
      }
      this.visible = false;
    },
    // 清除时间
    handleClear() {
      this.visible = false;
      this.allDay = null;
      this.startDate = null;
      this.endDate = null;
      if (this.value !== this.input) {
        console.log("清除时间并提交更新");
        this.emitInput();
      } else {
        console.log("时间没有变化");
      }
    },
    // 选择了持续时间以后，要修改结束时间了
    handleSelect({ key }) {
      if (this.startDate && this.startDate._isValid && key) {
        let key_ = key.split(" ");
        this.endDate = this.startDate.clone().add(parseFloat(key_[0]), key_[1]);
      }
    },
    // 添加结束时间
    handleCreate(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  padding: 10px;
  box-shadow: 1px 1px 5px 3px #d8d8d8;
  border-radius: 5px;
  line-height: 2.5;
  width: 320px;
}

.time-string {
  display: inline-block;
  padding: 0 3px;
}

.span-data,
.span-empty {
  padding-right: 10px;
  vertical-align: bottom;
  color: #636363;
}

.span-empty {
  color: #c3c3c3;
}
</style>
