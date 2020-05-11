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
    if (!this.getTitle()) {
      this.$router.push("/plan/today");
    }
    this.getAllPlanData();
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      publicPath: publicPath, // public 文件夹的位置
      selectedSortKey: "time", //排序对象
      selectedDetailKey: "show", // 详情选择情况
      title: this.getTitle()
    };
  },
  watch: {
    $route: function() {
      this.title = this.getTitle();
      this.updateCurrntPlans();
    }
  },
  computed: {
    planDataToday() {
      return this.groupPlan(this.$store.state.planDataToday);
    },
    planDataRecent() {
      return this.groupPlan(this.$store.state.planDataRecent);
    },
    planDataStar() {
      return this.groupPlan(this.$store.state.planDataStar);
    },
    planDataFinished() {
      return this.groupPlan(this.$store.state.planDataFinished);
    },
    planDataAll() {
      return this.groupPlan(this.$store.state.planDataAll);
    },
    planDataTrash() {
      return this.groupPlan(this.$store.state.planDataTrash);
    }
  },
  methods: {
    getTitle() {
      let menu = this.$store.state.planSiderMenu.filter(
        item => item.key === this.$router.currentRoute.path
      );
      return menu.length === 1 ? menu[0].name : undefined;
    },
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
      obj.isDeleted = plan.isDeleted;

      // 附加属性
      obj.startString = dateFormat("m月d日", new Date(obj.start));
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
        return (
          !obj.isDeleted &&
          (obj.isExpired() || obj.isFinishedToday() || obj.isGoingToday())
        );
      };
      obj.belongRecent = function() {
        return (
          !obj.isDeleted &&
          (obj.isExpired() || obj.isFinishedRecent() || obj.isGoingRecent())
        );
      };
      obj.belongStar = function() {
        return !obj.isDeleted && obj.star;
      };
      obj.belongFinished = function() {
        return !obj.isDeleted && obj.isFinished();
      };

      return obj;
    },
    getAllPlanData() {
      this.$request({
        url: "/api/plans",
        method: "get"
      }).then(res => {
        this.$store.state.planDataFull = res.data.map(
          obj => new this.Plan(obj)
        );
        this.updateData();
        this.updateCurrntPlans();
      });
    },
    // 数据分组
    updateData() {
      this.$store.state.planDataToday = this.$store.state.planDataFull.filter(
        plan => plan.belongToday()
      );
      this.$store.state.planDataRecent = this.$store.state.planDataFull.filter(
        plan => plan.belongRecent()
      );
      this.$store.state.planDataStar = this.$store.state.planDataFull.filter(
        plan => plan.belongStar()
      );
      this.$store.state.planDataAll = this.$store.state.planDataFull.filter(
        plan => !plan.isDeleted
      );
      this.$store.state.planDataFinished = this.$store.state.planDataFull.filter(
        plan => plan.belongFinished()
      );
      this.$store.state.planDataTrash = this.$store.state.planDataFull.filter(
        plan => plan.isDeleted
      );
    },
    // 获取当前路由下的计划数据
    updateCurrntPlans() {
      let data = null;
      switch (this.$router.currentRoute.path) {
        case "/plan/today":
          data = this.$store.state.planDataToday;
          break;
        case "/plan/recent":
          data = this.$store.state.planDataRecent;
          break;
        case "/plan/all":
          data = this.$store.state.planDataAll;
          break;
        case "/plan/star":
          data = this.$store.state.planDataStar;
          break;
        case "/plan/finished":
          data = this.$store.state.planDataFinished;
          break;
        case "/plan/trash":
          data = this.$store.state.planDataTrash;
          break;
        default:
          break;
      }
      this.$store.state.currentPlans = data;
    }
  }
};
</script>

<style scoped></style>
