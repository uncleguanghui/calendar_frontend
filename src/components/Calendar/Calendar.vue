<template>
  <div class="calendar">
    <FullCalendar
      ref="fullCalendar"
      timeZone="Asia/Shanghai"
      :firstDay="firstDay"
      :header="false"
      :plugins="calendarPlugins"
      :locale="locale"
      :columnHeaderHtml="columnHeaderHtml"
      :dayRender="dayRender"
      height="parent"
      @dateClick="dateClick"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import interactionPlugin from "@fullcalendar/interaction";
import zhLocale from "@fullcalendar/core/locales/zh-cn";
import momentPlugin from "@fullcalendar/moment";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";

var chineseLunar = require("chinese-lunar");

export default {
  props: {
    date: {
      default: () => new Date()
    }
  },
  mounted() {
    window.vue = this;
    window.chineseLunar = chineseLunar;
    // 获取调休日期
    this.getWorkData();
    // 获取节气日期
    this.getSolarTerms();
  },
  components: {
    FullCalendar
  },
  data() {
    return {
      firstDay: 1, // 0是周日，1~6是周一~周六
      locale: zhLocale,
      calendarPlugins: [
        dayGridPlugin,
        bootstrapPlugin,
        interactionPlugin,
        momentPlugin,
        momentTimezonePlugin
      ],
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      workDays: {}, // 调休日期字典：{ "2020" : { "2020-02-02" : "休" } }
      solarTerms: {}, // 节气日期字典： { "2020" : { "2013-02-04": "立春" } }
      elFocusOn: undefined // 当前点击的元素
    };
  },
  watch: {
    date(to) {
      let calendar = this.$refs.fullCalendar.getApi();
      calendar.gotoDate(to);

      // this.clear();
    },
    workDays() {
      // 重新渲染日期单元格
      this.reDayRender();
    },
    solarTerms() {
      // 重新渲染日期单元格
      this.reDayRender();
    }
  },
  methods: {
    // 获取调休数据
    getWorkData() {
      this.$request({
        url: "/api/calendar/workDays",
        method: "get"
      }).then(res => {
        this.workDays = res.data;
      });
    },
    // 获取节气数据
    getSolarTerms() {
      this.$request({
        url: "/api/calendar/solarTerms",
        method: "get"
      }).then(res => {
        this.solarTerms = res.data;
      });
    },
    // 日历切换时做一些清除操作
    clear() {
      this.elFocusOn.style.background = "none";
      this.elFocusOn = undefined;
    },
    // 周标题文本
    columnHeaderHtml(date) {
      if (date.getDay() == 0 || date.getDay() == 6) {
        return (
          '<span class="font-weekend">' +
          this.dayNames[date.getDay()] +
          "</span>"
        );
      } else {
        return this.dayNames[date.getDay()];
      }
    },
    // 获取父元素
    getParent(el, tagName, include = "") {
      var t = el;
      var find = false;
      while (t && !find) {
        t = t.parentNode;
        find =
          t &&
          t.tagName.toLowerCase() == tagName.toLowerCase() &&
          t.className.toLowerCase().includes(include.toLowerCase());
      }
      return find ? t : undefined;
    },
    // 格式化日期
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    // 几月第几个周期
    weekdayNum(date) {
      var n = parseInt((date.getDate() - 1) / 7) + 1; // 第几个
      var w = date.getDay();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return m + "-" + n + w;
    },
    // 渲染日单元格
    dayRender(dayRenderInfo) {
      if (dayRenderInfo.date.getDate() > 0) {
        // 日期处理
        // 是周末吗
        var isWeekend =
          dayRenderInfo.date.getDay() == 0 || dayRenderInfo.date.getDay() == 6;
        // 是今天吗
        var isToday =
          dayRenderInfo.date.toDateString() == new Date().toDateString();
        // 今天是几月第几个周期
        var weekdayNumString = this.weekdayNum(dayRenderInfo.date);
        // 格式化后的公历日期
        var dateString = this.dateFormat("mm-dd", dayRenderInfo.date);
        var dateFullString = this.dateFormat("Y-mm-dd", dayRenderInfo.date);
        // 农历
        var lunarDate = chineseLunar.solarToLunar(dayRenderInfo.date);
        var lunarString = chineseLunar.format(lunarDate, "D");
        // 格式化后的农历
        var lunarDateString = this.dateFormat(
          "mm-dd",
          new Date(2020, lunarDate.month - 1, lunarDate.day)
        );

        // 显示的节日
        var solarTerm = (this.solarTerms[
          "" + dayRenderInfo.date.getFullYear()
        ] || {})[dateFullString]; // 节气
        var solarFestival = this.$store.state.solarFestival[dateString]; // 公历节日
        var lunarFestival = this.$store.state.lunarFestival[lunarDateString]; // 农历节日
        var westFestival = this.$store.state.westFestival[weekdayNumString]; // 西方节日
        var festival =
          solarFestival || lunarFestival || westFestival || solarTerm; // 公历节日 > 农历节日 > 西方节日 > 节气

        // 显示的上班调休状态：班、休、undefined
        var workEvent = (this.workDays["" + dayRenderInfo.date.getFullYear()] ||
          {})[dateFullString];

        // 找到日期容器和事件容器
        const divContent = this.getParent(dayRenderInfo.el, "div", "bg")
          .nextSibling;
        // 在标题行中的索引
        const index = (7 + dayRenderInfo.date.getDay() - this.firstDay) % 7;
        const tdHead = divContent.getElementsByTagName("thead").length
          ? divContent
              .getElementsByTagName("thead")[0]
              .getElementsByTagName("td")[index]
          : undefined;

        // 设置标题行的内容与样式;
        tdHead.innerHTML = `
        <div>
          <span class="font-date">
            <span class="${isWeekend ? "font-weekend" : ""}">
                ${dayRenderInfo.date.getDate()}
            </span>
          </span>
          <div class="right-top">
            <span class="font-lunar">
              ${lunarString}
            </span>
            <span class="${festival ? "font-festival" : "font-no-festival"}">
                ${festival}
            </span>
          </div>
        </div>
        `;

        // 设置背景的内容与样式
        dayRenderInfo.el.style.background = "none"; //取消背景色
        dayRenderInfo.el.innerHTML = `
        <div class="${isToday ? "border-today" : "border-not-today"}">
          <div class="${
            workEvent
              ? workEvent == "班"
                ? "triangle-work"
                : "triangle-relax"
              : "font-hidden"
          }">
            <span class="font-work-event">
              ${workEvent}
            </span>
          </div>
        </div>
        `;
      }
    },
    // 重新渲染日单元格
    reDayRender() {
      // 重新渲染日期单元格
      let calendar = this.$refs.fullCalendar.getApi();
      [...calendar.el.getElementsByClassName("fc-day")].map(item => {
        this.dayRender({
          date: new Date(item.getAttribute("data-date") + " 00:00:00"),
          el: item
        });
      });
    },
    // 选择月份
    changeMonth(start, end, current) {
      console.log(
        "changeMonth",
        start.format(),
        end.format(),
        current.format()
      );
    },
    // 点击日单元格
    dateClick(arg) {
      // 取消上一次点击的元素的单元格背景
      if (this.elFocusOn) {
        this.elFocusOn.style.background = "none";
      }
      // 如果不是重复点击，则修改本次点击的元素的单元格背景
      if (this.elFocusOn != arg.dayEl) {
        this.elFocusOn = arg.dayEl;
        this.elFocusOn.style.background = "#92e6e3";

        // 修改日期
        this.$emit("update:date", arg.date);
      } else {
        // 如果是重复点击，则设置本次点击的元素为空
        this.elFocusOn = undefined;
      }
    },
    // 点击日
    dayClick(day, jsEvent) {
      console.log("dayClick", day, jsEvent);
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
      console.log("eventClick", event, jsEvent, pos);
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
      console.log("moreCLick", day, events, jsEvent);
    },
    // 事件渲染
    eventRender: function(info) {
      if (info.event.extendedProps.status === "done") {
        // Change background color of row
        info.el.style.backgroundColor = "red";

        // Change color of dot marker
        var dotEl = info.el.getElementsByClassName("fc-event-dot")[0];
        if (dotEl) {
          dotEl.style.backgroundColor = "white";
        }
      }
    }
  }
};
</script>

