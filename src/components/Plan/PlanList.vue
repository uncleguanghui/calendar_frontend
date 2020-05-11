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
    // 数据更新统一在这里完成
    $route: function() {
      this.title = this.getTitle();
      this.updateCurrntPlans();
      this.updateCurrntPlan();
    },
    "$store.state.planDataFull": function() {
      this.updateData();
      this.updateCurrntPlans();
      this.updateCurrntPlan();
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
    getAllPlanData() {
      this.$request({
        url: "/api/plans",
        method: "get"
      }).then(res => {
        this.$store.state.planDataFull = res.data.map(
          plan => new this.$Plan(plan)
        );
        console.log("0 成功更新数据");
      });
    },
    // 数据分组
    updateData() {
      console.log("1 更新所有数据分组");
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
      console.log("2 更新当前的计划列表");
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
    },
    // 更新当前选中的计划
    updateCurrntPlan() {
      let currentPlan = this.$store.state.currentPlan;
      if (currentPlan.id) {
        console.log("3 更新当前选中的计划");
        let targets = this.$store.state.planDataFull.filter(
          plan => plan.id === currentPlan.id
        );
        let target = targets.length === 1 ? targets[0] : {};
        this.$store.state.currentPlan = target;
      }
    }
  }
};
</script>

<style scoped></style>
