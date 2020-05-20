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
      <a-form-item label="第一节课日期" v-bind="formItemLayout">
        <a-week-picker
          v-decorator="['date']"
          placeholder="请选择第一节课的日期"
          format="YYYY年MM月DD日 ddd"
          style="width:100%"
          @change="
            e => {
              selectDate = e;
            }
          "
        >
        </a-week-picker>
      </a-form-item>
      <a-form-item label="上课时间" v-bind="formItemLayout">
        <a-time-picker
          :showTime="{ format: 'HH:mm' }"
          v-decorator="['time']"
          placeholder="上课时间"
          format="a h点mm分"
          style="width:100%"
          @keydown.enter="openTime = false"
          :open.sync="openTime"
          :minuteStep="5"
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
      <a-form-item label="连续" v-bind="formItemLayout">
        <a-input
          v-decorator="['cycle']"
          @change="
            e => {
              selectCycle = e.target.value;
            }
          "
        >
          <a-select
            slot="addonAfter"
            v-model="selectRepeat"
            style="width: 80px"
          >
            <a-select-option
              v-for="item in repeatItems"
              :value="item.value"
              :key="item.value"
            >
              {{ item.content }}
            </a-select-option>
          </a-select>
        </a-input>
        <span slot="extra" v-if="nextCourseStartTime">
          <span v-if="lastCourseStartTime > $moment().add(10, 'years')">
            这么长时间的课，你是认真的吗
          </span>
          <span v-else>
            下一节课在
            {{ nextCourseStartTime.format("Y年MM月DD日 a hh:mm:ss") }}
            <br />
            当前进度 {{ Math.floor(currentProgressRate * 100) }}%
          </span>
        </span>
      </a-form-item>
      <a-form-item label="地点" v-bind="formItemLayout">
        <position
          v-decorator="['position']"
          @change="handleChange"
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
    // 第一节课开始时间
    firstCourseStartTime() {
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
    // 最后一节课开始时间
    lastCourseStartTime() {
      if (this.firstCourseStartTime && parseInt(this.selectCycle) >= 1) {
        return this.firstCourseStartTime
          .clone()
          .add(parseInt(this.selectCycle) - 1, this.selectRepeat); // 最后一节课开始时间
      } else {
        return null;
      }
    },
    // 下一节课上课时间
    // 如果当前正处于上课时间里，则认为当前的课已经上完了，因此只需要比较各种开始时间
    nextCourseStartTime() {
      if (this.firstCourseStartTime && parseInt(this.selectCycle) >= 1) {
        let current = this.$moment().startOf("minute"); // 现在

        let nextCourseStartTime = null;
        if (this.lastCourseStartTime < current) {
          // 如果最后一节课发生在过去，则下一节课不存在，全都上完了
          nextCourseStartTime = null;
        } else if (this.firstCourseStartTime > current) {
          // 如果第一节课发生在未来，则下一节课就是第一节课，一节都没上
          nextCourseStartTime = this.firstCourseStartTime.clone();
        } else {
          // 否则，就是还有课没上
          let diffNum =
            current.diff(this.firstCourseStartTime, this.selectRepeat) + 1; // 已经上了几节课
          nextCourseStartTime = this.firstCourseStartTime
            .clone()
            .add(diffNum, this.selectRepeat);
        }
        return nextCourseStartTime;
      } else {
        return null;
      }
    },
    // 当前上课进度(0~1)
    currentProgressRate() {
      if (this.nextCourseStartTime) {
        let totalCycle = parseInt(this.selectCycle); // 总共的课数
        let leftCycle =
          this.lastCourseStartTime.diff(
            this.nextCourseStartTime,
            this.selectRepeat
          ) + 1; // 剩余的课程数
        return 1 - leftCycle / totalCycle;
      } else {
        return null;
      }
    },
    // 到下一节课的天数
    leftDays() {
      if (this.nextCourseStartTime) {
        let today = this.$moment().startOf("day"); // 今天
        console.log(this.nextCourseStartTime.diff(today, "days"));
        return this.nextCourseStartTime.diff(today, "days");
      } else {
        return null;
      }
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
      openTime: false, // 时间下拉框的打开状态
      selectDate: null, // 纪念日 moment
      selectTime: null,
      selectCycle: null, // 课时数 可解析为整数
      selectRepeat: "weeks", // 重复的选项
      selectAlarm: "none", // 提醒的选项
      selectDuration: "45", // 课程时长，暂时对于各种计算没有帮助
      repeatItems: [
        { value: "days", content: "天" },
        { value: "weeks", content: "周" },
        { value: "months", content: "月" },
        { value: "years", content: "年" }
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
    },
    handleChange(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped></style>
