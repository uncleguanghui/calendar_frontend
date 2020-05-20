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
      <a-form-item label="类型" v-bind="formItemLayout">
        <a-select
          v-decorator="[
            'dayType',
            {
              initialValue: selectType
            }
          ]"
          style="width:100%"
          @change="
            e => {
              selectType = e;
            }
          "
        >
          <a-select-option value="gregorian">
            公历
          </a-select-option>
          <a-select-option value="lunar">
            农历
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="生日" v-bind="formItemLayout">
        <a-date-picker
          :mode="mode"
          v-decorator="['birthday']"
          placeholder="请选择生日"
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
          <template slot="dateRender" slot-scope="current">
            <!-- 显示农历在日期上 -->
            <div class="ant-calendar-date" :style="getCurrentStyle(current)">
              <div class="date-number-string">
                {{ current.date() }}
              </div>
              <div class="date-lunar-string">
                {{ getLunarString(current) }}
              </div>
            </div>
          </template>
        </a-date-picker>
        <span slot="extra" v-if="leftDays !== null">
          <span v-if="lunarDate && selectType === 'lunar'">
            {{ $lunar.format(lunarDate, "T A YMd") }}
            <br />
          </span>
          <span>
            距离下个生日还有：
            <span :style="{ color: leftDays === 0 ? 'red' : '#979797' }">
              {{ leftDays }}
            </span>
            天
          </span>
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
export default {
  props: {
    value: Boolean
  },
  computed: {
    // 农历日期，返回特殊对象 {leap: false, year: 2020, month: 4, day: 1, leapMonth: 4}
    lunarDate() {
      if (this.selectDate && this.selectDate._isValid) {
        let date = new Date(this.selectDate.toDate().toDateString());
        return this.$lunar.solarToLunar(date); // 生日当天农历（month值在1~12）
      }
      return null;
    },
    // 下一个还没过的生日
    nextBrithday() {
      if (this.selectDate && this.selectDate._isValid) {
        let today = this.$moment().startOf("day"); // 今天
        let nextBirthday = this.selectDate.clone().startOf("day"); // 下一个生日
        if (this.selectType === "lunar") {
          // 公历转农历，获取农历生日的月、日
          let lunar = this.lunarDate;

          // 如果生日发生在过去，则切换到今年的生日
          if (nextBirthday < today) {
            nextBirthday = this.$moment(
              this.$lunar.lunarToSolar(
                today.get("year"),
                lunar.month,
                lunar.day
              )
            );
          }

          // 如果今年生日已经过了，则看今年闰月的（leap=true）
          // 如果没有闰月，则该日期就是上面算的今年生日
          if (nextBirthday < today) {
            nextBirthday = this.$moment(
              this.$lunar.lunarToSolar(
                today.get("year") + 1,
                lunar.month,
                lunar.day,
                true
              )
            );
          }

          // 如果今年生日已经过了，则看明年的（不用管闰月了）
          if (nextBirthday < today) {
            nextBirthday = this.$moment(
              this.$lunar.lunarToSolar(
                today.get("year") + 1,
                lunar.month,
                lunar.day
              )
            );
          }
          console.log("下个生日", nextBirthday.format("Y年MM月DD日"));
        } else {
          // 如果生日发生在过去，则切换到今年的生日
          if (nextBirthday < today) {
            nextBirthday.year(today.get("year"));
          }

          // 如果今年生日已经过了，则看明年的
          if (nextBirthday < today) {
            nextBirthday.add(1, "years");
          }
          console.log("下个生日", nextBirthday.format("Y年MM月DD日"));
        }

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
        let alarmDate = this.nextBrithday
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
      selectType: "gregorian", // 生日类型
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
        console.log("生日参数：", values);
        this.handleCancel();
      });
    },
    handleCancel() {
      this.$emit("input", false);
    },
    // 尽可能把字符放到一起，同时如果是农历的初一，则将颜色变红，并增加一个边框
    getCurrentStyle(current) {
      let style = {
        width: "38px",
        height: "38px",
        lineHeight: 1,
        paddingTop: "6px"
      };
      // 判断农历是否为初一
      let date = new Date(current.toDate().toDateString());
      let lunar = this.$lunar.solarToLunar(date);
      if (lunar.day === 1) {
        style.color = "#ff6464";
        style.border = "1px solid #ff6464";
        style.borderRadius = "50%";
      }
      return style;
    },
    // 获取农历字符串
    // 因为 lunar 库有点问题，当小时和分钟不为0时，给出的农历日期是有问题的，所以这里稍作处理
    getLunarString(current, format = "D") {
      let date = new Date(current.toDate().toDateString());
      let lunar = this.$lunar.solarToLunar(date);
      return this.$lunar.format(lunar, format);
    },
    // 禁止选择的日期为未来（暂时不限制了。。体验上并没有多好）
    disabledDate(current) {
      return current && current > this.$moment().endOf("day");
    },
    // 打开面板时，如果已输入了有效日期，则进入日期页面，否则重置 mode 为 year
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

<style scoped>
.date-number-string {
  font-size: 12px;
}

/* 农历字符在变成最小的12px的同时，再进行0.7倍的缩小 */
.date-lunar-string {
  transform: scale(0.6);
  font-size: 12px;
}
</style>
