<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
    title="课程"
    okText="确定"
    width="500px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="value"
  >
    <a-form :form="form">
      <a-form-item label="课程名称" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          v-decorator="['title']"
          placeholder="请输入课程名称"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="上课日期" v-bind="formItemLayout">
        <a-range-picker
          v-decorator="['date']"
          :ranges="{
            今天: [$moment(), $moment()],
            本周: [$moment().startOf('week'), $moment().endOf('week')],
            本月: [$moment().startOf('month'), $moment().endOf('month')],
            上半年: [
              $moment().startOf('year'),
              $moment()
                .startOf('year')
                .add(6, 'months')
            ],
            下半年: [
              $moment()
                .startOf('year')
                .add(6, 'months'),
              $moment().endOf('year')
            ],
            今年: [$moment().startOf('year'), $moment().endOf('year')]
          }"
          format="YYYY-MM-DD"
          style="width:100%"
          @change="
            e => {
              selectStartDate = e[0];
              selectEndDate = e[1];
            }
          "
        />
        <span
          slot="extra"
          v-if="
            selectStartDate &&
              selectEndDate &&
              selectEndDate.startOf('day') < $moment().startOf('day')
          "
        >
          这个课程你已经上完了哦
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
          style="width: 100%"
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
      </a-form-item>
      <a-form-item
        label="星期"
        v-bind="formItemLayout"
        v-if="selectRepeat === 'weeks'"
      >
        <a-button-group>
          <a-button
            v-for="day in weekDays"
            :key="day"
            style="width:14.4%"
            @click="() => handleClick(day)"
            :type="selectWeekDay.indexOf(day) > -1 ? 'primary' : 'default'"
          >
            {{ day }}
          </a-button>
        </a-button-group>
        <span slot="extra" v-if="currentProgress.total > 0">
          目前进度 <b>{{ Math.floor(currentProgress.rate * 100) }}%</b>， 已完成
          <b>{{ currentProgress.finish }} / {{ currentProgress.total }}</b> 节
          <span v-if="leftDays !== null">
            <br />
            下一节课在
            <span v-if="leftDays > 0">
              <b>{{ leftDays }}</b> 天后
            </span>
            <span v-else style="color:#ff4d4f">今天</span>
          </span>
        </span>
      </a-form-item>
      <a-form-item
        label="在每月的"
        v-bind="formItemLayout"
        v-if="selectRepeat === 'months'"
      >
        <!-- 选择上课时间，允许只选中父级选项 -->
        <a-cascader
          :options="monthOptions"
          placeholder="请选择"
          style="width:100%"
          @change="
            e => {
              selectMonthOption1 = e[0];
              selectMonthOption2 = e[1];
            }
          "
        >
          <span
            slot="displayRender"
            slot-scope="{ selectedOptions }"
            v-if="selectedOptions && selectedOptions.length > 0"
          >
            {{ showMonthOptions(selectedOptions) }}
          </span>
        </a-cascader>
      </a-form-item>
      <a-form-item
        label="在每年的"
        v-bind="formItemLayout"
        v-if="selectRepeat === 'years'"
      >
        <!-- 选择上课时间，允许只选中父级选项 -->
        <a-cascader
          :options="yearOptions"
          placeholder="请选择"
          style="width:100%"
          @change="
            e => {
              selectYearOption1 = e[0];
              selectYearOption2 = e[1];
              selectYearOption3 = e[2];
            }
          "
        >
          <span
            slot="displayRender"
            slot-scope="{ selectedOptions }"
            v-if="selectedOptions && selectedOptions.length > 0"
          >
            {{ showYearOptions(selectedOptions) }}
          </span>
        </a-cascader>
      </a-form-item>
      <a-form-item label="上课时间" v-bind="formItemLayout">
        <!-- 选择上课时间，允许只选中父级选项 -->
        <a-cascader
          v-decorator="['time']"
          :options="timeOptions"
          placeholder="请选择上课时间"
          style="width:100%"
          @change="
            e => {
              selectTimeOption1 = e[0];
              selectTimeOption2 = e[1];
            }
          "
        >
          <span
            slot="displayRender"
            slot-scope="{ selectedOptions }"
            v-if="selectedOptions && selectedOptions.length > 0"
          >
            {{ showTimeOptions(selectedOptions) }}
          </span>
        </a-cascader>
      </a-form-item>
      <a-form-item label="时长" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'duration',
            {
              initialValue: selectDuration
            }
          ]"
          suffix="分钟"
          @change="
            e => {
              selectDuration = e.target.value;
            }
          "
        >
        </a-input>
      </a-form-item>
      <a-form-item label="地点" v-bind="formItemLayout">
        <position
          v-decorator="['position']"
          @change="
            e => {
              selectPosition = e;
            }
          "
          style="border: 1px solid #d9dad9; padding: 4px 11px; border-radius: 4px;"
        ></position>
      </a-form-item>
      <a-form-item label="提醒" v-bind="formItemLayout">
        <a-select
          v-decorator="['alarm']"
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
import Position from "@/components/Plan/Items/Position";

