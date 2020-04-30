<template>
  <div :style="{ textAlign: 'left' }">
    <plan-header
      :style="{ padding: '15px' }"
      :selectedSortKey.sync="selectedSortKey"
      :selectedDetailKey.sync="selectedDetailKey"
      :title="title"
    />
    <!-- 计划列表 -->
    <plan-collapse
      :data="groupPlanData"
      :selectedSortKey="selectedSortKey"
      :selectedDetailKey="selectedDetailKey"
    />
  </div>
</template>

<script>
import PlanCollapse from "./PlanCollapse";
import PlanHeader from "./PlanHeader";

export default {
  components: { PlanCollapse, PlanHeader },
  mounted() {
    this.getAllPlanData();
  },
  data() {
    const publicPath = process.env.BASE_URL;
    const titles = {
      "/plan/today": "今天",
      "/plan/all": "全部",
      "/plan/recent": "最近7天",
      "/plan/finished": "已完成"
    };
    return {
      titles: titles,
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      title: titles[this.$router.currentRoute.path],
      publicPath: publicPath, // public 文件夹的位置
      selectedSortKey: "time", //排序对象
      selectedDetailKey: "show", // 详情选择情况
      fullPlanData: [], // 所有计划
      groupPlanData: [] // 所有计划（分组后）
    };
  },
  watch: {
    $route: function(to) {
      this.title = this.titles[to.path];
      this.updateData();
      console.log(this.groupPlanData.map(item => item.data.length));
    }
  },
  methods: {
    getAllPlanData() {
      this.$request({
        url: "/api/plan/all",
        method: "get"
      }).then(res => {
        this.fullPlanData = res.data;
        this.updateData();
      });
    },
    // 日期格式化
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
    // 数据分组
    updateData() {
      // 根据排序对象 selectedSortKey ，有两种分组方式：优先级分组、时间分组（默认）
      // 1、按优先级分组：共分5组（高/中/低/无/已完成），展示顺序如括号，同组内默认按结束时间升序
      // 其中，对于（高/中/低/无）这4组，筛选逻辑与下面的（进行中 + 已过期）相同，只是对结果再进行重新分组
      // 其中，对于（已完成）这1组，筛选逻辑与下面的（已完成）相同
      // 2、按时间分组：共分3组（进行中/已过期/已完成），展示顺序如括号，同组内默认按结束时间升序
      // 其中，对于（已过期）这1组，选择所有已过期的数据
      // 其中，对于（进行中/已完成）这2组，根据选择的边栏（today/recent/all）来筛选要展示的数据
      // 其中，对于（进行中）这1组，如果边栏是最近7天，则再按照结束时间所在的天来进行分组

      // 筛选数据逻辑如下：
      // 已过期：状态为0，且结束时间在现在（含）之前。
      // 进行中-今天：状态为0，且满足以下任意一个条件：1）结束时间在现在~今天24点（含）之间；2）结束时间在今天24点之后且开始时间在今天0点（含）之前
      // 进行中-最近7天：状态为0，且满足以下任意一个条件：1）结束时间在现在~6天后的24点（含）之间；2）结束时间在6天后的24点之后且开始时间在今天0点（含）之前
      // 进行中-全部：状态为0
      // 已完成-今天：状态为1，且满足以下任意一个条件：1）结束时间在今天0点~24点（含）之间；2）完成时间在今天0点~24点（含）之间
      // 已完成-最近7天：状态为1，且满足以下任意一个条件：1）结束时间在今天0点~6天后的24点（含）之间；2）完成时间在今天0点~6天后的24点（含）之间
      // 已完成-全部：状态为1

      const path = this.$router.currentRoute.path; //当前路径
      const current = new Date(); //当前时间
      const today0 = new Date(new Date().toDateString()); //今天0点
      const today24 = new Date(new Date().toDateString()); //今天24点
      today24.setDate(today24.getDate() + 1);
      const future7 = new Date(new Date().toDateString()); //6天后的24点
      future7.setDate(future7.getDate() + 7);

      // 1、先对计划按照完成状态进行分组
      var finished = []; //已完成
      var expired = []; //已过期
      var going = []; //进行中

      for (let plan of this.fullPlanData) {
        // 任务的各种时间
        const start = new Date(plan.start); //开始时间
        const end = new Date(plan.end); //结束时间
        const finish = plan.finish ? new Date(plan.finish) : undefined; //完成时间

        // 过期状态
        const isExpired = plan.status === 0 && end <= current;
        if (isExpired) {
          expired.push(plan);
          continue;
        }

        // 完成状态
        const isFinished = plan.status === 1;
        if (isFinished) {
          const isFinishedToday =
            isFinished &&
            ((end > today0 && end <= today24) ||
              (finish && finish > today0 && finish <= today24));
          const isFinishedRecent =
            isFinished &&
            ((end > today0 && end <= future7) ||
              (finish && finish > today0 && finish <= future7));
          if (path === "/plan/today" && isFinishedToday) {
            finished.push(plan);
          } else if (path === "/plan/recent" && isFinishedRecent) {
            finished.push(plan);
          } else if (path === "/plan/all") {
            finished.push(plan);
          } else if (path === "/plan/finished") {
            finished.push(plan);
          }
          continue;
        }

        // 进行状态
        const isGoing = plan.status === 0 && end > current;
        if (isGoing) {
          const isGoingToday =
            isGoing && (end <= today24 || (end > today24 && start <= today0));
          const isGoingRecent =
            isGoing && (end <= future7 || (end > future7 && start <= today0));
          if (path === "/plan/today" && isGoingToday) {
            going.push(plan);
          } else if (path === "/plan/recent" && isGoingRecent) {
            going.push(plan);
          } else if (path === "/plan/all") {
            going.push(plan);
          }
          continue;
        }
      }

      // 2、对结果按照结束时间升序
      const sortTime = function(a, b, reverse, key) {
        if (reverse) {
          // 降序：数组中两两比较，b大于a时，ab互换，b在前面
          return new Date(b[key]) - new Date(a[key]);
        } else {
          return new Date(a[key]) - new Date(b[key]);
        }
      };
      const sortEndTime = (a, b) => sortTime(a, b, false, "end");
      expired.sort(sortEndTime);
      going.sort(sortEndTime);
      finished.sort(sortEndTime);

      // 3、再看是否要根据优先级货日期进行分组，输出最终的数据
      var highLevel = []; //高
      var mediumLevel = []; //中
      var lowLevel = []; //低
      var noneLevel = []; //无
      var result = [];
      if (this.selectedSortKey === "level") {
        // 拆分已过期和进行中的任务
        for (let plan of [...expired, ...going]) {
          if (plan.level === "high") {
            highLevel.push(plan);
          } else if (plan.level === "medium") {
            mediumLevel.push(plan);
          } else if (plan.level === "low") {
            lowLevel.push(plan);
          } else if (plan.level === "none") {
            noneLevel.push(plan);
          }
        }

        result = [
          { title: "高优先级", data: highLevel },
          { title: "中优先级", data: mediumLevel },
          { title: "低优先级", data: lowLevel },
          { title: "无优先级", data: noneLevel },
          { title: "已完成", data: finished }
        ];
      } else if (this.selectedSortKey === "time") {
        // 按时间排序
        // 对结果按日期进行分组的函数
        if (
          path === "/plan/today" ||
          path === "/plan/recent" ||
          path === "/plan/all"
        ) {
          result = [
            { title: "已过期", data: expired },
            ...this.groupDate(going),
            { title: "已完成", data: finished }
          ];
        } else if (path === "/plan/finished") {
          result = this.groupDate(finished);
        }
      }
      this.groupPlanData = result;
    },
    // 对计划列表 data ，按照列表内元素的日期进行分组
    groupDate(data) {
      // 对进行中的任务，按日期进行分组
      var datePlans = {};
      for (let plan of data) {
        const key = new Date(plan.end).toDateString();
        if (datePlans[key]) {
          datePlans[key].push(plan);
        } else {
          datePlans[key] = [plan];
        }
      }
      // 按日期降序
      return Array.from(
        new Set(data.map(plan => new Date(plan.end).toDateString()))
      )
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => {
          return {
            title:
              "周" +
              this.dayNames[new Date(date).getDay()] +
              ", " +
              (new Date(date).toDateString() === new Date().toDateString()
                ? "今天"
                : this.dateFormat("m月d日", new Date(date))),
            data: datePlans[date]
          };
        });
    }
  }
};
</script>

<style scoped></style>