<style>
/* 去掉 scoped 以便 innerHTML 可以生效 */
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/bootstrap/main.css";
@import "~font-awesome/css/font-awesome.css";
@import "~@fullcalendar/timegrid/main.css";
@import "~@fullcalendar/list/main.css";
@import "~@fullcalendar/timeline/main.css";

@import "~bootstrap/dist/css/bootstrap.css";
@import "~bootstrap-vue/dist/bootstrap-vue.css";

th.fc-day-header {
  border: 0;
}

/* 设置td的内容超过容器以后隐藏 */

td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.calendar {
  background: #fff;
  /* min-height: 500px; */
  /* 139px 是 layout-header 的 64px + layout-header 的 60px + 为底部预留的 padding-bottom 的 15px*/
  height: calc(100vh - 139px);
}

.font-hidden {
  display: none;
}

.fc-day {
  height: 100%;
}

.alert-info,
.fc-today {
  /* 取消今天的背景色，改成边缘色 */
  background-color: none;
}

/* 调休状态 */

.triangle-work,
.triangle-relax {
  width: 0;
  height: 0;
  border-right: 36px solid transparent;
  bottom: 0;
  position: absolute;
}

.triangle-relax {
  border-bottom: 36px solid #ff7c7c;
}

.triangle-work {
  border-bottom: 36px solid rgb(107, 190, 107);
}

.font-work-event {
  position: absolute;
  top: 16px;
  font-size: 8px;
  left: 5px;
  color: #fff;
}

/* 日期 */

.font-date {
  position: absolute;
  font-size: 36px;
  float: left;
  padding: 5px 0 0 5px;
  line-height: 1;
  color: #989898;
}

/* 周末 */

.font-weekend {
  color: #ff7c7c;
}

/* 右上角 */
.right-top {
  float: right;
  text-align: right;
  padding: 5px;
  position: relative;
}

/* 右上角：农历 */

.font-lunar {
  color: #8d8d8d;
  display: block;
  font-size: 8px;
  line-height: 1;
}

/* 右上角：节日 */

.font-festival {
  font-size: 8px;
  line-height: 1;
  color: rgb(107, 190, 107);
}

.font-no-festival {
  display: none;
}

/* 背景 */

.border-today,
.border-not-today {
  height: 100%;
}

.border-today {
  border: 2px solid red;
}

/* 自适应 */

@media screen and (max-width: 640px) {
  .font-lunar,
  .font-relax,
  .font-work,
  [class^="font-festival"] {
    display: none;
  }
}

@media screen and (max-height: 640px) {
  .font-lunar,
  .font-relax,
  .font-work,
  [class^="font-festival"] {
    display: none;
  }
}
</style>