export default {
  components: { Position },
  props: {
    value: Boolean
  },
  computed: {
    // 课程的日期列表
    courseDates() {
      let courseDates = [];
      if (this.selectStartDate && this.selectEndDate) {
        let startDate = this.selectStartDate.startOf("day");
        let endDate = this.selectEndDate.startOf("day");
        // 按天循环
        for (let day = 0; day < endDate.diff(startDate, "days"); day++) {
          let date = startDate.clone().add(day, "days");
          if (this.selectRepeat === "days") {
            // 如果是按天重复，加上每天
            courseDates.push(date);
          } else if (this.selectRepeat === "weeks" && this.selectWeekDay) {
            // 如果是按日重复，则判断当天是否满足所选的星期
            let weekday = this.weekDays[date.isoWeekday() - 1];
            if (this.selectWeekDay.indexOf(weekday) > -1) {
              courseDates.push(date);
            }
          } else if (
            this.selectRepeat === "months" &&
            this.selectMonthOption1 &&
            this.selectMonthOption2
          ) {
            // 如果是按月重复，则判断当天是否满足所选的日期或星期
            if (
              this.isWeekDayRight(
                date,
                this.selectMonthOption1,
                this.selectMonthOption2
              )
            ) {
              courseDates.push(date);
            }
          } else if (
            this.selectRepeat === "years" &&
            this.selectYearOption1 &&
            this.selectYearOption2 &&
            this.selectYearOption3
          ) {
            // 如果是按年重复，则判断当天是否满足所选的月份、日期或星期
            let monthOk = date.month() + 1 + "月" === this.selectYearOption1;
            if (
              monthOk &&
              this.isWeekDayRight(
                date,
                this.selectYearOption2,
                this.selectYearOption3
              )
            ) {
              courseDates.push(date);
            }
          }
        }
      }
      return courseDates;
    },
    // 课程的时间列表(开始时间、结束时间)
    courseTimes() {
      let courseTimes = this.courseDates
        .map(i =>
          i
            .clone()
            .hour(this.selectTimeOption1 || 0)
            .minute(this.selectTimeOption2 || 0)
        )
        .map(i => [
          i,
          i.clone().add(parseInt(this.selectDuration) || 0, "minutes")
        ]);
      console.log(
        "上课时间",
        courseTimes.map(
          i =>
            i[0].format("YYYY-MM-DD HH:mm") +
            " ~ " +
            i[1].format("YYYY-MM-DD HH:mm")
        )
      );
      return courseTimes;
    },
    // 下一节课上课时间
    // 如果当前正处于上课时间里，则认为当前的课已经上完了，因此只需要比较各种开始时间
    nextCourseStartTime() {
      if (this.courseTimes.length > 0) {
        let current = this.$moment().startOf("minute");
        let nextCourseStartTime = null;
        for (let times of this.courseTimes) {
          if (times[0] > current) {
            nextCourseStartTime = times[0];
            break;
          }
        }
        return nextCourseStartTime;
      } else {
        return null;
      }
    },
    // 下一节课的剩余天数
    leftDays() {
      return this.nextCourseStartTime
        ? this.nextCourseStartTime.diff(this.$moment().startOf("day"), "days")
        : null;
    },
    // 当前上课进度(0~1)，不管时间仅看天数
    currentProgress() {
      let current = this.$moment().startOf("minute");
      let finishCount = 0;
      for (let times of this.courseTimes) {
        if (times[0] > current) {
          break;
        } else {
          finishCount += 1;
        }
      }
      let res = {
        finish: finishCount, // 已完成
        total: this.courseTimes.length, // 总课数
        rate: finishCount > 0 ? finishCount / this.courseTimes.length : 0 // 完成率
      };
      console.log("课程进度", res);
      return res;
    },
    // 到下个提醒日的天数
    nextAlarmDays() {
      if (this.nextCourseStartTime && this.selectAlarm !== "none") {
        let today = this.$moment().startOf("day"); // 今天
        let alarmDate = this.nextCourseStartTime
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
      weekDays: ["一", "二", "三", "四", "五", "六", "日"],
      timeOptions: this.createTimeOptions(), // 上课时间选择
      monthOptions: this.createMonthOptions(), // 按月重复时的选择
      yearOptions: this.createYearOptions(), // 按年重复时的选择

      selectStartDate: undefined, // 课程开始日期 moment
      selectEndDate: undefined, // 课程结束日期 moment
      selectYearOption1: undefined, // 当按年重复时，月份的选择
      selectYearOption2: undefined, // 当按年重复时，序号的选择
      selectYearOption3: undefined, // 当按年重复时，星期的选择
      selectMonthOption1: undefined, // 当按月重复时，序号的选择
      selectMonthOption2: undefined, // 当按月重复时，星期的选择
      selectWeekDay: "", // 当按周重复时，星期的选择，多个选择之间用下划线相连
      selectTimeOption1: undefined, // 选择时间时，小时
      selectTimeOption2: undefined, // 选择时间时，分钟
      selectRepeat: "weeks", // 重复的选项
      selectAlarm: "none", // 提醒的选项
      selectDuration: "45", // 课程时长，暂时对于各种计算没有帮助
      selectPosition: "", // 地址

      repeatItems: [
        { value: "days", content: "每天" },
        { value: "weeks", content: "每周" },
        { value: "months", content: "每月" },
        { value: "years", content: "每年" }
      ],
      alarmItems: [
        { value: "0days", content: "当天 ( 8:00 )" },
        { value: "1days", content: "提前1天 ( 8:00 )" },
        { value: "3days", content: "提前3天 ( 8:00 )" },
        { value: "7days", content: "提前7天 ( 8:00 )" }
      ]
    };
  },
  methods: {
    // 点击星期，改变选中状态
    handleClick(day) {
      let weekDays = [...this.selectWeekDay.split("_")];
      if (weekDays.indexOf(day) > -1) {
        weekDays = weekDays.filter(i => i !== day);
      } else {
        weekDays.push(day);
      }
      this.selectWeekDay = weekDays.join("_");
    },
    // 显示上课时间
    showTimeOptions(options) {
      let string = "";

      if (options[0] !== undefined) {
        let hour = options[0].value;
        let ampm = hour < 12 ? "上午" : "下午";
        hour = hour < 12 ? hour : hour - 12;
        string += ampm + " " + hour + "点";
      }

      if (options[1] !== undefined) {
        let minute = options[1].value;
        if (minute === 0) {
          string += "整";
        } else {
          string += minute + "分";
        }
      }

      return string;
    },
    // 构造上课时间选择
    createTimeOptions() {
      var hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(i);
      }
      var minutes = [];
      for (let i = 0; i < 60; i += 5) {
        minutes.push(i);
      }
      let options = [];
      for (let hour of hours) {
        let option1 = { value: hour, label: hour + "点", children: [] };
        for (let minute of minutes) {
          let option2 = { value: minute, label: minute + "" };
          option1.children.push(option2);
        }
        options.push(option1);
      }
      return options;
    },
    // 显示每个月的选项
    showMonthOptions(options) {
      let string = "";
      let values = options.map(i => i.value);

      if (values[0] === "天") {
        string += values[1];
      } else {
        string += values.join(" ");
      }

      return string;
    },
    // 当每个月重复时，构造相关选择
    createMonthOptions() {
      let options = [];

      var option1 = { value: "天", label: "天", children: [] };
      for (let i = 1; i < 32; i++) {
        option1.children.push({ value: i + "号", label: i + "号" });
      }
      options.push(option1);

      let weekDays = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      var orders = ["第1个", "第2个", "第3个", "第4个", "最后一个"];
      for (let order of orders) {
        let option2 = { value: order, label: order, children: [] };
        for (let weekDay of weekDays) {
          option2.children.push({ value: weekDay, label: weekDay });
        }
        options.push(option2);
      }
      return options;
    },
    // 显示每年的选项
    showYearOptions(options) {
      let values = options.map(i => i.value);
      let string = values[0] + " " + this.showMonthOptions(options.slice(1));
      return string;
    },
    // 当每年重复时，构造相关选择
    createYearOptions() {
      let options = [];
      for (let m = 1; m < 13; m++) {
        options.push({
          value: m + "月",
          label: m + "月",
          children: this.createMonthOptions()
        });
      }
      return options;
    },
    // 当天是否是所选的星期几（如当天是否是本月第3个星期天）
    // date： 查询日期
    // targetOrder： 目标：天/第N个/最后一个
    // targetWeekDay 星期
    isWeekDayRight(date, targetOrder, targetWeekDay) {
      let weekday = "星期" + this.weekDays[date.isoWeekday() - 1];
      let ok = false;
      switch (targetOrder) {
        case "天":
          ok = date.date() + "号" === targetWeekDay;
          break;
        case "第1个":
          ok =
            weekday === targetWeekDay &&
            date
              .clone()
              .subtract(1, "weeks")
              .month() < date.month();
          break;
        case "第2个":
          ok =
            weekday === targetWeekDay &&
            date
              .clone()
              .subtract(1, "weeks")
              .month() === date.month() &&
            date
              .clone()
              .subtract(2, "weeks")
              .month() !== date.month();
          break;
        case "第3个":
          ok =
            weekday === targetWeekDay &&
            date
              .clone()
              .subtract(2, "weeks")
              .month() === date.month() &&
            date
              .clone()
              .subtract(3, "weeks")
              .month() !== date.month();
          break;
        case "第4个":
          ok =
            weekday === targetWeekDay &&
            date
              .clone()
              .subtract(3, "weeks")
              .month() === date.month() &&
            date
              .clone()
              .subtract(4, "weeks")
              .month() !== date.month();
          break;
        case "最后一个":
          ok =
            weekday === targetWeekDay &&
            date
              .clone()
              .add(1, "weeks")
              .month() !== date.month();
          break;
        default:
          break;
      }
      return ok;
    },
    handleCreate() {
      const form = this.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("课程参数：", values);
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
