<template>
  <div :style="{ textAlign: 'left' }">
    <div :style="{ padding: '15px', minHeight: '70px' }">
      <!-- 标题 -->
      <span :style="{ fontSize: '26px' }">{{ title }}</span>
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right', marginTop: '12px' }">
        <!-- 排序下拉框（当且仅当列表页有数据时显示） -->
        <a-dropdown
          :trigger="['click']"
          v-if="groups.length && selectedSortKey[0]"
        >
          <a-avatar
            shape="square"
            :src="selectedSortKey[0] === 'time' ? timeImage : levelImage"
            :size="18"
            :style="{ marginRight: '15px' }"
          />
          <a-menu
            slot="overlay"
            :selectedKeys="selectedSortKey"
            @click="selectedSortKey = [$event.key]"
          >
            <a-menu-item key="time">
              <a-avatar
                shape="square"
                :src="timeImage"
                :size="20"
                :style="{ marginRight: '10px' }"
              />
              按时间排序
            </a-menu-item>
            <a-menu-item key="level">
              <a-avatar
                shape="square"
                :src="levelImage"
                :size="18"
                :style="{ marginRight: '10px' }"
              />
              按优先级排序
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- 更多下拉框 -->
        <a-dropdown :trigger="['click']">
          <a-avatar
            shape="square"
            :src="publicPath + 'icons/' + '更多.png'"
            :size="20"
          />
          <a-menu slot="overlay" @click="moreClick">
            <a-menu-item key="detail" v-if="groups.length">
              <span v-if="showDetail">
                <a-avatar
                  shape="square"
                  :src="hideImage"
                  :size="18"
                  :style="{ marginRight: '10px' }"
                />
                隐藏详情
              </span>
              <span v-else>
                <a-avatar
                  shape="square"
                  :src="showImage"
                  :size="18"
                  :style="{ marginRight: '10px' }"
                />
                显示详情
              </span>
            </a-menu-item>
            <a-menu-item key="sync">
              <a-avatar
                shape="square"
                :src="publicPath + 'icons/' + '同步.png'"
                :size="18"
                :style="{ marginRight: '10px' }"
              />
              同步任务
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <!-- 创建计划 -->
    <div
      style="padding: 0 12px"
      v-if="showCreationGroupKey.indexOf(groupKey) > -1"
    >
      <plan-creation-input style="width:100%" />
    </div>
    <!-- 计划列表 -->
    <div class="page" v-if="groups.length">
      <a-collapse
        v-model="activeKey"
        :bordered="false"
        :style="{ backgroundColor: '#fff0' }"
      >
        <a-collapse-panel :key="group.key" v-for="group in groups">
          <div slot="header">
            <span>{{ group.title }}</span>
            <span :style="{ float: 'right' }">{{ group.options.length }}</span>
          </div>
          <div class="checkbox" :key="plan.id" v-for="plan in group.options">
            <!-- 选择框 -->
            <a-checkbox @change="() => onChange(plan)" />
            <div
              class="checkbox-content"
              @click="() => $store.dispatch('setCurrentPlanId', plan.id)"
            >
              <!-- 标题 -->
              <span class="checkbox-label">
                <plan-level
                  :showDropdown="false"
                  v-if="plan.level !== 'none'"
                  :value="plan.level"
                  :style="{ margin: '0 5px 2px 0' }"
                />
                {{ plan.title }}
              </span>
              <!-- 右上角 -->
              <div class="checkbox-right">
                <!-- 提醒的符号 -->
                <a-icon
                  type="bell"
                  v-if="plan.alarm"
                  style="padding-right: 10px"
                />
                <!-- 子任务的符号 -->
                <a-icon
                  type="ordered-list"
                  v-if="plan.subTasks.length > 0"
                  style="padding-right: 10px"
                />
                <!-- 开始日期 -->
                <span :style="{ color: plan.isExpired() ? '#ff4d4f' : '' }">
                  {{
                    plan.startDate._isValid
                      ? plan.startDate.format("M月D日")
                      : ""
                  }}
                </span>
              </div>
              <!-- 底部的任务描述 -->
              <div v-if="showDetail" class="checkbox-description">
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
  </div>
</template>

<script>
// TODO: 对于已完成和已删除的计划，都只看日期分组降序
// TODO: 增加按标题排序
// TODO: 缩小时显示数字，展开时右上角不显示数字
// TODO: 优先级的高低不用图标显示，而是用方框的颜色
// TODO: 缩小并淡化以下内容：分组的label、日期、各种Icon、数字
// TODO: 选中某个计划时，修改底色以突出选中
// TODO: 默认展开全部（主要目的是看看如何在切换侧边栏时过渡效果不那么强烈）
import PlanLevel from "./Items/Level";
import PlanCreationInput from "./Items/CreationInput";

