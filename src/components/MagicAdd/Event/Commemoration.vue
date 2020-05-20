<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
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
          :mode="mode"
          v-decorator="['time']"
          placeholder="请选择纪念日"
          :format="dateFormat"
          style="width:100%"
          @openChange="handleOpenChange"
          @panelChange="handlePanelChange"
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
      <a-form-item label="特殊提醒" v-bind="formItemLayout">
        <a-select
          mode="multiple"
          v-decorator="[
            'specialAlarm',
            {
              initialValue: selectSpecial
            }
          ]"
          style="width:100%;"
          @change="
            e => {
              selectSpecial = e;
            }
          "
        >
          <a-select-opt-group
            v-for="group in specialAlarmItems"
            :key="group.label"
          >
            <span slot="label">
              <a-icon :type="group.icon" />
              {{ group.label }}
            </span>
            <a-select-option
              v-for="item in group.children"
              :value="item.value"
              :key="item.value"
            >
              {{ item.content }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
        <span slot="extra" v-if="selectSpecial.length > 0">
          <span v-if="nextSpecialDate">
            距离最近的特殊纪念日
            <span :style="{ color: '#ff7c7c' }">
              {{ nextSpecialDate.title }}
            </span>
            还有
            <span :style="{ color: '#ff7c7c' }">
              {{ nextSpecialDate.diff }}
            </span>
            天
          </span>
          <span v-else>
            这些特殊提醒日子都已经过去啦
          </span>
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
export default {
  props: {
    value: Boolean
  },
  computed: {
    // 下一个特殊日子
    nextSpecialDate() {
      if (
        this.selectDate &&
        this.selectDate._isValid &&
        this.selectSpecial &&
        this.selectSpecial.length > 0
      ) {
        let today = this.$moment().startOf("day"); // 今天
        let commemoration = this.selectDate.clone().startOf("day"); // 纪念日当天

        // 添加还未到的特殊纪念日并排序
        let dates = [];
        for (let key of this.selectSpecial) {
          let res = key.split(" ");
          let date = commemoration.clone().add(parseInt(res[0]), res[1]);
          if (date > today) {
            // 找到对应的元素
            let items = this.specialAlarmItems.filter(
              i => i.children.filter(j => j.value === key).length > 0
            )[0];
            let item = items
              ? items.children.filter(j => j.value === key)[0]
              : undefined;
            if (item) {
              // 保存纪念日名称和距离日期
              let diff = date.diff(today, "days");
              dates.push({ title: item.content, diff: diff });
            }
          }
        }
        dates.sort((a, b) => a.date - b.date);

        if (dates.length) {
          return dates[0];
        }
      }
      return null;
    },
    // 下一个还没到的纪念日
    nextCommemoration() {
      if (this.selectDate && this.selectDate._isValid) {
        let today = this.$moment().startOf("day"); // 今天
        let nextCommemoration = this.selectDate.clone().startOf("day"); // 纪念日当天

        // 如果纪念日发生在过去，则切换到纪念的纪念日
        if (nextCommemoration < today) {
          nextCommemoration.year(today.get("year"));
        }

        // 如果今年纪念日已经过了，则看明年的
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
      if (this.nextCommemoration && this.selectAlarm !== "none") {
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
      mode: "year",
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      selectDate: null, // 纪念日 moment
      selectRepeat: "1year", // 重复的选项
      selectAlarm: "7days", // 提醒的选项
      selectSpecial: [], // 特殊提醒的选项
      repeatItems: [
        { value: "none", content: "不重复" },
        { value: "1month", content: "每月" },
        { value: "1year", content: "每年" }
      ],
      alarmItems: [
        { value: "none", content: "不提醒" },
        { value: "0days", content: "当天 ( 8:00 )" },
        { value: "1days", content: "提前1天 ( 8:00 )" },
        { value: "3days", content: "提前3天 ( 8:00 )" },
        { value: "7days", content: "提前7天 ( 8:00 )" },
        { value: "15days", content: "提前15天 ( 8:00 )" },
        { value: "30days", content: "提前30天 ( 8:00 )" }
      ],
      specialAlarmItems: [
        {
          label: "爱情",
          icon: "heart",
          children: [
            { value: "99 days", content: "第99天" },
            { value: "520 days", content: "第520天" },
            { value: "999 days", content: "第999天" },
            { value: "1314 days", content: "第1314天" },
            { value: "5200 days", content: "第5200天" },
            { value: "9999 days", content: "第9999天" }
          ]
        },
        {
          label: "宝宝",
          icon: "smile",
          children: [
            { value: "1 months", content: "满月（第30天）" },
            { value: "42 days", content: "月子（第42天）" },
            { value: "100 days", content: "百日（第100天）" }
          ]
        }
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
    },
    // 打开面板时，重置 mode 为 year
    handleOpenChange(open) {
      if (open) {
        if (this.selectDate) {
          this.mode = "date";
        } else {
          this.mode = "year";
        }
      }
    },
    // 在面板上点击时，触发此面板切换函数
    // value 为 一个 moment 对象
    handlePanelChange(value, mode) {
      if (!mode) {
        // 当在 year 面板上点击时（不知道为什么 mode 为 null），切换到 month
        this.mode = "month";
      } else {
        // 当在 month 面板上点击时（不知道为什么 mode 不是 month 而是 date），切换到 date
        this.mode = "date";
      }
    }
  }
};
</script>

<style scoped></style>
