<template>
  <div class="plan-page" v-if="plan.id">
    <!-- 标题 -->
    <div class="detail-row">
      <a-checkbox class="taks-icon" v-model="finish" />
      <div class="plan-content">
        <!-- 标题区 -->
        <div style="display: contents">
          <plan-title
            v-model="title"
            class="text-content"
            style="width:calc(100% - 60px)"
          />
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
        </div>
      </div>
    </div>
    <!-- 标签 -->
    <div class="detail-row">
      <a-icon type="tags" class="taks-icon" />
      <plan-tag v-model="tags" v-if="refresh" />
    </div>
    <!-- 任务时间 -->
    <div class="detail-row">
      <a-icon type="clock-circle" class="taks-icon" />
      <div class="plan-content pointer-content">
        <plan-time v-model="time" v-if="refresh" />
      </div>
    </div>
    <!-- 提醒 -->
    <div class="detail-row" v-if="$moment(start)._isValid">
      <a-icon type="bell" class="taks-icon" />
      <div class="plan-content pointer-content">
        <plan-alarm v-model="alarm" :start="start" />
      </div>
    </div>
    <!-- 地点 -->
    <div class="detail-row">
      <a-icon type="environment" class="taks-icon" />
      <div class="plan-content text-content">
        <plan-position v-model="position" />
      </div>
    </div>
    <!-- 子任务 -->
    <div class="detail-row">
      <a-icon type="ordered-list" class="taks-icon" />
      <div class="plan-content">
        <plan-sub-tasks v-model="subTasks" />
      </div>
    </div>
    <!-- 描述 -->
    <div class="detail-row">
      <a-icon type="file-text" class="taks-icon" />
      <div class="plan-content text-content">
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
import { mapActions } from "vuex";

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
      refresh: true,

      finish: false, // 完成状态
      title: "", // 标题
      start: "", // 开始时间，如 "2020-01-01 10:10:10"
      time: "", // 时间策略，如 "true__2020-01-01 10:10:10__2020-01-02 20:20:20" 或 "true__2020-01-01 10:10:10"
      tags: [], // 标签
      alarm: "", // 提醒策略，如 "3 09:00"
      position: "", // 位置
      subTasks: [], // 子任务
      description: "" // 描述
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
          target = this.$Plan(target);
          console.log("更新后", target);
          this.$store.state.planDataFull = [
            ...plans.filter(i => i.id !== res.data.id),
            target
          ];
        } else {
          console.log(`未找到目标计划: ${this.plan.id}`);
        }
      });
    },
    // 收藏/取消收藏
    handleStar() {
      console.log(this.plan.star ? "取消收藏" : "收藏");
      this.updatePlan({ star: !this.plan.star });
    },
    ...mapActions(["getTags"])
  },
  mounted() {
    this.getTags();
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
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });

      this.finish = to.finish;
      this.title = to.title;
      this.start = to.start;
      this.time = to.time;
      this.tags = to.tags;
      this.alarm = to.alarm;
      this.position = to.position;
      this.subTasks = to.subTasks;
      this.description = to.description;
    },
    tags(to) {
      let idOld = this.plan.tags.map(i => i.id);
      let idNew = to.map(i => i.id);
      if (idOld.sort().toString() !== idNew.sort().toString()) {
        console.log("标签数据发生了变化，推送到后端");
        this.updatePlan({ tags: idNew });
      } else {
        console.log("标签数据没有变化");
      }
    },
    title(to) {
      if (this.plan.title !== to) {
        console.log("标题数据发生了变化，推送到后端");
        this.updatePlan({ title: to });
      } else {
        console.log("标题数据没有变化");
      }
    },
    position(to) {
      if (this.plan.position !== to) {
        console.log("地址数据发生了变化，推送到后端");
        this.updatePlan({ position: to });
      } else {
        console.log("地址数据没有变化");
      }
    },
    subTasks(to) {
      if (this.plan.subTasks !== to) {
        console.log("子任务数据发生了变化，推送到后端");
        this.updatePlan({ subTasks: to });
      } else {
        console.log("子任务数据没有变化");
      }
    },
    description(to) {
      if (this.plan.description !== to) {
        console.log("描述数据发生了变化，推送到后端");
        this.updatePlan({ description: to });
      } else {
        console.log("描述数据没有变化");
      }
    },
    alarm(to) {
      if (this.plan.alarm !== to) {
        console.log("提醒数据发生了变化，推送到后端");
        let advancedDays = to ? parseInt(to.split(" ")[0]) : null;
        let alarmTime = to ? to.split(" ")[1] : "";
        this.updatePlan({
          advancedDays: advancedDays,
          alarmTime: alarmTime
        });
      } else {
        console.log("提醒数据没有变化");
      }
    },
    time(to) {
      if (this.plan.time !== to) {
        console.log("时间数据发生了变化，推送到后端");
        let res = to.split("__");
        let allDay = res.length > 1 ? res[0] === "true" : null;
        let start = res.length > 1 ? res[1] : "";
        let end = res.length > 2 ? res[2] : "";
        this.updatePlan({
          allDay: allDay,
          start: start,
          end: end
        });
      } else {
        console.log("时间数据没有变化");
      }
    },
    finish(to) {
      if (this.plan.finish !== to) {
        console.log("完成状态数据发生了变化，推送到后端");
        this.updatePlan({ status: to ? 1 : 0 });
      } else {
        console.log("完成状态数据没有变化");
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

.plan-header-star {
  margin: 0 15px 2px 0;
}

.detail-row {
  display: -webkit-box;
  line-height: 2;
  margin: 10px 0;
}

.plan-content {
  width: calc(100% - 20px);
}

/* 可点击的内容 */
.pointer-content {
  cursor: pointer;
}
.pointer-content:hover {
  background-color: #e8e8e8;
  border-radius: 3px;
}

/* 可编辑的内容 */
.text-content {
  cursor: text;
}

.text-content:focus,
.text-content:hover {
  background-color: #40a9ff24;
  border-radius: 3px;
}
</style>
