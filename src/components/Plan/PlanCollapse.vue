<template>
  <div class="page" v-if="plans.length > 0">
    <a-collapse
      v-model="activeKey"
      :bordered="false"
      :style="{ backgroundColor: '#fff' }"
    >
      <a-collapse-panel :key="item.key" v-for="item in plans">
        <div slot="header">
          <span>{{ item.title }}</span>
          <span :style="{ float: 'right' }">{{ item.options.length }}</span>
        </div>
        <div class="checkbox" :key="plan.id" v-for="plan in item.options">
          <!-- 选择框 -->
          <a-checkbox @change="() => onChange(plan)" />
          <div class="checkbox-content" @click="() => clickHandle(plan)">
            <!-- 标题 -->
            <span class="checkbox-label">
              <a-avatar
                shape="square"
                v-if="getLevelImage(plan.level)"
                :src="getLevelImage(plan.level)"
                :size="18"
                :style="{ margin: '0 5px 2px 0' }"
              />
              {{ plan.title }}
            </span>
            <!-- 右上角日期 -->
            <div class="checkbox-right">
              <span :style="{ color: plan.isExpired() ? '#ff4d4f' : '' }">
                {{ plan.startString }}
              </span>
            </div>
            <!-- 底部的任务描述 -->
            <div
              v-if="selectedDetailKey === 'show'"
              class="checkbox-description"
            >
              {{ plan.description }}
            </div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div v-else class="plan-empty">
    <img :src="emptyImage" alt="" class="plan-empty-image" />
    <div class="plan-empty-title">没有任务哦，稍微放松下吧</div>
  </div>
</template>

<script>
export default {
  props: {
    // 排序对象
    selectedSortKey: {
      require: true
    },
    // 详情选择情况
    selectedDetailKey: {
      require: true
    }
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      publicPath: publicPath,
      activeKey: [],
      emptyImage: publicPath + "images/" + "Relax.svg"
    };
  },
  watch: {
    plans(to) {
      // 如果只有已完成，则全展开，否则仅不展开已完成
      let keys = to.map(obj => obj.key);
      if (keys.length === 1) {
        this.activeKey = keys;
      } else {
        this.activeKey = keys.filter(key => key !== "finished");
      }
    }
  },
  computed: {
    plans() {
      let plans = this.groupPlans(this.$store.state.currentPlans);
      console.log("4 在列表页成功获取到最新数据");
      return plans;
    }
  },
  methods: {
    getLevelImage(level) {
      let name = undefined;
      switch (level) {
        case "high":
          name = "高优先级.png";
          break;
        case "medium":
          name = "中优先级.png";
          break;
        case "low":
          name = "低优先级.png";
          break;
        default:
          break;
      }
      return name ? this.publicPath + "icons/" + name : undefined;
    },
    onChange(plan) {
      // todo: 添加完成事件
      console.log(`${plan}已完成`);
    },
    clickHandle(plan) {
      this.$store.state.currentPlan = plan;
    },
    // 将数据进行分组
    groupPlans(plans) {
      let groups = [];
      switch (this.selectedSortKey) {
        case "time":
          groups = this.sortPlanByTime(plans);
          break;
        case "level":
          groups = this.sortPlanByLevel(plans);
          break;
        default:
          break;
      }
      return groups;
    },
    // 对计划按照完成状态分组，并按时间排序
    sortPlanByTime(plans) {
      // 分组
      let going = [];
      let expired = [];
      let finished = [];
      for (let plan of plans) {
        if (plan.isExpired()) {
          expired.push(plan);
        } else if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.isGoing()) {
          going.push(plan);
        }
      }

      // 组内排序
      going.sort((a, b) => a.startDate - b.startDate);
      finished.sort((a, b) => a.startDate - b.startDate);
      expired.sort((a, b) => a.startDate - b.startDate);

      // 按顺序显示
      let group = [];
      if (expired.length) {
        group.push({ options: expired, title: "已过期", key: "expired" });
      }
      if (going.length) {
        group.push({ options: going, title: "进行中", key: "going" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }

      return group;
    },
    // 对计划按照优先级分组
    sortPlanByLevel(plans) {
      // 分组
      let highLevel = [];
      let mediumLevel = [];
      let lowLevel = [];
      let noneLevel = [];
      let finished = [];
      for (let plan of plans) {
        if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.level === "high") {
          highLevel.push(plan);
        } else if (plan.level === "medium") {
          mediumLevel.push(plan);
        } else if (plan.level === "low") {
          lowLevel.push(plan);
        } else {
          noneLevel.push(plan);
        }
      }

      // 组内排序
      highLevel.sort((a, b) => a.startDate - b.startDate);
      mediumLevel.sort((a, b) => a.startDate - b.startDate);
      lowLevel.sort((a, b) => a.startDate - b.startDate);
      noneLevel.sort((a, b) => a.startDate - b.startDate);
      finished.sort((a, b) => a.startDate - b.startDate);

      // 按顺序显示
      let group = [];
      if (highLevel.length) {
        group.push({ options: highLevel, title: "高优先级", key: "highLevel" });
      }
      if (mediumLevel.length) {
        group.push({
          options: mediumLevel,
          title: "中优先级",
          key: "mediumLevel"
        });
      }
      if (lowLevel.length) {
        group.push({ options: lowLevel, title: "低优先级", key: "lowLevel" });
      }
      if (noneLevel.length) {
        group.push({ options: noneLevel, title: "无优先级", key: "noneLevel" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }

      return group;
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
                : this.$dateFormat("m月d日", new Date(date))),
            data: datePlans[date]
          };
        });
    }
  }
};
</script>

<style scoped>
.plan-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
  text-align: center;
}

.plan-empty-image {
  width: 80%;
}

.plan-empty-title {
  color: #767879;
  padding-top: 20px;
}

.checkbox {
  max-height: 50px;
  margin: 10px 0;
}

.checkbox-content {
  display: inline;
  padding-left: 10px;
}

.checkbox-right {
  right: 15px;
  display: inline-block;
  position: absolute;
}

.checkbox-label,
.checkbox-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
  display: inline-block;
}

.checkbox-description {
  font-size: 8px;
  margin-left: 25px;
  line-height: 2;
  border-bottom: 1px solid #ececec;
  max-width: calc(100% - 20px);
}

.checkbox-label {
  font-weight: bold;
  max-width: calc(100% - 100px);
  top: 5px;
  position: relative;
}

/* 隐藏下边栏 */
.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}
.ant-collapse > .ant-collapse-item {
  border-bottom: none;
}
</style>
