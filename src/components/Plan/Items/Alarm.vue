<template>
  <a-dropdown :trigger="['click']" v-model="visible">
    <span v-if="alarmString">
      下次提醒：
      <div class="alarm-string">
        {{ alarmString }}
      </div>
    </span>
    <span v-else style="color:#bfbfbf">设置提醒</span>
    <div slot="overlay" class="container">
      <a-row>
        <span>提前天数</span>
        <a-select v-model="advancedDays" class="select-value" size="small">
          <a-select-option :value="day" :key="day" v-for="day in array(0, 30)">
            {{ day + " 天" }}
          </a-select-option>
        </a-select>
      </a-row>
      <a-row>
        <span>提醒时间</span>
        <a-select v-model="alarmTime" class="select-value" size="small">
          <a-select-option
            :value="time.value"
            :key="time.value"
            v-for="time in timeArray"
          >
            {{ time.content }}
          </a-select-option>
        </a-select>
      </a-row>
      <a-divider style="margin: 16px 0" />
      <a-row>
        <a-col :span="8">
          <a-button @click="visible = false">
            取消
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="danger" @click="handleClear">
            清除
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" @click="handleUpdate">
            确定
          </a-button>
        </a-col>
      </a-row>
    </div>
  </a-dropdown>
</template>

<script>
export default {
  props: {
    value: String,
    start: String
  },
  data() {
    return {
      visible: false, // 下拉框是否可见
      timeArray: this.makeTimeArray(), // 时间数组
      advancedDays: this.value ? parseInt(this.value.split(" ")[0]) : null, // 提前的天数
      alarmTime: this.value ? this.value.split(" ")[1] : "" // 提醒的时间
    };
  },
  computed: {
    // 要显示在前端的下一次提醒日期
    alarmString() {
      if (this.start && this.input) {
        return (
          this.$moment(this.start)
            .subtract(this.advancedDays, "days")
            .format("Y年M月D日") +
          " " +
          this.alarmTime
        );
      } else {
        return "";
      }
    },
    input() {
      if (this.advancedDays !== null && this.alarmTime) {
        return this.advancedDays + " " + this.alarmTime;
      } else {
        return "";
      }
    }
  },
  watch: {
    value(to) {
      this.advancedDays = to ? parseInt(to.split(" ")[0]) : null;
      this.alarmTime = to ? to.split(" ")[1] : "";
    },
    visible(to) {
      if (to) {
        // 打开下拉框时，如果没设置过相关参数，则给予默认值
        if (!this.input) {
          console.log("给予提醒默认值");
          this.advancedDays = 1;
          this.alarmTime = "09:00";
        }
      } else {
        // 关闭下拉框时，如果用户还没有保存，则重置
        console.log("重置提醒时间");
        this.advancedDays = this.value
          ? parseInt(this.value.split(" ")[0])
          : null;
        this.alarmTime = this.value ? this.value.split(" ")[1] : "";
      }
    }
  },
  methods: {
    // 向后台提交数据更新
    emitInput() {
      this.$emit("input", this.input);
    },
    // 确认修改
    handleUpdate() {
      this.visible = false;
      if (this.value !== this.input) {
        this.emitInput();
      } else {
        console.log("提醒策略没有变化");
      }
    },
    // 清除提醒
    handleClear() {
      this.visible = false;
      this.advancedDays = null;
      this.alarmTime = "";
      if (this.value !== this.input) {
        this.emitInput();
      } else {
        console.log("提醒策略没有变化");
      }
    },
    // 生成有序数组
    array(start, end, step = 1) {
      let res = [];
      for (let index = start; index < end; index += step) {
        res.push(index);
      }
      return res;
    },
    // 时刻表
    makeTimeArray() {
      let res = [];
      for (let t of ["上午", "下午"]) {
        for (let hour of this.array(0, 12)) {
          for (let minute of this.array(0, 60, 15)) {
            let hour24_ = t === "上午" ? hour : hour + 12;
            let hour12_s = hour + ""; // 12 小时制的小时字符串
            let hour24_s = (hour24_ + "").padStart(2, "0"); // 24 小时制的小时字符串
            let minute_s = (minute + "").padStart(2, "0"); // 分钟字符串
            res.push({
              value: `${hour24_s}:${minute_s}`, // 作为策略保存的值
              content: `${t} ${hour12_s}:${minute_s}` // 前端展示的内容
            });
          }
        }
      }
      return res;
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
  text-align: center;
  line-height: 2.5;
  width: 280px;
}

.select-value {
  width: 120px;
  margin-left: 20px;
}

.alarm-string {
  display: inline-block;
  padding: 0 3px;
}
</style>
