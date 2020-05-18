<template>
  <a-modal
    centered
    :destroyOnClose="false"
    title="提醒"
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
          placeholder="请简单描述提醒内容"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="提醒时间" v-bind="formItemLayout">
        <a-date-picker
          :showTime="{ format: 'HH:mm' }"
          v-decorator="['time']"
          placeholder="请选择开始提醒时间"
          format="Y年MM月DD日  ah点mm分"
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
        <span slot="extra" v-if="nextAlarmTimeString">
          下次提醒：{{ nextAlarmTimeString }}
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
    // 下一次提醒时间（不能设置为不重复）
    // 如果设置的提醒时间大于等于此刻，则不返回
    nextAlarmTimeString() {
      if (
        this.selectDate &&
        this.selectDate._isValid &&
        this.selectRepeat !== "none"
      ) {
        let now = this.$moment().startOf("minute"); // 现在
        let alarmDate = this.selectDate.clone().startOf("minute"); // 设置的提醒时间
        if (alarmDate < now) {
          switch (this.selectRepeat) {
            case "1day":
              alarmDate
                .year(now.get("year"))
                .month(now.get("month"))
                .date(now.get("date"));
              if (alarmDate <= now) {
                alarmDate.add(1, "days");
              }
              break;
            case "1week":
              alarmDate
                .year(now.get("year"))
                .month(now.get("month"))
                .date(now.get("date"))
                .day(this.selectDate.get("day"));
              if (alarmDate <= now) {
                alarmDate.add(1, "weeks");
              }
              break;
            case "1month":
              alarmDate.year(now.get("year")).month(now.get("month"));
              if (alarmDate <= now) {
                alarmDate.add(1, "months");
              }
              break;
            case "1year":
              alarmDate.year(now.get("year"));
              if (alarmDate <= now) {
                alarmDate.add(1, "years");
              }
              break;
            default:
              break;
          }
          return alarmDate.format("Y年MM月DD日  ah点mm分");
        }
      }
      return "";
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      selectDate: null, // 开始提醒的日期 moment
      selectRepeat: "none", // 重复选项的 value
      repeatItems: [
        { value: "none", content: "不重复" },
        { value: "1day", content: "每天" },
        { value: "1week", content: "每周" },
        { value: "1month", content: "每月" },
        { value: "1year", content: "每年" }
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
