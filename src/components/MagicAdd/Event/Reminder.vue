<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
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
      <a-form-item label="提醒日期" v-bind="formItemLayout">
        <a-date-picker
          v-decorator="['date']"
          placeholder="请选择首次提醒日期"
          :format="dateFormat"
          style="width:100%"
          @change="
            e => {
              selectDate = e;
            }
          "
        >
        </a-date-picker>
      </a-form-item>
      <a-form-item label="提醒时间" v-bind="formItemLayout">
        <a-time-picker
          :showTime="{ format: 'HH:mm' }"
          v-decorator="['time']"
          placeholder="提醒时间"
          format="a h点mm分"
          style="width:100%"
          @keydown.enter="openTime = false"
          :open.sync="openTime"
          @change="
            e => {
              selectTime = e;
            }
          "
        >
          <a-button
            slot="addon"
            size="small"
            type="primary"
            @click="openTime = false"
            style="width:100%"
          >
            完成
          </a-button>
        </a-time-picker>
        <span
          slot="extra"
          v-if="!nextAlarmTime && alarmTime"
          style="color: #ff1313"
        >
          设置的提醒时间已过时，请检查
        </span>
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
        <span slot="extra" v-if="nextAlarmTime">
          下次提醒：{{ nextAlarmTime.format("Y年MM月DD日 a h点mm分") }}
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
    // 真正的提醒时间
    alarmTime() {
      if (
        this.selectDate &&
        this.selectDate._isValid &&
        this.selectTime &&
        this.selectTime._isValid
      ) {
        let date = this.selectDate.clone().startOf("day");
        return date
          .hour(this.selectTime.get("hour"))
          .minute(this.selectTime.get("minute"));
      }
      return null;
    },
    // 下一次提醒时间（不能设置为不重复）
    nextAlarmTime() {
      if (this.alarmTime && this.alarmTime._isValid) {
        let now = this.$moment().startOf("minute"); // 现在
        let alarmDate = this.alarmTime.clone().startOf("minute"); // 设置的提醒时间

        if (alarmDate < now) {
          switch (this.selectRepeat) {
            case "none":
              alarmDate = null;
              break;
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
                .day(this.alarmTime.get("day"));
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
        }
        return alarmDate;
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
      openTime: false, // 时间选择框的打开状态
      selectDate: null, // 开始提醒的日期 moment
      selectTime: null, // 开始提醒的时间 moment
      selectRepeat: "none", // 重复选项的 value
      repeatItems: [
        { value: "none", content: "不重复" },
        { value: "1day", content: "每天" },
        { value: "1week", content: "每周" },
        { value: "1month", content: "每月" },
        { value: "1year", content: "每年" }
      ],
      dateFormat: [
        "YYYY年MM月DD日",
        "YYYY年MM月DD",
        "YYYY-MM-DD",
        "YYYYMMDD",
        "YYYY年M月DD日",
        "YYYY年MM月D日",
        "YYYY年M月D日",
        "YYYY年M月DD",
        "YYYY年MM月D",
        "YYYY年M月D",
        "YYYY-M-DD",
        "YYYY-MM-D",
        "YYYY-M-D",
        "YYYYMDD",
        "YYYYMD"
      ] // 日期格式化，支持多格式匹配，展示以第一个为准，并以此解析用户的输入项（如复制粘贴进来的日期格式）
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
