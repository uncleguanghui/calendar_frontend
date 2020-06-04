<template>
  <div style="text-align:left" v-if="plan">
    <!-- 标题 -->
    <div
      class="detail-row"
      :style="{
        boxShadow: scrollTop > 0 ? '0px 5px 6px -5px #000000b3' : 'none',
        margin: '5px 0 3px 0'
      }"
    >
      <plan-checkbox
        class="taks-icon"
        v-model="finish"
        :level="plan.level"
        :showLevel="true"
        :id="plan.id"
        :emitChange="true"
      />
      <div class="plan-content">
        <!-- 标题区 -->
        <div style="display: contents">
          <plan-title
            v-model="title"
            class="text-content"
            style="width:calc(100% - 100px)"
          />
        </div>
        <!-- 右上角功能区 -->
        <div :style="{ float: 'right' }">
          <!-- 修改优先级 -->
          <plan-level v-model="level" style="margin-right:10px" />
          <!-- 收藏 -->
          <plan-star v-model="star" style="margin-right:10px" />
          <!-- 更多功能：删除 -->
          <a-dropdown :trigger="['click']">
            <a-icon type="more" class="super-icon" />
            <a-menu slot="overlay" style="min-width:100px">
              <a-menu-item key="1" @click="handleDeleteOrRecover">
                <a-icon type="delete" />
                {{ plan.isDeleted ? "恢复删除" : "删除" }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div style="overflow: hidden">
      <div
        style="overflow-y: scroll;overflow-x: hidden;max-height: calc(100vh - 160px);"
        @scroll="scrollTop = $event.target.scrollTop"
      >
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
    </div>
  </div>
  <div v-else-if="$store.state.currentPlans.length > 0" class="plan-empty">
    <div class="plan-empty-image">
      <img style="width: 100%" :src="emptyImage" alt="" />
      <div style="color: #767879; padding-top: 20px;">点击标题查看详情</div>
    </div>
  </div>
</template>

<script>
// 样式
// TODO: 在外部编辑完标签（如颜色）后，详情页里没有同步

// 功能
// TODO: 增加任务的复制功能（优先级较低，非必要不做）
// TODO: 增加前端限制 + 后端校验：对于各种input和标签名称，前端限制长度，后端校验并分割；对于各种select，前后端校验；对于各种数量（如子任务数量、标签数量），前后端均限制数量

import PlanTag from "./Items/Tag/TagTile";
import PlanTime from "./Items/Time";
import PlanAlarm from "./Items/Alarm";
import PlanPosition from "./Items/Position";
import PlanSubTasks from "./Items/SubTasks";
import PlanDescription from "./Items/Description";
import PlanTitle from "./Items/Title";
import PlanLevel from "./Items/Level";
import PlanCheckbox from "./Items/Checkbox";
import PlanStar from "./Items/Star";

export default {
  components: {
    PlanTag,
    PlanTime,
    PlanAlarm,
    PlanPosition,
    PlanSubTasks,
    PlanDescription,
    PlanTitle,
    PlanLevel,
    PlanCheckbox,
    PlanStar
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      plan: null, // 当前计划
      publicPath: publicPath, // public 文件夹的位置
      emptyImage: publicPath + "svg/" + "Knowledge.svg",
      scrollTop: 0, // 计划详情部分的滚动情况

      refresh: true,

      finish: false, // 完成状态
      star: false, // 收藏状态
      level: "", // 优先级
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
      this.$store.dispatch("updatePlan", { id: this.plan.id, data: data });
    },
    // 删除/恢复任务
    handleDeleteOrRecover() {
      this.updatePlan({ isDeleted: !this.plan.isDeleted });
    },
    // 获取当前计划（）
    setData() {
      let plans = [...this.$store.state.currentPlans];
      let plan =
        plans[plans.map(i => i.id).indexOf(this.$store.state.currentPlanId)];

      if (plan) {
        this.plan = Object.create(plan);
        this.level = plan.level;
        this.finish = plan.isFinished();
        this.title = plan.title;
        this.star = plan.star;
        this.start = plan.start;
        this.time = plan.time;
        this.tags = plan.tags;
        this.alarm = plan.alarm;
        this.position = plan.position;
        this.subTasks = plan.subTasks;
        this.description = plan.description;
      } else {
        console.log("3 当前计划列表里没有对应的计划");
        this.plan = null;
      }
    },
    // 节流函数 : 减少浏览器内存消耗
    throttle(callback) {
      let isScrolling = false;
      return function() {
        if (isScrolling) return;
        isScrolling = true;
        // requestAnimationFrame:回调间隔 = 浏览器重绘频率
        // setTimeout(function() {
        //   callback();
        //   isScrolling = false;
        // }, 1000);
        window.requestAnimationFrame(function() {
          callback();
          console.log(1111);
          isScrolling = false;
        });
      };
    }
  },
  watch: {
    "$store.state.currentPlans": function(to) {
      if (to) {
        this.setData();
        console.log("3 成功更新当前计划");

        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      }
    },
    "$store.state.currentPlanId": function(to) {
      if (to) {
        this.setData();
        console.log("3 打开新的计划");

        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      }
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
        let start = res.length > 1 ? res[1] : null;
        let end = res.length > 2 ? res[2] : null;
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
      if (this.plan.isFinished() !== to) {
        console.log("完成状态数据发生了变化，推送到后端");
        this.updatePlan({ status: to ? 1 : 0 });
      } else {
        console.log("完成状态数据没有变化");
      }
    },
    level(to) {
      if (this.plan.level !== to) {
        console.log("优先级数据发生了变化，推送到后端");
        this.updatePlan({ level: to });
      } else {
        console.log("优先级数据没有变化");
      }
    },
    star(to) {
      if (this.plan.star !== to) {
        console.log("收藏数据发生了变化，推送到后端");
        this.updatePlan({ star: to });
      } else {
        console.log("收藏数据没有变化");
      }
    }
  }
};
</script>

<style scoped>
.plan-empty {
  width: 100%;
  height: 100%;
}

.plan-empty-image {
  width: 80%;
  left: 10%; /* (100-80)/2  */
  position: absolute;
  top: 40%;
  transform: translate(0, -50%); /* 向上移动50%图片高度  */
}

.taks-icon {
  padding-right: 10px;
}

.detail-row {
  display: -webkit-box;
  line-height: 2;
  margin: 5px 0;
  padding: 0 15px;
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
