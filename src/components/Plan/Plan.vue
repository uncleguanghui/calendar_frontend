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
import dateFormat from "@/utils/dateFormat";

export default {
  components: { PlanCollapse, PlanHeader },
  mounted() {
    if (!this.title) {
      this.$router.push("/plan/today");
    }
    this.getAllPlanData();
  },
  computed: {
    title() {
      let menu = this.$store.state.planSiderMenu.filter(
        item => item.key === this.$router.currentRoute.path
      );
      return menu.length === 1 ? menu[0].name : undefined;
    }
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      publicPath: publicPath, // public 文件夹的位置
      selectedSortKey: "time", //排序对象
      selectedDetailKey: "show" // 详情选择情况
    };
  },
  watch: {
    $route: function() {
      this.updateData();
    }
  },
  methods: {
    // 计划对象
    Plan(plan) {
      var obj = new Object();

      // 基础属性
      obj.id = plan.id;
      obj.groupId = plan.groupId;
      obj.title = plan.title;
      obj.star = plan.star;
      obj.alarmStrategy = plan.alarmStrategy;
      obj.typeId = plan.typeId;
      obj.status = plan.status;
      obj.allDay = plan.allDay;
      obj.position = plan.position;
      obj.level = plan.level;
      obj.tags = plan.tags;
      obj.backgroundColor = plan.backgroundColor;
      obj.description = plan.description;
      obj.attachments = plan.attachments;
      obj.start = plan.start;
      obj.end = plan.end;

      // 附加属性
      obj.endString = dateFormat("m月d日", new Date(obj.end));
      obj.startDate = new Date(obj.start); //开始时间
      obj.endDate = new Date(obj.end); //结束时间
      obj.finishDate = obj.finish ? new Date(obj.finish) : undefined; //完成时间

      // 计算函数
      obj.isExpired = function() {
        return obj.status === 0 && obj.endDate <= new Date();
      };
      obj.isFinished = function() {
        return obj.status === 1;
      };
      obj.isFinishedToday = function() {
        if (obj.isFinished()) {
          const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
          const tomorrow0 = new Date(today0).setDate(today0.getDate() + 1); // 明天0点
          return (
            (obj.endDate >= today0 && obj.endDate < tomorrow0) ||
            (obj.finishDate &&
              obj.finishDate >= today0 &&
              obj.finishDate < tomorrow0)
          );
        } else {
          return false;
        }
      };
      obj.isFinishedRecent = function() {
        if (obj.isFinished()) {
          const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
          const future0 = new Date(today0).setDate(today0.getDate() + 7); // 7天后的0点
          return (
            (obj.endDate >= today0 && obj.endDate < future0) ||
            (obj.finishDate &&
              obj.finishDate >= today0 &&
              obj.finishDate < future0)
          );
        } else {
          return false;
        }
      };
      obj.isGoing = function() {
        return obj.status === 0 && obj.endDate > new Date();
      };
      obj.isGoingToday = function() {
        if (obj.isGoing()) {
          const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
          const tomorrow0 = new Date(today0).setDate(today0.getDate() + 1); // 明天0点
          return !(obj.startDate > tomorrow0);
        } else {
          return false;
        }
      };
      obj.isGoingRecent = function() {
        if (obj.isGoing()) {
          const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
          const future0 = new Date(today0).setDate(today0.getDate() + 7); // 7天后的0点
          return !(obj.startDate > future0);
        } else {
          return false;
        }
      };
      obj.belongToday = function() {
        return obj.isExpired() || obj.isFinishedToday() || obj.isGoingToday();
      };
      obj.belongRecent = function() {
        return obj.isExpired() || obj.isFinishedRecent() || obj.isGoingRecent();
      };

      return obj;
    },
    getAllPlanData() {
      this.$request({
        url: "/api/plans",
        method: "get"
      }).then(res => {
        this.$store.state.fullPlanData = res.data.map(
          obj => new this.Plan(obj)
        );
        this.updateData();
      });
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

      var result = JSON.parse(
        JSON.stringify(this.$store.state.groupPlanDataTemp)
      ); //最终结果

      function pushLevel(key, plan) {
        switch (plan.level) {
          case "high":
            result[key].highLevel.push(plan);
            break;
          case "medium":
            result[key].mediumLevel.push(plan);
            break;
          case "low":
            result[key].lowLevel.push(plan);
            break;
          case "none":
            result[key].noneLevel.push(plan);
            break;
          default:
            break;
        }
      }

      // 1、先对计划按照完成状态进行分组
      for (let plan of this.$store.state.fullPlanData) {
        // 1）过期状态
        if (plan.isExpired()) {
          result["/plan/today"].expired.push(plan);
          result["/plan/recent"].expired.push(plan);
          if (plan.star) {
            result["/plan/star"].expired.push(plan);
          }
          result["/plan/all"].expired.push(plan);
        }

        // 2）完成状态
        if (plan.isFinishedToday()) {
          result["/plan/today"].finished.push(plan);
        }
        if (plan.isFinishedRecent()) {
          result["/plan/recent"].finished.push(plan);
        }
        if (plan.isFinished()) {
          if (plan.star) {
            result["/plan/star"].finished.push(plan);
          }
          result["/plan/all"].finished.push(plan);
          result["/plan/finished"].finished.push(plan);
        }

        // 3）进行状态
        if (plan.isGoingToday()) {
          result["/plan/today"].going.push(plan);
        }
        if (plan.isGoingRecent()) {
          result["/plan/recent"].going.push(plan);
        }
        if (plan.isGoing()) {
          if (plan.star) {
            result["/plan/star"].going.push(plan);
          }
          result["/plan/all"].going.push(plan);
        }

        // 4）优先级
        if (plan.belongToday()) {
          pushLevel("/plan/today", plan);
        }
        if (plan.belongRecent()) {
          pushLevel("/plan/recent", plan);
        }
        if (plan.star) {
          pushLevel("/plan/star", plan);
        }
        pushLevel("/plan/all", plan);
      }

      // 2、对结果按照结束时间升序
      function sortTimeFunc(a, b, reverse, key) {
        if (reverse) {
          // 降序：数组中两两比较，b大于a时，ab互换，b在前面
          return new Date(b[key]) - new Date(a[key]);
        } else {
          return new Date(a[key]) - new Date(b[key]);
        }
      }
      const sortTime = (a, b) => sortTimeFunc(a, b, false, "end");
      result["/plan/today"].expired.sort(sortTime);
      result["/plan/today"].going.sort(sortTime);
      result["/plan/today"].finished.sort(sortTime);
      result["/plan/today"].highLevel.sort(sortTime);
      result["/plan/today"].mediumLevel.sort(sortTime);
      result["/plan/today"].lowLevel.sort(sortTime);
      result["/plan/today"].noneLevel.sort(sortTime);
      result["/plan/recent"].expired.sort(sortTime);
      result["/plan/recent"].going.sort(sortTime);
      result["/plan/recent"].finished.sort(sortTime);
      result["/plan/recent"].highLevel.sort(sortTime);
      result["/plan/recent"].mediumLevel.sort(sortTime);
      result["/plan/recent"].lowLevel.sort(sortTime);
      result["/plan/recent"].noneLevel.sort(sortTime);
      result["/plan/star"].expired.sort(sortTime);
      result["/plan/star"].going.sort(sortTime);
      result["/plan/star"].finished.sort(sortTime);
      result["/plan/star"].highLevel.sort(sortTime);
      result["/plan/star"].mediumLevel.sort(sortTime);
      result["/plan/star"].lowLevel.sort(sortTime);
      result["/plan/star"].noneLevel.sort(sortTime);
      result["/plan/all"].expired.sort(sortTime);
      result["/plan/all"].going.sort(sortTime);
      result["/plan/all"].finished.sort(sortTime);
      result["/plan/all"].highLevel.sort(sortTime);
      result["/plan/all"].mediumLevel.sort(sortTime);
      result["/plan/all"].lowLevel.sort(sortTime);
      result["/plan/all"].noneLevel.sort(sortTime);
      result["/plan/finished"].finished.sort(sortTime);

      this.$store.state.groupPlanData = result;
    }
  }
};
</script>

<style scoped></style>
