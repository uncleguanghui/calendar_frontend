<template>
  <div class="plan-page" v-if="plan.id">
    <!-- 标题 -->
    <div class="plan-content">
      <a-checkbox class="plan-header-checkbox" />
      <div style="width:calc(100% - 100px)">
        <plan-title v-model="title" />
      </div>
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right' }">
        <a-tooltip
          :title="!plan.star ? '点击收藏' : '点击取消收藏'"
          trigger="hover"
          placement="bottom"
        >
          <a-avatar
            shape="square"
            :src="!plan.star ? starImage : unstarImage"
            :size="14"
            class="plan-header-star"
            @click="handleStar"
          />
        </a-tooltip>
        <a-button type="primary" size="small">保存</a-button>
      </div>
    </div>
    <div class="plan-content">
      <!-- 图标 -->
      <a-icon type="tags" class="taks-icon" />
      <plan-tag v-model="tags" />
    </div>
    <!-- 任务时间 -->
    <div class="plan-content">
      <a-icon type="clock-circle" class="taks-icon" />
      <plan-time :start.sync="start" :end.sync="end" :checked.sync="checked" />
    </div>
    <!-- 提醒 -->
    <div class="plan-content">
      <a-icon type="bell" class="taks-icon" />
      <plan-alarm v-model="alarm" />
    </div>
    <!-- 地点 -->
    <div class="plan-content">
      <a-icon type="environment" class="taks-icon" />
      <plan-position v-model="position" />
    </div>
    <!-- 子任务 -->
    <div class="plan-content">
      <a-icon type="ordered-list" class="taks-icon" />
      <plan-sub-tasks v-model="subTasks" />
    </div>
    <!-- 描述 -->
    <div class="plan-content">
      <a-icon type="file-text" class="taks-icon" />
      <div style="width:calc(100% - 20px)">
        <plan-description v-model="description" />
      </div>
    </div>
  </div>
  <div v-else-if="$store.state.currentPlans.length > 0" class="plan-empty">
    <img :src="emptyImage" alt="" class="plan-empty-image" />
    <div class="plan-empty-title">点击标题查看详情</div>
  </div>
</template>

<script>
import PlanTag from "./Items/Tag";
import PlanTime from "./Items/Time";
import PlanAlarm from "./Items/Alarm";
import PlanPosition from "./Items/Position";
import PlanSubTasks from "./Items/SubTasks";
import PlanDescription from "./Items/Description";
import PlanTitle from "./Items/Title";

export default {
  components: {
    PlanTag,
    PlanTime,
    PlanAlarm,
    PlanPosition,
    PlanSubTasks,
    PlanDescription,
    PlanTitle
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      publicPath: publicPath, // public 文件夹的位置
      starImage: publicPath + "icons/" + "收藏.png",
      unstarImage: publicPath + "icons/" + "未收藏.png",
      emptyImage: publicPath + "images/" + "Knowledge.svg",

      title: "", // 用户最终期望的标题
      start: "", // 用户最终期望的开始时间
      end: "", // 用户最终期望的结束时间
      checked: "", // 用户最终期望的全天
      tags: [], // 用户最终期望的标签
      alarm: "", // 用户最终期望的提醒
      position: "", // 用户最终期望的位置
      subTasks: "", // 用户最终期望的子任务
      description: "" // 用户最终期望的描述
    };
  },
  methods: {
    // 更新计划
    updatePlan(data) {
      this.$request({
        url: `/api/plans/${this.plan.id}`,
        method: "put",
        data: data
      }).then(res => {
        // 更新列表里的数据
        let plans = [...this.$store.state.planDataFull];
        let targets = plans.filter(item => item.id === res.data.id);
        let target = targets.length === 1 ? targets[0] : undefined;

        if (target) {
          console.log("更新前", target);
          console.log("更新内容", data);
          for (let key in data) {
            target[key] = res.data[key];
          }
          console.log("更新后", target);
        } else {
          console.log(`未找到目标计划: ${this.plan.id}`);
        }
        this.$store.state.planDataFull = plans;
      });
    },
    // 收藏/取消收藏
    handleStar() {
      console.log(this.plan.star ? "取消收藏" : "收藏");
      this.updatePlan({ star: !this.plan.star });
    }
  },
  computed: {
    plan() {
      // 看看选中的计划是否在当前页，如果不在，则不显示
      let currentPlan = this.$store.state.currentPlan;
      let targets = this.$store.state.currentPlans.filter(
        plan => plan.id === currentPlan.id
      );
      let target = targets.length === 1 ? targets[0] : {};
      console.log("5 在详情页成功获取到最新数据");
      return Object.create(target); // 复制对象
    }
  },
  watch: {
    plan(to) {
      if (!to.id) {
        return;
      }
      console.log("6 计划数据发生了变化，重新赋值");

      this.title = to.title;
      this.start = to.start;
      this.end = to.end;
      this.checke = to.checkedAllDay;
      this.tags = to.tags;
      this.alarm = to.alarmStrategy;
      this.position = to.position;
      this.subTasks = to.subTasks;
      this.description = to.description;
    },
    tags(to) {
      let idOld = this.plan.tags.map(i => i.id);
      let idNew = to.map(i => i.id);
      if (idOld.sort().toString() !== idNew.sort().toString()) {
        this.updatePlan({ tags: idNew });
      }
    },
    title(to) {
      if (this.plan.title !== to) {
        console.log("标题数据发生了变化，推送到后端");
        this.updatePlan({ title: to });
      }
    }
  }
};
</script>

<style scoped>
.plan-page {
  text-align: left;
  padding: 15px;
}

.plan-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
}

.plan-empty-image {
  width: 80%;
}

.plan-empty-title {
  color: #767879;
  padding-top: 20px;
}

.taks-icon {
  padding-right: 10px;
}

.plan-header-checkbox {
  float: left;
}

.plan-header-star {
  margin: 0 15px 2px 0;
}

.plan-content {
  display: -webkit-box;
  line-height: 2;
  margin: 10px 0;
}
</style>
