<template>
  <div :style="{ textAlign: 'left' }">
    <plan-header
      :style="{ padding: '15px' }"
      :selectedSortKey.sync="selectedSortKey"
      :selectedDetailKey.sync="selectedDetailKey"
      :title="title"
      :reloadFunc="getAllPlanData"
    />
    <!-- 计划列表 -->
    <plan-collapse
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
    if (!this.titles[this.$router.currentRoute.path]) {
      this.$router.push("/plan/today");
    }
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
      selectedDetailKey: "show" // 详情选择情况
    };
  },
  watch: {
    $route: function(to) {
      this.title = this.titles[to.path];
      this.updateData();
    }
  },
  methods: {
    getAllPlanData() {
      this.$request({
        url: "/api/plans",
        method: "get"
      }).then(res => {
        this.$store.state.fullPlanData = res.data.map(obj => {
          obj.endString = this.dateFormat("m月d日", new Date(obj.end));
          return obj;
        });
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

      const current = new Date(); //当前时间
      const today0 = new Date(new Date().toDateString()); //今天0点
      const today24 = new Date(new Date().toDateString()); //今天24点
      today24.setDate(today24.getDate() + 1);
      const future7 = new Date(new Date().toDateString()); //6天后的24点
      future7.setDate(future7.getDate() + 7);

      var result = {
        "/plan/today": {
          finished: [], //已完成
          expired: [], //已过期
          going: [], //进行中
          highLevel: [], //高
          mediumLevel: [], //中
          lowLevel: [], //低
          noneLevel: [] //无
        },
        "/plan/recent": {
          finished: [], //已完成
          expired: [], //已过期
          going: [], //进行中
          highLevel: [], //高
          mediumLevel: [], //中
          lowLevel: [], //低
          noneLevel: [] //无
        },
        "/plan/all": {
          finished: [], //已完成
          expired: [], //已过期
          going: [], //进行中
          highLevel: [], //高
          mediumLevel: [], //中
          lowLevel: [], //低
          noneLevel: [] //无
        },
        "/plan/finished": {
          finished: [] //已完成
        }
      }; //最终结果

      // 1、先对计划按照完成状态进行分组
      for (let plan of this.$store.state.fullPlanData) {
        // 任务的各种时间
        const start = new Date(plan.start); //开始时间
        const end = new Date(plan.end); //结束时间
        const finish = plan.finish ? new Date(plan.finish) : undefined; //完成时间

        // 1）过期状态
        const isExpired = plan.status === 0 && end <= current;
        if (isExpired) {
          result["/plan/today"].expired.push(plan);
          result["/plan/recent"].expired.push(plan);
          result["/plan/all"].expired.push(plan);
          if (plan.level === "high") {
            result["/plan/today"].highLevel.push(plan);
            result["/plan/recent"].highLevel.push(plan);
            result["/plan/all"].highLevel.push(plan);
          } else if (plan.level === "medium") {
            result["/plan/today"].mediumLevel.push(plan);
            result["/plan/recent"].mediumLevel.push(plan);
            result["/plan/all"].mediumLevel.push(plan);
          } else if (plan.level === "low") {
            result["/plan/today"].lowLevel.push(plan);
            result["/plan/recent"].lowLevel.push(plan);
            result["/plan/all"].lowLevel.push(plan);
          } else if (plan.level === "none") {
            result["/plan/today"].noneLevel.push(plan);
            result["/plan/recent"].noneLevel.push(plan);
            result["/plan/all"].noneLevel.push(plan);
          }
        }

        // 2）完成状态
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

          if (isFinishedToday) {
            result["/plan/today"].finished.push(plan);
          }
          if (isFinishedRecent) {
            result["/plan/recent"].finished.push(plan);
          }
          result["/plan/all"].finished.push(plan);
          result["/plan/finished"].finished.push(plan);
        }

        // 3）进行状态
        const isGoing = plan.status === 0 && end > current;
        if (isGoing) {
          const isGoingToday =
            isGoing && (end <= today24 || (end > today24 && start <= today0));
          const isGoingRecent =
            isGoing && (end <= future7 || (end > future7 && start <= today0));

          if (isGoingToday) {
            result["/plan/today"].going.push(plan);
            if (plan.level === "high") {
              result["/plan/today"].highLevel.push(plan);
            } else if (plan.level === "medium") {
              result["/plan/today"].mediumLevel.push(plan);
            } else if (plan.level === "low") {
              result["/plan/today"].lowLevel.push(plan);
            } else if (plan.level === "none") {
              result["/plan/today"].noneLevel.push(plan);
            }
          }
          if (isGoingRecent) {
            result["/plan/recent"].going.push(plan);
            if (plan.level === "high") {
              result["/plan/recent"].highLevel.push(plan);
            } else if (plan.level === "medium") {
              result["/plan/recent"].mediumLevel.push(plan);
            } else if (plan.level === "low") {
              result["/plan/recent"].lowLevel.push(plan);
            } else if (plan.level === "none") {
              result["/plan/recent"].noneLevel.push(plan);
            }
          }
          result["/plan/all"].going.push(plan);
          if (plan.level === "high") {
            result["/plan/all"].highLevel.push(plan);
          } else if (plan.level === "medium") {
            result["/plan/all"].mediumLevel.push(plan);
          } else if (plan.level === "low") {
            result["/plan/all"].lowLevel.push(plan);
          } else if (plan.level === "none") {
            result["/plan/all"].noneLevel.push(plan);
          }
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
      result["/plan/today"].expired.sort(sortEndTime);
      result["/plan/today"].going.sort(sortEndTime);
      result["/plan/today"].finished.sort(sortEndTime);
      result["/plan/today"].highLevel.sort(sortEndTime);
      result["/plan/today"].mediumLevel.sort(sortEndTime);
      result["/plan/today"].lowLevel.sort(sortEndTime);
      result["/plan/today"].noneLevel.sort(sortEndTime);
      result["/plan/recent"].expired.sort(sortEndTime);
      result["/plan/recent"].going.sort(sortEndTime);
      result["/plan/recent"].finished.sort(sortEndTime);
      result["/plan/recent"].highLevel.sort(sortEndTime);
      result["/plan/recent"].mediumLevel.sort(sortEndTime);
      result["/plan/recent"].lowLevel.sort(sortEndTime);
      result["/plan/recent"].noneLevel.sort(sortEndTime);
      result["/plan/all"].expired.sort(sortEndTime);
      result["/plan/all"].going.sort(sortEndTime);
      result["/plan/all"].finished.sort(sortEndTime);
      result["/plan/all"].highLevel.sort(sortEndTime);
      result["/plan/all"].mediumLevel.sort(sortEndTime);
      result["/plan/all"].lowLevel.sort(sortEndTime);
      result["/plan/all"].noneLevel.sort(sortEndTime);
      result["/plan/finished"].finished.sort(sortEndTime);

      this.$store.state.groupPlanData = result;
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
