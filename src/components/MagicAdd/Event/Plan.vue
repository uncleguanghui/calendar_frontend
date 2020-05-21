<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
    okText="确定"
    width="500px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="value"
  >
    <span slot="title">
      计划
      <plan-level v-model="level" style="margin-left: 10px" />
      <plan-time v-model="time" style="margin-left: 10px" class="time-string" />
    </span>
    <a-form :form="form">
      <a-form-item label="内容" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          v-decorator="['title']"
          placeholder="请简单描述计划内容"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="提醒" v-bind="formItemLayout" v-if="time">
        <a-select mode="multiple" v-model="selectAlarm" style="width:100%">
          <a-select-option
            v-for="item in alarmItems"
            :value="item.value"
            :key="item.value"
          >
            {{ item.content }}
          </a-select-option>
        </a-select>
        <span slot="extra" v-if="nextAlarmDays !== null">
          距离下次提醒还有：
          <span :style="{ color: nextAlarmDays === 0 ? 'red' : '#979797' }">
            {{ nextAlarmDays }}
          </span>
          天
        </span>
      </a-form-item>
      <a-form-item label="备注" v-bind="formItemLayout">
        <a-textarea
          autocomplete="off"
          v-decorator="['description']"
          placeholder=""
          style="width:100%"
          :rows="1"
          :autoSize="{
            minRows: 1,
            maxRows: 5
          }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import PlanLevel from "@/components/Plan/Items/Level";
import PlanTime from "@/components/Plan/Items/Time";

export default {
  components: { PlanLevel, PlanTime },
  props: {
    value: Boolean
  },
  computed: {
    // 开始时间 moment
    start() {
      let t = this.time.split("__")[1];
      return t ? this.$moment(t) : null;
    },
    // 结束时间 moment
    end() {
      let t = this.time.split("__")[2];
      return t ? this.$moment(t) : null;
    },
    // 提醒
    alarmItems() {
      let items = [];
      if (this.start) {
        items.push({ value: "start -3 days", content: "开始前3天 ( 8:00 )" });
        items.push({ value: "start -1 days", content: "开始前1天 ( 8:00 )" });
        items.push({ value: "start 0 days", content: "开始当天 ( 8:00 )" });
      }
      if (this.end) {
        items.push({ value: "end -3 days", content: "结束前3天 ( 8:00 )" });
        items.push({ value: "end -1 days", content: "结束前1天 ( 8:00 )" });
        items.push({ value: "end 0 days", content: "结束当天 ( 8:00 )" });
      }
      return items;
    },
    // 所有的提醒时间
    alarmTimes() {
      let alarmTimes = [];
      for (let alarm of this.selectAlarm) {
        let res = alarm.split(" ");
        let day = parseInt(res[1]);
        if (res[0] === "start" && this.start && this.start._isValid) {
          alarmTimes.push(this.start.clone().add(day, "days"));
        } else if (res[0] === "end" && this.end && this.end._isValid) {
          alarmTimes.push(this.end.clone().add(day, "days"));
        }
      }
      alarmTimes = alarmTimes.sort().map(i => i.startOf("day").hour(8));
      return alarmTimes;
    },
    // 到下个提醒日的天数
    nextAlarmDays() {
      let current = this.$moment().startOf("minute");
      for (let time of this.alarmTimes) {
        let diffDays = time.diff(current, "days");
        if (diffDays >= 0) {
          return diffDays;
        }
      }
      return null;
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      time: "true__" + this.$moment().format("YYYY-MM-DD"), // 时间字符串
      level: "none",
      selectAlarm: [] // 提醒的选项
    };
  },
  methods: {
    handleCreate() {
      const form = this.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("计划参数：", values);
        this.handleCancel();
      });
    },
    handleCancel() {
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped>
.time-string {
  font-size: 8px;
  color: #8e8e8e;
  border: 1px solid #8e8e8e;
  border-radius: 4px;
  padding: 4px;
}
</style>
