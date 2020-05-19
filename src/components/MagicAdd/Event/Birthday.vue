<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
    title="生日"
    okText="确定"
    width="400px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="value"
  >
    <a-form :form="form">
      <a-form-item label="名字" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          v-decorator="['name']"
          placeholder="请输入名字，或昵称"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="生日" v-bind="formItemLayout">
        <a-date-picker
          v-decorator="['birthday']"
          placeholder="请选择生日"
          format="Y年MM月DD日"
          style="width:100%"
          @change="
            e => {
              selectDate = e;
            }
          "
        >
        </a-date-picker>
        <span slot="extra" v-if="leftDays !== null">
          距离下个生日还有：
          <span :style="{ color: leftDays === 0 ? 'red' : '#979797' }">
            {{ leftDays }}
          </span>
          天
        </span>
      </a-form-item>
      <a-form-item label="类型" v-bind="formItemLayout">
        <a-select
          v-decorator="[
            'dayType',
            {
              initialValue: 'gregorian'
            }
          ]"
          style="width:100%"
        >
          <a-select-option value="gregorian">
            公历
          </a-select-option>
          <a-select-option value="lunar">
            农历
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="提醒" v-bind="formItemLayout">
        <a-select
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
          style="width:100%"
          placeholder=""
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
// TODO: 可以把农历和日历整合在一起
// TODO: 完善农历下的提醒功能
// TODO: 完善提醒时间的选择
export default {
  props: {
    value: Boolean
  },
  computed: {
    // 下一个还没过的生日
    nextBrithday() {
      if (this.selectDate && this.selectDate._isValid) {
        let today = this.$moment().startOf("day"); // 今天
        let nextBirthday = this.selectDate
          .clone()
          .startOf("day")
          .year(today.get("year"));
        // 如果今年生日已经过了，则看明年的
        if (nextBirthday < today) {
          nextBirthday.add(1, "years");
        }
        console.log("下个生日", nextBirthday.format("Y年MM月DD日"));
        return nextBirthday;
      } else {
        return null;
      }
    },
    // 到下个生日的天数
    leftDays() {
      if (this.nextBrithday) {
        let today = this.$moment().startOf("day"); // 今天
        return this.nextBrithday.diff(today, "days");
      } else {
        return null;
      }
    },
    // 到下次提醒的天数（能设置为不提醒）
    // 如果设置的提醒时间大于等于此刻，则不返回
    nextAlarmDays() {
      if (this.nextBrithday && this.selectAlarm !== "none") {
        let today = this.$moment().startOf("day"); // 今天
        let alarmDate = this.nextCommemoration
          .clone()
          .subtract(parseInt(this.selectAlarm.replace("days", "")), "days"); // 提醒日期
        if (alarmDate >= today) {
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
      selectDate: null, // 选择的日期
      selectAlarm: "7days", // 设置的提醒
      newIndex: 0, // 新提醒的序号
      alarmItems: [
        { value: "none", content: "不提醒" },
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
        console.log("生日参数：", values);
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
