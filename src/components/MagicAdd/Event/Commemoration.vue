<template>
  <a-modal
    centered
    :destroyOnClose="false"
    title="纪念"
    okText="确定"
    width="500px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="value"
  >
    <a-form :form="form">
      <a-form-item label="内容" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          v-decorator="['title']"
          placeholder="请输入纪念内容"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="日期" v-bind="formItemLayout">
        <a-date-picker
          v-decorator="['time']"
          placeholder="请选择纪念日"
          format="Y年MM月DD日"
          style="width:100%"
          @change="
            e => {
              selectDate = e;
            }
          "
        >
        </a-date-picker>
      </a-form-item>
      <a-form-item label="重复" v-bind="formItemLayout">
        <a-select
          v-decorator="[
            'repeat',
            {
              initialValue: selectRepeat
            }
          ]"
          style="width:100%"
          @change="
            e => {
              selectRepeat = e;
            }
          "
        >
          <a-select-option
            v-for="item in repeatItems"
            :value="item.value"
            :key="item.value"
          >
            {{ item.content }}
          </a-select-option>
        </a-select>
        <span slot="extra" v-if="leftDays !== null">
          距离下个纪念日还有：
          <span :style="{ color: leftDays === 0 ? 'red' : '#979797' }">
            {{ leftDays }}
          </span>
          天
        </span>
      </a-form-item>
      <a-form-item label="提醒" v-bind="formItemLayout">
        <a-select
          mode="multiple"
          v-decorator="[
            'alarm',
            {
              initialValue: selectAlarm
            }
          ]"
          style="width:100%"
          @change="
            e => {
              selectAlarm = e;
            }
          "
        >
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
// TODO: 对于重复项增加模板——对于爱情（增加第520天重复，1314天重复）；对于出生（增加第1个月重复，第100天重复）
export default {
  props: {
    value: Boolean
  },
  computed: {
    // 下一个还没到的纪念日
    nextCommemoration() {
      if (this.selectDate && this.selectDate._isValid) {
        let today = this.$moment().startOf("day"); // 今天
        let nextCommemoration = this.selectDate
          .clone()
          .startOf("day")
          .year(today.get("year"));

        // 如果今年纪念日已经过了
        if (nextCommemoration < today) {
          // 如果按年重复，则看明年的
          if (this.selectRepeat === "1year") {
            nextCommemoration.add(1, "years");
          } else if (this.selectRepeat === "1month") {
            // 如果按月重复，则先到这个月看看，如果还比较小，则到下个月
            nextCommemoration.month(today.get("month"));
            if (nextCommemoration < today) {
              nextCommemoration.add(1, "month");
            }
          } else if (this.selectRepeat === "none") {
            // 如果没有设置重复
            return null;
          } else {
            console.error("新增加了重复项");
            return null;
          }
        }
        return nextCommemoration;
      } else {
        return null;
      }
    },
    // 到下个纪念日的天数
    leftDays() {
      if (this.nextCommemoration) {
        let today = this.$moment().startOf("day"); // 今天
        return this.nextCommemoration.diff(today, "days");
      } else {
        return null;
      }
    },
    // 到下个提醒日的天数
    nextAlarmDays() {
      if (this.nextCommemoration && this.selectAlarm.length >= 1) {
        let today = this.$moment().startOf("day"); // 今天
        let alarmDate = null;
        let days = this.selectAlarm
          .map(i => parseInt(i.replace("days", "")))
          .sort((a, b) => b - a); // 提前提醒的天数列表

        for (let day of days) {
          let t = this.nextCommemoration.clone().subtract(day, "days");
          if (t >= today) {
            alarmDate = t;
            break;
          }
        }

        if (alarmDate) {
          return alarmDate.diff(today, "days");
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
      selectDate: null, // 纪念日 moment
      selectRepeat: "1year", // 重复的选项
      selectAlarm: ["7days"], // 提醒的选项
      repeatItems: [
        { value: "none", content: "不重复" },
        { value: "1month", content: "每月" },
        { value: "1year", content: "每年" }
      ],
      alarmItems: [
        { value: "0days", content: "当天 ( 8:00 )" },
        { value: "1days", content: "提前1天 ( 8:00 )" },
        { value: "3days", content: "提前3天 ( 8:00 )" },
        { value: "7days", content: "提前7天 ( 8:00 )" },
        { value: "15days", content: "提前15天 ( 8:00 )" },
        { value: "30days", content: "提前30天 ( 8:00 )" }
      ]
    };
  },
  methods: {
    handleCreate() {
      const form = this.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("提醒参数：", values);
        this.handleCancel();
      });
    },
    handleCancel() {
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped></style>