export default {
  components: { PlanLevel, PlanCreationInput },
  data() {
    const publicPath = process.env.BASE_URL;
    let defaultActiveKey = [
      "going",
      "expired",
      "nodate",
      "high",
      "medium",
      "low"
    ]; // 默认展开的列，默认不展开已完成和已删除列
    return {
      groups: [], // 分组后的计划
      groupKey: "", // 当前选中的分组
      showCreationGroupKey: ["today", "recent", "all"], // 要显示创建计划 input 的分组
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      defaultActiveKey: defaultActiveKey, // 默认展开的 key
      activeKey: defaultActiveKey, // 当前展开的 key
      publicPath: publicPath, // public 文件夹的位置
      selectedSortKey: ["time"], // 排序 menu 选中
      showDetail: true, // 是否显示详情
      title: "",
      hideImage: publicPath + "icons/" + "详情-隐藏.png",
      showImage: publicPath + "icons/" + "详情-显示.png",
      timeImage: publicPath + "icons/" + "降序-时间.png",
      levelImage: publicPath + "icons/" + "降序-优先级.png",
      emptyImage: publicPath + "images/" + "Relax.svg"
    };
  },
  watch: {
    "$store.state.currentGroupKey": function(to) {
      let planGroupMenu = this.$store.state.planGroupMenu;
      let menu = planGroupMenu[planGroupMenu.map(i => i.key).indexOf(to)];
      this.title = menu ? menu.name : "";
      this.groupKey = to;
    },
    "$store.state.currentPlans": function() {
      this.refreshCurrentGroups();
    },
    selectedSortKey(from, to) {
      if (from[0] !== to[0]) {
        this.refreshCurrentGroups();
        this.activeKey = this.defaultActiveKey; // 刷新展开列
      }
    }
  },
  methods: {
    // 对当前页面需要展示的计划，进行分组
    refreshCurrentGroups() {
      let groups = [];
      let key = this.selectedSortKey[0] || "";
      switch (key) {
        case "time":
          groups = this.sortPlanByTime();
          break;
        case "level":
          groups = this.sortPlanByLevel();
          break;
        default:
          break;
      }
      this.groups = groups;
      console.log("2 成功分组计划列表页");
    },
    moreClick({ key }) {
      switch (key) {
        case "detail":
          this.showDetail = !this.showDetail;
          console.log("2 显示/隐藏详情");
          break;
        case "sync":
          this.$store.dispatch("getPlans");
          break;
        default:
          break;
      }
    },
    onChange(plan) {
      // TODO: 添加完成事件
      console.log(`${plan}已完成`);
    },
    // 对计划进行排序，如果两个都有开始时间，则大的排在后面；如果只有一个有开始时间，则有开始时间的排在前面。
    sortPlan(a, b) {
      if (a.startDate._isValid) {
        if (b.startDate._isValid) {
          return a.startDate - b.startDate;
        } else {
          return -1;
        }
      } else {
        if (b.startDate._isValid) {
          return 1;
        } else {
          return -1;
        }
      }
    },
    // 对计划按照完成状态分组，并按时间排序
    sortPlanByTime() {
      let plans = [...this.$store.state.currentPlans];

      // 分组
      let going = []; // 进行中
      let expired = []; // 已过期
      let finished = []; // 已完成
      let trash = []; // 已删除
      let nodate = []; // 无日期
      for (let plan of plans) {
        if (plan.isDeleted) {
          trash.push(plan);
        } else if (plan.isExpired()) {
          expired.push(plan);
        } else if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.isGoing()) {
          going.push(plan);
        } else {
          nodate.push(plan);
        }
      }

      // 组内排序
      going.sort(this.sortPlan);
      finished.sort(this.sortPlan);
      expired.sort(this.sortPlan);
      trash.sort(this.sortPlan);
      nodate.sort(this.sortPlan);

      // 按顺序显示
      let group = [];

      if (expired.length) {
        group.push({ options: expired, title: "已过期", key: "expired" });
      }
      if (going.length) {
        group.push({ options: going, title: "进行中", key: "going" });
      }
      if (nodate.length) {
        group.push({ options: nodate, title: "无日期", key: "nodate" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }
      if (trash.length) {
        group.push({ options: trash, title: "已删除", key: "trash" });
      }

      return group;
    },
    // 对计划按照优先级分组
    sortPlanByLevel() {
      let plans = [...this.$store.state.currentPlans];

      // 分组
      let highLevel = [];
      let mediumLevel = [];
      let lowLevel = [];
      let noneLevel = [];
      let finished = [];
      let trash = [];
      let nodate = [];
      for (let plan of plans) {
        if (plan.isDeleted) {
          trash.push(plan);
        } else if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.level === "high") {
          highLevel.push(plan);
        } else if (plan.level === "medium") {
          mediumLevel.push(plan);
        } else if (plan.level === "low") {
          lowLevel.push(plan);
        } else if (plan.level === "none") {
          noneLevel.push(plan);
        } else {
          nodate.push(plan);
        }
      }

      // 组内排序
      highLevel.sort(this.sortPlan);
      mediumLevel.sort(this.sortPlan);
      lowLevel.sort(this.sortPlan);
      noneLevel.sort(this.sortPlan);
      finished.sort(this.sortPlan);
      trash.sort(this.sortPlan);
      nodate.sort(this.sortPlan);

      // 按顺序显示
      let group = [];
      if (highLevel.length) {
        group.push({ options: highLevel, title: "高优先级", key: "high" });
      }
      if (mediumLevel.length) {
        group.push({
          options: mediumLevel,
          title: "中优先级",
          key: "medium"
        });
      }
      if (lowLevel.length) {
        group.push({ options: lowLevel, title: "低优先级", key: "low" });
      }
      if (noneLevel.length) {
        group.push({ options: noneLevel, title: "无优先级", key: "none" });
      }
      if (nodate.length) {
        group.push({ options: nodate, title: "无日期", key: "nodate" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }
      if (trash.length) {
        group.push({ options: trash, title: "已删除", key: "trash" });
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
                : this.$moment(date).format("M月D日")),
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
  max-width: calc(100% - 130px);
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
